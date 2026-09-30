const mongoose = require('mongoose')
const messageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true })
const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    messages: [messageSchema]
}, { timestamps: true })

const chatModel = mongoose.model('chat', chatSchema)
module.export = chatModel