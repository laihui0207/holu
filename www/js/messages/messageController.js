/**
 *
 * Created by sunlaihui on 7/11/15.
 */

angular.module('Holu')
    .controller('MessageCtrl',function($scope,Messages,$state,$rootScope){
        if($rootScope.currentUser==undefined){
            $rootScope.backurl="tab.messages"
            $state.go("login")
            return
        }
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
    .controller('MessageSendCtrl',function($scope, Messages,UserService,UserGroup,$rootScope,$stateParams,$translate,$state,$ionicPopup){
        $scope.sendUsers="";
        $scope.sendGroups="";
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
            Messages.send($scope.message.id,$scope.sendUsers,$scope.sendGroups,$rootScope.currentUser.id)
                .success(function(data){
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
