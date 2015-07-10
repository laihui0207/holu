/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
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
    .controller('PostBarNewCtrl',function($scope,PostBars,UserGroup,UserService,$translate,$stateParams,$rootScope){
        $scope.postBar={};
        UserGroup.listSlv().then(function(response){
            $scope.userGroupList=response.data
        })
        UserService.listSlv().then(function(response){
            $scope.userList=response.data
        })
        $translate(['NoChooseUser','ChooseUser', 'NoChooseUserGroup','ChooseUserGroup']).then(function (translations) {
            $scope.NoChooseUser = translations.NoChooseUser;
            $scope.ChooseUser = translations.ChooseUser;
            $scope.NoChooseUserGroup = translations.NoChooseUserGroup;
            $scope.ChooseUserGroup = translations.ChooseUserGroup;
        });
        $scope.autoExpand = function(e) {
            var element = typeof e === 'object' ? e.target : document.getElementById(e);
            var scrollHeight = element.scrollHeight - 5; // replace 60 by the sum of padding-top and padding-bottom
            element.style.height =  scrollHeight + "px";
        };

    })