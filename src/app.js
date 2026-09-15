const { userAuth } = require("./middlewares/auth")
const express = require("express")
const { addUserValid } = require('./utils/addUserValidator')
const { connectDB } = require('./config/database')
const User = require('./models/user')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const app = express()
app.use(express.json())
app.use(cookieParser())

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        console.log(user)
        if (!user) {
            throw new Error('Invalid Creds')
        }
        const isValid = await bcrypt.compare(password, user.password)
        if (isValid) {
            const token = await jwt.sign({ _id: user._id }, "JOE19")
            res.cookie("token", token)
            res.send('Login ok')
        } else {
            throw new Error("Invalid creds")
        }

    } catch (err) {
        res.status(500).send('invalid creds')
    }
})

app.post('/signUp', async (req, res) => {
    console.log(req.body)

    try {
        //add data valdaitor for the data that user enter
        addUserValid(req.body)
        // add password encrption to srote password safelu in db
        const { fname, lname, email, password } = req.body
        const pasHash = await bcrypt.hash(password, 10)
        const user = new User({ fname, lname, email, password: pasHash })
        await user.save()
        res.send('user added ok')

    } catch (err) {
        res.status(500).send('something went wrong' + err.message)
    }
})

app.get('/getUser', userAuth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (err) {
        res.status(500).send('something went wrong' + err.message)
    }
})


app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)

    } catch (err) {
        res.status(500).send('something went wrong')
    }
})

app.delete('/delUser', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.body.userId)
        if (user) {
            res.send(user)
        } else {
            res.status(400).send('user not found')
        }
    } catch (err) {
        res.status(500).send('something went wrong')
    }
})

app.patch('/updateUser', async (req, res) => {
    try {
        const ALLOWED = ["age", "skills", "userId"]
        isReqOk = Object.keys(req.body).every(k => ALLOWED.includes(k))
        if (!isReqOk) {
            throw new Error('non valid feilds are there in the code')
        }
        const user = await User.findByIdAndUpdate({ _id: req.body.userId }, req.body, { returnDocument: "after", runValidators: true })
        res.send(user)
    } catch (err) {
        res.status(500).send('something went wrong' + err.message)
    }
})

connectDB().then(() => {
    console.log('db connection ok')
    app.listen(3000, () => {
        console.log('server statrt ok')
    })
}).catch(() => {
    console.log('db not ok')
})
