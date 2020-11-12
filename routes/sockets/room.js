const { find } = require('../../models/room');
const room = require('../../models/room');
const Room = require('../../models/room')
const generateScramble = require('../../utils/scrambler')

exports = module.exports = function(io) {
    io.on('connection', socket => {
        var roomid = socket.handshake.query.roomid;
        var userid = socket.request.user.id
        var userLogin = socket.request.user.login
        socket.join(roomid)
        checkIfStartOrStopRound(roomid)
        
        Room.findById(roomid).populate('users').exec((err, room) => {
            let users = []
            room.users.forEach(user => users.push(user.login))
            socket.emit('user list', users)
            socket.broadcast.to(roomid).emit('user connect', userLogin)
        })

        socket.on('time', async time => {
            try{
                let room = await Room.findById(roomid)
                const roundUserIndex = room.round.participants.findIndex(el => el.user_id == userid)
                if(roundUserIndex >= 0)
                {
                    room.round.participants[roundUserIndex].time = time
                    room.round.participants[roundUserIndex].state = 2
                    await room.save()
                    io.in(roomid).emit('time', {user: userLogin, time})
                    checkIfStartOrStopRound(roomid)
                }
            }
            catch(err)
            {
                console.log(err)
            }
        })

        socket.on('disconnect', async () => {
            try{
                let room = await Room.findOne({_id: roomid});
                const userIndex = room.users.indexOf(userid)
                if(userIndex >= 0)
                    room.users.splice(userIndex, 1)

                const roundUserIndex = room.round.participants.findIndex(el => el.user_id == userid)
                if(roundUserIndex >= 0)
                    room.round.participants[roundUserIndex].active = false

                await room.save()
                
                io.in(roomid).emit('user disconnect', userLogin)

                checkIfStartOrStopRound(roomid) 
            }
            catch(err)
            {
                console.error(err);
            }
        })
    })

    async function checkIfStartOrStopRound(roomid)
    {
        try{
            let room = await Room.findOne({_id: roomid});
            if (room.solving)
            {
                let stop = true;
                room.round.participants.forEach(participant => {
                    if (participant.active && participant.state == 1)
                        stop = false
                })
                if(room.round.end.getTime() < Date.now())
                    stop = true
                if (stop)
                {
                    room.solving = false
                    await room.save()
                    io.in(roomid).emit('stop round')
                    checkIfStartOrStopRound(roomid)
                }
            }
            else
            {
                if(room.users.length)
                {
                    room.round.participants = []
                    room.users.forEach(userId => {
                        room.round.participants.push({user_id: userId})
                    })
                    room.solving = true;
                    room.updateRoundTimes()
                    await room.save()
                    scramble = generateScramble(room.type)
                    setTimeout(() => io.in(roomid).emit('start round', {scramble: scramble, start: room.round.start, end: room.round.end}), 1000)
                }
            }
        }
        catch(err)
        {
            console.log(err)
        }
    }

    setInterval(async () => {
        let rooms = await Room.find()
        rooms.forEach(async room => {
            await checkIfStartOrStopRound(room._id)
        })
    },  process.env.TIMEOUT_CHECK_INTERVAL)
}