/*|*******************************************************
    
                        Mongoose 

*********************************************************/
const Laboratory = require('../models/Laboratory');
const Student = require('../models/Student');
const Technician = require('../models/Technician');
const Reservation = require('../models/Reservation');

/*|*******************************************************
    
                Database Utility Functions 

*********************************************************/
const database = {

    /*|*******************************************************
                         Constructor Methods 
    *********************************************************/
    /**
        ` Creates a new Laboratory object using the provided laboratory 
        data. It assumes the inputs are complete, with the properties 
        accessible using matching field identifiers. 

        @param laboratoryData      object containing the required laboratory data
    */
    createLaboratory: function( laboratoryData ) {
        const laboratory = new Laboratory({ 
            name: laboratoryData.name,
            row: laboratoryData.row,
            col: laboratoryData.col,
            imageURL: laboratoryData.imageURL 
            // - reservationsRef : to be added by different function
        }); 
        return laboratory;
    },

    /**
        ` Creates a new Student object using the provided student data. 
        It assumes the inputs are complete, with the properties accessible 
        using matching field identifiers. 

        @param studentData      object containing the required student data
    */
    createStudent: function( studentData ) {
        const student = new Student({ 
            name: studentData.name,
            id: studentData.id, 
            email: studentData.email,
            password: studentData.password
            // - reservationsRef : to be added by different function
        }); 
        return student;
    },

    /**
        ` Creates a new Reservation object using the provided reservation 
        data. It assumes the inputs are complete, with the properties 
        accessible using matching field identifiers. 

        @param reservationData      object containing the required reservation data
    */
    createReservation: function( reservationData ) {
        const reservation = new Reservation({ 
            labName: reservationData.labName,
            // - labRef : to be added by a different function
            studentID : reservationData.studentID,
            // - studentRef : to be added by a different function
            seatNumber : reservationData.seatNumber,
            reservationDate : reservationData.reservationDate,
            startTime : reservationData.startTime,
            endTime : reservationData.endTime,
            requestDate : reservationData.requestDate,
            isAnonymous : reservationData.isAnonymous
        }); 
        return reservation;
    },
};

module.exports = database;