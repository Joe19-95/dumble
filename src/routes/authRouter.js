const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { addUserValid } = require('../utils/addUserValidator')
const { userAuth } = require('../middlewares/auth')

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        console.log(user)
        if (!user) {
            throw new Error('Invalid Creds')
        }
        const isValid = await bcrypt.compare(password, user.password)
        if (isValid) {
            const token = user.getJWT()
            res.cookie("token", token)
            res.send('Login ok')
        } else {
            throw new Error("Invalid creds")
        }

    } catch (err) {
        res.status(500).send('invalid creds')
    }
})

router.post('/signUp', async (req, res) => {
    console.log(req.body)
    try {
        //add data valdaitor for the data that user enter
        addUserValid(req.body)
        // add password encrption to srote password safelu in db
        const { fname, lname, email, photoURL, age, gender, skills, password, } = req.body
        const pasHash = await bcrypt.hash(password, 10)
        const user = new User({ fname, lname, email, photoURL, age, gender, skills, password: pasHash })
        await user.save()
        res.send('user added ok')

    } catch (err) {
        res.status(500).send('something went wrong' + err.message)
    }
})

router.patch('/passwordUpdate', userAuth, async (req, res) => {
    try {
        const loggedInuser = req.user
        const isPasValid = await bcrypt.compare(req.body.oldPass, loggedInuser.password)
        if (!isPasValid) {
            throw new Error('old password is not correct')
        } else {
            loggedInuser.password = await bcrypt.hash(req.body.newPass, 10)
            await loggedInuser.save()
            res.send('passwrd update sucesfylly')
        }

    } catch (err) {
        res.status(500).send("something wen wrong" + err.message)
    }
})

router.post('/logout', (req, res) => {
    res.cookie('token', null, { expires: new Date(Date.now()) })
    res.send('logout ok')
})


module.exports = router