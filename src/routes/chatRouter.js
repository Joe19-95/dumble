const express = require('express')
const chatRouter = express.Router()
const Chat = require('../models/chat')
const { userAuth } = require('../middlewares/auth')

chatRouter.get('/chat/:to', userAuth, async (req, res) => {
    const { to } = req.params
    const from = req.user._id
    try {
        let chat = await Chat.findOne({
            participants: {
                $all: [from, to]
            }
        }).populate({
            path: "messages.from",
            select: "fname lname"
        })
        if (!chat) {
            chat = new Chat({
                participants: [from, to],
                messages: []
            })
        }
        await chat.save()
        res.json(chat)
    } catch (err) {
        console.error('Unable to load chat', err)
        res.status(500).send('Unable to load chat')
    }
})

module.exports = chatRouter