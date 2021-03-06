/**
 *
 * Created by sunlaihui on 7/11/15.
 */

angular.module('Holu')
    .controller('MessageCtrl',function($scope,Messages,$state,$rootScope,AuthService){
        var user=AuthService.currentUser();
        var needReload=true;
        $scope.messageType="all";
        if(user == undefined){
            $rootScope.backurl="tab.messages"
            $state.go("login")
            return
        }
        $scope.doRefresh = function () {
            Messages.list(user.id)
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
            if($scope.messageList==undefined || $scope.messageList.length==0){
                $scope.noContent=true;
            }
            else {
                $scope.noContent=false;
            }
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
        $scope.changeMessgeType=function(type){
            $scope.messageType=type;
            Messages.messageType(type,user.id);
        }
    })
    .controller('MessageDetailCtrl',function($scope,Messages,AuthService,$state,$stateParams,$ionicPopup){
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
        Messages.readed($stateParams.messageId,user.id);
        /*Messages.view($stateParams.messageId).then(function(response){
            $scope.message=response.data
        })*/
        $scope.reply=function(){
            Messages.reply($scope.message.id,user.id,$scope.message.reply.content)
                .success(function(data){
                    $scope.message=data;
                })
                .error(function(){
                    var alertPopup = $ionicPopup.alert({
                        title: $scope.SaveFailedHeader,
                        template: $scope.APICallFailed
                    });
                })
        }
    })
    .controller('MessageSendCtrl',function($scope, Messages,UserService,UserGroup,$rootScope,AuthService,
                                           $stateParams,$translate,$state,$ionicPopup,Department){
        var user=AuthService.currentUser();
        if(user == undefined){
            $rootScope.backurl="tab.messages"
            $state.go("login")
            return
        }
        Messages.view($stateParams.messageId).then(function(response){
            $scope.message=response.data
        })
        UserService.listSlv(user.userID).then(function(response){
            $scope.userList=response.data
        })
        UserGroup.listSlv(user.userID).then(function(response){
            $scope.groupList=response.data
        })
        Department.listSlv(user.userID).then(function(response){
            $scope.departmentList=response.data;
        })
        $translate(['ChooseUser', 'ChooseUserGroup','NoChooseUser','NoChooseUserGroup','ChooseDepartment','NoChooseDepartment']).then(function (translations) {
            $scope.ChooseUser = translations.ChooseUser;
            $scope.NoChooseUser = translations.NoChooseUser;
            $scope.NoChooseUserGroup= translations.NoChooseUserGroup;
            $scope.ChooseUserGroup = translations.ChooseUserGroup;
            $scope.NoChooseDepartment= translations.NoChooseDepartment;
            $scope.ChooseDepartment = translations.ChooseDepartment;
        });
        $scope.send=function(){
            Messages.send($scope.message.id,$scope.message.sendUsers,$scope.message.sendGroups,$scope.message.sendDepartments,user.id)
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
    .controller('MessageNewCtrl',function($scope,Messages,UserService,UserGroup,Department,$translate,$rootScope,$state,$ionicPopup,AuthService){
        $scope.autoExpand = function(e) {
            var element = typeof e === 'object' ? e.target : document.getElementById(e);
            var scrollHeight = element.scrollHeight - 1; // replace 60 by the sum of padding-top and padding-bottom
            element.style.height =  scrollHeight + "px";
        };
        var user=AuthService.currentUser();
        if(user == undefined){
            $rootScope.backurl="tab.messages"
            $state.go("login")
            return
        }
        UserService.listSlv(user.userID).then(function(response){
            $scope.userList=response.data
        })
        UserGroup.listSlv(user.userID).then(function(response){
            $scope.groupList=response.data
        })
        Department.listSlv(user.userID).then(function(response){
            $scope.departmentList=response.data;
        })
        $translate(['ChooseUser', 'ChooseUserGroup','NoChooseUser','NoChooseUserGroup','ChooseDepartment','NoChooseDepartment']).then(function (translations) {
            $scope.ChooseUser = translations.ChooseUser;
            $scope.NoChooseUser = translations.NoChooseUser;
            $scope.NoChooseUserGroup= translations.NoChooseUserGroup;
            $scope.ChooseUserGroup = translations.ChooseUserGroup;
            $scope.NoChooseDepartment= translations.NoChooseDepartment;
            $scope.ChooseDepartment = translations.ChooseDepartment;
        });
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
        $scope.saveAndSend=function(){
            if($scope.message.title=="" || $scope.message.content==""){
                // to do block save process
            }
            Messages.save($scope.message.title,$scope.message.content,user.id)
                .success(function(data){
                    Messages.send(data.id,$scope.message.sendUsers,$scope.message.sendGroups,$scope.message.sendDepartments,user.id)
                        .success(function(data){
                            $rootScope.$broadcast('MessageUpdate');
                            $state.go("tab.messages")
/*                            $state.go("tab.message-detail",{messageId:$scope.message.id})*/
                        })
                        .error(function(){
                            var alertPopup = $ionicPopup.alert({
                                title: $scope.SaveFailedHeader,
                                template: $scope.SaveFailed
                            });
                        })
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
                                           $state,$ionicPopup,AuthService){
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
