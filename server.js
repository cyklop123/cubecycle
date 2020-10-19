if(process.env.NODE_ENV != 'production')
{
    require('dotenv').config();
}

const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const initializePassport = require('./passport-config');
initializePassport(
    passport,
    login => users.find(user => user.login === login),
    id => users.find(user => user.id === id)
);

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set('view-engine','ejs');
app.use(express.static('views/static'));
app.use(express.urlencoded({extended: false}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

/* Log in system */
let users = [];

app.get('/login', checkNotAuth, (req, res)=>
    res.render('pages/login.ejs')
);

app.post('/login', checkNotAuth, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuth, (req, res)=>
    res.render('pages/register.ejs')
);

app.post('/register', checkNotAuth, async (req, res)=>{
    try{
        const hashedPass = await bcrypt.hash(req.body.password,10);
        users.push({
            id: Date.now().toString(),
            login: req.body.login,
            email: req.body.email,
            password: hashedPass
        });
        console.log(users);
        res.redirect('/login');
    }
    catch{
        res.redirect('/register');
    }
});

app.delete('/logout', checkAuth, (req, res) => {
    req.logOut();
    res.redirect('/login');
});

function checkAuth(req, res, next) {
    if (req.isAuthenticated())
    {
        return next();
    }
    res.redirect('/login');
}

function checkNotAuth(req, res, next) {
    if (req.isAuthenticated())
    {
        return res.redirect('/');
    }
    return next();
}

/* App functionality */

app.get('/', checkAuth, (req,res)=>{
    res.render('pages/index.ejs', {name: req.user.login });
});

app.get('/room', checkAuth, (req, res)=>{
    res.render('pages/room.ejs', {name: req.user.login });
});

io.on('connection',(socket)=>{
    console.log('New connection',socket.id);
});

server.listen(8080,()=> console.log(`Server is listening at port 8080`));