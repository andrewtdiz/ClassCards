const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cardCommentSchema = new Schema({
    userId: String,
    content: String,
    handId: String,
    dateCreated: String,
})

module.exports = mongoose.model('CardComment', cardCommentSchema)

