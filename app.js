const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize express
const app = express();

// Config Server
const { PORT, URI } = require('./config/configuration');
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    family: 4
}

// CORS
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Import Routes
const appRoutes = require('./routes/app');
const gatewayRoutes = require('./routes/gateway');
const deviceRoutes = require('./routes/device');

// connection to DB
mongoose.connect(`${URI}`, options).then(
    () => console.log('DataBase: \x1b[32m%s\x1b[0m', 'online'),
    err => {throw err}
); 

//Routes
app.use('/', appRoutes);
app.use('/gateways', gatewayRoutes);
app.use('/devices', deviceRoutes);

// listen Port
app.listen(PORT, () => {
    console.log(`Express Server on port: ${PORT} \x1b[32m%s\x1b[0m`, 'online');
});