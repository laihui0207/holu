angular.module('Holu.controllers', ['ngSanitize'])
    .controller('LoginCtrl',function($scope,AuthService,$ionicPopup,$rootScope, $state,Storage,
                                     $translate,menuItemService){
        $scope.data={
            remeberMe: false,
            language: 'zh'
        };
        $scope.newUser={};
        AuthService.companies().then(function(response){
            $scope.companies=response.data;
        })
        $translate(['LoginFailHeader', 'LoginFailMessage','SignUpSuccessHeader','SignUpFailedHeader','SignUpSuccessMessage',
        'SignUpFailedMessage']).then(function (translations) {
            $scope.loginFailHeader = translations.LoginFailHeader;
            $scope.LoginFailMessage = translations.LoginFailMessage;
            $scope.SignUpSuccessHeader = translations.SignUpSuccessHeader;
            $scope.SignUpFailedHeader = translations.SignUpFailedHeader;
            $scope.SignUpSuccessMessage = translations.SignUpSuccessMessage;
            $scope.SignUpFailedMessage = translations.SignUpFailedMessage;
        });
        $scope.$on("$ionicView.enter", function(scopes, states){
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
            $rootScope.menuItems=menuItemService.menuList(false);
        })
        $scope.changeLanguage=function(){
            if($scope.data.language=='en')
            {
                $translate.use('en');
            }
            else {
                $translate.use('zh');
            }
        }
        $scope.signup=function(){
            AuthService.signup($scope.newUser).success(function(data){
                if(data!="" && data.loginCode==$scope.newUser.loginCode){
                    $scope.newUser={};
                    var alertPopup = $ionicPopup.alert({
                        title: $scope.SignUpSuccessHeader,
                        template: $scope.SignUpSuccessMessage
                    });
                    $state.go('login')
                }
                else {
                    var alertPopup = $ionicPopup.alert({
                        title: $scope.SignUpFailedHeader,
                        template: $scope.SignUpFailedMessage
                    });
                }
            }).error(function(data){
                var alertPopup = $ionicPopup.alert({
                    title: $scope.SignUpFailedHeader,
                    template: $scope.SignUpFailedMessage
                });
            })
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
                    $scope.data={};
                    $state.go(backurl)
                }
                else {
                    $scope.data={};
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
            AuthService.logout();
            $state.go('login')
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
