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

http.createServer(app).listen(config.get('port'), function () {
    log.info('Express start on port ' + config.get('port'));
});

app.use(function (req, res) {
    switch (req.url) {
        case '/view':
            res.render('index');
            break;
        default:
            res.send(404, 'Page not found!');
    }
});