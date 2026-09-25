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

const validateEditData = (data) => {
 const ALLOWED = ['fname', 'lname','skills', 'photoURL', 'age', 'gender', 'skills']
    return Object.keys(data).every(k => ALLOWED.includes(k))
}

module.exports = { addUserValid, validateEditData }