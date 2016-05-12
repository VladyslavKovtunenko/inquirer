module.exports = function (connection, Sequelize) {
    return connection.define('question', {
        question: Sequelize.JSON
    });
};