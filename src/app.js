const express = require('express')
const cron = require('node-cron')
const userRouter = require('./routers/user')
const animeRouter = require('./routers/anime')
const maxEpFill = require('./cron/maxEpFill')

const port = process.env.PORT
require('./db/connect')

const app = express()
cron.schedule("0 1 * * *", async() => {
     await maxEpFill()
     console.log("Max episodes updated")
})
app.use(function (req, res, next) {

     // Website you wish to allow to connect
     res.setHeader('Access-Control-Allow-Origin', '*');
 
     // Request methods you wish to allow
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, OPTIONS');
 
     // Request headers you wish to allow
     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
 
     // Set to true if you need the website to include cookies in the requests sent
     // to the API (e.g. in case you use sessions)
     res.setHeader('Access-Control-Allow-Credentials', true);
 
     // Pass to next layer of middleware
     next();
 });
app.use(express.json())
app.use(userRouter)
app.use(animeRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})