angular.module('Holu.controllers', ['ngSanitize'])
    .controller('LoginCtrl',function($scope,AuthService,$ionicPopup,$rootScope, $state,Storage,
                                     $translate,menuItemService,amMoment,$cordovaNetwork){
        $scope.data={
            remeberMe: false,
            language: 'zh'
        };
        $scope.newUser={};
        AuthService.companies().then(function(response){
            $scope.companies=response.data;
        });
        $translate(['LoginFailHeader', 'LoginFailMessage','SignUpSuccessHeader','SignUpFailedHeader','SignUpSuccessMessage',
        'SignUpFailedMessage','UserName','Password','RemeberMe','Login','SignUp',
            'Language','BUTTON_TEXT_ZH','BUTTON_TEXT_EN','loginCode','company','CompanyNote'
        ])
            .then(function (translations) {
            $scope.loginFailHeader = translations.LoginFailHeader;
            $scope.LoginFailMessage = translations.LoginFailMessage;
            $scope.SignUpSuccessHeader = translations.SignUpSuccessHeader;
            $scope.SignUpFailedHeader = translations.SignUpFailedHeader;
            $scope.SignUpSuccessMessage = translations.SignUpSuccessMessage;
            $scope.SignUpFailedMessage = translations.SignUpFailedMessage;
                $scope.UserName = translations.UserName;
                $scope.Password = translations.Password;
                $scope.RemeberMe = translations.RemeberMe;
                $scope.Login = translations.Login;
                $scope.SignUp = translations.SignUp;
                $scope.Language = translations.Language;
                $scope.BUTTON_TEXT_ZH = translations.BUTTON_TEXT_ZH;
                $scope.BUTTON_TEXT_EN = translations.BUTTON_TEXT_EN;
                $scope.loginCode = translations.loginCode;
                $scope.company = translations.company;
                $scope.CompanyNote = translations.CompanyNote;
        });
        $scope.$on("$ionicView.enter", function(scopes, states){
            $scope.data.userName=Storage.get("userName");
            var remeberMe=Storage.get("remeberMe");
            if(remeberMe!==undefined){
                $scope.data.remeberMe=remeberMe;
            }
            var language=Storage.get("language");
            if(language!== undefined && language!="undefined"){
                $scope.data.language=language;
            }
            $translate.use($scope.data.language);
            if(remeberMe!==undefined){
                var user=Storage.get("user");
                if(user!==undefined){
                    AuthService.setUser(user);
                    $rootScope.menuItems=menuItemService.menuList(true);
                    $rootScope.$broadcast('holu.logged');
                    $state.go('tab.home');
                }
            }
            else {
                $rootScope.menuItems=menuItemService.menuList(false);
            }
        });
        $scope.changeLanguage=function(){
            if($scope.data.language=='en')
            {
                $translate.use('en');
                amMoment.changeLocale('en');
            }
            else {
                $translate.use('zh');
                amMoment.changeLocale('zh-cn');
            }
        };
        $scope.signup=function(){
            AuthService.signup($scope.newUser).success(function(data){
                if(data!=="" && data.loginCode==$scope.newUser.loginCode){
                    $scope.newUser={};
                    var alertPopup = $ionicPopup.alert({
                        title: $scope.SignUpSuccessHeader,
                        template: $scope.SignUpSuccessMessage
                    });
                    $state.go('login');
                }
                else {
                     $ionicPopup.alert({
                        title: $scope.SignUpFailedHeader,
                        template: $scope.SignUpFailedMessage
                    });
                }
            }).error(function(data){
                var alertPopup = $ionicPopup.alert({
                    title: $scope.SignUpFailedHeader,
                    template: $scope.SignUpFailedMessage
                });
            });
        };
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
                if($rootScope.backurl !== undefined){
                    backurl=$rootScope.backurl;
                    $rootScope.backurl=undefined;
                    $scope.data={};
                    $state.go(backurl);
                }
                else {
                    $scope.data={};
                    $state.go('tab.home');
                }
            }).error(function(data){
                var alertPopup = $ionicPopup.alert({
                    title: $scope.loginFailHeader,
                    template: $scope.LoginFailMessage
                });
            });
        };
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            var onlineState = networkState;
            console.log("mobile online");
            $rootScope.networkStatus=true;
        });

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            var offlineState = networkState;
            console.log("mobile offline");
            $rootScope.networkStatus=false;
        });
    })
    .controller("HomeCtrl",function($scope,$rootScope,AuthService,Messages,News,$translate,
                                    $ionicSlideBoxDelegate,ENV,$state,$cordovaSplashscreen){
        var user=AuthService.currentUser();
        if(user!==undefined){
            $scope.companyName=user.company.companyShortNameCN;
        }
        $scope.ServerUrl = ENV.ServerUrl; // use to image filter
        Messages.refreshNewMessagecount(user.id);
        News.lastedNews().then(function(response){
            $scope.newsList=response.data;
        });
/*        backcallFactory.backcallfun();*/
        //$scope.newMessageCount=Messages.getNewMessageCount();
        $translate(['ProjectSummary', 'ProjectOverview','MyTask','urgentTask','MyProject',
            'News','MyTask','urgentTask','ImportNews','Messages','Documents','Notes','Posts','friendLink'])
            .then(function (translations) {
                $scope.ProjectSummary = translations.ProjectSummary;
                $scope.ProjectOverview = translations.ProjectOverview;
                $scope.MyTask = translations.MyTask;
                $scope.urgentTask = translations.urgentTask;
                $scope.MyProject = translations.MyProject;
                $scope.News = translations.News;
                $scope.MyTask = translations.MyTask;
                $scope.urgentTask = translations.urgentTask;
                $scope.ImportNews = translations.ImportNews;
                $scope.Messages = translations.Messages;
                $scope.Documents = translations.Documents;
                $scope.Notes = translations.Notes;
                $scope.Posts = translations.Posts;
                $scope.friendLink = translations.friendLink;
            });
        $scope.doRefresh=function(){
            Messages.refreshNewMessagecount(user.id);
            News.lastedNews().then(function(response){
                $scope.newsList=response.data;
            });
            $scope.companyName=user.company.companyShortNameCN;
            $scope.$broadcast('scroll.refreshComplete');
        };
        $scope.$on("$ionicView.enter", function(scopes, states){
            $scope.doRefresh();
        });
        $scope.$on("holu.messageCountUpdate",function(){
            Messages.refreshNewMessagecount(user.id);
            $scope.$broadcast('scroll.refreshComplete');
        });
        /*$rootScope.$on('holu.logged',function(){
            console.log("Home page Get login event")
            var user=AuthService.currentUser();
            $scope.companyName=user.company.companyShortNameCN
        })*/
        $scope.navSlide = function(index) {
            $ionicSlideBoxDelegate.slide(index, 500);
        };
        $scope.gotoNews = function(index){
            $state.go("tab.news-detail",{newsId:index});
        };
        $scope.showSplashScreen =function(){
            $cordovaSplashscreen.show();
            setTimeout(function() {
                $cordovaSplashscreen.hide();
            }, 5000);
        };

    })
    .controller('TranslateController', function ($translate, $scope) {
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
        };
    })
    .controller('NavCtrl', function ($scope,$rootScope, $ionicSideMenuDelegate,$state,menuItemService,AuthService,$translate) {
         var currentUser=AuthService.currentUser();
        if(currentUser!== undefined){
            $scope.userName=currentUser.username || null;
        }
        $translate(['mainMenu', 'rightMenu','mainMenuHeader','Logout','Home','News','Posts','OA','Project','ProjectSummary'])
            .then(function (translations) {
                $scope.mainMenu = translations.mainMenu;
                $scope.rightMenu = translations.rightMenu;
                $scope.mainMenuHeader = translations.mainMenuHeader;
                $scope.Logout = translations.Logout;
                $scope.Home = translations.Home;
                $scope.News = translations.News;
                $scope.Posts = translations.Posts;
                $scope.OA = translations.OA;
                $scope.Project = translations.Project;
                $scope.ProjectSummary = translations.ProjectSummary;
        });
        $scope.showMenu = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };
        $scope.showRightMenu = function () {
            $ionicSideMenuDelegate.toggleRight();
        };
        $scope.logout=function(){
            AuthService.logout();
            $rootScope.$broadcast('holu.logout');

        };
        $scope.goHome=function(){
            $state.go('tab.home');
        };
        $rootScope.$on('holu.logged',function(){
            var currentUser=AuthService.currentUser();
            if(currentUser!== undefined){
                $scope.userName=currentUser.username || null;
            }
            $scope.menuItems=menuItemService.menuList(true);
        });
        $rootScope.$on('holu.logout',function(){
            $scope.userName=null;
            $scope.menuItems=menuItemService.menuList(false);
            AuthService.logout();
            $state.go('login');
        });
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
        };
    });
