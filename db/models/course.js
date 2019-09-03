const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model {}
    Course.init({ 
        userId: Sequelize.INTEGER,
        title: Sequelize.STRING,
        description: Sequelize.TEXT,
        estimatedTime: Sequelize.STRING,
        materialsNeeded: Sequelize.STRING
    }, { sequelize });

    return Course;
};
