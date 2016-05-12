var Sequelize = require('sequelize');
var connection = require('./connection')(Sequelize);
var creator = require('./creator')(connection, Sequelize);

var Question = connection.define('question', {
    question: Sequelize.JSON
});

module.exports.send = function (data) {
    Question
        .sync()
        .then(function () {
            return creator.create({
                question: data
            });
        });
};

module.exports.get = function () {
    return new Promise(function (resolve, reject) {
        Question
            .findAll()
            .then(function (question) {
                var arr = [];
                question.forEach(function (item) {
                    arr.push(item.dataValues.question);
                });
                resolve(arr);
            })
    });
};

module.exports.update = function () {

};

module.exports.delete = function () {
    
};

