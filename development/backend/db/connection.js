var config = require('../lib/config/config.json').db;
module.exports = function (Sequelize) {
    return new Sequelize(
        config.db_name,
        config.username,
        config.password, {
            host: config.host,
            port: config.port,
            dialect: config.dialect
        });
};