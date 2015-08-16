/**
 *
 * Created by sunlaihui on 7/11/15.
 */

angular.module('Holu')
    .controller('MessageCtrl',function($scope,Messages,$state,$rootScope,AuthService,$ionicLoading){
        var user=AuthService.currentUser();
        var needReload=true;
        if(user == undefined){
            $rootScope.backurl="tab.messages"
            $state.go("login")
            return
        }
        $scope.doRefresh = function () {
            Messages.list($rootScope.currentUser.id)
        }
        $rootScope.$on('MessageUpdate',function(){
            console.log("Get event:MessageUpdate")
            Messages.list($rootScope.currentUser.id)
        })
        $scope.$on("$ionicView.enter", function(scopes, states){
            user=AuthService.currentUser();
            if(needReload){
                Messages.list(user.id)
            }
            Messages.refreshNewMessagecount(user.id);
        })
        $scope.$on('MessageFlushed',function(){
            console.log("Get event:MessageFlushed")
            $scope.messageList=Messages.messages();
            needReload=false;
            $scope.$broadcast('scroll.refreshComplete');
        })

        $scope.loadMore=function(){
            Messages.more();
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        $scope.canLoadMore=function(){
            return Messages.hasMore();
        }
        $scope.$on("holu.logout",function(){
            needReload=true;
        })
    })
    .controller('MessageDetailCtrl',function($scope,Messages,$stateParams,$ionicLoading){
        $scope.$on("$ionicView.enter", function(scopes, states){
            Messages.view($stateParams.messageId).then(function (response) {
                $scope.message = response.data;
            })
        })
        Messages.readed($stateParams.messageId);
        /*Messages.view($stateParams.messageId).then(function(response){
            $scope.message=response.data
        })*/
    })
    .controller('MessageSendCtrl',function($scope, Messages,UserService,UserGroup,$rootScope,AuthService,
                                           $stateParams,$translate,$state,$ionicPopup,$ionicLoading){
        var user=AuthService.currentUser();
        if(user == undefined){
            $rootScope.backurl="tab.messages"
            $state.go("login")
            return
        }
        Messages.view($stateParams.messageId).then(function(response){
            $scope.message=response.data
        })
        UserService.listSlv().then(function(response){
            $scope.userList=response.data
        })
        UserGroup.listSlv().then(function(response){
            $scope.groupList=response.data
        })
        $translate(['ChooseUser', 'ChooseUserGroup','NoChooseUser','NoChooseUserGroup']).then(function (translations) {
            $scope.ChooseUser = translations.ChooseUser;
            $scope.NoChooseUser = translations.NoChooseUser;
            $scope.NoChooseUserGroup= translations.NoChooseUserGroup;
            $scope.ChooseUserGroup = translations.ChooseUserGroup;
        });
        $scope.send=function(){
            Messages.send($scope.message.id,$scope.message.sendUsers,$scope.message.sendGroups,user.id)
                .success(function(data){
                    $rootScope.$broadcast('MessageUpdate');
                    $state.go("tab.message-detail",{messageId:$scope.message.id})
                })
                .error(function(){
                    var alertPopup = $ionicPopup.alert({
                        title: $scope.SaveFailedHeader,
                        template: $scope.SaveFailed
                    });
                })
        }
    })
    .controller('MessageNewCtrl',function($scope,Messages,$translate,$rootScope,$state,$ionicPopup,$ionicLoading,AuthService){
        $scope.autoExpand = function(e) {
            var element = typeof e === 'object' ? e.target : document.getElementById(e);
            var scrollHeight = element.scrollHeight - 1; // replace 60 by the sum of padding-top and padding-bottom
            element.style.height =  scrollHeight + "px";
        };
        $translate(['SaveFailed', 'SaveFailedHeader','APICallFailed']).then(function (translations) {
            $scope.SaveFailed = translations.SaveFailed;
            $scope.SaveFailedHeader = translations.SaveFailedHeader;
            $scope.APICallFailed = translations.APICallFailed;
        });
        $scope.message={};
        var user=AuthService.currentUser();
        if(user == undefined){
            $rootScope.backurl="tab.messages"
            $state.go("login")
            return
        }
        $scope.save=function(){
            if($scope.message.title=="" || $scope.message.content==""){
                // to do block save process
            }
            Messages.save($scope.message.title,$scope.message.content,user.id)
                .success(function(data){
                    console.log("save message Controller:"+data)
                    if(data.title==$scope.message.title){
                        $rootScope.$broadcast('MessageUpdate');
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
    .controller('MessageEditCtrl',function($scope, Messages, $stateParams,$translate,$rootScope,
                                           $ionicLoading,$state,$ionicPopup,AuthService){
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
        var user=AuthService.currentUser();
        if(user == undefined){
            $rootScope.backurl="tab.messages"
            $state.go("login")
            return
        }
        $scope.$on("$ionicView.enter", function(scopes, states){
            Messages.view($stateParams.messageId).then(function (response) {
                $scope.message = response.data;
            })
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
            Messages.save($scope.message.title,$scope.message.content,user.id,$scope.message.id)
                .success(function(data){
                    if(data.title==$scope.message.title){
                        $rootScope.$broadcast('MessageUpdate');
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
