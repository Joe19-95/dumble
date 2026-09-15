const { userAuth } = require("./middlewares/auth")
const express = require("express")
const { connectDB } = require('./config/database')
const User = require('./models/user')
const app = express()

app.post('/signup', async (req, res) => {
    const user = new User({
        fname: 'joe',
        lname: 'jacob',
        age: '90'
    })
    await user.save()
    res.send('user saved ok')
})

connectDB().then(() => {
    console.log('db connection ok')
    app.listen(3000, () => {
        console.log('server statrt ok')
    })
}).catch(() => {
    console.log('db not ok')
})
