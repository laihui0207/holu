/**
 * Created by sunlaihui on 7/11/15.
 */

angular.module('Holu')
    .controller('NoteCtrl',function($scope,Notes,$rootScope,ServerUrl){
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
        $scope.ServerUrl = ServerUrl;
        $rootScope.$on('NoteUpdate',function(){
            console.log("Get event:NoteUpdate")
            Notes.all().then(function(response){
                $scope.noteList=response.data
            })
        })

    })
    .controller('NoteSendCtrl',function($scope, Notes,UserService,UserGroup,$rootScope,$stateParams,$translate,$state,$ionicPopup,ServerUrl){
        $scope.sendUsers="";
        $scope.sendGroups="";
        Notes.view($stateParams.noteId).then(function (response) {
            $scope.note = response.data;
        })
        $scope.ServerUrl = ServerUrl;
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
            Notes.send($scope.note.id,$scope.sendUsers,$scope.sendGroups,$rootScope.currentUser.id)
                .success(function(data){
                    $state.go("tab.note-detail",{noteId:$scope.note.id})
                })
                .error(function(){
                    var alertPopup = $ionicPopup.alert({
                        title: $scope.SaveFailedHeader,
                        template: $scope.SaveFailed
                    });
                })
        }
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
    .controller('NoteEditCtrl',function($scope, Notes, $stateParams,$translate,$rootScope,$state,$ionicPopup,ServerUrl){
        $scope.autoExpand = function(e) {
            var element = typeof e === 'object' ? e.target : document.getElementById(e);
            var scrollHeight = element.scrollHeight - 5; // replace 60 by the sum of padding-top and padding-bottom
            element.style.height =  scrollHeight + "px";
        };
        $scope.ServerUrl = ServerUrl;
        $translate(['SaveFailed', 'SaveFailedHeader','APICallFailed']).then(function (translations) {
            $scope.SaveFailed = translations.LoginFailHeader;
            $scope.SaveFailedHeader = translations.SaveFailedHeader;
            $scope.APICallFailed = translations.LoginFailMessage;
        });
        Notes.view($stateParams.noteId).then(function (response) {
            $scope.note = response.data;
        })
        /*$scope.$watch('note.content',function(){
            $scope.note.content.replace(
                new RegExp("(<img.*?(?: |\t|\r|\n)?src=['\"]?)(.+?)(['\"]?(?:(?: |\t|\r|\n)+.*?)?>)", 'gi'),
                function ($0, $1, $2, $3) {
                    var url=$2;
                    if(!url.startsWith('http')){
                        if(url.indexOf("/attached")>0){
                            url=url.substring(url.indexOf("/attached"))
                        }
                        return $1 + ServerUrl + url + $3;
                    }
                    else {
                        return $0;
                    }

                });
        })*/
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
