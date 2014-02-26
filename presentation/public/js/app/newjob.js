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
            $scope.job = {};
            $scope.response = data;
        });
    };
});