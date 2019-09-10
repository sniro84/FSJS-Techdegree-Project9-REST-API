/******************************************
Treehouse FSJS Techdegree:
Project 9 - REST API
Name: Snir Holland
Date: 05/09/2019

>>> index <<<
******************************************/

const Sequelize = require('sequelize');

// create a Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'fsjstd-restapi.db'
});

// create a db object which contains sequelize instance and models (allow access from the app)
const db = {
    sequelize,
    Sequelize,
    models: {},
};

// insert User and Course models into db object 
const User = require('./models/user.js');
db.models.User = User(sequelize);
const Course = require('./models/course.js');
db.models.Course = Course(sequelize);

// create associations
db.models.Course.associate(db.models);
db.models.User.associate(db.models);

// export the db object
module.exports = db;
