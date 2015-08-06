/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .controller("NewsCtrl", function ($scope, News, ENV) {
        News.newsTypes().then(function(response){
            $scope.newsTypeList=response.data;
        })
        News.all().then(function (response) {
            $scope.newsList = response.data;
        })
        $scope.ServerUrl = ENV.ServerUrl;

        $scope.doRefresh = function () {
            News.newsTypes().then(function(response){
                $scope.newsTypeList=response.data;
            })
            News.all().then(function (response) {
                $scope.newsList = response.data;
            }).then(function(){
                $scope.$broadcast('scroll.refreshComplete');
            })

        }
        $scope.newsListByType=function(typeId){
            News.newsListByType(typeId).then(function(response){
                $scope.newsList = response.data;
            })
        }
    })
    .controller('NewsDetailCtrl', function ($scope, News, $stateParams, ENV) {
        News.viewNews($stateParams.newsId).then(function (response) {
            $scope.news = response.data;
        })
        $scope.ServerUrl = ENV.ServerUrl;
    })