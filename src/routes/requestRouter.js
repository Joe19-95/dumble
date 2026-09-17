const express = require('express')
const reqRouter = express.Router()
const { userAuth } = require('../middlewares/auth')
const User = require('../models/user')
const Connection = require('../models/connectionRequest')

// localhost:3000/sendRequest/intrested/6aab9236c95a43f76bfc9113

reqRouter.post('/sendRequest/:status/:toId', userAuth, async (req, res) => {
    try {
        const from = req.user._id
        const to = req.params.toId
        const status = req.params.status
        const ALLOWED = ['interested', 'ignored']
        if (!ALLOWED.includes(status)) {
            throw new Error('invalid status is sent for connection request')
        }
        if (from.toString() === to) {
            throw new Error('cannot send request to urself')
        }
        const toUser = await User.findById(to)
        if (!toUser) {
            throw new Error('user does not exist')
        }
        const connectionExist = await Connection.findOne({ $or: [{ from: from, to: to }, { from: to, to: from }] })
        if (connectionExist) {
            throw new Error('connection already exist cannot send again')
        }
        const newCon = new Connection({
            to,
            from,
            status
        })
        await newCon.save()
        res.json({ message: 'connetion sent ok', data: newCon })
    } catch (err) {
        res.status(400).send('something went wrong' + err.message)
    }

})
// localhost:3000/reviewRequest/accepted/6aab9a422baf28a2a50e42f7
reqRouter.post('/reviewRequest/:status/:connectionReq', userAuth, async (req, res) => {
    try {

        const loggedUser = req.user
        const { status, connectionReq } = req.params
        const ALLOWED = ['accepted', 'rejected']
        if (!ALLOWED.includes(status)) {
            throw new Error('ststus sis not valid')
        }
        // console.log(loggedUser._id.toString())
        const connectionRequest = await Connection.findOne({
            _id: connectionReq,
            to: loggedUser._id.toString(),
            status: 'interested'
        })
        if (!connectionRequest) {
            throw new Error('this connection is not valid')
        }
        connectionRequest.status = status
        await connectionRequest.save()
        res.json({
            message: 'request status is changed',
            data: connectionRequest
        })
    } catch (err) {
        res.status(400).send('something went eweonr' + err.message)
    }
})



module.exports = reqRouter