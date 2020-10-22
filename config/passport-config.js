const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user')

function configure(passport)
{    
    const authenticateUser = (login, password, done) => {
        User.findOne({ 'login': login }, (err, user) => {
            if(err) return done(err)
            if(!user) return done(null, false, {message: 'No user with that login'})
            if(!user.validatePassword(password)) return done(null, false, {message: 'Password incorrect'})
            return done(null,user)
        })
    }
    const registrationUser = (req, login, password, done) => {
        User.findOne({ 'login': login }, (err, user) => {
            if(err) return done(err)
            if(user) return done(null, false, {message: 'User with this login exist'})
            if(req.body.password != req.body.password2) return done(null, false, {message: 'Passwords not match each other'})
            let newUser = new User()
            newUser.login = login;
            let hash = newUser.generateHash(password)
            newUser.password = hash
            newUser.email = req.body.email
            newUser.save(err=>{
                if(err) throw err;
                return done(null, newUser)
            })
        })
    }
    passport.use(new LocalStrategy({usernameField: 'login', passwordField: 'password'}, authenticateUser));
    passport.use('local-register', new LocalStrategy({usernameField: 'login', passwordField: 'password', passReqToCallback: true}, registrationUser));
    passport.serializeUser((user, done) => done(null, user.id) );
    passport.deserializeUser((id, done) => User.findById( id, (err, user) => done(err, user) ) );
}

module.exports = configure;