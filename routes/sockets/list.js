const Room = require('../../models/room')
const sanitizeHtml = require('sanitize-html')
const room = require('../../models/room')

exports = module.exports = function(io){
    io.on('connection', async socket => {
        const rooms = await findAllRooms();
        io.emit('rooms', rooms)

        socket.on('add room', room=>{
            const name = sanitizeHtml(room.name, { allowedTags: [], allowedAttributes: {} })
            const type = sanitizeHtml(room.type, { allowedTags: [], allowedAttributes: {} })
            const timeout = sanitizeHtml(room.timeout, { allowedTags: [], allowedAttributes: {} })
            const password = sanitizeHtml(room.password, { allowedTags: [], allowedAttributes: {} })
            let newRoom = new Room({name, type, timeout, password, admin: socket.request.user.id});
            newRoom.save(async (err) => {
                if (err) return err;
                try{
                    const rooms = await findAllRooms();
                    io.emit('rooms', rooms)
                }
                catch(err)
                {
                    console.log(err)
                }
            })
        })

        socket.on('delete room', async roomid => {
            try{
                let room = await Room.findById(roomid,{admin:1}).populate('admin')
                if(!room)
                    return
                if(room.admin.id !== socket.request.user.id)
                    return
                if(await room.deleteOne())
                {
                    try{
                        const rooms = await findAllRooms();
                        io.emit('rooms', rooms)
                    }
                    catch(err)
                    {
                        console.log(err)
                    }
                }
            }
            catch(err)
            {
                console.log(err)
            }
        })

        socket.on('refresh', async () => {
            try{
                const rooms = await findAllRooms();
                socket.emit('rooms', rooms)
            }
            catch(err)
            {
                console.log(err)
            }
        })
    })
}

async function findAllRooms()
{
    try{
        const rooms = await Room.find({},{name:1, timeout:1, type:1, _id:1, password:1}).populate({path: 'admin', select:{login: 1}})
        for(var i=0; i<rooms.length; i++)
            if(rooms[i].password)
                rooms[i].password = true;
        return rooms.reverse();
    }
    catch(err)
    {
        return [];
    }
}