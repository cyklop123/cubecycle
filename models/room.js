const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    type: {
        type:String,
        required: true
    },
    timeout: {
        type: Number,
        required: true,
        min: 5
    },
    password: {
        type:String
    },
    createdAt: {
        type: Date,
        default:  Date.now
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    solving: {
        type: Boolean,
        default: false
    },
    round: {
        participants:[{
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            time: {
                type: String,
                default: null
            },
            state: {
                type: Number,
                default: 1 //0-idle, 1-solving, 2-solved
            },
            active: {
                type: Boolean,
                default: true
            }
        }],
        start:{
            type: Date,
            default: Date.now
        },
        end:{
            type: Date,
            default: function(){ return new Date().getTime() + this.timeout*1000 + 1000 }
        }
    }
})

roomSchema.methods.updateRoundTimes = function()
{
    this.round.start = Date.now()
    this.round.end = Date.now() + this.timeout*1000 + 1000
}

module.exports = mongoose.model('Room', roomSchema)