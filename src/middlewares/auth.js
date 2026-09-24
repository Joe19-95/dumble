const jwt = require('jsonwebtoken')
const User = require('../models/user')
const userAuth = async (req, res, next) => {
    try {

        const { token } = req.cookies
        if (!token) {
            return res.status(401).send('No token present')
            // throw new Error('ur token is not valid')
        }
        const decoded = await jwt.verify(token, 'JOE19')
        const user = await User.findById(decoded._id)
        if (!user) {
            throw new Error('user not found')
        } else {
            req.user = user
            next()
        }
    } catch (err) {
        res.status(400).send("ERROR" + err.message)
    }

}

module.exports = {
    userAuth
}