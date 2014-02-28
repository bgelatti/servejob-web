function renderview(view) {
    return function (req, res) {
        res.render(view, {"query": req.query});
    };
}

function routes($) {
    $.get('/', renderview('home'));
    $.get('/newjob', renderview('newjob'));
    $.get('/detail', renderview('details'));
}

module.exports = routes;