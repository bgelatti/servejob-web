function renderview(view) {
    return function (req, res) {
        res.render(view);
    };
}

function routes($) {
    $.get('/', renderview('layout'));
}

module.exports = routes;
