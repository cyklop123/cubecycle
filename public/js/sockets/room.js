let roomId = window.location.pathname.split('/').pop()
var socket = io(`/room`, {'transports':['websocket'], upgrade: false, query:`roomid=${roomId}`});



socket.on('disconnect', () => {
    window.location.replace('/')
})