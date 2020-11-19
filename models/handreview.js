const mongoose = require('mongoose')

const Schema = mongoose.Schema

const handReviewSchema = new Schema({
    userId: String,
    review: Number,
    handId: String,
    dateCreated: String,
})

module.exports = mongoose.model('HandReview', handReviewSchema)

