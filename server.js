if(process.env.NODE_ENV != 'production')
{
    require('dotenv').config();
}
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const expressLayouts = require('express-ejs-layouts')
const path = require('path')

const indexRouter = require('./routes/index')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', './layouts/layout')
app.set('layout room', 'false')

app.use(express.static('public'));

app.use('/', indexRouter)

io.on('connection',(socket)=>{
    console.log('New connection',socket.id);
});

server.listen(8080,()=> console.log(`Server is listening at port 8080`));