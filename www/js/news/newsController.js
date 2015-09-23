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
    .controller('NewsDetailCtrl', function ($scope, News, $stateParams, ENV,$ionicModal, $ionicLoading) {
        News.viewNews($stateParams.newsId).then(function (response) {
            $scope.news = response.data;
        })
        $scope.ServerUrl = ENV.ServerUrl;
        $ionicModal.fromTemplateUrl('image-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
       /* $ionicModal.fromTemplateUrl(
            'templates/fullImage.html', function (modal) {
                scope.modal = modal;
            },
            {
                scope: $scope,
                animation: 'slide-in-up'
            }
        )*/
        $scope.openModal = function() {
            $scope.modal.show();
        };

        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hide', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });
        $scope.$on('modal.shown', function() {
            console.log('Modal is shown!');
        });

        //$scope.imageSrc = 'http://ionicframework.com/img/ionic-logo-blog.png';

        $scope.showImage = function(url) {
            /*switch(index) {
                case 1:
                    $scope.imageSrc = 'http://ionicframework.com/img/ionic-logo-blog.png';
                    break;
                case 2:
                    $scope.imageSrc  = 'http://ionicframework.com/img/ionic_logo.svg';
                    break;
                case 3:
                    $scope.imageSrc  = 'http://ionicframework.com/img/homepage/phones-weather-demo@2x.png';
                    break;
            }*/
            $scope.imageSrc=url;
            $scope.openModal();
        }
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
