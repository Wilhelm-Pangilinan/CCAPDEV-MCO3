/*|*******************************************************

                        Mongoose
                        
*********************************************************/
const Laboratory = require('../models/Laboratory');
const Student = require('../models/Student');
const Technician = require('../models/Technician');
const Reservation = require('../models/Reservation');
const constructor = require('../utility/constructor');

/*|*******************************************************

                    JSON Data Extraction        

*********************************************************/
const fs = require('fs');
const path = require('path');
const jsonDataPath = path.join(__dirname, 'data.json');
const jsonData = fs.readFileSync(jsonDataPath, 'utf8');
const data = JSON.parse(jsonData);

/*|*******************************************************

                     Import Functions

*********************************************************/
async function importStudents() {
    try {
        // - Extract the students data from the parsed JSON data
        const studentsData = data.students;

        for( const studentData of studentsData ) {
            // - Check if the email or ID already exists 
            const existingStudent = await Student.findOne({
                $or: [{ email : studentData.email }, { id : studentData.id }],
            });

            if( existingStudent ) {
                console.log( "Student already exists:", studentData.email  );
            } else {
                const newStudent = new Student(studentData);
                const savedStudent = await newStudent.save();
            }
        }
    } catch(error) {
        console.error('Error importing students:', error);
    }
}

async function importLaboratories() {
    try {
        // - Extract the laboratories data from the parsed JSON data
        const laboratoriesData = data.laboratory;

        for( const laboratoryData of laboratoriesData ) {
            // - Check if the laboratory already exists or not
            const existingLab = await Laboratory.findOne({name: laboratoryData.name});

            if( existingLab ) {
                console.log( "Laboratory already exists:", laboratoryData.name );
            } else {
                const newLab = new Laboratory(laboratoryData);
                const savedLab = await newLab.save();
            }
        }
    } catch(error) {
        console.error( "Error importing laboratories:", error );
    }
}

async function importReservations() {
    try {
        // - Extract the reservations data from the parsed JSON data
        const reservationsData = data.reservations;

        for( const reservationData of reservationsData ) {
            // - Find the laboratory and the user of the reservation
            const laboratory = await Laboratory.findOne({name: reservationData.labName});
            const student = await Student.findOne({id: reservationData.studentID});
            var savedReservation;

            // - Create new reservation object
            if( laboratory && student ) {

                // - Check if the reservation already exists 
                const existingReservation = await Reservation.findOne({
                    labName: reservationData.labName,
                    labRef: laboratory._id,
                    studentID: reservationData.studentID,
                    studentRef: student._id,
                    seatNumber: reservationData.seat,
                    reservationDate: reservationData.reservationDate,
                    startTime: reservationData.startTime,
                    endTime: reservationData.endTime,
                    requestDate: reservationData.requestDate,
                    isAnonymous: reservationData.isAnonymous
                })
                
                if( existingReservation ) {
                    console.log( "Reservation already exists:", existingReservation._id );
                } else {
                    const newReservation = await new Reservation({
                        labName: reservationData.labName,
                        labRef: laboratory._id,
                        studentID: reservationData.studentID,
                        studentRef: student._id,
                        seatNumber: reservationData.seat,
                        reservationDate: reservationData.reservationDate,
                        startTime: reservationData.startTime,
                        endTime: reservationData.endTime,
                        requestDate: reservationData.requestDate,
                        isAnonymous: reservationData.isAnonymous
                    });
                    savedReservation = await newReservation.save();
                }
            }

            // - If the reservation was created, create a reference in the lab and student document
            if( savedReservation ) {
                const reservationIdString = savedReservation._id.toString();

                // Add the reservation reference to the Laboratory document if not already present
                if( !laboratory.reservationsRef.includes(reservationIdString) ) {
                    laboratory.reservationsRef.push(savedReservation._id);
                    await laboratory.save();
                    console.log( "Reservation added in", laboratory.name );
                } else {
                    console.log( "Reservation already referenced in laboratory" );
                }

                // Add the reservation reference to the Student document if not already present
                if( !student.reservationsRef.includes(reservationIdString) ) {
                    student.reservationsRef.push(savedReservation._id);
                    await student.save();
                    console.log( "Reservation added in", student.name );
                } else {
                    console.log( "Reservation already referenced in student" );
                }
            }
        }
    } catch(error) {
        console.error( "Error importing reservations:", error );
    }
}

async function importTechnician() {
    try {
        // - Extract the students data from the parsed JSON data
        const techniciansData = data.technician;

        for( const technicianData of techniciansData ) {
            // - Check if the email or ID already exists 
            const existingTechnician = await Technician.findOne({
                $or: [{ email : technicianData.email }, { id : technicianData.id }],
            });

            if( existingTechnician ) {
                console.log( "Technician already exists:", technicianData.email  );
            } else {
                const newTechnician = new Technician(technicianData);
                const savedTechnician = await newTechnician.save();
            }
        }
    } catch(error) {
        console.error('Error importing students:', error);
    }
}

async function importData() {
    try {
        await importLaboratories();
        await importStudents();
        await importReservations();
        await importTechnician();
        console.log("Data import successful!");
    } catch( error ) {
        console.error("Data import failed:", error);
    }
}

/*|*******************************************************

                     Connect To Database

*********************************************************/
async function connect( mongoose, db_url ) {
    try {
        await mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log( "Database connected!" );
    } catch (error) {
        console.log("Database failed to connect.");
    }
}

module.exports = {
    importData,
    connect
};