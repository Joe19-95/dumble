const { userAuth } = require("./middlewares/auth")
const express = require("express")
const {connectDB} = require('./config/database')
const app = express()

const route2 = (req, res) => {
    res.send("from route handelr 2")
}

app.get('/user', userAuth, (req, res, next) => {
    throw new Error('not audio enable')
    console.log('callling next ererto addd another router handelr')
    next()
}, route2)


app.post('/user', (req, res) => {
    res.send('post data succeffule')
})


app.get('/params/:id/:name ', (req, res) => {
    res.send(req.params)
})
app.get('/query', (req, res) => {
    res.send(req.query)
})

app.use('/', (err, req, res, next) => {
    if (err) {
        res.status(500).send('something went wrong')
    }
    res.send('no route match fro u')
})

connectDB().then(() => {
    console.log('db connection ok')
    app.listen(3000, () => {
        console.log('server statrt ok')
    })
}).catch(() => {
    console.log('db not ok')
})
