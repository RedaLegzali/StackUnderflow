const {Schema, model} = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId

const questionSchema = new Schema({
    user: String,
    subject: String,
    body: String,
    category: String,
    answers: Array,
    best: ObjectId,
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const Question = model('question', questionSchema)

module.exports = Question