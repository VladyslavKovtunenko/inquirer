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
                questions: data
            });
        });
};

module.exports.get = function () {
    return new Promise(function (resolve, reject) {
        Question
            .findAll()
            .then(function (question) {
                var arr = {
                    fields: []
                };
                question.forEach(function (item) {
                    var obj = {
                        question: item.dataValues.question,
                        id: item.dataValues.id
                    };
                    arr.fields.push(obj);
                });
                resolve(arr);
            })
    });
};

module.exports.update = function () {

};

module.exports.delete = function () {

};

