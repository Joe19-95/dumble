const express = require("express")
const app = express()


app.get('/user', (req, res) => {
    res.send({ name: 'joe', lname: 'jacob' })
})

app.post('/user', (req, res) => {
    res.send('post data succeffule')
})


app.get('/params/:id/:name', (req, res) => {
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