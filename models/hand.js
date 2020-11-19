const mongoose = require('mongoose')

const Schema = mongoose.Schema

const handSchema = new Schema({
    deckId: String,
    dateCreated: String,
    cardIds: [String],
    defaultCard: String,
    commentTotal: Number,
    likeTotal: Number,
    createdByUserId: String,
})

module.exports = mongoose.model('Hand', handSchema)

