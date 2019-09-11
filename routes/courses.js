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
            attributes: {
                include: ['id','title','description','estimatedTime','materialsNeeded'],
                exclude: ['userId','createdAt','updatedAt']
            },
            include: [{
                    model: User,
                    attributes: {
                        include:['id','firstName','lastName','emailAddress'],
                        exclude:['password','createdAt','updatedAt']
                    }    
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
        const course = await Course.findByPk(req.params.id , {
            attributes: {
                include: ['id','title','description','estimatedTime','materialsNeeded'],
                exclude: ['userId','createdAt','updatedAt']
            },
            include: [{
                    model: User,
                    attributes: {
                        include:['id','firstName','lastName','emailAddress'],
                        exclude:['password','createdAt','updatedAt']
                    }    
            }] 
        });
        if (course)
            res.status(200).json(course);
        else
            next();     
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
        const course = await Course.create({
            userId,
            title,
            description,
            estimatedTime,
            materialsNeeded
        });
        res.location(`/${course.id}`).status(201).end();
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

// a route that updates an existing course
router.put('/:id'  ,authenticateUser, async (req,res,next) => {
    try {
        const course = await Course.findByPk(req.params.id);
        const user = await User.findByPk(req.currentUser.id);
        const targetUserExists = await User.findByPk(req.body.userId);
        
        if (course) {
            const validationErrors = [];

            if(course.userId !== user.id)  // current user doesn't own the course
                res.status(403).json({message : `Current user doesn't own the course`});
            else {
                // validation for course title and description (model validations works only for the POST requests)    
                if (!req.body.title || req.body.title === "") 
                    validationErrors.push(`Please provide a value for 'title'`);
                if (!req.body.description || req.body.description === "") 
                    validationErrors.push(`Please provide a value for 'description'`);
                if (validationErrors.length > 0) 
                    res.status(400).json({validationErrors});

                // target user (in the request body) doesn't exist
                if (!targetUserExists)
                    res.status(400).json({message : `Target user doesn't exist`});    

                await course.update({
                    userId: req.body.userId,
                    title: req.body.title,
                    description: req.body.description,
                    estimatedTime: req.body.estimatedTime,
                    materialsNeeded: req.body.materialsNeeded
                });
                res.status(204).end();
            }      
        }
        else 
            next();
    }
    catch(err) {    
        next(err); 
    }
});

// a route that deletes an existing course
router.delete('/:id' ,authenticateUser,  async (req,res,next) => {
    try {
        const course = await Course.findByPk(req.params.id);
        const user = await User.findByPk(req.currentUser.id);

        if (course) {
            if(course.userId !== user.id)  // current user doesn't own the course
                res.status(403).json({message : `Current user doesn't own the course`});
            else {
                await course.destroy();
                res.status(204).end(); 
            }        
        }
        else 
            next();
    }
    catch(err) {
            next(err);
    }
});

module.exports = router;