const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    login: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    password: {
        type:String,
        required: true
    },
    registeredAt: {
        type: Date,
        default:  Date.now
    }
})

userSchema.methods.generateHash = function(password)
{
    return bcrypt.hashSync(password, 10)
}

userSchema.methods.validatePassword = function(password)
{
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', userSchema)