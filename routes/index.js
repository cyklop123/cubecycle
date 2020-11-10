const express = require('express')
const router = express.Router()

const Room = require('../models/room')

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
            title:'Rooms',
            name: req.user.login });
    });

    router.get('/room', checkAuth, (req, res)=>{
        res.redirect('/')
    });

    router.get('/room/:id', checkAuth, checkUserInRoom, (req, res)=>{
        res.render('pages/room.ejs', {
            title:'Room',
            layout: false,
            name: req.user.login,
            room: req.room});
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

/* Verify if user is in room */
async function checkUserInRoom(req, res, next)
{
    try{
        let room = await Room.findOne({_id: req.params.id})
        if (room.users.includes(req.user.id))
        {
            res.redirect('/')
        }
        else
        {
            room.users.push(req.user.id)
            await room.save()
            req.room = {
                name: room.name,
                type: room.type,
                timeout: room.timeout
            }
            next()
        }
    }
    catch(err)
    {
        res.redirect('/')
    }
}

exports.router = router