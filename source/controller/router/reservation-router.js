// - Modules
const express = require('express');

// - Models
const Student = require('../../models/Student');
const Laboratory = require('../../models/Laboratory');
const Reservation = require('../../models/Reservation');

// - Express
const reservationRouter = express.Router();
const urlencoded = express.urlencoded;
reservationRouter.use( urlencoded({extended:true}) );

// - GET route for rendering the reservation page
reservationRouter.get('/reservation', async (req, res) => {

    // - Redirect to login page if the student is not found in the session
    if( !req.session.student ) {
        return res.redirect('/login'); 
    }
    
    const name = req.query['lab'];
    const laboratory = await Laboratory.findOne({ name });

    if( !laboratory ) {
        return res.status(404).send('Laboratory not found');
    }

    req.session.laboratory = laboratory;

    try {
        const reservationsData = [];
        await Promise.all(
            laboratory.reservationsRef.map( async( reservationRef ) => {
                const reservation = await Reservation.findById(reservationRef);
                reservationsData.push(reservation);
            })
        );

        const laboratoryData = [{
            laboratory: laboratory,
            reservations: reservationsData,
        }];

        res.render('reservation', { laboratoryData: laboratoryData });
    } catch( err ) {
        console.error("Error fetching reservations:", err);
        return res.status(500).send('Error fetching reservations');
    }
});

// - POST request for creating reservations 
reservationRouter.post('/reserve', async (req, res) => {
    try {
        // - Retrieve the session data
        var laboratory = req.session.laboratory;
        var student = req.session.student;

        // - Retrieve the documents from the database
        laboratory = await Laboratory.findOne( {name: laboratory.name} );
        student = await Student.findOne( {id: student.id} );

        // - Retrieve the reservations input
        const { date, isAnonymous } = req.body;
        if( isAnonymous === 'on' ) {
            var isAnonymousValue = true;
        } else {
            var isAnonymousValue = false;
        }

        const timeSlots = [];
        for( const key in req.body ) {
            if( key.startsWith('seat-time-') && req.body[key] === 'on' ) {
                const [seatNumber, startTime] = key.split('-').slice(2); // Extract seat number and start time from the key
                timeSlots.push({ seatNumber: seatNumber, startTime: startTime });
            }
        }

        for( const timeSlot of timeSlots ) {
            try {
                const reservationEndTime = calculateEndTime(timeSlot.startTime);

                // - Check if the new reservation overlaps with an existing reservation
                const existingReservation = await Reservation.findOne( {
                    $and: [
                        { labName: laboratory.name },
                        { studentID: student.id },
                        { endTime: timeSlot.startTime },
                        { seatNumber: timeSlot.seatNumber },
                        { reservationDate: date }
                    ]
                });

                if( existingReservation ) {
                    existingReservation.endTime = reservationEndTime;
                    existingReservation.requestDate = new Date();
                    await existingReservation.save();

                    /*
                        e.g. existingReservation: 0930-1100, olderReservation: 0730-0930, 
                             oldReservation updates to 0730-1100
                    */
                    const olderReservation = await Reservation.findOne( {
                        $and: [
                            { labName: laboratory.name },
                            { studentID: student.id },
                            { endTime: existingReservation.startTime },
                            { seatNumber: existingReservation.seatNumber },
                            { reservationDate: date }
                        ]
                    });

                    if( olderReservation ) {
                        olderReservation.endTime = existingReservation.endTime;
                        olderReservation.requestDate = new Date();
                        await olderReservation.save();

                        // - Remove the previous reservatoin reference from laboratory
                        await Laboratory.findByIdAndUpdate( 
                            laboratory._id,
                            { $pull: { reservationsRef: existingReservation._id } },
                            { new: true }
                        )

                        // - Remove the previous reservation reference from student
                        await Student.findByIdAndUpdate( 
                            student._id,
                            { $pull: { reservationsRef: existingReservation._id } },
                            { new: true }
                        )

                        // - Remove the previous reservation document from database
                        await Reservation.deleteOne({ _id: existingReservation._id });
                    }

                    /*
                        e.g. existingReservation: 0730-0930, newerReservation updates to 0930-1100
                             existingReservation updates to 0730-1100
                    */
                    const newerReservation = await Reservation.findOne( {
                        $and: [
                            { labName: laboratory.name },
                            { studentID: student.id },
                            { startTime: existingReservation.endTime },
                            { seatNumber: existingReservation.seatNumber },
                            { reservationDate: date }
                        ]
                    });

                    if( newerReservation ) {
                        existingReservation.endTime = newerReservation.endTime;
                        existingReservation.requestDate = new Date();
                        await existingReservation.save();
                        await Laboratory.findByIdAndUpdate( 
                            laboratory._id,
                            { $pull: { reservationsRef: newerReservation._id }},
                            { new: true }
                        )
                        await Student.findByIdAndUpdate( 
                            student._id,
                            { $pull: { reservationsRef: newerReservation._id }},
                            { new: true }
                        )
                        await Reservation.deleteOne({ _id: newerReservation._id });
                    }
                } else {
                    const reservation = new Reservation({
                        labName: laboratory.name,
                        labRef: laboratory._id,
                        studentID: student.id,
                        studentRef: student._id,
                        seatNumber: timeSlot.seatNumber,
                        reservationDate: date,
                        startTime: timeSlot.startTime,
                        endTime: calculateEndTime(timeSlot.startTime),
                        requestDate: new Date(),
                        isAnonymous: isAnonymousValue
                    });

                    await reservation.save();

                    if( reservation ) {
                        console.log( "Reservation added in reservations collection." );
                        const reservationIdString = reservation._id.toString();
    
                        // - Add the reservation reference to the Laboratory document if not already present
                        if( !laboratory.reservationsRef.includes(reservationIdString) ) {
                            laboratory.reservationsRef.push(reservation._id);
                            await laboratory.save();
                            console.log( "Reservation added in", laboratory.name );
                        } else {
                            console.log( "Reservation already referenced in laboratory" );
                        }
    
                        // - Add the reservation reference to the Student document if not already present
                        if( !student.reservationsRef.includes(reservationIdString) ) {
                            student.reservationsRef.push(reservation._id);
                            await student.save();
                            console.log( "Reservation added in", student.name );
                        } else {
                            console.log( "Reservation already referenced in student" );
                        }
                    }
                }
            } catch( error ) {
                    console.log( error );
            }
        }

        // - Retrieve the session data
        req.session.laboratory = laboratory;
        req.session.student = student;

        res.redirect('/laboratory');

    } catch( err ) {
        return res.status(500).send('Error creating reservation');
    }
});

function calculateEndTime(startTime) {
    try {
    // - Parse the hours and minutes from the start time
    var newStartTime = parseInt(startTime);
    var startHours = parseInt(newStartTime / 100); 
    var startMin = newStartTime % 100; 

    // - Add 30 minutes to the start time
    var endHours = startHours;
    var endMin = startMin + 30;

    // - Adjust hours and minutes 
    if( endMin >= 60 ) {
        endHours += 1;
        endMin = 0;
        endHours *= 10; 
    } 

    var endTime = endHours.toString() + endMin.toString();
    return endTime;
    } catch( error ) {
        console.log( error );
    }     
}
  
module.exports = reservationRouter; 