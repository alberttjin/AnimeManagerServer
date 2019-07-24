// Import express
const express = require('express')
const apiRoutes = require("./api-routes")
// Initialize the app
const app = express();
// Setup server port
const port = process.env.PORT || 8080;
// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));
app.use('/api', apiRoutes);
// Launch app to listen to specified port
app.listen(port, function () {
     console.log("Running RestHub on port " + port);
});