'use strict';

const express = require('express');

// an array to keep track of users records
const User = require('../db/models/user');

// construct a router instance
const router = express.Router();

// a route that creates a new user
router.post('/' , (req,res) => {
    const user = req.body;
    console.log(user);

    // create the new user
    User.create(user)
        .then( res.location('/').status(201).end() ) 
        .catch( (err) => console.log(err))
});

module.exports = router;
