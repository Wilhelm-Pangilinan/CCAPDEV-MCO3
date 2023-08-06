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
        if( !req.session.authorized ) {
            return res.status(401).redirect('/login'); 
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

        reservationsData.sort((a, b) => new Date(a.data.reservationDate) - new Date(b.data.reservationDate));

        req.session.student = student;
        res.status(200).render( 'dashboard', { reservationsData: reservationsData });
    } catch( error ) {
        console.log( "Error fetching reservations: ", error );
        res.status(500).render('login');
    }
});

module.exports = dashboardRouter;