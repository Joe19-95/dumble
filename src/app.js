const express = require("express")
const app = express()

app.use('/test',(req, res) => {
    res.send('hello fromnn server')
})
app.listen(3000, () => {
    console.log('server connected suucessfully')
})
