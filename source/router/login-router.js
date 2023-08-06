// - Modules
const express = require('express');
const loginRouter = express.Router();

// - Models
const Student = require('../models/Student');
const Reservation = require('../models/Reservation');

// - Express
const urlencoded = express.urlencoded;
loginRouter.use( urlencoded({extended:true}) );

// - GET route for rendering the login page
loginRouter.get('/login', (req, res) => {
    res.render('login');
});


/* 
    ` POST route to handle the login form submission
    Use POST instead of GET request when dealing with 
    sensitive information such as passwords.
*/
loginRouter.post('/login', async (req, res) => {
    const email = req.body['login-email-input'];
    const password = req.body['login-password-input'];

    try {
        // - Find the user in the database based on the email
        const student = await Student.findOne({ email })

        // - Handle incorrect email or password
        if( !student || student.password !== password ) {
            console.log("Error: Invalid login credentials");
            return;
        }

        req.session.student = student;          // save student to the session
        console.log( "Login Successful" );      // console message
        res.redirect('/dashboard');             // redirect to dashboard.ejs

    } catch( error ) {
        console.error('Error during login:', error);
        return res.render('login', { errorMessage: 'An error occurred during login' });
    }
});

loginRouter.post('/register', async (req, res) => {
    const firstName = req.body['register-first-name-input'];
    const lastName = req.body['register-last-name-input'];
    const studentID = req.body['register-id-input'];
    const email = req.body['register-email-input'];
    const password = req.body['register-password-input'];
    
    try {
        const student = await Student.findOne({ $or: [{ email }, { id : studentID }] });

        // - Check if a user with the same email or student ID already exists in the database
        if( student ) {
            if( student.email === email ) {
                console.log( "Error: User with this email already exists:", email );
                return res.render( 'login', { errorMessage: 'A user with this email already exists'})
            } else if( student.id === studentID ) {
                console.log( "Error: User with this ID already exists: ", studentID );
                return res.render( 'login', { errorMessage: 'A user with this ID already exists'})
            }
        }

        // - Create a new student object
        const newStudent = new Student({
            name: { firstName, lastName },
            id: studentID,
            email,
            password
        })

        // - Save the student to the session
        await newStudent.save();

        // - Login successful
        console.log( "Register Successful" );
        res.redirect( 'login' );
        return res.status(200).json({ message: 'User registration successful' });
        
    } catch (error) {
        console.error('Error during registration:', error);
        return ('login', { errorMessage: 'An error occurred during registration' });
      }
});

loginRouter.post('/delete', async (req, res) => {
    try {
        // Find the student with the given ID in the database
        var student = req.session.student;
        const currentStudent = await Student.findOne({ id: student.id });

        // Check if the student exists
        if( !currentStudent ) {
            console.log("Error: User with this ID not found:", student.id);
            return res.render('login', { errorMessage: 'User with this ID not found' });
        }

        // - Delete the student from the database
        await Student.deleteOne({ id: student.id });

        // - Deletion successful
        console.log( "Deletion Successful" );
        res.redirect('/login');
        return res.status(200).json({ message: 'User deletion successful' });

    } catch (error) {
        console.error('Error during deletion:', error);
        return res.render('login', { errorMessage: 'An error occurred during deletion' });
    }
});


module.exports = loginRouter;