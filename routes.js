var config  = require('./configuration');

function renderview(view) {
    return function (req, res) {
        var model = {
            "config": config
        };
        res.render(view, model);
    };
}

function routes($) {
    $.get('/', renderview('layout'));
    $.get('/rss', function(req, res){
        res.redirect('http://api.servejob.com/rss');
    });
}

module.exports = routes;
