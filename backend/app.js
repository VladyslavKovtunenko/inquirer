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
                    var validObj = generateValidObj(arr);
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.write(validObj);
                    res.end();
                });
            } else {
                res.send(400, 'Bad request!');
            }
            break;
        case '/api/question':
            /* (POST) add new question */
            if (req.method == 'POST') {
                dao.send(JSON.stringify(req.body));
            } else {
                res.send(400, 'Bad request!');
            }
            res.end();
            break;
        case '/api/question/id':
            /* (PUT) update question */
            /* (DELETE) delete question */
            res.end();
            break;
        default:
            /* 404 */
            res.send(404, 'Page not found!');
    }
});

function generateValidObj(arr) {
    var obj = {
        fields: []
    };

    if (arr.length > 1) {
        arr.forEach(function (item) {
            var tempArr = JSON.parse(item).fields;
            tempArr.forEach(function (item) {
                obj.fields.push(item);
            });
        });
    } else {
        var tempArr = JSON.parse(arr[0]);
        obj.fields.push(tempArr);
    }

    return JSON.stringify(obj);
}