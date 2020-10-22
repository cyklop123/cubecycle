const express = require('express')
const router = express.Router()

exports = module.exports = function(passport){
    /* Authentication routes */
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

    router.post('/register', checkNotAuth, passport.authenticate('local-register',{
        successRedirect: '/',
        failureRedirect: '/register',
        failureFlash: true
    }));

    router.delete('/logout', checkAuth, (req, res) => {
        req.logOut();
        res.redirect('/login');
    });

    /* Authorized routes */
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
}

/* Authorization functions */
function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

function checkNotAuth(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/')
    return next();
}

exports.router = router