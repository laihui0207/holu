/**
 * Created by sunlaihui on 9/20/15.
 */

angular.module('Holu')
    .controller('TotalSummaryCtrl',function($scope, Summary, $rootScope, AuthService, $state){
        var user = AuthService.currentUser();
        var needReload=true;
        $scope.date = new Date();
        if (user == undefined) {
            $rootScope.backurl = "tab.summary"
            $state.go("login")
            return
        }
/*        $scope.no_content=undefined;*/
        $scope.searchDate="today";
        $scope.searchStyle="project";
        $scope.searchStatus="end";
        $scope.currentType=$scope.searchDate+"_"+$scope.searchStyle+"_"+$scope.searchStatus;
        Summary.Summary(user.userID,"today","project","end").then(function(response){
            $scope.totalSummary=response.data;
        });
        Summary.SummaryDetail(user.userID,"today","project","end").then(function(response){
            $scope.summaryItem=response.data;
        });
        $scope.changeTab=function(sumDate,style,status){
            $scope.searchDate=sumDate;
            $scope.searchStyle=style;
            $scope.searchStatus=status;
            $scope.currentType=$scope.searchDate+"_"+$scope.searchStyle+"_"+$scope.searchStatus;
            if($scope.searchDate=='today'){
                $scope.date=new Date();
            }
            else if($scope.searchDate=='yesterday'){
                var date=new Date();
                $scope.date=date.setDate(date.getDate()-1)
            }
            Summary.Summary(user.userID,sumDate,style,status).then(function(response){
                $scope.totalSummary=response.data;
            });
            Summary.SummaryDetail(user.userID,sumDate,style,status).then(function(response){
                $scope.summaryItem=response.data;
            });
        }
        $scope.doRefresh = function () {
            Summary.Summary(user.userID,$scope.searchDate,$scope.searchStyle,$scope.searchStatus).then(function(response){
                $scope.totalSummary=response.data;
            });
            Summary.SummaryDetail(user.userID,$scope.searchDate,$scope.searchStyle,$scope.searchStatus).then(function(response){
                $scope.summaryItem=response.data;
            });
            $scope.$broadcast('scroll.refreshComplete');
        }

    })
    .controller('SummaryDetailCtrl',function($scope, Summary, $rootScope, AuthService, $state,$stateParams){
        var user = AuthService.currentUser();
        $scope.date = new Date();
        if (user == undefined) {
            $rootScope.backurl = "tab.summary"
            $state.go("login")
            return
        }
        $scope.date = new Date();
        Summary.Detail(user.userID,$stateParams.itemId,$stateParams.sumDate,$stateParams.style,$stateParams.status)
            .then(function(response){
                $scope.details=response.data;
            })
    })
