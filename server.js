if(process.env.NODE_ENV != 'production')
{
    require('dotenv').config();
}
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('express-flash')
const session = require('express-session')
const mongoStore = require('connect-mongo')(session)
const passport = require('passport')
const methodOverride = require('method-override')
const passportSocketIo = require('passport.socketio')
const cookieParser = require('cookie-parser')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs')
app.set('layout', './layouts/layout')
app.set('layout room', 'false')

app.use(expressLayouts)
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(flash());
const sessionStore = new mongoStore({ url: process.env.DB_CONNECTION_STRING })
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

/* Init modules */
const passportInit = require('./config/passport-config')(passport)
const indexRoute = require('./routes/index');
indexRoute(passport)
io.use(passportSocketIo.authorize({
    key: 'connect.sid',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    passport: passport,
    cookieParser: cookieParser
}))

/* Database connection */
mongoose.connect(process.env.DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', async () => {
    console.log('Connected to database')
    const Room = require('./models/room')
    try{
        await Room.deleteMany({})
    }
    catch(err)
    {
        console.log(err)
    }
})


app.use('/', indexRoute.router)

const list = io.of('/list')
const room = io.of('/room')

const a = require('./routes/sockets/list')(list)
const b = require('./routes/sockets/room')(room)

server.listen(process.env.PORT,()=> console.log(`Server is listening at port 8080`));