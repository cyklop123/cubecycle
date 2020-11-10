let roomId = window.location.pathname.split('/').pop()
var socket = io(`/room`, {'transports':['websocket'], upgrade: false, query:`roomid=${roomId}`});

socket.on('disconnect', () => {
    window.location.replace('/')
})

socket.on('start round', data => {
    $('#scramble').text(data.scramble)
    $('#message').text('New round. You can solve now.')
    $(`#time`).text(`0.00`)
    unlockTimer()
})

socket.on('stop round', () => lockTimer())

$(() => {
    $(`#sendResult`).on('click', () => {
        const val = $('#time').text()
        if(val != '0.00')
        {
            socket.emit('time',  val)
            $(`#message`).text("Result is send")
        }
    })
})

function unlockTimer()
{
    $('#plus2').prop('disabled', false);
    $('#dnf').prop('disabled', false);
    $('#sendResult').prop('disabled', false);
}

function lockTimer()
{
    $('#plus2').prop('disabled', true);
    $('#dnf').prop('disabled', true);
    $('#sendResult').prop('disabled', true);
}