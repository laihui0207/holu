/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .controller("NewsCtrl", function ($scope, News, ENV) {
        News.newsTypes().then(function (response) {
            $scope.newsTypeList = response.data;
        })
        News.fleshNews();
        $scope.ServerUrl = ENV.ServerUrl; // use to image filter
        $scope.$on("News.updated", function () {
            $scope.newsList = News.newsList();
            $scope.$broadcast('scroll.refreshComplete');
        })
        $scope.doRefresh = function () {
            News.newsTypes().then(function (response) {
                $scope.newsTypeList = response.data;
            })
            News.fleshNews();

        }
        $scope.loadMore = function () {
            News.more();
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        $scope.canLoadMore = function () {
            return News.hasMore();
        }
        $scope.newsListByType = function (typeId) {
            News.setCurrentNewsType(typeId);
        }
    })
    .controller('NewsDetailCtrl', function ($scope, News, $stateParams, ENV, $ionicLoading) {
        News.viewNews($stateParams.newsId).then(function (response) {
            $scope.news = response.data;
        })
        $scope.ServerUrl = ENV.ServerUrl;
    })