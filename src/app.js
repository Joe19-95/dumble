const { userAuth } = require("../middlewares/auth")
const express = require("express")
const app = express()

const route2 = (req, res) => {
    res.send("from route handelr 2")
}

app.get('/user',userAuth, (req, res, next) => {
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

app.use('/', (req, res) => {
    res.send('no route match fro u')
})



app.listen(3000, () => {
    console.log('server statrt ok')
})