exports = module.exports = function(io) {
    io.on('connection', socket => {
        console.log('New connection',socket.id,socket.request.url, 'room');
    })
}