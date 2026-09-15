const validator = require('validator')
const addUserValid = (data) => {
    const { fname, lname, email, password } = data
    if (fname === '' || lname === '') {
        throw new Error('fname and lname is not valid')
    } else if (!validator.isEmail(email)) {
        throw new Error('email is not valid')
    } else if (!validator.isStrongPassword(password)) {
        throw new Error('pass word is not strong enough')
    }
}

module.exports = { addUserValid }