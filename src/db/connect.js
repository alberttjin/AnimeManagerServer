const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/anikeepserver', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true
})