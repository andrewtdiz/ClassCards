const mongoose = require('mongoose')

const Schema = mongoose.Schema

const deckSchema = new Schema({
    name: String,
    deckDescription: String,
    everyone: Boolean,
    inviteOnly: Boolean,
    usersEdit: Boolean,
    anonymousPosting: Boolean,
    dateCreated: String,
    userIds: [String],
    adminIds: [String],
})

module.exports = mongoose.model('Deck', deckSchema)

