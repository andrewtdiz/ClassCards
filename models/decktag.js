const mongoose = require('mongoose')

const Schema = mongoose.Schema

const deckTagSchema = new Schema({
    name: String,
    deckId: String,
    dateCreated: String,
    handIdsOrder: [String],
    parentTag: String,
})

module.exports = mongoose.model('DeckTag', deckTagSchema)