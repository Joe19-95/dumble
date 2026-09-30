const express = require("express")
require('dotenv').config()
const { connectDB } = require('./config/database')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const reqRouter = require('./routes/requestRouter')
const paymentRouter = require('./routes/paymentRouter')
const connectionRouter = require('./routes/connectionRouter');
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger')
const cors = require('cors')
const app = express()
require('./utils/cron')
const http = require('http')
const socket = require('socket.io')
const initSocket = require("./utils/socket")
const chatRouter = require("./routes/chatRouter")
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/', authRouter)
app.use('/', userRouter)
app.use('/', reqRouter)
app.use('/', connectionRouter);
app.use('/', paymentRouter);
app.use('/', chatRouter)

const server = http.createServer(app)
initSocket(server)

connectDB().then(() => {
    console.log('db connection ok')
    server.listen(3000, () => {
        console.log('server statrt ok')
    })
}).catch(() => {
    console.log('db not ok')
})
