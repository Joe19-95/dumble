const express = require('express')
const userRouter = express.Router()
const { userAuth } = require("../middlewares/auth")
const User = require('../models/user')
const { validateEditData } = require('../utils/addUserValidator')
const ConnecModel = require('../models/connectionRequest')


userRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (err) {
        res.status(500).send('something went wrong' + err.message)
    }
})

userRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateEditData(req.body)) {
            throw new Error('data payload is not valid')
        }
        const loggedInuser = req.user
        Object.keys(req.body).forEach((k) => {
            loggedInuser[k] = req.body[k]
        })
        await loggedInuser.save()
        res.send({
            message: `{loggedInuser.fname} your is succesfully updated`,
            data: loggedInuser
        })

    } catch (err) {
        res.status(500).send('something went wrong' + err.message)
    }
})

userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const curUser = req.user
        let connection = await ConnecModel.find({
            $or: [
                { from: curUser._id }, { to: curUser._id }
            ]
        }).select("from to")
        const hideId = []
        connection.forEach(element => {
            hideId.push(element.from.toString())
            hideId.push(element.to.toString())
        });
        const finalUsers = await User.find({ $and: [{ _id: { $nin: hideId } }, { _id: {$ne: curUser._id }}] }).select('fname lname photoURL age gender skills');
        res.json({ data: finalUsers })

    } catch (err) {
        res.status(500).send('something went wrong' + err.message)
    }
})

userRouter.delete('/delUser', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.body.userId)
        if (user) {
            res.send(user)
        } else {
            res.status(400).send('user not found')
        }
    } catch (err) {
        res.status(500).send('something went wrong')
    }
})


userRouter.patch('/updateUser', async (req, res) => {
    try {
        const ALLOWED = ["age", "skills", "userId"]
        isReqOk = Object.keys(req.body).every(k => ALLOWED.includes(k))
        if (!isReqOk) {
            throw new Error('non valid feilds are there in the code')
        }
        const user = await User.findByIdAndUpdate({ _id: req.body.userId }, req.body, { returnDocument: "after", runValidators: true })
        res.send(user)
    } catch (err) {
        res.status(500).send('something went wrong' + err.message)
    }
})


module.exports = userRouter