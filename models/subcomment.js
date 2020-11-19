const mongoose = require('mongoose')

const Schema = mongoose.Schema

const subCommentSchema = new Schema({
    userId: String,
    content: String,
    cardCommentId: String,
    dateCreated: String,
})

module.exports = mongoose.model('SubComment', subCommentSchema)

