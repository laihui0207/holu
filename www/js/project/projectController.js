/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .controller('ProjectCtrl', function ($scope,Projects,$rootScope,AuthService,$state) {
        var user=AuthService.currentUser();
        console.log("Project user:"+user);
        if(user == undefined){
            $rootScope.backurl="tab.project"
            $state.go("login")
            return
        }
        Projects.projects($rootScope.currentUser.userID).then(function(response){
            $scope.projectList=response.data
        })
        $scope.doRefresh = function () {
            Projects.projects($rootScope.currentUser.userID).then(function(response){
                $scope.projectList=response.data
            }).then(function(){
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
    })
    .controller('ComponentCtrl',function($scope,Projects,$rootScope,$stateParams){
        Projects.viewProject($stateParams.projectId).then(function(response){
            $scope.project=response.data
        })

        Projects.components($stateParams.projectId).then(function(response){
            $scope.componentList=response.data
        })
        $scope.doRefresh = function () {
            Projects.components($stateParams.projectId).then(function(response){
                $scope.componentList=response.data
            }).then(function(){
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
    })
    .controller('ProcessCtrl',function($scope,Projects,$rootScope,$stateParams){
        Projects.processList($stateParams.styleName,$stateParams.companyId,$rootScope.currentUser.id).then(function(response){
            $scope.componentStyleList=response.data
        })
        $scope.doRefresh = function () {
            Projects.processList($stateParams.styleName,$stateParams.companyId,$rootScope.currentUser.id).then(function(response){
                $scope.componentStyleList=response.data
            }).then(function(){
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
        $scope.confirmProcess=function(){

        }
    })
