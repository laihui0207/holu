/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .controller('PostSubjectCtrl',function($scope,PostBars){
        var needReload=true;
        PostBars.postSubjects()
        $scope.doRefresh = function () {
            PostBars.postSubjects()
                $scope.$broadcast('scroll.refreshComplete');
        }
        $scope.$on("SubjectRefreshed",function(){
            $scope.subjectList=PostBars.subjectData();
            if($scope.subjectList==undefined || $scope.subjectList.length==0){
                $scope.noContent=true;
            }
            else {
                $scope.noContent=false;
            }
            needReload=false;
            $scope.$broadcast("scroll.refreshComplete");
        });
        $scope.loadMore = function () {
            PostBars.moreSubject();
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        $scope.canLoadMore = function () {
            return PostBars.canMoreSubject();
        }
        $scope.$on("holu.logout",function(){
            needReload=true;
        })
    })
    .controller('PostBarCtrl',function($scope,PostBars,$stateParams,$rootScope,ENV){
        $scope.subjectId=$stateParams.subjectId;
        var needReload=true;
        $scope.ServerUrl = ENV.ServerUrl;
        PostBars.postBars($stateParams.subjectId)
        $scope.doRefresh = function () {
            PostBars.postBars($stateParams.subjectId);
        }
        $scope.$on("PostBarRefreshed",function(){
            $scope.postBarList=PostBars.postBarData();
            if($scope.postBarList==undefined || $scope.postBarList.length==0){
                $scope.noContent=true;
            }
            else {
                $scope.noContent=false;
            }
            needReload=false;
            $scope.$broadcast("scroll.refreshComplete");
        });
        $scope.loadMore = function () {
            PostBars.morePostBar();
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        $scope.canLoadMore = function () {
            return PostBars.canMorePostBar();
        }
        $rootScope.$on('PostBarUpdate',function(event, args){
            console.log("Get event:NoteUpdate")
            data=args.data;
            PostBars.postBars(data.subjectId).then(function(response){
                $scope.postBarList=response.data
            })
        })
    })
    .controller('PostBarDetailCtrl',function($scope,PostBars,$stateParams,$rootScope,$ionicPopup,ENV){
        PostBars.viewPost($stateParams.postBarId).then(function(response){
            $scope.postBar=response.data
        })
        $scope.ServerUrl = ENV.ServerUrl;
        PostBars.replies($stateParams.postBarId).then(function(response){
            $scope.replyList=response.data
        })
        $scope.doRefresh = function () {
            PostBars.replies($stateParams.postBarId).then(function(response){
                $scope.replyList=response.data
            }).then(function(){
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
        $scope.reply=function(){
            PostBars.replyPost($scope.postBar.reply.content,$scope.postBar.id,$rootScope.currentUser.id)
                .success(function(dtata){
                    PostBars.replies($stateParams.postBarId).then(function(response){
                        $scope.replyList=response.data
                    })
                })
                .error(function(data){
                    var alertPopup = $ionicPopup.alert({
                        title: $scope.SaveFailedHeader,
                        template: $scope.APICallFailed
                    });
                })
        }

    })
    .controller('PostBarNewCtrl',function($scope,PostBars,$translate,$state,$stateParams,$rootScope,$ionicPopup){
        var user=AuthService.currentUser();
        if(user == undefined){
            $rootScope.backurl="tab.postbars"
            $state.go("login")
            return
        }
        if($stateParams.postBarId!=undefined){
            PostBars.viewPost($stateParams.postBarId).then(function(response){
                $scope.postBar=response.data
                $scope.postBar.subjectId=$stateParams.subjectId;
            })
        }
        else {
            $scope.postBar={subjectId:$stateParams.subjectId};
        }
        PostBars.listViewUsers($stateParams.postBarId,user.userID).then(function(response){
            $scope.viewUserList=response.data
        })
        PostBars.listReplyUsers($stateParams.postBarId,user.userID).then(function(response){
            $scope.replyUserList=response.data
        })
        PostBars.listViewGroups($stateParams.postBarId,user.userID).then(function(response){
            $scope.viewGroupList=response.data
        })
        PostBars.listReplyGroups($stateParams.postBarId,user.userID).then(function(response){
            $scope.replyGroupList=response.data
        })
        $translate(['NoChooseUser','ChooseViewUser','ChooseReplyUser', 'NoChooseUserGroup','ChooseViewUserGroup','ChooseReplyUserGroup']).then(function (translations) {
            $scope.NoChooseReplyUser = translations.NoChooseUser;
            $scope.NoChooseViewUser = translations.NoChooseUser;
            $scope.ChooseViewUser = translations.ChooseViewUser;
            $scope.ChooseReplyUser = translations.ChooseReplyUser;
            $scope.NoChooseViewUserGroup = translations.NoChooseUserGroup;
            $scope.NoChooseReplyUserGroup = translations.NoChooseUserGroup;
            $scope.ChooseViewUserGroup = translations.ChooseViewUserGroup;
            $scope.ChooseReplyUserGroup = translations.ChooseReplyUserGroup;
        });
        $scope.autoExpand = function(e) {
            var element = typeof e === 'object' ? e.target : document.getElementById(e);
            var scrollHeight = element.scrollHeight - 5; // replace 60 by the sum of padding-top and padding-bottom
            element.style.height =  scrollHeight + "px";
        };
        $scope.save=function(){
            PostBars.save($scope.postBar.title,$scope.postBar.content,$scope.postBar.subjectId,$rootScope.currentUser.id,
            $scope.postBar.viewUsers,$scope.postBar.viewGroups,$scope.postBar.replyUsers,$scope.postBar.replyGroups,$scope.postBar.id)
                .success(function(data){
                    console.log("save postBar Controller:"+data)
                    if(data.title==$scope.postBar.title){
                        $rootScope.$broadcast('PostBarUpdate',{data:{subjectId:$scope.postBar.subjectId}});
                        $state.go("tab.postbars",{subjectId:$scope.postBar.subjectId})
                    }
                    else {
                        console.log("save postBar Controller:"+data)
                        var alertPopup = $ionicPopup.alert({
                            title: $scope.SaveFailedHeader,
                            template: $scope.SaveFailed
                        });
                    }
                })
                .error(function(data){
                    console.log("save postBar Controller:"+data)
                    var alertPopup = $ionicPopup.alert({
                        title: $scope.SaveFailedHeader,
                        template: $scope.APICallFailed
                    });
                })
        }
        $scope.delete=function(){
            PostBars.delete($scope.postBar.id).success(function(data){
                $rootScope.$broadcast('PostBarUpdate',{data:{subjectId:$scope.postBar.subjectId}});
                $state.go("tab.postbars",{subjectId:$scope.postBar.subjectId})
            }).error(function(data){
                var alertPopup = $ionicPopup.alert({
                    title: $scope.SaveFailedHeader,
                    template: $scope.SaveFailed
                });
            })
        }
    })