var format  = require('util').format;
var env     = process.env;
var configs = {
    "port":        env.PORT        || 7051,
    "api_address": env.API_ADDRESS || "http://localhost:7050",
    "prerender":   env.PRE_RENDER  || false
};

module.exports = configs;
