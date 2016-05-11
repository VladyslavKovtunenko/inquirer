var express = require('express');
var favicon = require('serve-favicon');
var http = require('http');
var path = require('path');
var config = require('lib/config');
var log = require('lib/logger')(module);

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
            res.render('index');
            break;
        case '/api/questions':
            /* (GET) get questions list */
            break;
        case '/api/question':
            /* (POST) add new question */
            break;
        case '/api/question/id':
            /* (PUT) update question */
            /* (DELETE) delete question */
            break;
        default:
            /* 404 */
            res.send(404, 'Page not found!');
    }
});