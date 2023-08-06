// - Modules
const express = require('express');
const dashboardRouter = express.Router();

// - Models
const Student = require('../../models/Student'); 
const Reservation = require('../../models/Reservation'); 
const Laboratory = require('../../models/Laboratory'); 

const urlencoded = express.urlencoded;
dashboardRouter.use( urlencoded({extended:true}) );

// - GET route for rendering the dashboard page
dashboardRouter.get('/dashboard', async (req, res) => {
    try {
        var student = req.session.student;

        // - Redirect to login page if the student is not found in the session
        if( !student ) {
            return res.redirect('/login'); 
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
        res.render('dashboard', { reservationsData: reservationsData });

    } catch( error ) {
        console.error( "Error fetching reservations: ", error );
        res.render('login');
    }
});

module.exports = dashboardRouter;