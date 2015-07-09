angular.module('Holu.controllers', ['ngSanitize'])

    .controller('DashCtrl', function ($scope) {
    })
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
                $state.go('tab.news')
            }).error(function(data){
                var alertPopup = $ionicPopup.alert({
                    title: $scope.loginFailHeader,
                    template: $scope.LoginFailMessage
                });
            })
        }
    })
    .controller("NewsCtrl", function ($scope, News, ServerUrl) {
        News.newsTypes().then(function(response){
            $scope.newsTypeList=response.data;
        })
        News.all().then(function (response) {
            $scope.newsList = response.data;
        })
        $scope.ServerUrl = ServerUrl;

        $scope.doRefresh = function () {
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
    .controller('NewsDetailCtrl', function ($scope, News, $stateParams, ServerUrl) {
        News.viewNews($stateParams.newsId).then(function (response) {
            $scope.news = response.data;
        })
        $scope.ServerUrl = ServerUrl;
    })

    .controller('DocCtrl',function($scope,Documentations,$ionicLoading,ServerUrl){
        Documentations.all().then(function(response){
            $scope.DocList=response.data;
        })
        $scope.ServerUrl=ServerUrl;
        $scope.doRefresh = function () {
            Documentations.all().then(function(response){
                $scope.DocList=response.data;
            }).then(function(){
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
        $scope.download = function() {
            $ionicLoading.show({
                template: 'Loading...'
            });
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
                    fs.root.getDirectory(
                        "Holu",
                        {
                            create: true
                        },
                        function(dirEntry) {
                            dirEntry.getFile(
                                "test.png",
                                {
                                    create: true,
                                    exclusive: false
                                },
                                function gotFileEntry(fe) {
                                    var p = fe.toURL();
                                    fe.remove();
                                    ft = new FileTransfer();
                                    ft.download(
                                        encodeURI("http://ionicframework.com/img/ionic-logo-blog.png"),
                                        p,
                                        function(entry) {
                                            $ionicLoading.hide();
                                            $scope.imgFile = entry.toURL();
                                        },
                                        function(error) {
                                            $ionicLoading.hide();
                                            alert("Download Error Source -> " + error.source);
                                        },
                                        false,
                                        null
                                    );
                                },
                                function() {
                                    $ionicLoading.hide();
                                    console.log("Get file failed");
                                }
                            );
                        }
                    );
                },
                function() {
                    $ionicLoading.hide();
                    console.log("Request for filesystem failed");
                });
        }
    })
    .controller('NoteCtrl',function($scope,Notes,$rootScope){
        Notes.all().then(function(response){
            $scope.noteList=response.data
        })
        $scope.doRefresh = function () {
            Notes.all().then(function (response) {
                $scope.noteList = response.data;
            }).then(function(){
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
        $rootScope.$on('NoteUpdate',function(){
            console.log("Get event:NoteUpdate")
            Notes.all().then(function(response){
                $scope.noteList=response.data
            })
        })

    })
    .controller('NoteDetailCtrl', function ($scope, Notes, $stateParams,ServerUrl) {
        Notes.view($stateParams.noteId).then(function (response) {
            $scope.note = response.data;
        })
        $scope.ServerUrl = ServerUrl;
    })
    .controller('NoteNewCtrl',function($scope, Notes, $translate,$rootScope,$state,$ionicPopup){
        $scope.autoExpand = function(e) {
            var element = typeof e === 'object' ? e.target : document.getElementById(e);
            var scrollHeight = element.scrollHeight - 5; // replace 60 by the sum of padding-top and padding-bottom
            element.style.height =  scrollHeight + "px";
        };
        $translate(['SaveFailed', 'SaveFailedHeader','APICallFailed']).then(function (translations) {
            $scope.SaveFailed = translations.SaveFailed;
            $scope.SaveFailedHeader = translations.SaveFailedHeader;
            $scope.APICallFailed = translations.APICallFailed;
        });
        $scope.note={};
        $scope.saveNote=function(){
            if($scope.note.title=="" || $scope.note.content==""){
                // to do block save process
            }
            Notes.save($scope.note.title,$scope.note.content,$rootScope.currentUser.id)
                .success(function(data){
                    console.log("save note Controller:"+data)
                    if(data.title==$scope.note.title){
                        $rootScope.$broadcast('NoteUpdate',data);
                        $state.go("tab.notes")
                    }
                    else {
                        console.log("save note Controller:"+data)
                        var alertPopup = $ionicPopup.alert({
                            title: $scope.SaveFailedHeader,
                            template: $scope.SaveFailed
                        });
                    }
                })
                .error(function(data){
                    console.log("save note Controller:"+data)
                    var alertPopup = $ionicPopup.alert({
                        title: $scope.SaveFailedHeader,
                        template: $scope.APICallFailed
                    });
                })
        }
    })
    .controller('NoteEditCtrl',function($scope, Notes, $stateParams,$translate,$rootScope,$state,$ionicPopup){
        $scope.autoExpand = function(e) {
            var element = typeof e === 'object' ? e.target : document.getElementById(e);
            var scrollHeight = element.scrollHeight - 5; // replace 60 by the sum of padding-top and padding-bottom
            element.style.height =  scrollHeight + "px";
        };
        $translate(['SaveFailed', 'SaveFailedHeader','APICallFailed']).then(function (translations) {
            $scope.SaveFailed = translations.LoginFailHeader;
            $scope.SaveFailedHeader = translations.SaveFailedHeader;
            $scope.APICallFailed = translations.LoginFailMessage;
        });
        Notes.view($stateParams.noteId).then(function (response) {
            $scope.note = response.data;
        })
        $scope.deleteNote=function(){
            Notes.delete($scope.note.id).success(function(data){
                $rootScope.$broadcast('NoteUpdate');
                $state.go("tab.notes")
            }).error(function(data){
                var alertPopup = $ionicPopup.alert({
                    title: $scope.SaveFailedHeader,
                    template: $scope.SaveFailed
                });
            })
        }
        $scope.saveNote=function(){
            if($scope.note.title=="" || $scope.note.content==""){
                // to do block save process
            }
            Notes.save($scope.note.title,$scope.note.content,$rootScope.currentUser.id,$scope.note.id)
                .success(function(data){
                    console.log("save note Controller:"+data)
                    if(data.title==$scope.note.title){
                        $rootScope.$broadcast('NoteUpdate',data);

                        $state.go("tab.notes")
                    }
                    else {
                        console.log("save note Controller:"+data)
                        var alertPopup = $ionicPopup.alert({
                            title: $scope.SaveFailedHeader,
                            template: $scope.SaveFailed
                        });
                    }
                })
                .error(function(data){
                    console.log("save note Controller:"+data)
                    var alertPopup = $ionicPopup.alert({
                        title: $scope.SaveFailedHeader,
                        template: $scope.APICallFailed
                    });
                })
        }
    })
    .controller('PostSubjectCtrl',function($scope,PostBars,$state,$rootScope){
        PostBars.postSubjects().then(function(response){
            $scope.subjectList=response.data
        })
        $scope.doRefresh = function () {
            PostBars.postSubjects().then(function(response){
                $scope.subjectList=response.data
            }).then(function(){
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
    })
    .controller('PostBarCtrl',function($scope,PostBars,$stateParams,$rootScope){
        $scope.subjectId=$stateParams.subjectId;
        PostBars.postBars($stateParams.subjectId).then(function(response){
            $scope.postBarList=response.data
        })
        $scope.doRefresh = function () {
            PostBars.postBars($stateParams.subjectId).then(function(response){
                $scope.postBarList=response.data
            }).then(function(){
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
    })
    .controller('PostBarDetailCtrl',function($scope,PostBars,$stateParams,$rootScope){
        PostBars.viewPost($stateParams.postbarId).then(function(response){
            $scope.postbar=response.data
        })
        $scope.doRefresh = function () {
            PostBars.viewPost($stateParams.postbarId).then(function(response){
                $scope.postbar=response.data
            }).then(function(){
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
    })
    .controller('PostBarNewCtrl',function($scope,PostBars,$stateParams,$rootScope){
       $scope.postBar={};
        $scope.countries = [
            {id: 1, text: 'USA', checked: false, icon: null},
            {id: 2, text: 'France', checked: false, icon: 'https://www.zeendoc.com/wp-content/themes/zeendoc/img/french_flag_small.jpg'},
            {id : 3, text: 'Japan', checked: true, icon: null}];

        $scope.countries_text_single = 'Choose country';
        $scope.countries_text_multiple = 'Choose countries';
        $scope.val =  {single: null, multiple: null};
    })
    .controller('MessageCtrl',function($scope,Messages,$state,$rootScope){
       /* if($rootScope.currentUser==undefined){
            $state.go("login")
            return
        }*/
        Messages.list($rootScope.currentUser.id).then(function(response){
            $scope.messageList=response.data
        })
        $scope.doRefresh = function () {
            Messages.list($rootScope.currentUser.id).then(function(response){
                $scope.messageList=response.data
            }).then(function(){
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
        $rootScope.$on('MessageUpdate',function(){
            console.log("Get event:NoteUpdate")
            Messages.list($rootScope.currentUser.id).then(function(response){
                $scope.messageList=response.data
            })
        })
    })
    .controller('MessageDetailCtrl',function($scope,Messages,$stateParams){
        Messages.view($stateParams.messageId).then(function(response){
            $scope.message=response.data
        })
    })
    .controller('MessageNewCtrl',function($scope,Messages,$translate,$rootScope,$state,$ionicPopup){
        $scope.autoExpand = function(e) {
            var element = typeof e === 'object' ? e.target : document.getElementById(e);
            var scrollHeight = element.scrollHeight - 5; // replace 60 by the sum of padding-top and padding-bottom
            element.style.height =  scrollHeight + "px";
        };
        $translate(['SaveFailed', 'SaveFailedHeader','APICallFailed']).then(function (translations) {
            $scope.SaveFailed = translations.SaveFailed;
            $scope.SaveFailedHeader = translations.SaveFailedHeader;
            $scope.APICallFailed = translations.APICallFailed;
        });
        $scope.message={};
        $scope.save=function(){
            if($scope.message.title=="" || $scope.message.content==""){
                // to do block save process
            }
            Messages.save($scope.message.title,$scope.message.content,$rootScope.currentUser.id)
                .success(function(data){
                    console.log("save message Controller:"+data)
                    if(data.title==$scope.message.title){
                        $rootScope.$broadcast('MessageUpdate',data);
                        $state.go("tab.messages")
                    }
                    else {
                        console.log("save message Controller:"+data)
                        var alertPopup = $ionicPopup.alert({
                            title: $scope.SaveFailedHeader,
                            template: $scope.SaveFailed
                        });
                    }
                })
                .error(function(data){
                    console.log("save note Controller:"+data)
                    var alertPopup = $ionicPopup.alert({
                        title: $scope.SaveFailedHeader,
                        template: $scope.APICallFailed
                    });
                })
        }
    })
    .controller('MessageEditCtrl',function($scope, Messages, $stateParams,$translate,$rootScope,$state,$ionicPopup){
        $scope.autoExpand = function(e) {
            var element = typeof e === 'object' ? e.target : document.getElementById(e);
            var scrollHeight = element.scrollHeight - 5; // replace 60 by the sum of padding-top and padding-bottom
            element.style.height =  scrollHeight + "px";
        };
        $translate(['SaveFailed', 'SaveFailedHeader','APICallFailed']).then(function (translations) {
            $scope.SaveFailed = translations.LoginFailHeader;
            $scope.SaveFailedHeader = translations.SaveFailedHeader;
            $scope.APICallFailed = translations.LoginFailMessage;
        });
        Messages.view($stateParams.messageId).then(function (response) {
            $scope.message = response.data;
        })
        $scope.delete=function(){
            Messages.delete($scope.message.id).success(function(data){
                $rootScope.$broadcast('MessageUpdate');
                $state.go("tab.messages")
            }).error(function(data){
                var alertPopup = $ionicPopup.alert({
                    title: $scope.SaveFailedHeader,
                    template: $scope.SaveFailed
                });
            })
        }
        $scope.save=function(){
            if($scope.message.title=="" || $scope.message.content==""){
                // to do block save process
            }
            Messages.save($scope.message.title,$scope.message.content,$rootScope.currentUser.id,$scope.message.id)
                .success(function(data){
                    console.log("save message Controller:"+data)
                    if(data.title==$scope.message.title){
                        $rootScope.$broadcast('MessageUpdate',data);

                        $state.go("tab.messages")
                    }
                    else {
                        console.log("save nomessagete Controller:"+data)
                        var alertPopup = $ionicPopup.alert({
                            title: $scope.SaveFailedHeader,
                            template: $scope.SaveFailed
                        });
                    }
                })
                .error(function(data){
                    console.log("save note Controller:"+data)
                    var alertPopup = $ionicPopup.alert({
                        title: $scope.SaveFailedHeader,
                        template: $scope.APICallFailed
                    });
                })
        }
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
