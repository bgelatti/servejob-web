function renderview(view) {
    return function (req, res) {
        res.render(view)
    };
}

function routes($) {
    $.get('/', renderview('home'));
    $.get('/newjob', renderview('newjob'));
}

module.exports = routes;