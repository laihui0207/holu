/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .controller('ProjectCtrl', function ($scope, Projects, $rootScope, AuthService, $state, $stateParams) {
        var user = AuthService.currentUser();
        console.log("Project user:" + user);
        if (user == undefined) {
            $rootScope.backurl = "tab.project"
            $state.go("login")
            return
        }
        Projects.projects(user.userID,$stateParams.projectID).then(function (response) {
            $scope.projectList = response.data
        })

        $scope.doRefresh = function () {
            Projects.projects(user.userID,$stateParams.projectID).then(function (response) {
                $scope.projectList = response.data
            }).then(function () {
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
        $rootScope.$on('holu.logged', function () {
            console.log("Get event:Logged")
            user = AuthService.currentUser();
        })
    })
    .controller('ComponentCtrl', function ($scope, Projects, $rootScope, $stateParams,AuthService) {
        var user=AuthService.currentUser();
        Projects.viewProject($stateParams.projectId).then(function (response) {
            $scope.project = response.data
        })

        Projects.components($stateParams.projectId,user.userID).then(function (response) {
            $scope.componentList = response.data
        })
        $scope.doRefresh = function () {
            Projects.components($stateParams.projectId,user.userID).then(function (response) {
                $scope.componentList = response.data
            }).then(function () {
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
    })
    .controller('SubComponentCtrl',function($scope, Projects, $rootScope, $stateParams,AuthService){
        var user=AuthService.currentUser();
        Projects.viewComponent($stateParams.componentID,user.userID).then(function(response){
            $scope.component=response.data;
        })
       /* Projects.subComponents($stateParams.componentID,user.userID).then(function(response){
            $scope.subCompoentList=response.data;
        })*/
        $scope.doRefresh = function () {
            Projects.viewComponent($stateParams.componentID,user.userID).then(function(response){
                $scope.component=response.data;
            }).then(function () {
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
    })
    .controller('ProcessCtrl', function ($scope, Projects, $rootScope, $stateParams) {
        var user=AuthService.currentUser();
        Projects.processList($stateParams.styleID, user.company.companyId,user.userID).then(function (response) {
            $scope.componentStyleList = response.data
        })
        $scope.doRefresh = function () {
            Projects.processList($stateParams.styleName, user.company.companyId,user.userID).then(function (response) {
                $scope.componentStyleList = response.data
            }).then(function () {
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
        $scope.confirmProcess = function () {

        }
    })
