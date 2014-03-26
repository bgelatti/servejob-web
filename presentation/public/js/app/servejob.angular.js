(function (angular, config) {
    var servejob = angular.module('servejob', ['ngRoute', 'infinite-scroll']);

    servejob.config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: "/template/home.html"
            })
            .when('/jobs/search/:search', {
                templateUrl: "/template/search.html"
            })
            .when('/job/:permalink', {
                templateUrl: "/template/details.html"
            })
            .when('/newjob', {
                templateUrl: "/template/newjob.html"
            })
            .when('/404', {
                templateUrl: "/template/404.html"
            })
            .otherwise({
                templateUrl: "/template/404.html"
            });

            $locationProvider.html5Mode(true);
            $locationProvider.hashPrefix('!');
    });

    servejob.controller('mainController', function($scope, $location, $timeout) {
        $scope.seo = {
            pageTitle: '',
            pageDescription : ''
        };

        var searchTimer;
        var searchFunction = $scope.searchFunction = function (term) {
            $timeout.cancel(searchTimer);
            searchTimer = $timeout(function() {
                if (term) {
                    $location.path("/jobs/search/" + term);
                } else if ($location.path().length === 13) {
                    $location.path("/");
                }
            }, 400);
        }
        $scope.$watch('searchInput', function (term) {
            searchFunction(term);
        });
    });

    servejob.controller('home', function($scope, $http, $routeParams, $location) {
        $scope.$parent.seo = {
            pageTitle: 'Home',
            pageDescription: 'If you are seeking employment, their place here. No registration, no hassles, no ad, simple and objective.'
        };
        var page = 1;
        var total_pages = 0;

        var getJobs = function (callback) {
            var req_list_job = {
                "method": "get",
                "url": config.api_route + "/jobs/getalljobs?jobQty=8&page=" + page,
                "cache": false
            };

            $http(req_list_job).success(function (data) {
                total_pages = data.result.total_pages;
                var list_jobs = data.result.items;
                angular.forEach(list_jobs, function(key){
                    key.created_on = moment(key.created_on).format("MMM Do");
                });
                callback(list_jobs);
            });
        };

        $scope.loadMore  = function() {
            if (page !== total_pages) {
                console.log(page);
                page += 1;
                getJobs(function (jobs){
                    for(var i in jobs) {
                        $scope.jobs.push(jobs[i]);
                    }
                });
            }
        }

        loadingPage(true);
        getJobs(function (jobs){
            $scope.jobs = jobs;
            loadingPage(false);
        });
    });

    servejob.controller('search', function($scope, $http, $routeParams) {
        loadingPage(true);
        var searchTerm = $scope.searchQuery || $routeParams.search;
        document.getElementById("search-input").value = searchTerm;

        $scope.$parent.seo = {
            pageTitle: 'Search',
            pageDescription: ('Result of jobs fetched by the term: ' + searchTerm)
        };

        var req_search_job = {
            "method": "get",
            "url": config.api_route + "/jobs/search/" + searchTerm,
            "cache": false
        };

        $http(req_search_job).success(function (data) {
            var list_jobs = data.result;
            angular.forEach(list_jobs, function(key){
                key.created_on = moment(key.created_on).format("MMM Do");
            });
            $scope.jobs = list_jobs;
            loadingPage(false);
        });
    });

    servejob.controller('detail', function($scope, $http, $routeParams) {
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
                window.location = "/404";
                return;
            }
            job.created_on = moment(job.created_on).calendar();
            $scope.job = data.result;
            // stButtons.makeButtons(); // Render ShareThis
            $scope.$parent.seo = {
                pageTitle: data.result.jobTitle,
                pageDescription: ('Job detail: ' + data.result.jobTitle)
            };
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

    servejob.controller('newjob', function($scope, $http) {
        loadingPage(false);
        $scope.$parent.seo = {
            pageTitle: 'New Job',
            pageDescription: 'Register a new job without bureaucracies! Simple, fast and easy.'
        };
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
                        window.location = "/";
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

    servejob.controller('error404', function($scope) {
        loadingPage(false);
        $scope.$parent.seo = {
            pageTitle: 'Page Not Found',
            pageDescription: 'Page Not Found'
        };
    });

}(angular, window.servejob));

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
