const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    image: String,
    team: String,
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const User = model('user', userSchema)

module.exports = User