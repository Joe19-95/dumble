const express = require('express')
const { userAuth } = require('../middlewares/auth')
const router = express.Router()
const Connection = require('../models/connectionRequest')

const SAFERETURNS = ['fname', 'lname', 'photoURL', 'age', 'gender', 'skills']
router.get('/view/requests', userAuth, async (req, res) => {
    try {
        const requests = await Connection.find({
            to: req.user._id,
            status: 'interested'
        }).populate('from', SAFERETURNS)
        // const data = requests.map(r => r.from)
        res.json({
            data: requests
        })
    } catch (err) {
        res.status(400).send('something went wrong' + err.message)
    }
})

router.get('/view/connections', userAuth, async (req, res) => {
    try {

        const connections = await Connection.find({
            $or: [
                { from: req.user._id, status: 'accepted' }, { to: req.user._id, status: 'accepted' }
            ]
        }).populate('from', SAFERETURNS).populate('to', SAFERETURNS)
        const data = connections.map((item) => {
            if (item.to._id.toString() === req.user._id.toString()) {
                return item.from
            } else {
                return item.to
            }
        })
        res.json({ data })
    } catch (err) {
        res.status(400).send('something went wrong' + err.message)
    }
})


module.exports = router;