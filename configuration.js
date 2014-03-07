var format  = require('util').format;
var env     = process.env;
var configs = {
    "port":        env.PORT        || 7051,
    "api_address": env.API_ADDRESS || "http://localhost:7050"
};

module.exports = configs;
