'use strict';

const express = require('express');

// import User module
const User = require('../db/models/user');

// import user authentication module
const authenticateUser = require('../auth');

// bcrypt module
const bcryptjs = require('bcryptjs');

// construct a router instance
const router = express.Router();

// a route that returns the currently authenticated user
router.get('/' , authenticateUser , (req,res) => {
    const user = req.currentUser;
    res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
});

// a route that creates a new user
router.post('/' , (req,res) => {
    const user = req.body;
    user.password = bcryptjs.hashSync(user.password);

    // create the new user
    User.create(user)
        .then( () => res.location('/').status(201).end() ) 
        .catch( (error) => {
            const errors = error.errors.map( (err) => err.message);
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({Errors: errors});
                console.error('Validation errors: ', errors);
            }    
            else
                res.status(500).json({message: error.message});        
        }    
)});

module.exports = router;
