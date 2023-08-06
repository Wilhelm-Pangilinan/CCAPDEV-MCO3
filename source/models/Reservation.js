const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    labName: {
        type: String, 
        required: true
    },
    labRef: {
        type: Schema.Types.ObjectId,
        ref: 'Laboratory',
        required: true
    },
    studentID: {
        type: String,
        required: true
    },
    studentRef: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true  
    },
    seatNumber: {
        type: Number,
        required: true
    },
    reservationDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: Number,
        required: true
    },
    endTime: {
        type: Number,
        required: true
    },
    requestDate: {
        type: Date,
        required: true
    },
    isAnonymous: {
        type: Boolean,
        default: false
    }
})

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;