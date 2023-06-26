var express = require('express')
    , app = express();
let config = require('./config-properties');

app.use(express.static(config.expressStatic));
app.use('/node_modules', express.static(config.nodeModules));
app.use('/schedule', express.static(config.schedule));

module.exports = app;