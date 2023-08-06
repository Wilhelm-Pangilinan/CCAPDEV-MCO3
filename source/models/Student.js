const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const studentSchema = new Schema({
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    id: {
        type: String,
        required: true,
        unqiue: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    reservationsRef: [{
        type: Schema.Types.ObjectId,
        ref: 'Reservation'
    }]
})

studentSchema.pre('save', async function(next) {
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

studentSchema.method('comparePassword', async function(passwordInput) {
    return await bcrypt.compare( passwordInput, this.password );
});


const Student = mongoose.model('Student', studentSchema);
module.exports = Student;