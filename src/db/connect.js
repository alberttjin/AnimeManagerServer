const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://ajin:JUssiSVl0LBF7tnZ@cluster0-ggiav.mongodb.net/anime-db?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true
})