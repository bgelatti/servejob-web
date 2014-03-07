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