const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

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

technicianSchema.pre('save', async function(next) {
    const user = this;
    if( !user.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(15);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    } catch(error) {
        console.log(error);
        return next(error);
    }
});

technicianSchema.method('comparePassword', async function(passwordInput) {
    return await bcrypt.compare( passwordInput, this.password );
});


const Technician = mongoose.model('Technician', technicianSchema);
module.exports = Technician;