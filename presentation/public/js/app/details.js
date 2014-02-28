var servejob = angular.module('servejob', []);

servejob.controller('detail_job', function($scope, $http) {
    var id = $('#jobId').val();
    var req_list_job = {
        "method": "get",
        "url": "http://localhost:7050/jobs/getbyid/" + id,
        "cache": false
    };

    $http(req_list_job).success(function (data) {
        $scope.job = data.result;
    });
});