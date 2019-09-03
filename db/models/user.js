const Sequelize = require('sequelize');

module.exports = (sequelize) => { 
    class User extends Sequelize.Model {}
    User.init({ 
        firstName: Sequelize.STRING,
        lastName: Sequelize.STRING,
        emailAddress: Sequelize.STRING,
        password: Sequelize.STRING
    }, { sequelize });

    return User;
};
