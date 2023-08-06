/*|*******************************************************

                        Mongoose 

*********************************************************/
const Student = require('../../models/Student');
const Reservation = require('../../models/Reservation'); 
const Laboratory = require('../../models/Laboratory'); 
const Technician = require('../../models/Technician');
const constructor = require('../../utility/constructor');

/*|*******************************************************

                        Express
                        
*********************************************************/
const express = require('express');
const urlencoded = express.urlencoded;
const loginRouter = express.Router();
loginRouter.use( urlencoded({extended:true}) );

/*|*******************************************************
    
                        Login 

*********************************************************/
loginRouter.get( '/login', (req, res) => { 
    console.log( "Authorized", req.session.authorized );
    console.log( "RememberMe", req.session.rememberMe );

    if( req.session.authorized && req.session.rememberMe ) {
        console.log( "Session remembered! Logging in!" );
        if( req.session.student ) {
            res.redirect('/dashboard');
        } else {
            res.redirect('/technician');
        }
    } else {
        res.render('login'); 
    }
});

loginRouter.get( '/logout', (req, res) => {     
    req.session.destroy();
    res.render('login'); 
});


/* 
    ` POST route to handle the login form submission
    Use POST instead of GET request when dealing with 
    sensitive information such as passwords.
*/
loginRouter.post('/login', async (req, res) => {
    try {
        const loginData = req.body;
        const email = loginData.email;
        const password = loginData.password;

        console.log( "Email Technician:", email.includes("technician") );

        // - Check if the email is for technician
        if( email.includes("technician") ) {
            // - Find the technician in the database based on the email
            const technician = await Technician.findOne({ email });

            // - Handle invalid credentials
            if( !technician || await technician.comparePassword(password) == false ) {
                return res.status(401).json({ message: 'Invalid credentials'})
            }

            // - If remember me option was checked
            if( loginData.rememberMe == 'true' ) {
                req.session.rememberMe = true;
            } else {
                req.session.rememberMe = false;
            }

            req.session.resetMaxAge();              // reset session duration
            req.session.authorized = true;          // set the user as authenticated
            req.session.technician = technician;    // save technician to the session
            res.redirect('/technician');            // redirect to technician.ejs
            console.log( "Going to technician");
        } else {
            // - Find the user in the database based on the email
            const student = await Student.findOne({ email });

            // - Handle invalid credentials
            if( !student || await student.comparePassword(password) == false ) {
                return res.status(401).json({ message: 'Invalid credentials'})
            } 

            // - If remember me option was checked
            if( loginData.rememberMe == 'true' ) {
                req.session.rememberMe = true;
            } else {
                req.session.rememberMe = false;
            }

            req.session.resetMaxAge();              // reset session duration
            req.session.authorized = true;          // set the user as authenticated
            req.session.student = student;          // save student to the session
            console.log( "Login Successful" );      // console message
            res.redirect('/dashboard');             // redirect to dashboard.ejs
        }
    } catch( error ) {
        return res.status(500).json({ message: 'An error occured in the login process. Please try again.' });
    }
});

/*|*******************************************************
    
                        Register 

*********************************************************/
/**
    ` Executes when the client sends a POST request to path `/register`, which
    is done through the register button in the registration form. It assumes the 
    the registration data being received is complete, i.e, the input error handling 
    should be done on the front-end.

    If the email and student ID does not exist in the database, then the account 
    will be succesfully registered. It informs the client if whether the operation 
    was succesful or not.

    409 Conflict status: The HTTP 409 Conflict response status code indicates 
    a request conflict with the current state of the target resource.
*/
loginRouter.post( '/register', async( req, res ) => {
    try {
        const registrationData = req.body;
        const email = registrationData.email;
        const studentID = registrationData.id;

        // - Check if a student with the same email or ID exists in the database
        const student = await Student.findOne({ $or: [{ email: email }, { id: studentID }]})
        console.log();
        console.log( registrationData );

        // - If a student with the same email or ID exists, return a 409 Conflict status
        if( student ) {
            if( student.email === email ) {
                console.log( "Email error triggered" );
                return res.status(409).json({ message: 'Email is already registered'})
            } else if( student.id === studentID ) {
                console.log( "ID error triggered" );
                return res.status(409).json({ message: 'ID is already registered'})
            }
        }

        // - Create a new student object and save it to the database
        const newStudent = constructor.createStudent( registrationData );
        await newStudent.save();
        
        // - Inform client the registration was successful
        return res.status(200).json({ message: 'Registration successful', email: email });
    } catch( error ) {
        return res.status(500).json({ error: 'An error occured in the registration process. Please try again.' });
    }
});

module.exports = loginRouter;