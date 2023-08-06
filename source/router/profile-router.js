// - Modules
const express = require('express');

// - Express
const profileRouter = express.Router();
const urlencoded = express.urlencoded;

// - Models
const Student = require('../models/Student');
const Reservation = require('../models/Reservation'); 
const Laboratory = require('../models/Laboratory'); 

profileRouter.use( urlencoded({extended:true}) );

profileRouter.get('/profile', async (req, res) => {

    // - Redirect to login page if the student is not found in the session
    if( !req.session.student ) {
        return res.redirect('/login'); 
    }

    var student;
    const id = req.query['studentID'];
    if( id ) {
        student = await Student.findOne({ id });
    } else {
        student = req.session.student 
    }

    // - Retrieve the student document from the database
    student = await Student.findOne( {id: student.id} );

    // - Extract the reservations data from the student
    const reservationsData = [];
    for( const reservationRef of student.reservationsRef ) {
        const reservation = await Reservation.findById( reservationRef );

        // - Extract the laboratory name and image url from the reservations
        const laboratory = await Laboratory.findById( reservation.labRef );

        // - Create an object containing both reservation and laboratory data
        const reservationWithLabData = {
            data: reservation,
            imageURL: laboratory.imageURL,
        };
        reservationsData.push(reservationWithLabData);
    }

    reservationsData.sort((a, b) => new Date(a.data.requestDate) - new Date(b.data.requestDate));

    req.session.student = student;
    res.render('profile', { student: student, reservationsData: reservationsData });
});

/*
profileRouter.post('/profile', (req, res) => {
    const email = req.body.email-input;
    const password = req.body.password-input;
});
*/

/*
    # TO-DO:
    Create a function that accepts the user's ID as a parameter
    Or something like that :)
*/
module.exports = profileRouter;