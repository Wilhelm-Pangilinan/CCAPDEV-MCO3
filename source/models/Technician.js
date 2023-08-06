const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const technicianSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Technician = mongoose.model('Technician', technicianSchema);
module.exports = Technician;