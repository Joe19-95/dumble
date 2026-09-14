const userAuth = (req, res, next) => {
    const token = 'xyz'
    const isAuth = (token === 'xyz')
    if (isAuth) {
        next()
    } else {
        res.status(401).send('not authorized')
    }
}

module.exports = {
    userAuth
}