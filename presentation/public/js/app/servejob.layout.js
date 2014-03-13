var searchInput = (function () {
    var timer;

    var searchMethod = function (element) {
        var value = element.value;
        clearTimeout(timer);

        timer = setTimeout(function() {
            if (value) {
                window.location.hash = "/jobs/search/" + value;
            } else if (window.location.hash.indexOf("/jobs/search/") === 0) {
                window.location.hash = "/";
            }
        }, 400);
    }

    return searchMethod;
}());
