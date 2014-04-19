/**
 * Module dependencies.
 */
var express  = require('express');
var hbs      = require('express-hbs');
var format   = require('util').format;
var routes   = require('./routes');
var config   = require('./configuration');
var newrelic = require('./newrelic.js');
var server   = express();

/**
 * View Configuration.
 */
 var hbsconf = {
    'partialsDir'  : __dirname + '/presentation/views/partials'
};
server.engine('hbs', hbs.express3(hbsconf));
server.set('view engine', 'hbs');
server.set('views', __dirname + '/presentation/views');

/**
 * Express Configuration.
 */
 if (process.env.PROTOTYPE) {
    server.use(express.basicAuth('a', 'b'));
}

if (!process.env.DISABLE_EXPRESS_LOG) {
   server.use(express.logger('dev'));
}

if (config.prerender) {
    server.use(require('prerender-node').set('prerenderToken', 'IHICuA1WA7Z7emahdIaY'));
}
newrelic.start();
server.set('port', config.port);
server.disable('x-powered-by');
server.use(express.static(__dirname + '/presentation/public'));
server.use(express.favicon(__dirname + '/presentation/public/img/favicon.ico'));
server.use(express.urlencoded());
server.use(express.json());
server.use(express.methodOverride());
server.use(server.router);
server.use(function (req, res, next ){
    res.status(404);
    res.redirect("/#!/404");
});
/**
 * Routes Configuration.
 */
routes(server);

/**
 * Start Server.
 */
server.listen(server.get('port'), function() {
    var msg = '';
    msg += '\n- \u001b[31mServeJob - Client - WEB';
    msg += '\u001b[31m at \u001b[0m';
    msg += 'http://localhost:%s\u001b[0m';
    msg = format(msg, server.get('port'));
    console.info(msg);
});
