var servejob = angular.module('servejob', []);

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