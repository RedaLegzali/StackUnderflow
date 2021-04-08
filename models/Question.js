const {Schema, model} = require('mongoose')

const questionSchema = new Schema({
    user: String,
    subject: String,
    body: String,
    category: String,
    answers: Array,
    best: String,
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const Question = model('question', questionSchema)

module.exports = Question