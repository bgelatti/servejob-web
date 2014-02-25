var format  = require('util').format;
var env     = process.env;
var configs = {
    "port": env.PORT || 7051
};

module.exports = configs;