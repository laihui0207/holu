angular.module('Holu.controllers', ['ngSanitize'])

    .controller('DashCtrl', function ($scope) {
    })
    .controller("NewsCtrl", function ($scope, News, ServerUrl) {
        News.all().then(function (response) {
            $scope.newsList = response.data;
        })
        $scope.ServerUrl = ServerUrl;

        $scope.doRefresh = function () {
            News.all().then(function (response) {
                $scope.newsList = response.data;
            })
        }
    })
    .controller('NewsDetailCtrl', function ($scope, News, $stateParams, ServerUrl) {
        News.viewNews($stateParams.newsId).then(function (response) {
            console.log(response.data.content)
            var content = response.data.content;
            var newContent=content.replace(new RegExp("(<img.*?(?: |\t|\r|\n)?src=['\"]?)(.+?)(['\"]?(?:(?: |\t|\r|\n)+.*?)?>)", 'gi'), function ($0, $1, $2, $3) {
                return $1 + ServerUrl + $2 + $3;
            });
            $scope.newContent=newContent;
            $scope.news = response.data;
        })
        $scope.ServerUrl = ServerUrl;
    })
    .controller('ChatsCtrl', function ($scope, Chats) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        }
    })
    .controller('TranslateController', function ($translate, $scope) {
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
        };
    })
    .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })
    .controller('NavCtrl', function ($scope, $ionicSideMenuDelegate) {
        $scope.showMenu = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };
        $scope.showRightMenu = function () {
            $ionicSideMenuDelegate.toggleRight();
        };
    })
    .controller('AccountCtrl', function ($scope, News) {
        $scope.settings = {
            enableFriends: true
        };
        $scope.newsList = News.all();
    });
