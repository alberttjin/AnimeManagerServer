const mongoose = require('mongoose')

const animeSchema = mongoose.Schema({
    title: {
        type: String,
        unique: false
    },
    ep: {
        type: Number,
        unique: false
    },
    url: {
        type: String,
        unique: false
    },
})

const Anime = mongoose.model('Anime', animeSchema)

module.exports = Anime