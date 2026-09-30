const socket = require("socket.io")
const Chat = require('../models/chat')

const initSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: 'http://localhost/5173'
        }
    })

    io.on('connection', (socket) => {
        socket.on('joinChat', ({ from, to }) => {
            const roomId = [from, to].sort().join('_')
            console.log("joining room", roomId)
            socket.join(roomId)
        })
        socket.on('sendMessage', async ({ fname, from, to, text }) => {
            const roomId = [from, to].sort().join('_')
            console.log(`sendime mesafe to${roomId} and messafe ${text}`)

            try {
                let chat = await Chat.find({
                    participants: {
                        $all: [from, to]
                    }
                })
                if (!chat) {
                    chat = new Chat({
                        participants: [from, to],
                        messages: []
                    })
                }
                chat.messages.push({ from: from, text: text })
                chat.save()
                io.to(roomId).emit("newMessage", { fname, from, text })

            } catch (err) {
                res.status(500).send('something went wrong' + err)
            }
        })
        socket.on('disconnect', () => { })
    })
}


module.exports = initSocket