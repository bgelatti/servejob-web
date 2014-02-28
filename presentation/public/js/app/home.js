var servejob = angular.module('servejob', []);

servejob.controller('list_job', function($scope, $http) {
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
    });
});