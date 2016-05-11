var Sequelize = require('sequelize');
var config = require('../lib/config/config.json').db;
var sequelize = new Sequelize(
    config.db_name,
    config.username,
    config.password, {
        host: config.host,
        port: config.port,
        dialect: config.dialect
    });

var User = sequelize.define('user', {
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    }
});

// User.sync().then(function () {
//    return User.create({
//        firstName: 'John',
//        lastName: 'Smith'
//    });
// });

User.findOne().then(function (user) {
    console.log(user.get('firstName') + ' ' + user.get('lastName'));
});

