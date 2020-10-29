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

io.on('rooms', rooms => {
    $("#addRoom").modal('hide')
    $("#rooms-list").empty();    
    rooms.forEach(room => {
        $("#rooms-list").append(`
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card mt-2">
            <div class="card-header">
                ${room.name}
                </div>
                <img class="card-img-top w-50 p-1 m-auto" src="img/${room.type}.png" alt="Card image cap">
                <ul class="list-group list-group-flush">
                <li class="list-group-item">Type: ${room.type}</li>
                <li class="list-group-item">Timeout: ${room.timeout}s</li>
                <li class="list-group-item">Admin: jhon1</li>
                </ul>
                <div class="card-body">
                <a href="room/${room._id}" class="btn btn-primary btn-block">Join</a>
                </div>
                <div class="card-footer text-muted">
                ${(room.password) ? 'Private' : 'Public'}
                </div>
            </div>
        </div>`)
    });
})

