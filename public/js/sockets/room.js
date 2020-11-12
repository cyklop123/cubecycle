let roomId = window.location.pathname.split('/').pop()
var socket = io(`/room`, {'transports':['websocket'], upgrade: false, query:`roomid=${roomId}`});
let resManager; 

socket.on('disconnect', () => {
    window.location.replace('/')
})

socket.on('start round', data => {
    $('#scramble').text(data.scramble)
    $('#message').text('New round. You can solve now.')
    $(`#time`).text(`0.00`)
    unlockTimer()
    resManager.addRound()
})

socket.on('stop round', () => lockTimer())

socket.on('time', data => {
    resManager.addTime(data.user, data.time)
})

socket.on('user connect', login => {
    resManager.addUser(login)
})

socket.on('user list', users => {
    resManager = new ResultManager($("#res-h"), $("#res-b"), users)
})

socket.on('user disconnect', login => {
    resManager.removeUser(login)
})

$(() => {
    $(`#sendResult`).on('click', () => {
        let val = $('#time').text()
        if(val != '0.00')
        {
            if($("#plus2").prop('checked'))
            {
                val += '+2'
            }
            if($("#dnf").prop('checked'))
                val = "DNF"
            socket.emit('time',  val)
            $(`#message`).text("Result is send")
            lockTimer()
        }
    })
    $(window).on('keypress', e => { if(e.key == "Enter") $(`#sendResult`).trigger('click') })
})

function unlockTimer()
{
    $('#plus2').prop('disabled', false);
    $('#dnf').prop('disabled', false);
    $('#sendResult').prop('disabled', false);
}

function lockTimer()
{
    $('#plus2').prop({disabled: true, checked: false}).parent().removeClass('active')
    $('#dnf').prop({disabled: true, checked: false}).parent().removeClass('active')
    $('#sendResult').prop('disabled', true);
}