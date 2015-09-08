/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .controller("NewsCtrl", function ($scope, News, ENV,AuthService) {
        var currentUser=AuthService.currentUser();
        if(currentUser!=undefined){
            $scope.companyName=currentUser.company.companyShortNameCN
        }
        $scope.currentType='all';
        News.newsTypes().then(function (response) {
            $scope.newsTypeList = response.data;
        })
        News.fleshNews();
        $scope.ServerUrl = ENV.ServerUrl; // use to image filter
        $scope.$on("News.updated", function () {
            $scope.newsList = News.newsList();
            if($scope.newsList==undefined || $scope.newsList.length==0){
                $scope.noContent=true;
            }
            else {
                $scope.noContent=false;
            }
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
            $scope.currentType=typeId;
            News.setCurrentNewsType(typeId);
        }
    })
    .controller('NewsDetailCtrl', function ($scope, News, $stateParams, ENV, $ionicLoading) {
        News.viewNews($stateParams.newsId).then(function (response) {
            $scope.news = response.data;
        })
        $scope.ServerUrl = ENV.ServerUrl;
    })
    .controller("ImportantNewsCtrl", function ($scope, News, ENV,AuthService) {
        var currentUser=AuthService.currentUser();
        if(currentUser!=undefined){
            $scope.companyName=currentUser.company.companyShortNameCN
        }
      /*  News.newsTypes().then(function (response) {
            $scope.newsTypeList = response.data;
        })*/
        News.fleshImportantNews();
        $scope.ServerUrl = ENV.ServerUrl; // use to image filter
        $scope.$on("ImportantNews.updated", function () {
            $scope.newsList = News.importantNewsList();
            $scope.$broadcast('scroll.refreshComplete');
        })
        $scope.doRefresh = function () {
          /*  News.newsTypes().then(function (response) {
                $scope.newsTypeList = response.data;
            })*/
            News.fleshImportantNews();

        }
        $scope.loadMore = function () {
            News.moreImportant();
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        $scope.canLoadMore = function () {
            return News.hasMoreImportant();
        }
    })
