const socket = require("socket.io")

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
        socket.on('sendMessage', ({ fname, from, to, text }) => {
            const roomId = [from, to].sort().join('_')
            console.log(`sendime mesafe to${roomId} and messafe ${text}`)
            io.to(roomId).emit("newMessage", { fname, from, text })
        })
        socket.on('disconnect', () => { })
    })
}


module.exports = initSocket