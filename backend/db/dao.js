var Sequelize = require('sequelize');
var connection = require('./connection')(Sequelize);
var creator = require('./creator')(connection, Sequelize);

var Question = connection.define('question', {
    question: Sequelize.JSON
});

module.exports.set = function (data) {
    Question
        .sync()
        .then(function () {
            return creator.create({
                question: data
            });
        });
};

module.exports.getById = function (id) {
    return new Promise(function (resolve, reject) {
        Question
            .findById(id)
            .then(function (question) {
                resolve(question);
            });

    })
};

module.exports.getAll = function () {
    return new Promise(function (resolve, reject) {
        Question
            .findAll()
            .then(function (question) {
                var arr = getData(question);
                resolve(arr);
            });

        function getData(question) {
            var arr = {};
            arr.fields = [];
            question.forEach(function (item) {
                var obj = {
                    question: item.dataValues.question,
                    id: item.dataValues.id
                };
                arr.fields.push(obj);
            });
            return arr;
        }

    });
};

module.exports.update = function (id, data) {
    Question
        .update({
            question: data
        }, {
            where: {
                id: id
            }
        });
};

module.exports.delete = function (id) {
    Question
        .destroy({
            where: {
                id: id
            }
        });
};

