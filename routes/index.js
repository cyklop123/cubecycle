/* Includes */
const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')
const methodOverride = require('method-override')

/* Init modules */
const conifigurePassport = require('../passport-config');
conifigurePassport(
    passport,
    login => users.find(user => user.login === login),
    id => users.find(user => user.id === id)
);

router.use(express.urlencoded({extended: false}));
router.use(flash());
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride('_method'));

/* Routes */
let users = []; //temporary

/* Log in routes */

router.get('/login', checkNotAuth, (req, res)=>
    res.render('pages/login.ejs', {title: 'Log in'})
);

router.post('/login', checkNotAuth, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/register', checkNotAuth, (req, res)=>
    res.render('pages/register.ejs', { title: 'Register' })
);

router.post('/register', checkNotAuth, async (req, res)=>{
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

router.delete('/logout', checkAuth, (req, res) => {
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

/* Users routes */

router.get('/', checkAuth, (req,res)=>{
    res.render('pages/index.ejs', {
        title:'Cubecycle',
        name: req.user.login });
});

router.get('/room', checkAuth, (req, res)=>{
    res.render('pages/room.ejs', {
        title:'Room',
        layout: false,
        name: req.user.login });
});

module.exports = router