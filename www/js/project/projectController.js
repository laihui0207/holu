/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .controller('ProjectCtrl', function ($http, $q,$scope,Projects,$rootScope) {
        Projects.projects($rootScope.currentUser.id).then(function(response){
            $scope.projectList=response.data
        })
        $scope.doRefresh = function () {
            Projects.projects($rootScope.currentUser.id).then(function(response){
                $scope.projectList=response.data
            }).then(function(){
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
    })