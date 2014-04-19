var config  = require('./configuration');

function renderview(view) {
    return function (req, res) {
        var model = {
            "config": config
        };
        res.render(view, model);
    };
}

function sitemap(req, res, next) {
    if (req.url === '/sitemap') {
        res.redirect('http://api.servejob.com/sitemap');
    } else {
        next();
    }
}

function routes($) {
    $.get('*', sitemap, renderview('layout'));
}

module.exports = routes;
