const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cardSchema = new Schema({
    front: String,
    back: String,
    userId: String,
    deckId: String,
    handId: String,
    dateCreated: String,
})

module.exports = mongoose.model('Card', cardSchema)

