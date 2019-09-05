/******************************************
Treehouse FSJS Techdegree:
Project 9 - REST API
Name: Snir Holland
Date: 05/09/2019

>>> Routes: courses <<<
******************************************/

'use strict';

const express = require('express');

// import Course module
const Course = require('../db/models/course');

// import user authentication module
const authenticateUser = require('../auth');

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

// a route that creates a new course
router.post('/' , authenticateUser, (req,res) => {

    const course = req.body;
    // create the new course
    Course.create(course)
        .then( () => res.location('/').status(201).end() ) 
        .catch( (error) => {
            const errors = error.errors.map( (err) => err.message);
            if (error.name === 'SequelizeValidationError') {
                console.error('Validation errors: ', errors);
                res.status(400).json({Errors: errors});
            }    
            else
                res.status(500).json({message: error.message});  
        })
});

// a route that updates an existing course
router.put('/:id'  ,authenticateUser, async (req,res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            await course.update({
                userId: req.body.userId,
                title: req.body.title,
                description: req.body.description,
	            estimatedTime: req.body.estimatedTime,
	            materialsNeeded: req.body.materialsNeeded
            });
            res.status(204).end();
        }
        else 
            res.status(404).json({message : 'Not found'}); 
    }
    catch(error) {
        const errors = error.errors.map( (err) => err.message);
        if (error.name === 'SequelizeValidationError') {
            console.error('Validation errors: ', errors);
            res.status(400).json({Errors: errors});
        }
        else
            res.status(500).json({message: error.message});
    }

});


// a route that deletes an existing course
router.delete('/:id' ,authenticateUser,  async (req,res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            await course.destroy();
            res.status(204).end();
        }
        else 
            res.status(404).json({message : 'Not found'}); 
    }
    catch(error) {
            res.status(500).json({message: error.message});
    }
});

module.exports = router;