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
app.use(express.static(path.join(__dirname, '../frontend/app')));
app.use(bodyParser.json());

http.createServer(app).listen(config.get('server_port'), function () {
    log.info('Express start on port ' + config.get('server_port'));
});

app.get('/', function (req, res) {
    fs.createReadStream('frontend/view/index.html').pipe(res);
});

app.get('/api/questions', function (req, res) {
    dao.getAll().then(function (arr) {
        var jsonArr = JSON.stringify(arr);
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(jsonArr);
        res.end();
    });
});

app.post('/api/question', function (req, res) {
    dao.set(JSON.stringify(req.body));
    res.status(201).end();
});

app.route(/^\/api\/question\/[0-9]+/)
    .put(function (req, res) {
        var id = generateIdFromUrl(req.url);
        generateChanges(req.body, id).then(function (newData) {
            dao.update(id, JSON.stringify(newData)); 
        });
        res.status(201).end();
    })
    .delete(function (req, res) {
        var id = generateIdFromUrl(req.url);
        dao.delete(id);
        res.status(201).end();
    });

function generateChanges(newData, id) {
    return new Promise(function (resolve, reject) {
        dao.getById(id).then(function (data) {
            var oldData = JSON.parse(data.dataValues.question);
            for (var field in oldData) {
                if (newData[field] != oldData[field]) {
                    oldData[field] = newData[field];
                }
                
            }
            resolve(oldData);
        });
    });
}

function generateIdFromUrl(url) {
    return url.split('/')[3];
}
