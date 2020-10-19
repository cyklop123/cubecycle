const express = require('express');
const http = require('http')
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketio(server)

app.set('view-engine','ejs');
app.use(express.static('views/static'));

app.get('/',(req,res)=>{
    res.render('pages/index.ejs');
});

app.get('/room',(req, res)=>{
    res.render('pages/room.ejs');
});

io.on('connection',(socket)=>{
    console.log('New connection',socket.id);
});

server.listen(8080,()=> console.log(`Server is listening at port 8080`));