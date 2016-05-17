var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var config = require('./lib/config');
var log = require('./lib/logger')(module);
var dao = require('./db/dao');
var fs = require('fs');

var app = express();

app.set('views', path.join(__dirname, '../frontend/view'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../frontend/static')));
app.use(bodyParser.json());

http.createServer(app).listen(config.get('server_port'), function () {
    log.info('Express start on port ' + config.get('server_port'));
});

app.use(function (req, res) {
    switch (req.url) {
        case '/':
            /* (GET) get view */
            fs.createReadStream('frontend/view/index.html').pipe(res);
            break;
        case '/api/questions':
            /* (GET) get questions list */
            if (req.method == 'GET') {
                dao.get().then(function (arr) {
                    var jsonArr = JSON.stringify(arr);
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.write(jsonArr);
                    res.end();
                });
            } else {
                res.status(400).end('Bad request!');
            }
            break;
        case '/api/question':
            /* (POST) add new questions */
            if (req.method == 'POST') {
                dao.set(JSON.stringify(req.body));
            } else {
                res.status(400).end('Bad request!');
            }
            break;
        default:
            /* (PUT) update questions */
            /* (DELETE) delete questions */
            if (req.url.startsWith('/api/question/')) {
                if (req.method == 'DELETE') {
                    generateUrls().then(function (urls) {
                        deleteData(urls);
                    });
                } else if (req.method == 'PUT') {
                    generateUrls().then(function (urls) {
                        updateData(urls);
                    });
                } else {
                    res.status(400).end('Bad request!');
                }
            } else {
                res.status(404).end('Not found!')
            }
            break;
    }

    function deleteData(urls) {
        for (var i = 0; i < urls.length; i++) {
            if (req.url == urls[i].url) {
                /* delete */
                dao.delete(urls[i].id);
                res.status(201).end('Deleted complete!');
                break;
            }
        }

        res.status(404).end('Don\'t valid id!')
    }

    function updateData(urls) {
        for (var i = 0; i < urls.length; i++) {
            if (req.url == urls[i].url) {
                /* update */
                dao.update(urls[i].id, JSON.stringify(req.body));
                res.status(201).end('Updated complete!');
                break;
            }
        }
        res.status(404).end('Don\'t valid id!')
    }

    function generateUrls() {
        return new Promise(function (resolve, reject) {
            dao.get().then(function (arr) {
                var urls = [];

                arr.fields.forEach(function (item) {
                    urls.push({
                        url: '/api/question/' + item.id,
                        id: item.id
                    });
                });
                resolve(urls);
            });
        });
    }
});