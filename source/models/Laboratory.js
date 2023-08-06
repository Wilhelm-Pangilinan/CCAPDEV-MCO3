const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const laboratorySchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    row: {
        type: Number,
        required: true
    },
    col: {
        type: Number,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    reservationsRef: [{
        type: Schema.Types.ObjectId,
        ref: 'Reservation'
    }]
});

const Laboratory = mongoose.model('Laboratory', laboratorySchema);
module.exports = Laboratory;