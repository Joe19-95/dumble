const mongoose = require('mongoose')
const validator = require('validator')
const userSchema = mongoose.Schema({
    fname: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 10
    },
    lname: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(val){
            if(!validator(val)){
                throw new Error('Email id is not valid')
            }
        }
    },
    password: {
        type: String,
        required: true,


    },
    photoURL: {
        type: String
    },
    age: {
        type: Number,
        min: 5,
        max: 90
    },
    gendedr: {
        type: String,
        validate(val) {
            if (!['M', 'F', 'O'].includes(val)) {
                throw new Error('gender is not valid')
            }
        }
    },
    skills: {
        type: [String],
        default: ['jogging']
    }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)