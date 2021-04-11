const {Schema, model} = require('mongoose')

const chatSchema = new Schema({
    user: String,
    time: String,
    message: String,
    room: String,
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const Chat = model('chat', chatSchema)

module.exports = Chat