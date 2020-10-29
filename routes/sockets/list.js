const Room = require('../../models/room')

exports = module.exports = function(io){
    io.on('connection', async socket => {
        const rooms = await findAllRooms();
        io.emit('rooms', rooms)

        socket.on('add room', room=>{
            let newRoom = new Room(room);
            newRoom.save(async (err) => {
                if (err) return err;
                const rooms = await findAllRooms();
                io.emit('rooms', rooms)
            })
        })

        socket.on('refresh', async () => {
            const rooms = await findAllRooms();
            socket.emit('rooms', rooms)
        })
    })
}

async function findAllRooms()
{
    try{
        const rooms = await Room.find()
        return rooms.reverse();
    }
    catch(err)
    {
        return [];
    }
}