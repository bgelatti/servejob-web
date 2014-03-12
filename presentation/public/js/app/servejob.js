(function (angular, config) {
    var servejob = angular.module('servejob', ['ngRoute']);

    servejob.config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(false).hashPrefix('!');
        $routeProvider
            .when('/', {
                controller: "home",
                templateUrl: "/template/home.html"
            })
            .when('/jobs/search/:search', {
                controller: "home",
                templateUrl: "/template/home.html"
            })
            .when('/job/:permalink', {
                controller: "detail",
                templateUrl: "/template/details.html"
            })
            .when('/newjob', {
                controller: "newjob",
                templateUrl: "/template/newjob.html"
            })
            .when('/404', {
                controller: "error404",
                templateUrl: "/template/404.html"
            })
            .otherwise({
                controller: "error404",
                templateUrl: "/template/404.html"
            });
    });

    servejob.controller('home', function($scope, $http, $routeParams, $location) {
        activeSearch($scope, $location);
        var searchTerm = $scope.searchQuery || $routeParams.search;
        loadingPage(true);
        showJobs(searchTerm, config, $scope, $http);
    });

    servejob.controller('detail', function($scope, $http, $routeParams, $location) {
        activeSearch($scope, $location);
        loadingPage(true);
        var permalink = $routeParams.permalink;
        var req_detail_job = {
            "method": "get",
            "url": config.api_route + "/jobs/getbypermalink/" + permalink,
            "cache": false
        };

        $http(req_detail_job).success(function (data) {
            var job = data.result;
            if (!job) {
                window.location = "/#!/404";
                return;
            }
            job.created_on = moment(job.created_on).calendar();
            $scope.job = data.result;
            stButtons.makeButtons(); // Render ShareThis
            loadingPage(false);
        });

        $scope.clickDelete = function(){
            var pass = prompt('Type your Password');
            if (!pass) { return; }

            var req_delete_job = {
                "method": "delete",
                "url": config.api_route + "/jobs/delete/" + pass + "/" + $scope.job._id,
                "cache": false
            };

            $http(req_delete_job).success(function (data) {
                if (data.status) {
                    window.location = '/';
                } else {
                    alert(data.message[0]);
                }
            });
        };
    });

    servejob.controller('newjob', function($scope, $http, $location) {
        activeSearch($scope, $location);
        loadingPage(false);
        $scope.submit = function(job) {
            if (job.deletePassword !== job.confirmDeletePassword) {
                job.status = "Passwords must be identical";
                return;
            }
            var req_newjob = {
                "method": "post",
                "url": config.api_route + "/jobs/savejob",
                "cache": false,
                "data": job
            }

            $http(req_newjob).success(function (data) {
                if (data.status) {
                    setTimeout(function(){
                        window.location = "/#!";
                    }, 1500);
                }

                var message = "";
                if (angular.isArray(data.message)) {
                    angular.forEach(data.message, function (value) {
                        message = message + value + ' ';
                    });
                } else {
                    message = data.message;
                }
                job.status = message;
            });
        };
    });

    servejob.controller('error404', function() {
        loadingPage(false);
    });

}(angular, window.servejob));

function activeSearch($scope, $location) {
    $scope.$watch('searchQuery', function (term) {
        if (term) {
            $location.path("/jobs/search/" + term);
        } else if ($location.path().indexOf('/jobs/search/') == 0){
            $location.path("/");
        }
    });
}

function showJobs(searchTerm, config, $scope, $http) {
    var req_list_job = {
        "method": "get",
        "url": config.api_route + "/jobs/getalljobs",
        "cache": true
    };
    var req_search_job = {
        "method": "get",
        "url": config.api_route + "/jobs/search/" + searchTerm,
        "cache": false
    };

    var makeJobs = function (list_jobs) {
        angular.forEach(list_jobs, function(key){
            key.created_on = moment(key.created_on).format("MMM Do");
        });
        $scope.jobs = list_jobs;
        loadingPage(false);
    };

    var getallJobs = function () {
        $http(req_list_job).success(function (data) {
            makeJobs(data.result);
        });
    };

    var searchJobs = function () {
        $http(req_search_job).success(function (data) {
            makeJobs(data.result);
        });
    };

    if (searchTerm) {
        searchJobs();
    } else {
        getallJobs();
    }
}

function loadingPage(boolShow) {
    var loadpage = document.getElementById("loading-page");
    var content = document.getElementById("content-page");

    if (boolShow) {
        content.style.display = "none";
        loadpage.style.display = "block";
    } else {
        content.style.display = "block";
        loadpage.style.display = "none";
    }
}
