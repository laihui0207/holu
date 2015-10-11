/**
 * Created by sunlaihui on 9/20/15.
 */

angular.module('Holu')
    .controller('ProjectSummaryCtrl',function($scope, Summary, $rootScope, AuthService, $state){
        var user = AuthService.currentUser();
        var needReload=true;
        $scope.date = new Date();
        if (user == undefined) {
            $rootScope.backurl = "tab.summary"
            $state.go("login")
            return
        }
/*        $scope.no_content=undefined;*/
        $scope.currentType='projectSummary';
        Summary.Summary(user.userID).then(function(response){
            $scope.totalSummary=response.data;
        });
        Summary.SummaryDetail(user.userID).then(function(response){
            $scope.summaryItem=response.data;
        });
        $scope.doRefresh = function () {
            Summary.Summary(user.userID).then(function(response){
                $scope.totalSummary=response.data;
            });
            Summary.SummaryDetail(user.userID).then(function(response){
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
        $scope.currentType='projectSummary';
        $scope.date = new Date();
        Summary.Detail(user.userID,$stateParams.itemName)
            .then(function(response){
                $scope.details=response.data;
            })
    })
    .controller('ProjectSearchCtrl',function($scope, Summary, $rootScope, AuthService, $state) {
        var user = AuthService.currentUser();
        $scope.date = new Date();
        if (user == undefined) {
            $rootScope.backurl = "tab.summary"
            $state.go("login")
            return
        }
        $scope.currentType='totalSearch';
        $scope.searchDate={};
        $scope.search=function (){
            if($scope.searchDate.startDate==undefined || $scope.searchDate.endDate==undefined){
                return;
            }

        }

        $scope.showDatePicker = function(inputElement) {
            var options = {
                date: new Date(),
                mode: 'date', // or 'time'
                allowOldDates: true,
                allowFutureDates: true,
                doneButtonLabel: $scope.Done,
                doneButtonColor: '#000000',
                cancelButtonLabel: $scope.cancel,
                cancelButtonColor: '#000000',
                locale: 'zh_cn'
            };

            $cordovaDatePicker.show(options).then(function (date) {
                if(inputElement=='start'){
                    $scope.searchDate.startDate=date;
                }
                else if(inputElement=='end'){
                    $scope.searchDate.endDate=date;
                }
            });
        };

    })
    .controller('FactorySearchCtrl',function($scope, Summary, $rootScope, AuthService, $state) {
        var user = AuthService.currentUser();
        $scope.date = new Date();
        if (user == undefined) {
            $rootScope.backurl = "tab.summary"
            $state.go("login")
            return
        }
        $scope.currentType='factorySearch';
        $scope.searchDate={};
        $scope.search=function (){
            if($scope.searchDate.startDate==undefined || $scope.searchDate.endDate==undefined){
                return;
            }

        }

        $scope.showDatePicker = function(inputElement) {
            var options = {
                date: new Date(),
                mode: 'date', // or 'time'
                allowOldDates: true,
                allowFutureDates: true,
                doneButtonLabel: $scope.Done,
                doneButtonColor: '#000000',
                cancelButtonLabel: $scope.cancel,
                cancelButtonColor: '#000000',
                locale: 'zh_cn'
            };

            $cordovaDatePicker.show(options).then(function (date) {
                if(inputElement=='start'){
                    $scope.searchDate.startDate=date;
                }
                else if(inputElement=='end'){
                    $scope.searchDate.endDate=date;
                }
            });
        };

    })
    .controller('FactorySearchDetailCtrl',function($scope, Summary, $rootScope, AuthService, $state,$stateParams){
        var user = AuthService.currentUser();
        $scope.date = new Date();
        if (user == undefined) {
            $rootScope.backurl = "tab.summary"
            $state.go("login")
            return
        }

        $scope.date = new Date();
        Summary.Detail(user.userID,$stateParams.itemName)
            .then(function(response){
                $scope.details=response.data;
            })
    })
    .controller('ProgressCtrl',function($scope, Summary, $rootScope, AuthService, $state,$translate){
        var user = AuthService.currentUser();
        $scope.date = new Date();
        if (user == undefined) {
            $rootScope.backurl = "tab.summary";
            $state.go("login");
            return
        }
        $translate(['projectProgress', 'factoryProgress']).then(function (translations) {
            $scope.projectProgress = translations.projectProgress;
            $scope.factoryProgress = translations.factoryProgress;
            $scope.progressName=$scope.projectProgress;
        });
        $scope.progressName=$scope.projectProgress;
        $scope.date = new Date();
        $scope.currentType="project";
        Summary.Progress(user.userID,$scope.currentType).then(function(response){
            $scope.progressList=response.data;
        })

        $scope.changeTab= function(itemStyle){
            $scope.currentType=itemStyle;
            if(itemStyle=='project'){
                $scope.progressName=$scope.projectProgress;
            }
            else {
                $scope.progressName=$scope.factoryProgress;
            }
            Summary.Progress(user.userID,$scope.currentType).then(function(response){
                $scope.progressList=response.data;
            })
        }
        $scope.doRefresh = function () {
            Summary.Progress(user.userID,$scope.currentType).then(function(response){
                $scope.progressList=response.data;
            })
            $scope.$broadcast('scroll.refreshComplete');
        }

    })
    .controller('ProgressDetailCtrl',function($scope, Summary, $rootScope, AuthService, $state,$stateParams){
        var user = AuthService.currentUser();
        $scope.date = new Date();
        if (user == undefined) {
            $rootScope.backurl = "tab.summary";
            $state.go("login");
            return
        }
        $scope.date = new Date();
        $scope.currentType=$stateParams.style;
        if($scope.currentType=='factory') {
            $scope.currentType='project'
        }

        Summary.ProgressDetail(user.userID,$stateParams.style,$stateParams.itemId).then(function(response){
            $scope.progressList=response.data;
        })

        $scope.changeTab= function(itemStyle){
            $scope.currentType=itemStyle;
            Summary.ProgressDetail(user.userID,itemStyle,$stateParams.itemId).then(function(response){
                $scope.progressList=response.data;
            })
        }
        $scope.doRefresh = function () {
            Summary.ProgressDetail(user.userID,$stateParams.style,$stateParams.itemId).then(function(response){
                $scope.progressList=response.data;
            })
            $scope.$broadcast('scroll.refreshComplete');
        }

    })
