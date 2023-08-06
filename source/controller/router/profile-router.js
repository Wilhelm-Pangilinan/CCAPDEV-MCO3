// - Modules
const express = require('express');

// - Express
const profileRouter = express.Router();
const urlencoded = express.urlencoded;

// - Models
const Student = require('../../models/Student');
const Reservation = require('../../models/Reservation'); 
const Laboratory = require('../../models/Laboratory'); 

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

/** 
    ` Deletes the user and their reservations from the database
    1. The reservation is connected to the laboratory and the user
    2. Must retrieve the reservation from the user first
    3. Then access the laboratory from the reservation
*/
profileRouter.post('/delete', async (req, res) => {
    try {
        // - Find the student with the given ID in the database
        var student = req.session.student;
        const currentStudent = await Student.findOne({ id: student.id });

        // - Check if the student exists
        if( !currentStudent ) {
            console.log("Error: User with this ID not found:", student.id);
            return res.render('login', { errorMessage: 'User with this ID not found' });
        }

        // - Remove reservation reference from laboratory and student
        for( const reservationRef of currentStudent.reservationsRef ) {

            // - Retrieve the reservation document in the database 
            const reservation = await Reservation.findById( reservationRef );

            // - Remove the reservation reference from laboratory
            await Laboratory.findByIdAndUpdate( 
                reservation.labRef, 
                { $pull: { reservationsRef: reservation._id } },
                { new: true }
            )

            // - Remove the reservation reference from student 
            await Student.findByIdAndUpdate(
                reservation.studentRef, 
                { $pull: { reservationsRef: reservation._id } },
                { new: true }
            )
            
            // - Remove the reservation document from the database
            await Reservation.deleteOne({ _id: reservation._id });
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


module.exports = profileRouter;