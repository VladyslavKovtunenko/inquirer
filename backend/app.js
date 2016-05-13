var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var config = require('lib/config');
var log = require('lib/logger')(module);
var dao = require('db/dao');

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
            
            res.sendFile('/home/someone/Projects/js/inquirer/frontend/view/index.html');
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
                res.send(400, 'Bad request!');
            }
            break;
        case '/api/question':
            /* (POST) add new questions */
            
            if (req.method == 'POST') {
                dao.send(JSON.stringify(req.body));
                res.end();
            } else {
                res.send(400, 'Bad request!');
            }
            break;
        case '/api/questions/id':
            /* (PUT) update questions */
            /* (DELETE) delete questions */
            
            if (req.method == 'PUT') {
                /* update */
                
            } else if (req.method == 'DELETE') {
                /* delete */
                
            } else {
                res.send(400, 'Bad request!');
            }
            
            res.end();
            break;
        default:
            /* 404 */
            res.send(404, 'Page not found!');
    }
});