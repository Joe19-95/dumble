const express = require("express")
const { connectDB } = require('./config/database')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use('/', authRouter)
app.use('/', userRouter)

connectDB().then(() => {
    console.log('db connection ok')
    app.listen(3000, () => {
        console.log('server statrt ok')
    })
}).catch(() => {
    console.log('db not ok')
})
