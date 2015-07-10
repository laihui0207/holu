angular.module('Holu.controllers', ['ngSanitize'])
    .controller('LoginCtrl',function($scope,AuthService,$ionicPopup,$rootScope, $state,$translate,menuItemService){
        $scope.data={};
        $translate(['LoginFailHeader', 'LoginFailMessage']).then(function (translations) {
            $scope.loginFailHeader = translations.LoginFailHeader;
            $scope.LoginFailMessage = translations.LoginFailMessage;
        });
        $rootScope.menuItems=menuItemService.menuList(false);
        $scope.login=function(){
            AuthService.login($scope.data.userName,$scope.data.password).success(function(data){
                $scope.data={};
                if($rootScope.backurl != undefined){
                    backurl=$rootScope.backurl;
                    $rootScope.backurl=undefined;
                    $state.go(backurl)
                }
                else {
                    $state.go('tab.news')
                }
            }).error(function(data){
                var alertPopup = $ionicPopup.alert({
                    title: $scope.loginFailHeader,
                    template: $scope.LoginFailMessage
                });
            })
        }
    })
    .controller('TranslateController', function ($translate, $scope) {
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
        };
    })
    .controller('NavCtrl', function ($scope,$rootScope, $ionicSideMenuDelegate,$state,menuItemService) {
        $scope.showMenu = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };
        $scope.showRightMenu = function () {
            $ionicSideMenuDelegate.toggleRight();
        };
        $scope.logout=function(){
            $rootScope.currentUser="";
            $rootScope.menuItems=menuItemService.menuList(false);
            $state.go('login')
        }
    })
    .controller('AccountCtrl', function ($scope,$state, $ionicModal ) {

        $ionicModal.fromTemplateUrl('templates/user/login2.html', function(modal) {
                $scope.loginModal = modal;
            },
            {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: true
            }
        );

        $scope.settings = {
            enableFriends: true
        };
        $scope.showLogin=function(){
            $scope.loginModal.show();
        }
    });
