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

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', './layouts/layout')
app.set('layout room', 'false')

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({ url: process.env.DB_CONNECTION_STRING })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

/* Init modules */
const passportInit = require('./config/passport-config')(passport)
const indexRoute = require('./routes/index');
const { MongoStore } = require('connect-mongo');
indexRoute(passport)

/* Database connection */
mongoose.connect(process.env.DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to database'))

app.use('/', indexRoute.router)

io.use((socket, next)=>{
    console.log(socket.request)
})

io.on('connection',(socket)=>{
    console.log('New connection',socket.id);
});

server.listen(8080,()=> console.log(`Server is listening at port 8080`));