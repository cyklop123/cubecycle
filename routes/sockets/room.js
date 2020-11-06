const Room = require('../../models/room')

exports = module.exports = function(io) {
    //room manager
    //tablica z roomami 
    io.on('connection', socket => {
        // console.log('New connection',socket.id, socket.request.user.id, socket.handshake.query.roomid);
        socket.join(socket.handshake.query.roomid)
        


        socket.on('disconnect', async () => {
            //remover user form room
            try{
                let room = await Room.findOne({_id: socket.handshake.query.roomid});
                const userIndex = room.users.indexOf(socket.request.user.id)
                if(userIndex >= 0)
                {
                    room.users.splice(userIndex, 1)
                    await room.save()
                }
            }
            catch(err)
            {
                console.error(err);
            }
        })
    })
}