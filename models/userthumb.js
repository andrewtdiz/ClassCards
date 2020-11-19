const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userThumbSchema = new Schema({
    userId: String,
    handId: String,
    cardId: String,
})

module.exports = mongoose.model('UserThumb', userThumbSchema)