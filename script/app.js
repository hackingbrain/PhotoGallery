var app = angular.module("photoGallery",['akoenig.deckgrid','me-lazyload']);

app.controller("photoCtrl", ["$http","$scope", "$filter", function ($http, $scope, $filter) {
    var target = "";
    $scope.searchTopic = function () {
        target = {targetTopic: $scope.topic}
    }
    
    $http.get("/api/v1/photos", target)
        .then(function (response) { // use promise to do it
            // bind data from back-end to front-end by using $scope
            $scope.photos = response.data;
            $scope.filteredPhotos = $scope.photos;

            $scope.pinFilter = 'all';

            $scope.searchTags = function () {
                // 如果search tag 为空 则显示所有
                if ($scope.tagsFilter === '') {
                    if ($scope.pinFilter === 'all') {
                        $scope.filteredPhotos = $scope.photos;
                    } else if ($scope.pinFilter === 'pinned'){
                        $scope.filteredPhotos = $filter('filter')($scope.photos, {pinned: true});
                    }
                } else {
                    if ($scope.pinFilter === 'all') {
                        // filter 用法：希望在$scope.photos里面进行filter, tag里面就是条件
                        $scope.filteredPhotos = $filter('filter')($scope.photos, {tags: $scope.tagsFilter});
                    } else if ($scope.pinFilter === 'pinned') {
                        $scope.filteredPhotos = $filter('filter')($scope.photos, {pinned: true, tags: $scope.tagsFilter});
                    }
                }
            };

            $scope.pin = function (index) {
                var currentPinStatus = $scope.photos[index].pinned;
                if (currentPinStatus == null) {
                    $scope.photos[index].pinned = true;
                } else {
                    $scope.photos[index].pinned = !currentPinStatus;
                }
            };

            $scope.togglePinned = function (pinFilter) {
                $scope.pinFilter = pinFilter; //to toggle button style class
                if (pinFilter === 'all') {
                    if ($scope.tagsFilter === '') {
                        $scope.filteredPhotos = $scope.photos;
                    } else {
                        $scope.filteredPhotos = $filter('filter')($scope.photos, {tags: $scope.tagsFilter});
                    }
                } else if (pinFilter === 'pinned') {
                    if ($scope.tagsFilter === '') {
                        $scope.filteredPhotos = $filter('filter')($scope.photos, {pinned: true});
                    } else {
                        $scope.filteredPhotos = $filter('filter')($scope.photos, {pinned: true, tags: $scope.tagsFilter});
                    }
                }
            }
        });
}]);