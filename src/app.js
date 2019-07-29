const express = require('express')
const userRouter = require('./routers/user')
const animeRouter = require('./routers/anime')

const port = process.env.PORT
require('./db/connect')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(animeRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})