const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    fname: {
        type: String
    },
    lname: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    age: {
        type: String
    },
    gendedr: {
        type: String
    }
})

module.exports = mongoose.model('User', userSchema)