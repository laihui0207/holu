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
                $rootScope.$broadcast('holu.logged');
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
    .controller('NavCtrl', function ($scope,$rootScope, $ionicSideMenuDelegate,$state,menuItemService,AuthService,$translate) {
         var currentUser=AuthService.currentUser();
        if(currentUser!= undefined){
            $scope.userName=currentUser.username || null;
        }
        $translate(['mainMenu', 'rightMenu','mainMenuHeader']).then(function (translations) {
            $scope.mainMenu = translations.mainMenu;
            $scope.rightMenu = translations.rightMenu;
            $scope.mainMenuHeader = translations.mainMenuHeader;
        });
        $scope.showMenu = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };
        $scope.showRightMenu = function () {
            $ionicSideMenuDelegate.toggleRight();
        };
        $scope.logout=function(){
            $rootScope.$broadcast('holu.logout');
            $state.go('login')
        }
        $rootScope.$on('holu.logged',function(){
            console.log("Get event:Logged")
            var currentUser=AuthService.currentUser();
            if(currentUser!= undefined){
                $scope.userName=currentUser.username || null;
            }
            $scope.menuItems=menuItemService.menuList(true);
        })
        $rootScope.$on('holu.logout',function(){
            console.log("Get event:Logout")
            $scope.userName=null;
            $scope.menuItems=menuItemService.menuList(false);
        })
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
