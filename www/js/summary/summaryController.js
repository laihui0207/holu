/**
 * Created by sunlaihui on 9/20/15.
 */

angular.module('Holu')
    .controller('ProjectSummaryCtrl',function($scope, Summary, $rootScope,$translate, AuthService, $state){
        var user = AuthService.currentUser();
        var needReload=true;
        $scope.date = moment();
        $scope.startDate=moment().startOf('month');
        if (user == undefined) {
            $rootScope.backurl = "tab.summary"
            $state.go("login")
            return
        }
        $translate(['ProjectSummary', 'TotalSearch','factorySummary','projectMonthSummary','ProjectTotalSummary',
            'PullToFresh','todaySummary','completed','dun','plan','percent','projectName'])
            .then(function (translations) {
                $scope.ProjectSummary = translations.ProjectSummary;
                $scope.TotalSearch = translations.TotalSearch;
                $scope.factorySummary = translations.factorySummary;
                $scope.projectMonthSummary = translations.projectMonthSummary;
                $scope.ProjectTotalSummary = translations.ProjectTotalSummary;
                $scope.PullToFresh = translations.PullToFresh;
                $scope.todaySummary = translations.todaySummary;
                $scope.completed = translations.completed;
                $scope.dun = translations.dun;
                $scope.plan = translations.plan;
                $scope.percent = translations.percent;
                $scope.projectName = translations.projectName;
            });
/*        $scope.no_content=undefined;*/
        $scope.currentType='projectMonthSummary';
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
    .controller('SummaryDetailCtrl',function($scope, Summary, $rootScope,$translate, AuthService, $state,$stateParams){
        var user = AuthService.currentUser();
        $scope.date = new Date();
        if (user == undefined) {
            $rootScope.backurl = "tab.summary"
            $state.go("login")
            return
        }
        $translate(['ProjectSummary', 'TotalSearch','factorySummary','projectMonthSummary','ProjectTotalSummary',
            'PullToFresh','todaySummary','completed','dun','plan','percent','projectName','progressTo'])
            .then(function (translations) {
                $scope.ProjectSummary = translations.ProjectSummary;
                $scope.TotalSearch = translations.TotalSearch;
                $scope.factorySummary = translations.factorySummary;
                $scope.projectMonthSummary = translations.projectMonthSummary;
                $scope.ProjectTotalSummary = translations.ProjectTotalSummary;
                $scope.PullToFresh = translations.PullToFresh;
                $scope.todaySummary = translations.todaySummary;
                $scope.completed = translations.completed;
                $scope.dun = translations.dun;
                $scope.plan = translations.plan;
                $scope.percent = translations.percent;
                $scope.projectName = translations.projectName;
                $scope.progressTo = translations.progressTo;
            });
        $scope.currentType='projectMonthSummary';
        $scope.date = moment();
        $scope.startDate=moment().startOf('month');
        $scope.projectName=$stateParams.projectName;
        Summary.Detail(user.userID,$stateParams.itemName)
            .then(function(response){
                $scope.details=response.data;
            })
    })
    .controller('ProjectTotalSummaryCtrl',function($scope, Summary,$translate, $rootScope, AuthService, $state){
        var user = AuthService.currentUser();
        $scope.startDate=moment().startOf('month');
        if (user == undefined) {
            $rootScope.backurl = "tab.summary"
            $state.go("login")
            return
        }
        $translate(['ProjectSummary', 'TotalSearch','factorySummary','projectMonthSummary','ProjectTotalSummary',
            'PullToFresh','todaySummary','completed','dun','plan','percent','projectName','progressTo'])
            .then(function (translations) {
                $scope.ProjectSummary = translations.ProjectSummary;
                $scope.TotalSearch = translations.TotalSearch;
                $scope.factorySummary = translations.factorySummary;
                $scope.projectMonthSummary = translations.projectMonthSummary;
                $scope.ProjectTotalSummary = translations.ProjectTotalSummary;
                $scope.PullToFresh = translations.PullToFresh;
                $scope.todaySummary = translations.todaySummary;
                $scope.completed = translations.completed;
                $scope.dun = translations.dun;
                $scope.plan = translations.plan;
                $scope.percent = translations.percent;
                $scope.projectName = translations.projectName;
                $scope.progressTo = translations.progressTo;
            });
        $scope.currentType='ProjectTotalSummary';
        $scope.date = moment();
        Summary.Summary(user.userID,"all").then(function(response){
            $scope.totalSummary=response.data;
        });
        Summary.SummaryDetail(user.userID,"all").then(function(response){
            $scope.summaryItem=response.data;
        });
        $scope.doRefresh = function () {
            Summary.Summary(user.userID,"all").then(function(response){
                $scope.totalSummary=response.data;
            });
            Summary.SummaryDetail(user.userID,"all").then(function(response){
                $scope.summaryItem=response.data;
            });
            $scope.$broadcast('scroll.refreshComplete');
        }

    })
    .controller('TotalSummaryDetailCtrl',function($scope, Summary,$translate, $rootScope, AuthService, $state,$stateParams){
        var user = AuthService.currentUser();
        $scope.date = new Date();
        if (user == undefined) {
            $rootScope.backurl = "tab.summary"
            $state.go("login")
            return
        }
        $translate(['ProjectSummary', 'TotalSearch','factorySummary','projectMonthSummary','ProjectTotalSummary',
            'PullToFresh','todaySummary','completed','dun','plan','percent','projectName','progressTo'])
            .then(function (translations) {
                $scope.ProjectSummary = translations.ProjectSummary;
                $scope.TotalSearch = translations.TotalSearch;
                $scope.factorySummary = translations.factorySummary;
                $scope.projectMonthSummary = translations.projectMonthSummary;
                $scope.ProjectTotalSummary = translations.ProjectTotalSummary;
                $scope.PullToFresh = translations.PullToFresh;
                $scope.todaySummary = translations.todaySummary;
                $scope.completed = translations.completed;
                $scope.dun = translations.dun;
                $scope.plan = translations.plan;
                $scope.percent = translations.percent;
                $scope.projectName = translations.projectName;
                $scope.progressTo = translations.progressTo;
            });
        $scope.currentType='ProjectTotalSummary';
        $scope.date = moment();
        $scope.projectName=$stateParams.projectName;
        Summary.Detail(user.userID,$stateParams.itemName,"all")
            .then(function(response){
                $scope.details=response.data;
            })
    })
    .controller('ProjectSearchCtrl',function($scope, Summary,$translate, $rootScope, AuthService, $state,$cordovaDatePicker,moment) {
        var user = AuthService.currentUser();
        $scope.date = new Date();
        if (user == undefined) {
            $rootScope.backurl = "tab.summary"
            $state.go("login")
            return
        }
        $translate(['ProjectSummary', 'TotalSearch','factorySummary','projectMonthSummary','ProjectTotalSummary',
            'PullToFresh','todaySummary','completed','dun','plan','percent','projectName','progressTo',
            'startDate','endDate'])
            .then(function (translations) {
                $scope.ProjectSummary = translations.ProjectSummary;
                $scope.TotalSearch = translations.TotalSearch;
                $scope.factorySummary = translations.factorySummary;
                $scope.projectMonthSummary = translations.projectMonthSummary;
                $scope.ProjectTotalSummary = translations.ProjectTotalSummary;
                $scope.PullToFresh = translations.PullToFresh;
                $scope.todaySummary = translations.todaySummary;
                $scope.completed = translations.completed;
                $scope.dun = translations.dun;
                $scope.plan = translations.plan;
                $scope.percent = translations.percent;
                $scope.projectName = translations.projectName;
                $scope.progressTo = translations.progressTo;
                $scope.startDate = translations.startDate;
                $scope.endDate = translations.endDate;
            });
        $scope.currentType='totalSearch';
        $scope.searchDate={startDate:moment().startOf('month').format("YYYY-MM-DD"),endDate: moment().format("YYYY-MM-DD")};
        $scope.search=function (){
            if($scope.searchDate.startDate==undefined || $scope.searchDate.endDate==undefined){
                return;
            }
            Summary.searchByDate(user.userID,$scope.searchDate.startDate,$scope.searchDate.endDate,'project').then(function(response){
                $scope.searchResult=response.data;
            })
        }
        $scope.doRefresh = function () {
            Summary.searchByDate(user.userID,$scope.searchDate.startDate,$scope.searchDate.endDate,'project').then(function(response){
                $scope.searchResult=response.data;
            })
            $scope.$broadcast('scroll.refreshComplete');
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
                    $scope.searchDate.startDate=moment(date).format("YYYY-MM-DD");;
                }
                else if(inputElement=='end'){
                    $scope.searchDate.endDate=moment(date).format("YYYY-MM-DD");;
                }
            });
        };

    })
    .controller('FactorySearchCtrl',function($scope, Summary, $rootScope,$translate, AuthService, $state,$cordovaDatePicker,moment) {
        var user = AuthService.currentUser();
        $scope.date = new Date();
        if (user == undefined) {
            $rootScope.backurl = "tab.summary"
            $state.go("login")
            return
        }
        $translate(['ProjectSummary', 'TotalSearch','factorySummary','projectMonthSummary','ProjectTotalSummary',
            'PullToFresh','todaySummary','completed','dun','plan','percent','projectName','progressTo',
            'startDate','endDate'])
            .then(function (translations) {
                $scope.ProjectSummary = translations.ProjectSummary;
                $scope.TotalSearch = translations.TotalSearch;
                $scope.factorySummary = translations.factorySummary;
                $scope.projectMonthSummary = translations.projectMonthSummary;
                $scope.ProjectTotalSummary = translations.ProjectTotalSummary;
                $scope.PullToFresh = translations.PullToFresh;
                $scope.todaySummary = translations.todaySummary;
                $scope.completed = translations.completed;
                $scope.dun = translations.dun;
                $scope.plan = translations.plan;
                $scope.percent = translations.percent;
                $scope.projectName = translations.projectName;
                $scope.progressTo = translations.progressTo;
                $scope.startDate = translations.startDate;
                $scope.endDate = translations.endDate;
            });
        $scope.currentType='factorySearch';
        $scope.searchDate={startDate:moment().startOf('month').format("YYYY-MM-DD"),endDate: moment().format("YYYY-MM-DD")};
        $scope.search=function (){
            if($scope.searchDate.startDate==undefined || $scope.searchDate.endDate==undefined){
                return;
            }
            Summary.searchByDate(user.userID,$scope.searchDate.startDate,$scope.searchDate.endDate,'factory').then(function(response){
                $scope.searchResult=response.data;
            })
        }
        $scope.doRefresh = function () {
            Summary.searchByDate(user.userID,$scope.searchDate.startDate,$scope.searchDate.endDate,'factory').then(function(response){
                $scope.searchResult=response.data;
            })
            $scope.$broadcast('scroll.refreshComplete');
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
                    $scope.searchDate.startDate=moment(date).format("YYYY-MM-DD");
                }
                else if(inputElement=='end'){
                    $scope.searchDate.endDate=moment(date).format("YYYY-MM-DD");
                }
            });
        };

    })
    .controller('FactorySearchDetailCtrl',function($scope, Summary,$translate, $rootScope, AuthService, $state,$stateParams){
        var user = AuthService.currentUser();
        $scope.date = new Date();
        if (user == undefined) {
            $rootScope.backurl = "tab.summary"
            $state.go("login")
            return
        }
        $translate(['ProjectSummary', 'TotalSearch','factorySummary','projectMonthSummary','ProjectTotalSummary',
            'PullToFresh','todaySummary','completed','dun','plan','percent','projectName','progressTo',
            'startDate','endDate'])
            .then(function (translations) {
                $scope.ProjectSummary = translations.ProjectSummary;
                $scope.TotalSearch = translations.TotalSearch;
                $scope.factorySummary = translations.factorySummary;
                $scope.projectMonthSummary = translations.projectMonthSummary;
                $scope.ProjectTotalSummary = translations.ProjectTotalSummary;
                $scope.PullToFresh = translations.PullToFresh;
                $scope.todaySummary = translations.todaySummary;
                $scope.completed = translations.completed;
                $scope.dun = translations.dun;
                $scope.plan = translations.plan;
                $scope.percent = translations.percent;
                $scope.projectName = translations.projectName;
                $scope.progressTo = translations.progressTo;
                $scope.startDate = translations.startDate;
                $scope.endDate = translations.endDate;
            });
        $scope.currentType='factorySearch';
        $scope.date = new Date();
        $scope.projectName=$stateParams.projectName;
        Summary.searchFactoryItemByDate(user.userID,$stateParams.start,$stateParams.end,'factory',$stateParams.itemID)
            .then(function(response){
                $scope.details=response.data;
            })
        $scope.doRefresh = function () {
            Summary.searchFactoryItemByDate(user.userID,$stateParams.start,$stateParams.end,'factory',$stateParams.itemID)
                .then(function(response){
                    $scope.details=response.data;
                })
            $scope.$broadcast('scroll.refreshComplete');
        }
    })
    .controller('ProgressCtrl',function($scope, Summary, $rootScope, AuthService, $state,$translate){
        var user = AuthService.currentUser();
        $scope.date = new Date();
        if (user == undefined) {
            $rootScope.backurl = "tab.summary";
            $state.go("login");
            return
        }
        $translate(['projectProgress', 'factoryProgress','ProjectOverview','progressStatus',
            'progressCurrent','progressInAdvance','progressDelay','progressDays','progressDuration','progressPlan'
        ,'progressUsed','progressDate','progressActual','progressPredict','progressTo','PullToFresh'])
            .then(function (translations) {
            $scope.projectProgress = translations.projectProgress;
            $scope.factoryProgress = translations.factoryProgress;
            $scope.progressName=translations.projectProgress;
            $scope.ProjectOverview=translations.ProjectOverview;
            $scope.progressStatus=translations.progressStatus;
            $scope.progressCurrent=translations.progressCurrent;
            $scope.progressInAdvance=translations.progressInAdvance;
            $scope.progressDelay=translations.progressDelay;
                $scope.progressDays=translations.progressDays;
                $scope.progressDuration=translations.progressDuration;
                $scope.progressPlan=translations.progressPlan;
                $scope.progressUsed=translations.progressUsed;
                $scope.progressDate=translations.progressDate;
                $scope.progressActual=translations.progressActual;
                $scope.progressPredict=translations.progressPredict;
                $scope.progressTo = translations.progressTo;
                $scope.PullToFresh = translations.PullToFresh;
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
