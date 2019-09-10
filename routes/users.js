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

        // validation of email address
        if  (emailAddress && (!((/^[^@]+@[^@.]+\.[a-z]+$/i).test(emailAddress)))) {
            const err = new Error('Invalid email address (syntax error)');
            err.status= 400;
            throw(err);
        }
      
        // check for existing user email address
        const emailAlreadyExists = await User.findOne({ where: {emailAddress: `${emailAddress}` } });
        if (emailAlreadyExists) {
            const err = new Error('Email already exists, try a different one.');
            err.status= 400;
            throw(err);
        }
        
        // hash password if supplied by the user
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
        if (err.name === 'SequelizeValidationError') {
            const errors = err.errors.map( (error) => error.message);
            err.status = 400;
            console.error('Validation errors: ', errors);
        }    
        next(err);              
    }    
});

module.exports = router;
