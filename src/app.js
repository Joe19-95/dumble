const express = require("express")
const { connectDB } = require('./config/database')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const reqRouter = require('./routes/requestRouter')
const connectionRouter = require('./routes/connectionRouter');
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/', authRouter)
app.use('/', userRouter)
app.use('/', reqRouter)
app.use('/', connectionRouter);

connectDB().then(() => {
    console.log('db connection ok')
    app.listen(3000, () => {
        console.log('server statrt ok')
    })
}).catch(() => {
    console.log('db not ok')
})
