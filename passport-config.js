const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy;

function configure(passport, getUserByLogin, getUserById)
{
    const authenticateUser = async (login, password, done)=>{
        const user = getUserByLogin(login);
        if(user == null)
        {
            return done(null, false, { message: 'No user with that login' });
        }
        try{
            if( await bcrypt.compare(password, user.password))
            {
                return done(null, user);
            }
            else
            {
                return done(null, false, 'Wrong password');
            }
        }
        catch(e)
        {
            return done(e);
        }
    }
    passport.use(new LocalStrategy({usernameField: 'login'}, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id) );
    passport.deserializeUser((id, done) => done(null, getUserById(id)) );
}

module.exports = configure;