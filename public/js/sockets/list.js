var io = io('/list', {'transports':['websocket'], upgrade: false});

$("#addRoom").on('submit', event => {
    event.preventDefault();
    io.emit('add room', {
        name: $("#name").val(),
        type: $("#type").val(),
        timeout: $("#timeout").val(),
        password: $("#password").val().trim()
    })
    event.target.reset()
})

$("#refresh").on('click', event => {
    io.emit('refresh')
})

$('#rooms-list').on('click', '.deleteRoom', function(){
    io.emit('delete room', $(this).attr('room-id'))
})

io.on('rooms', rooms => {
    const username = $("#username").text()
    $("#addRoom").modal('hide')
    $("#rooms-list").empty();
    if(rooms.length < 1)
    {
        $("#rooms-list").text("There is no rooms. Click add room to create new.")
        return;
    }
    rooms.forEach(room => {
        $("#rooms-list").append(`
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card mt-2">
            <div class="card-header">
                ${room.name}
                ${(room.admin.login === username) ? `<button class="btn btn-danger btn-sm float-right deleteRoom" room-id="${room._id}"><b>&times;</b></button>`:''}
            </div>
            <img class="card-img-top w-50 p-1 m-auto" src="img/${room.type}.png" alt="Card image cap">
            <ul class="list-group list-group-flush">
            <li class="list-group-item">Type: ${room.type}</li>
            <li class="list-group-item">Timeout: ${room.timeout}s</li>
            <li class="list-group-item">Admin: ${room.admin.login}</li>
            </ul>
            <form method="post" action="room/${room._id}">
                <div class="card-body">
                    <button class="btn btn-primary btn-block">Join</button>
                </div>
                <div class="card-footer text-muted">
                    ${(room.password) ? '<input type="text" placeholder="Type password" name="roompass" class="form-control form-control-sm" />' : 'Public'}
                </div>
            </form>
            </div>
        </div>`)
    });
})

