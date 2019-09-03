'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const db = require('./db');

/************* NEW ADDED CODE ***********/
// import User and Course models
const { User } = db.models;
const { Course } = db.models;


(async () => {
  // sync users table
  await db.sequelize.sync({ force: true });

  try {
    await db.sequelize.authenticate();
    console.log('Connection to the database successful!');

        // Instance of the User class represents a database row
        const user = await User.create({
          firstName: 'Snir',
          lastName: 'Holland',
          emailAddress: 'snirofakemail@yahoo.com',
          password: 'fakepass93751'
        });
        console.log(user.toJSON());

        const course = await Course.create({
          userId: 1,
          title: 'Linear Algebra',
          description: 'Abstract mathematics: Complex numbers, Matrices, Vector spaces etc..',
          estimatedTime: '4 months',
          materialsNeeded: 'A good mood..'
        });
        console.log(course.toJSON());
  }
  catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();
/******************************************************/ 


// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// TODO setup your api routes here

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});