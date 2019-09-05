/******************************************
Treehouse FSJS Techdegree:
Project 9 - REST API
Name: Snir Holland
Date: 05/09/2019

>>> user authentication <<<
******************************************/

// basic-auth module
const auth = require('basic-auth');

// bcrypt module
const bcryptjs = require('bcryptjs');

// import User module
const User = require('./db/models/user');

// middleware function that authenticates user
const authenticateUser = async (req,res,next) => {

    // retrieve users 
    const users = await User.findAll();

    // define error message
    let message = null;

    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);

    // If the user's credentials are available...
    if (credentials) {
        /* Attempt to retrieve the user from the data store by their email
           (i.e. the user's "key" from the Authorization header). */
        const user = users.find( (user) => user.emailAddress === credentials.name );

        // If a user was successfully retrieved from the data store...
        if (user) {
            /* Use the bcryptjs npm package to compare the user's password (from the Authorization header)
               to the user's password that was retrieved from the data store. */
            const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

            // If the passwords match...
            if (authenticated) {
                /* Then store the retrieved user object on the request object so any middleware functions
                   that follow this middleware function will have access to the user's information. */
                req.currentUser = user;
            }
            else {
                message = `Authentication failure for email address: ${user.emailAddress}`;
            }
        }
        else {
            message = `User not found for email address: ${credentials.name}`;
        }   
    }
    else {
        message = 'Auth header not found';
    }

    // If user authentication failed...
    if (message) {
        console.warn(message);

        // Return a response with a 401 Unauthorized HTTP status code.
        res.status(401).json({ message: 'Access Denied' });
    }

    // Or if user authentication succeeded...
    else {
        // Call the next() method.
        next();
    }
};

module.exports = authenticateUser;