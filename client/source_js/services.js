var MainServices = angular.module('MainServices', []);

/**
 * Initialize the commondata: the url. This can change after deployment.
 */
MainServices.factory('CommonData', function () {
    var data = "http://localhost:4000/api";
    return {
        getData: function () {
            return data;
        },
        setData: function (newData) {
            data = newData;
        }
    }
});

/**
 * All kinds of services, such as get, delete, post and put.
 */
MainServices
    .factory('TaskService', ['$http', 'CommonData', function ($http, CommonData) {
        return {
            get_service: function (select, callback) {
                $http.get(CommonData.getData() + select)
                    .success(function (data) {
                        callback(data.data)
                    })
                    .error(function (data) {
                        callback(null)
                    });
            },

            delete_service: function (delete_call, data_send, callback) {
                $http({
                    method: 'DELETE',
                    url: CommonData.getData() + delete_call,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: $.param(data_send)
                })
                    .success(function (data) {
                        callback;
                    })
                    .error(function (data) {
                        callback;
                    });
            },

            post_service: function (post_call, data_send, callback) {
                $http({
                    method: 'POST',
                    url: CommonData.getData() + post_call,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: $.param(data_send)
                })
                    .success(function (response) {
                        callback(response)
                    })
                    .error(function (data) {
                        callback(data)
                    })
            },

            put_service: function (put_call, data_send, callback) {
                $http({
                    method: 'PUT',
                    url: CommonData.getData() + put_call,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: $.param(data_send)
                })
                    .success(function (response, status) {
                        callback(response, status)
                    })
                    .error(function (data, status) {
                        callback(data, status)
                    })
            }
        }
    }]);

