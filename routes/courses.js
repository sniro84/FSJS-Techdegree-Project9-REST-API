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

// import User module
const User = require('../db/models/user');

// import user authentication module
const authenticateUser = require('../auth');

// construct a router instance
const router = express.Router();

// a route that returns a list of courses
router.get('/' , async (req,res,next) => {
    try {
        const courses = await Course.findAll({
            include:[{ 
                model: User
            }]
        });
        res.status(200).json(courses);
    }
    catch (err) {
        next(err);
    }      
});

// a route that returns a specific course
router.get('/:id' , async (req,res,next) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course)
            res.status(200).json(course);
        else
            res.status(404).json({message : 'Not found'});     
    }
    catch(err) {
        next(err);
    }       
});

// a route that creates a new course
router.post('/' , authenticateUser, async (req,res,next) => {

    try{
        const userId = await req.body.userId;
        const title = await req.body.title;
        const description = await req.body.description;
        const estimatedTime = await req.body.estimatedTime;
        const materialsNeeded = await req.body.materialsNeeded;

        // create the new course
        await Course.create({
            userId,
            title,
            description,
            estimatedTime,
            materialsNeeded
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

// a route that updates an existing course
router.put('/:id'  ,authenticateUser, async (req,res,next) => {
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
    catch(err) {
        const errors = err.errors.map( (error) => error.message);
        if (err.name === 'SequelizeValidationError') {
            err.status = 400;
            console.error('Validation errors: ', errors);
        }    
        next(err); 
    }

});


// a route that deletes an existing course
router.delete('/:id' ,authenticateUser,  async (req,res,next) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            await course.destroy();
            res.status(204).end();
        }
        else 
            res.status(404).json({message : 'Not found'}); 
    }
    catch(err) {
            next(err);
    }
});

module.exports = router;