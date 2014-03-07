(function (angular) {
    var servejob = angular.module('servejob', ['ngRoute']);

    servejob.config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                controller: "home",
                templateUrl: "/template/home.html"
            })
            .when('/detail', {
                controller: "home",
                templateUrl: "/template/details.html"
            })
            .when('/newjob', {
                controller: "home",
                templateUrl: "/template/newjob.html"
            })
    });

    servejob.controller('home', function($scope, $http) {
    });

    servejob.controller('list_job', function($scope, $http) {
        loadingPage(true);
        var req_list_job = {
            "method": "get",
            "url": "http://localhost:7050/jobs/getalljobs",
            "cache": true
        };

        $http(req_list_job).success(function (data) {
            angular.forEach(data.result, function(key){
                key.created_on = moment(key.created_on).format("MMM Do");
            });
            $scope.jobs = data.result;
            loadingPage(false);
        });
    });

    servejob.controller('detail_job', function($scope, $http, $routeParams) {
        loadingPage(true);
        var id = $routeParams.id;
        var req_list_job = {
            "method": "get",
            "url": "http://localhost:7050/jobs/getbyid/" + id,
            "cache": false
        };

        $http(req_list_job).success(function (data) {
            $scope.job = data.result;
            loadingPage(false);
        });

        $scope.clickDelete = function(){
            var pass = prompt('Type your Password');

            var req_delete_job = {
                "method": "delete",
                "url": "http://localhost:7050/jobs/delete/" + pass + "/" + id,
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
        $scope.submit = function(job) {
            var req_newjob = {
                "method": "post",
                "url": "http://localhost:7050/jobs/savejob",
                "cache": false,
                "data": job
            }

            $http(req_newjob).success(function (data) {
                if (data.status) {
                    window.location = "/";
                }

                var message = "";
                if (angular.isArray(data.message)) {
                    angular.forEach(data.message, function (value) {
                        message = message + value + ' ';
                    });
                } else {
                    message = data.message;
                }
                $('#statustop').text(message);
            });
        };
    });

}(angular));

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
