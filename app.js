/******************************************
Treehouse FSJS Techdegree:
Project 9 - REST API
Name: Snir Holland
Date: 05/09/2019

>>> main app <<<
******************************************/

'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const db = require('./db');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const courses = require('./routes/courses');
const bcryptjs = require('bcryptjs');

// connect to database
(async () => {
  await db.sequelize.sync();

  try {
    await db.sequelize.authenticate();
    console.log('Connection to the database successful!');
  }
  catch (err) {
    console.error('Error connecting to the database: ', err);
  }
})();

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// Body-parser
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// setup api routes
app.use('/api/users' , users);
app.use('/api/courses' , courses);

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
    message: err.message
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
