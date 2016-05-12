var express = require('express');
var favicon = require('serve-favicon');
var http = require('http');
var path = require('path');
var config = require('lib/config');
var log = require('lib/logger')(module);
var dao = require('db/dao');

var app = express();

app.set('views', path.join(__dirname, '../frontend/view'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../frontend/static')));

http.createServer(app).listen(config.get('server_port'), function () {
    log.info('Express start on port ' + config.get('server_port'));
});


app.use(function (req, res) {
    switch (req.url) {
        case '/':
            /* (GET) get view */
            // res.render('index');
            res.sendFile('/home/someone/Projects/js/inquirer/frontend/view/index.html');
            break;
        case '/api/questions':
            /* (GET) get questions list */
            dao.get().then(function (arr) {
                if (arr.length > 1) {
                    var validObj = generateValidObj(arr);
                    res.send(validObj);
                } else {
                    res.send(arr);
                }
            });
            break;
        case '/api/question':
            /* (POST) add new question */
            dao.send(JSON.stringify({
                fields: [
                    {
                        type: 'short_text',
                        question: 'How are you?'
                    },
                    {
                        type: 'rating',
                        question: 'Rating?',
                        range: {
                            start: '1',
                            end: '10'
                        }
                    }
                ]
            }));
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

    arr.forEach(function (item) {
        var tempArr = JSON.parse(item).fields;
        tempArr.forEach(function (item) {
            obj.fields.push(item);
        });
    });

    return JSON.stringify(obj);
}