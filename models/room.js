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
    }]
})

module.exports = mongoose.model('Room', roomSchema)