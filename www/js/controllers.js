angular.module('Holu.controllers', ['ngSanitize'])
    .controller('LoginCtrl',function($scope,AuthService,$ionicPopup,$rootScope, $state,Storage,
                                     $translate,menuItemService){
        $scope.data={
            remeberMe: false,
            language: 'zh'
        };
        $scope.data.userName=Storage.get("userName");
        var remeberMe=Storage.get("remeberMe");
        if(remeberMe!=undefined){
            $scope.data.remeberMe=remeberMe;
        }
        var language=Storage.get("language");
        if(language!= undefined && language!="undefined"){
            $scope.data.language=language;
        }
        $translate.use($scope.data.language);
        $translate(['LoginFailHeader', 'LoginFailMessage']).then(function (translations) {
            $scope.loginFailHeader = translations.LoginFailHeader;
            $scope.LoginFailMessage = translations.LoginFailMessage;
        });
        $rootScope.menuItems=menuItemService.menuList(false);
        $scope.changeLanguage=function(){
            if($scope.data.language=='en')
            {
                $translate.use('en');
            }
            else {
                $translate.use('zh');
            }
        }
        $scope.login=function(){
            if($scope.data.remeberMe){
                Storage.set("remeberMe",$scope.data.remeberMe);
                Storage.set("userName",$scope.data.userName);
            }
            else {
                Storage.remove("remeberMe");
                Storage.remove("userName");
            }
            Storage.set("language",$scope.data.language);
            AuthService.login($scope.data.userName,$scope.data.password).success(function(data){
                $scope.data={};
                $rootScope.$broadcast('holu.logged');
                if($rootScope.backurl != undefined){
                    backurl=$rootScope.backurl;
                    $rootScope.backurl=undefined;
                    $state.go(backurl)
                }
                else {
                    $state.go('tab.home')
                }
            }).error(function(data){
                var alertPopup = $ionicPopup.alert({
                    title: $scope.loginFailHeader,
                    template: $scope.LoginFailMessage
                });
            })
        }
    })
    .controller("HomeCtrl",function($scope,AuthService,Messages){
        var user=AuthService.currentUser();
        Messages.refreshNewMessagecount(user.id)
        //$scope.newMessageCount=Messages.getNewMessageCount();
        $scope.doRefresh=function(){
            Messages.refreshNewMessagecount(user.id);
            $scope.$broadcast('scroll.refreshComplete');
        }
        $scope.$on("holu.messageCountUpdate",function(){
            Messages.refreshNewMessagecount(user.id);
            $scope.$broadcast('scroll.refreshComplete');
        })

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
        $scope.goHome=function(){
            $state.go('tab.home')
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
