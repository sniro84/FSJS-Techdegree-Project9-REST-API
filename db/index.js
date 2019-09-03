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

// export the db object
module.exports = db;
