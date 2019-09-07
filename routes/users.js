/******************************************
Treehouse FSJS Techdegree:
Project 9 - REST API
Name: Snir Holland
Date: 05/09/2019

>>> Routes: users <<<
******************************************/

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
router.get('/' , authenticateUser , async (req,res,next) => {
    try {
        const user = await req.currentUser;
        res.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress
        });
    }
    catch(err) {
        next(err);
    }  
});

// a route that creates a new user
router.post('/' , async (req,res,next) => {
    try{
        const firstName = await req.body.firstName;
        const lastName = await req.body.lastName;
        const emailAddress = await req.body.emailAddress;
        let password = await req.body.password;

        // hash password
        if (password)
            password = bcryptjs.hashSync(password);

        // create the new user
        await User.create({
            firstName,
            lastName,
            emailAddress,
            password
        });
        res.location('/').status(201).end();
    }
    catch(err) {
        const errors = err.errors.map( (error) => error.message);
        if (err.name === 'SequelizeValidationError') {
            err.status = 400;
            console.error('Validation errors: ', errors);
        }    
        next(err);              
    }    
});

module.exports = router;
