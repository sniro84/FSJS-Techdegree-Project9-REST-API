'use strict';

const express = require('express');

// import User module
const Course = require('../db/models/course');

// construct a router instance
const router = express.Router();

// a route that returns a list of courses
router.get('/' , async (req,res) => {
    const courses = await Course.findAll();
    res.status(200).json(courses);     
});

// a route that returns a specific course
router.get('/:id' , async (req,res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course)
            res.status(200).json(course);
        else
            res.status(404).json({message : 'Not found'});     
    }
    catch(error) {
        res.status(500).json({message: error.message});

    }       
});

// a router that creates a new course
router.post('/', (req,res) => {

    const course = req.body;
    // create the new user
    Course.create(course)
        .then( () => res.location('/').status(201).end() ) 
        .catch( (error) => {
            const errors = error.errors.map( (err) => err.message);
            if (error.name === 'SequelizeValidationError')    
                console.error('Validation errors: ', errors);
            else
                throw error;
            res.status(400).json({Errors: errors});    
        })
});




module.exports = router;