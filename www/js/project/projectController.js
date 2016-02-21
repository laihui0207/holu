/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .controller('ProjectCtrl', function ($scope, Projects,$translate, $rootScope, AuthService, $state, $stateParams) {
        var user = AuthService.currentUser();
        var needReload=true;
        if (user == undefined) {
            $rootScope.backurl = "tab.project"
            $state.go("login")
            return
        }
        /*Projects.projects(user.userID,$stateParams.projectID).then(function (response) {
            $scope.projectList = response.data
        })*/
        $translate(['Project','PullToFresh','EmptyContent'])
            .then(function (translations) {
                $scope.Project = translations.Project;
                $scope.PullToFresh = translations.PullToFresh;
                $scope.EmptyContent = translations.EmptyContent;
            });
        $rootScope.$on("ProjectRefreshed",function(){
            $scope.projectList=Projects.projectData();
            if($scope.projectList==undefined || $scope.projectList.length==0){
                $scope.noContent=true;
            }
            else {
                $scope.noContent=false;
            }
            needReload=false;
            $scope.$broadcast('scroll.refreshComplete');
        })
        $scope.doRefresh = function () {
            Projects.projects(user.userID,$stateParams.projectID)
        }
        $scope.loadMore = function () {
            Projects.moreProject();
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        $scope.canLoadMore = function () {
            return Projects.canMoreProject();
        }
        $scope.$on("$ionicView.enter", function(scopes, states){
            user=AuthService.currentUser();
            if(needReload){

                Projects.projects(user.userID,$stateParams.projectID)
            }
        })
        $rootScope.$on("holu.logout",function(){
            needReload=true;
            $scope.projectList=undefined;
        })
        $scope.myTask=function(){
            Projects.myTasks(user.userID);
        }
        $scope.goto=function(length,projectID){
            if(length==0){
                $state.go("tab.component",{projectId:projectID})
            }
            else {
                $state.go("tab.project",{projectId:projectID})
            }
        }

    })

    .controller('ComponentCtrl', function ($scope, Projects,$state,$translate, $rootScope, $stateParams,AuthService) {
        var user=AuthService.currentUser();
        var needReload=true;
        if (user == undefined) {
            $rootScope.backurl = "tab.project"
            $state.go("login")
            return
        }
        $translate(['ComponentList','PullToFresh','EmptyContent','ProjectInformation'])
            .then(function (translations) {
                $scope.ComponentList = translations.ComponentList;
                $scope.PullToFresh = translations.PullToFresh;
                $scope.EmptyContent = translations.EmptyContent;
                $scope.ProjectInformation = translations.ProjectInformation;
            });
        Projects.viewProject($stateParams.projectId).then(function (response) {
            $scope.project = response.data
        })
        $scope.$on("ComponentRefreshed",function(){
            $scope.componentList=Projects.componentData();
            if($scope.componentList==undefined || $scope.componentList.length==0){
                $scope.noContent=true;
            }
            else {
                $scope.noContent=false;
            }
            needReload=false;
            $scope.$broadcast('scroll.refreshComplete');
        })
        Projects.components($stateParams.projectId,user.userID);
        $scope.doRefresh = function () {
            Projects.components($stateParams.projectId,user.userID)
        }
        $scope.loadMore = function () {
            Projects.moreComponent();
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        $scope.canLoadMore = function () {
            return Projects.canMoreComponent();
        }
        $scope.goto=function(length,item){
            if(length==0){
                $state.go("tab.styles",{styleID:item.styleID,componentID:item.componentID,type:'parent'})
            }
            else {

                $state.go("tab.subComponent",{componentID: item.componentID});
            }
        }
    })
    .controller('SubComponentCtrl',function($scope, Projects,$state,$translate, $rootScope, $stateParams,AuthService){
        var user=AuthService.currentUser();
        if (user == undefined) {
            $rootScope.backurl = "tab.project"
            $state.go("login")
            return
        }
        $translate(['ComponentList','PullToFresh','subComponent','EmptyContent','ProjectInformation'])
            .then(function (translations) {
                $scope.ComponentList = translations.ComponentList;
                $scope.PullToFresh = translations.PullToFresh;
                $scope.EmptyContent = translations.EmptyContent;
                $scope.ProjectInformation = translations.ProjectInformation;
                $scope.subComponent = translations.subComponent;
            });
        Projects.viewComponent($stateParams.componentID,user.userID).then(function(response){
            $scope.component=response.data;
        })
        $scope.$on("SubComponentRefreshed",function(){
            $scope.subComponentList=Projects.subComponentData();
            if($scope.subComponentList==undefined || $scope.subComponentList.length==0){
                $scope.noContent=true;
            }
            else {
                $scope.noContent=false;
            }
            needReload=false;
            $scope.$broadcast('scroll.refreshComplete');
        })
        Projects.subComponents($stateParams.componentID,user.userID)
        $scope.doRefresh = function () {
            Projects.subComponents($stateParams.componentID,user.userID)
        }
        $scope.loadMore = function () {
            Projects.moreSubComponent();
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        $scope.canLoadMore = function () {
            return Projects.canMoreSubComponent();
        }
    })
    .controller('ProcessCtrl', function ($scope, Projects, $rootScope,$translate,AuthService, $stateParams) {
        var user=AuthService.currentUser();
        if (user == undefined) {
            $rootScope.backurl = "tab.project"
            $state.go("login")
            return
        }
        $translate(['ComponentList','Project','PullToFresh','processConfirm','EmptyContent','confirmStart','confirmEnd',
            'ProjectInformation','confirmStartDate','confirmEndDate','confirmQuestion','componentStyleList',
            'note','position','ProjectInformation','Location','Submit'])
            .then(function (translations) {
                $scope.ComponentList = translations.ComponentList;
                $scope.PullToFresh = translations.PullToFresh;
                $scope.EmptyContent = translations.EmptyContent;
                $scope.ProjectInformation = translations.ProjectInformation;
                $scope.confirmStartDate = translations.confirmStartDate;
                $scope.confirmEndDate = translations.confirmEndDate;
                $scope.confirmQuestion = translations.confirmQuestion;
                $scope.componentStyleList = translations.componentStyleList;
                $scope.confirmStart = translations.confirmStart;
                $scope.confirmEnd = translations.confirmEnd;
                $scope.processConfirm = translations.processConfirm;
                $scope.note = translations.note;
                $scope.position = translations.position;
                $scope.ProjectInformation = translations.ProjectInformation;
                $scope.Location = translations.Location;
                $scope.Submit = translations.Submit;
            });
        $scope.currentUser=user;
        $scope.componentType=$stateParams.type;
        $scope.componentID=$stateParams.componentID;
        var needReload=true;
        $scope.$on("$ionicView.enter", function(scopes, states){
            user=AuthService.currentUser();
            if(needReload){
                Projects.processList($stateParams.styleID, user.company.companyId,user.userID,$stateParams.componentID).then(function (response) {
                    $scope.componentStyleList = response.data;
                    needReload=false;
                })
            }
        })
        $rootScope.$on("ProjectMissionUpdate",function(event,args){
            //needReload=true;
            if(args === undefined){
                $scope.doRefresh();
            }
            else {
                $scope.componentStyleList.forEach(function(mission){
                    if(mission.processMid.subComponentID == args.componentID && mission.processMid.styleProcessID== args.styleID){
                        if(args.type=="start"){
                            mission.processMid.startDate=new Date();
                        }
                        else if(args.type=="end"){
                            mission.processMid.endDate=new Date();
                        }
                    }
                })
            }

        })
        if($scope.componentType =='parent'){
            Projects.viewComponent($stateParams.componentID,user.userID).then(function(response){
                $scope.component=response.data;
            })
        }
        else if($scope.componentType =='sub'){
            Projects.viewSubComponent($stateParams.componentID,user.userID).then(function(response){
                $scope.subComponent=response.data;
            })
            Projects.parentComponent($stateParams.componentID,user.userID).then(function(response){
                $scope.component=response.data;
            })
        }

        $scope.doRefresh = function () {
            Projects.processList($stateParams.styleID, user.company.companyId,user.userID,$stateParams.componentID).then(function (response) {
                $scope.componentStyleList = response.data
                needReload=false;
            }).then(function () {
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
        $scope.confirmProcess = function () {

        }
    })
    .controller('ProcessBatchConfirmCtrl',function($scope, Projects,$state, $rootScope,AuthService,$cordovaGeolocation,$cordovaToast,
                                                   $stateParams,$translate,$ionicPopup,$cordovaDevice){
        var user=AuthService.currentUser();
        if (user == undefined) {
            $rootScope.backurl = "tab.project"
            $state.go("login");
            return
        }
        $translate(['SaveFailed', 'SaveFailedHeader','APICallFailed','SaveSuccess','SaveSuccessHeader','PullToFresh',
            'confirmQuestion','MyTask','urgentTask','processConfirm','note','position','ProjectInformation','Location','Submit'])
            .then(function (translations) {
                $scope.SaveFailed = translations.LoginFailHeader;
                $scope.SaveFailedHeader = translations.SaveFailedHeader;
                $scope.SaveSuccess = translations.SaveSuccess;
                $scope.SaveSuccessHeader = translations.SaveSuccessHeader;
                $scope.APICallFailed = translations.LoginFailMessage;
                $scope.confirmQuestion = translations.confirmQuestion;
                $scope.MyTask = translations.MyTask;
                $scope.urgentTask = translations.urgentTask;
                $scope.processConfirm = translations.processConfirm;
                $scope.note = translations.note;
                $scope.position = translations.position;
                $scope.ProjectInformation = translations.ProjectInformation;
                $scope.Location = translations.Location;
                $scope.Submit = translations.Submit;
                $scope.PullToFresh = translations.PullToFresh;
                $scope.BatchStart = translations.BatchStart;
                $scope.BatchEnd= translations.BatchEnd;
            });
        var confirmData=$stateParams.data;
        console.log("confirmData",confirmData);
        $scope.user=user;
        $scope.confirmDetail=[];
        $scope.processMid = {
            userID: user.userID
        };

        $scope.$on("$ionicView.enter", function(scopes, states){
            $scope.locationed=false;
            for(id in confirmData){
                getDetailData(confirmData[id]);
            }
           /* var platform = $cordovaDevice.getPlatform();
            if(platform=='Android'){*/
                getPostion_baidu();
           /* }
            else {
                getPosition();
            }*/
        })
        if($stateParams.type == 'note'){
            $scope.title='confirmQuestion';
        }
        else if ($stateParams.type == 'start'){
            $scope.title='BatchStart';
        }
        else if ($stateParams.type == 'end'){
            $scope.title='BatchEnd';
        }
        $scope.save=function(){
            Projects.batchConfirm(confirmData.join(','),$scope.processMid,$stateParams.type,user.userID)
                .success(function (data) {
                    if (data.length > 0) {
                       // $rootScope.$broadcast('ProcessUpdate', data);
                        var alertPopup = $ionicPopup.alert({
                            title: $scope.SaveSuccessHeader,
                            template: $scope.SaveSuccess
                        });
                        if($stateParams.from == 'task'){
                            var batchData="";
                            for(var id in data){
                                batchData+=data[id].subComponentID+"-"+data[id].styleProcessID+",";
                            }
                            $rootScope.$broadcast("MissionUpdate",
                                {type:$stateParams.type,batchData: batchData});
                            $state.go("tab.tasks")
                        }
                        else if($stateParams.from == 'urgent'){
                            var batchData="";
                            for(var id in data){
                                batchData+=data[id].subComponentID+"-"+data[id].styleProcessID+",";
                            }
                                $rootScope.$broadcast("UrgentMissionUpdate",
                                    {
                                        type: $stateParams.type,
                                        batchData: batchData
                                    });
                            $state.go("tab.urgenttask")
                        }
                       /* else if($stateParams.from == 'project'){
                            if($stateParams.type == 'end'){
                                $rootScope.$broadcast("ProjectMissionUpdate");
                            }
                            else {
                                $rootScope.$broadcast("ProjectMissionUpdate",
                                    {styleID:$stateParams.styleProcessID,componentID:$stateParams.componentID,type:$stateParams.type});
                            }
                            ///:styleID/:componentID/:type
                            $state.go("tab.styles",{type:'sub',styleID:$scope.component.styleID,componentID:$stateParams.componentID})
                        }*/
                    }
                    else {
                        var alertPopup = $ionicPopup.alert({
                            title: $scope.SaveFailedHeader,
                            template: $scope.SaveFailed
                        });
                    }
                })
                .error(function (data) {
                    var alertPopup = $ionicPopup.alert({
                        title: $scope.SaveFailedHeader,
                        template: $scope.APICallFailed
                    });
                })
        };
        function getDetailData(id){
            //id format: projectID,subcomponentID,processID
            var ids=id.split("-");
            var projectID=ids[0];
            var subcomponentID=ids[1];
            var processID=ids[2];
            var result={};
            /*Projects.viewProject(projectID).then(function (response) {
                result.project=response.data
            });*/
            Projects.parentComponent(subcomponentID,user.userID).then(function(response){
                result.component=response.data;
                result.project=response.data.project;
            });
            Projects.viewSubComponent(subcomponentID,user.userID).then(function(response){
                result.subComponent=response.data;
            });
            Projects.componentStyle(processID).then(function(response){
                result.componentStyle=response.data;
            })
            Projects.processMid(user.userID,subcomponentID,processID).then(function(response){
                if(response.data!=""){
                    result.processMid=response.data;
                }
                else {
                    result.processMid.styleProcessID=processID;
                    result.processMid.subComponentID=subcomponentID;
                }
            })

            $scope.confirmDetail.push(result);
        }
        function getPostion_baidu(){
            BaiduGeolocation.getCurrentPosition(function(position){
                // alert(JSON.stringify(position));
                $scope.processMid.positionGPS=position.coords.latitude+","+position.coords.longitude;
                $scope.processMid.positionName=position.addr;
                $scope.locationed=true;
                $scope.$digest();
                //BaiduGeolocation.stop(noop,noop);
            },function(e){
                //alert(e);
                $cordovaToast.showLongCenter(e)
                $scope.locationed=false;
                $scope.$digest();
                //alert(JSON.stringify(e))
                //BaiduGeolocation.stop(noop,noop)
            });
        }

    })
    .controller('ProcessConfirmCtrl', function ($scope, Projects,$state, $rootScope,AuthService,$cordovaGeolocation,$cordovaToast,
                                                $cordovaDatePicker,$stateParams,$translate,$ionicPopup,$cordovaDevice) {
        var user=AuthService.currentUser();
        if (user == undefined) {
            $rootScope.backurl = "tab.project"
            $state.go("login");
            return
        }
        $translate(['SaveFailed', 'SaveFailedHeader','APICallFailed','SaveSuccess','SaveSuccessHeader','PullToFresh',
            'confirmQuestion','MyTask','urgentTask','processConfirm','note','position','ProjectInformation','Location','Submit'])
            .then(function (translations) {
                $scope.SaveFailed = translations.LoginFailHeader;
                $scope.SaveFailedHeader = translations.SaveFailedHeader;
                $scope.SaveSuccess = translations.SaveSuccess;
                $scope.SaveSuccessHeader = translations.SaveSuccessHeader;
                $scope.APICallFailed = translations.LoginFailMessage;
                $scope.confirmQuestion = translations.confirmQuestion;
                $scope.MyTask = translations.MyTask;
                $scope.urgentTask = translations.urgentTask;
                $scope.processConfirm = translations.processConfirm;
                $scope.note = translations.note;
                $scope.position = translations.position;
                $scope.ProjectInformation = translations.ProjectInformation;
                $scope.Location = translations.Location;
                $scope.Submit = translations.Submit;
                $scope.PullToFresh = translations.PullToFresh;
        });
        $scope.user=user;
        $scope.processMid = {
            styleProcessID: $stateParams.styleProcessID,
            subComponentID: $stateParams.componentID,
            userID: user.userID
        };
        $scope.$on("$ionicView.enter", function(scopes, states){
           $scope.locationed=false;
/*            var platform = $cordovaDevice.getPlatform();*/
/*            if(platform=='Android'){*/
                getPostion_baidu();
            /*}
            else {
                getPosition();
            }*/
        })
        $scope.processMid.styleProcessID=$stateParams.styleProcessID;
        $scope.processMid.subComponentID=$stateParams.componentID;
        $scope.from=$stateParams.from;
        $scope.type=$stateParams.type;
        //$scope.locationed=false;
        if($stateParams.type == 'note'){
            $scope.title='confirmQuestion';
        }
        else if ($stateParams.type == 'start'){
            $scope.title='confirmStart';
        }
        else if ($stateParams.type == 'end'){
            $scope.title='confirmEnd';
        }
        Projects.viewProject($stateParams.projectID).then(function (response) {
            $scope.project = response.data

        })
        Projects.parentComponent($stateParams.componentID,user.userID).then(function(response){
            $scope.component=response.data;
        })
        Projects.viewSubComponent($stateParams.componentID,user.userID).then(function(response){
            $scope.subComponent=response.data;
        })
        Projects.processMid(user.userID,$stateParams.componentID,$stateParams.styleProcessID).then(function(response){
            if(response.data!=""){
                $scope.processMid=response.data;
            }
            else {
                $scope.processMid.styleProcessID=$stateParams.styleProcessID;
                $scope.processMid.subComponentID=$stateParams.componentID;
            }
        })
        $scope.save = function () {
            Projects.confirm($scope.processMid,$stateParams.type, user.userID)
                .success(function (data) {
                    if (data.styelProcessID == $scope.processMid.styelProcessID) {
                        $rootScope.$broadcast('ProcessUpdate', data);
                        var alertPopup = $ionicPopup.alert({
                            title: $scope.SaveSuccessHeader,
                            template: $scope.SaveSuccess
                        });
                        if($stateParams.from == 'task'){
                            $rootScope.$broadcast("MissionUpdate",
                                {styleID:$stateParams.styleProcessID,componentID:$stateParams.componentID,type:$stateParams.type});
                            $state.go("tab.tasks")
                        }
                        else if($stateParams.from == 'urgent'){
                            $rootScope.$broadcast("UrgentMissionUpdate",
                                {styleID:$stateParams.styleProcessID,componentID:$stateParams.componentID,type:$stateParams.type});
                            $state.go("tab.urgenttask")
                        }
                        else if($stateParams.from == 'project'){
                            if($stateParams.type == 'end'){
                                $rootScope.$broadcast("ProjectMissionUpdate");
                            }
                            else {
                                $rootScope.$broadcast("ProjectMissionUpdate",
                                    {styleID:$stateParams.styleProcessID,componentID:$stateParams.componentID,type:$stateParams.type});
                            }
                            ///:styleID/:componentID/:type
                            $state.go("tab.styles",{type:'sub',styleID:$scope.component.styleID,componentID:$stateParams.componentID})
                        }
                    }
                    else {
                        var alertPopup = $ionicPopup.alert({
                            title: $scope.SaveFailedHeader,
                            template: $scope.SaveFailed
                        });
                    }
                })
                .error(function (data) {
                    var alertPopup = $ionicPopup.alert({
                        title: $scope.SaveFailedHeader,
                        template: $scope.APICallFailed
                    });
                })
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
                    $scope.processMid.startDate=date;
                }
                else if(inputElement=='end'){
                    $scope.processMid.endDate=date;
                }
            });
        };
        $translate(['Done','cancel','getPositionFailed']).then(function (translations) {
            $scope.Done = translations.Done;
            $scope.getPositionFailed = translations.getPositionFailed;
            $scope.cancel = translations.cancel;
        });
/*
        var noop=function(){}
*/
        function getPostion_baidu(){
            BaiduGeolocation.getCurrentPosition(function(position){
               // alert(JSON.stringify(position));
                $scope.processMid.positionGPS=position.coords.latitude+","+position.coords.longitude;
                $scope.processMid.positionName=position.addr;
                $scope.locationed=true;
                $scope.$digest();
                //BaiduGeolocation.stop(noop,noop);
            },function(e){
                //alert(e);
                $cordovaToast.showLongCenter(e)
                $scope.locationed=false;
                $scope.$digest();
                //alert(JSON.stringify(e))
                //BaiduGeolocation.stop(noop,noop)
            });
        }
       /* function getPosition(){
            var posOptions = {timeout: 10000, enableHighAccuracy: true};
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    $scope.processMid.positionGPS=position.coords.latitude+","+position.coords.longitude;
                    qq.maps.convertor.translate(new qq.maps.LatLng(position.coords.latitude, position.coords.longitude), 1, function (res) {
                        latlng = res[0];
                        geocoder = new qq.maps.Geocoder({
                            complete: function (result) {
                                $scope.processMid.positionName=result.detail.address;
                                $scope.locationed=true;
                                $scope.$digest();
                            }
                        });
                        geocoder.getAddress(latlng);

                    });


                }, function(err) {
                    $cordovaToast.showLongCenter($scope.getPositionFailed)
                    $scope.locationed=false;
                    $scope.$digest();
                });

        }
*/
    })
    .controller('TaskProjectCtrl',function($scope,$rootScope, Projects,$state, $rootScope,AuthService){
        var user = AuthService.currentUser();
        if (user == undefined) {
            $rootScope.backurl = "tab.tasks"
            $state.go("login")
            return
        }
        $scope.currentType="doing";
        loadData();
        $scope.doRefresh = function () {
            loadData();
            $scope.$broadcast('scroll.refreshComplete');
        }
       /* $scope.loadMore=function(){
            Projects.moreTask(user.userID,$scope.currentType);
        }
        $scope.canLoadMore=function(){
            return Projects.canLoadMoreTask();
        }*/
        function loadData(){
            Projects.myTaskProjects(user.userID,$scope.currentType).then(function(response){
                $scope.projectList=response.data;
            })
        }
        $scope.taskListByType=function(type){
            $scope.currentType=type;
            loadData();
        }
    })
    .controller('TaskComponentStyleCtrl',function($scope,$rootScope, Projects,$state,$stateParams, $rootScope,AuthService){
        var user = AuthService.currentUser();
        if (user == undefined) {
            $rootScope.backurl = "tab.tasks"
            $state.go("login")
            return
        }
        $scope.currentType=$stateParams.type;
        $scope.projectID=$stateParams.projectID;
        loadData();
        $scope.doRefresh = function () {
            loadData();
            $scope.$broadcast('scroll.refreshComplete');
        }
        /* $scope.loadMore=function(){
         Projects.moreTask(user.userID,$scope.currentType);
         }
         $scope.canLoadMore=function(){
         return Projects.canLoadMoreTask();
         }*/
        function loadData(){
            Projects.myStyleListOfProject(user.userID,$stateParams.projectID,$scope.currentType).then(function(response){
                $scope.stylesList=response.data;
            })
        }
        $scope.taskListByType=function(type){
            $scope.currentType=type;
            loadData();
        }
    })
    .controller('TaskMissionCtrl',function($scope,$rootScope, Projects,$state,$stateParams, $rootScope,AuthService){
        var user = AuthService.currentUser();
        if (user == undefined) {
            $rootScope.backurl = "tab.tasks"
            $state.go("login")
            return
        }
        $scope.currentType=$stateParams.type;
        loadData();
        $scope.doRefresh = function () {
            loadData();
            $scope.$broadcast('scroll.refreshComplete');
        }
        /* $scope.loadMore=function(){
         Projects.moreTask(user.userID,$scope.currentType);
         }
         $scope.canLoadMore=function(){
         return Projects.canLoadMoreTask();
         }*/
        $scope.selectedStartProcess=[];
        $scope.selectedEndProcess=[];
        function loadData(){
            Projects.myTaskMissions(user.userID,$stateParams.projectID,$stateParams.styleID,$scope.currentType).then(function(response){
                $scope.taskList=response.data;
            })
        }
        $scope.taskListByType=function(type){
            $scope.currentType=type;
            loadData();
        }
        $scope.toggleProcess=function(value,type){
            if(type==='start'){
                var index=$scope.selectedStartProcess.indexOf(value);
                if(index > -1){
                    $scope.selectedStartProcess.splice(index,1)
                }
                else {
                    $scope.selectedStartProcess.push(value)
                }
            }
            else if(type==='end'){
                var index=$scope.selectedEndProcess.indexOf(value);
                if(index > -1){
                    $scope.selectedEndProcess.splice(index,1)
                }
                else {
                    $scope.selectedEndProcess.push(value)
                }
            }
        }
        $scope.batchConfirm=function(type){
            if(type==='start'){
                $state.go('tab.batchConfirm',{type:'start',from:'task',data: $scope.selectedStartProcess});
            }
            else if (type === 'end'){
                $state.go('tab.batchConfirm',{type:'end',from:'task',data:$scope.selectedEndProcess});
            }

        }
        $rootScope.$on('MissionUpdate',function(event,args){
            var batchConfirmResult=[];
            if(args.batchData != undefined){
                batchConfirmResult=args.batchData.split(",");
            }
            if(args.type=='start'){
                $scope.selectedStartProcess=[];
            }
            if(args.type === 'end'){
                $scope.selectedEndProcess=[];
            }

            $scope.taskList.forEach(function(mission){
                if(args.componentID != undefined && mission.subComponentID == args.componentID && mission.processMid.styleProcessID == args.styleID){
                    if(args.type=="start"){
                        mission.processMid.startDate=new Date();
                    }
                    else if(args.type=="end"){
                        mission.processMid.endDate=new Date();
                    }
                    console.log('mission',mission);
                } else if(args.batchData != undefined){
                    for(var i in batchConfirmResult){
                        var strA=batchConfirmResult[i].split("-");
                        if(mission.subComponentID == strA[0] && mission.processMid.styleProcessID== strA[1]) {
                            if (args.type === "start") {
                                mission.processMid.startDate = new Date();
                            }
                            else if (args.type === "end") {
                                mission.processMid.endDate = new Date();
                            }
                            console.log('mission',mission);
                        }
                    }
                }
            });
            //$scope.$digest();
        })
    })
    .controller('TaskCtrl',function($scope,$rootScope, Projects,$state, $rootScope,AuthService){
        var user = AuthService.currentUser();
        if (user == undefined) {
            $rootScope.backurl = "tab.tasks"
            $state.go("login")
            return
        }
        var needReload=true;
        $scope.config={itemsDisplayedInList:10};
        $scope.currentType="doing";
        $scope.selectedStartProcess=[];
        $scope.selectedEndProcess=[];
       /* var currentData={
            currentIndex:0,
            projects:[]
        };*/
        $scope.$on("$ionicView.enter", function(scopes, states){
            user=AuthService.currentUser();
            if(needReload){
                Projects.myTasks(user.userID,$scope.currentType,user.allowCreateProject);
            }
        })
        $rootScope.$on("holu.logout",function(){
            needReload=true;
            $scope.taskList=undefined;
        })
        $rootScope.$on('MissionUpdate',function(event,args){
            var batchConfirmResult=[];
            if(args.batchData != undefined){
                batchConfirmResult=args.batchData.split(",");
            }
            if(args.type=='start'){
                $scope.selectedStartProcess=[];
            }
            if(args.type === 'end'){
                $scope.selectedEndProcess=[];
            }

            $scope.taskList.forEach(function(mission){
                if(args.componentID != undefined && mission.subComponentID == args.componentID && mission.processMid.styleProcessID == args.styleID){
                    if(args.type=="start"){
                        mission.processMid.startDate=new Date();
                    }
                    else if(args.type=="end"){
                        mission.processMid.endDate=new Date();
                    }
                    console.log('mission',mission);
                } else if(args.batchData != undefined){
                    for(var i in batchConfirmResult){
                        var strA=batchConfirmResult[i].split("-");
                        if(mission.subComponentID == strA[0] && mission.processMid.styleProcessID== strA[1]) {
                            if (args.type === "start") {
                                mission.processMid.startDate = new Date();
                            }
                            else if (args.type === "end") {
                                mission.processMid.endDate = new Date();
                            }
                            console.log('mission',mission);
                        }
                    }
                }
            });
            //$scope.$digest();
        })

        $scope.doRefresh = function () {
            Projects.myTasks(user.userID,$scope.currentType,user.allowCreateProject);
            //$scope.$broadcast('scroll.refreshComplete');
        }
        $scope.loadMore=function(){
           Projects.moreTask(user.userID,$scope.currentType);
        }
        $scope.canLoadMore=function(){
            return Projects.canLoadMoreTask();
        }
        $scope.taskListByType=function(type){
            $scope.currentType=type;
            $scope.taskList=[];
            Projects.myTasks(user.userID,$scope.currentType,user.allowCreateProject);
            //$scope.doRefresh();
        }
        $rootScope.$on("TaskListUpdated",function(){
            console.log("get task updated event")
            $scope.taskList = Projects.taskData();
            needReload=false;
            if ($scope.taskList == undefined || $scope.taskList.length == 0) {
                $scope.noContent = true;
            }
            else {
                $scope.noContent = false;
            }
           // $scope.$digest();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');
        })

        //$scope.doRefresh();
        $scope.toggleProcess=function(value,type){
            if(type==='start'){
                var index=$scope.selectedStartProcess.indexOf(value);
                if(index > -1){
                    $scope.selectedStartProcess.splice(index,1)
                }
                else {
                    $scope.selectedStartProcess.push(value)
                }
            }
            else if(type==='end'){
                var index=$scope.selectedEndProcess.indexOf(value);
                if(index > -1){
                    $scope.selectedEndProcess.splice(index,1)
                }
                else {
                    $scope.selectedEndProcess.push(value)
                }
            }
        }
        $scope.batchConfirm=function(type){
            if(type==='start'){
               $state.go('tab.batchConfirm',{type:'start',from:'task',data: $scope.selectedStartProcess});
            }
            else if (type === 'end'){
                $state.go('tab.batchConfirm',{type:'end',from:'task',data:$scope.selectedEndProcess});
            }

        }
    })
    .controller('UrgentTaskCtrl',function($scope, Projects,AuthService, $rootScope,$state){
        var user=AuthService.currentUser();
        if (user == undefined) {
            $rootScope.backurl = "tab.urgenttask"
            $state.go("login")
            return
        }
        $scope.currentType="doing"
        var needReload=true;

        $scope.selectedStartProcess=[];
        $scope.selectedEndProcess=[];

        $scope.$on("$ionicView.enter", function(scopes, states){
            user=AuthService.currentUser();
            if(needReload){
                Projects.urgentTask(user.userID,$scope.currentType);
            }

        })
        $rootScope.$on("holu.logout",function(){
            needReload=true;
            $scope.taskList=undefined;
            $scope.$digest();
        })
        $rootScope.$on("UrgentTaskRefreshed",function(){
            $scope.taskList=Projects.urgentTaskData();
            if($scope.taskList==undefined || $scope.taskList.length==0){
                $scope.noContent=true;
            }
            else {
                $scope.noContent=false;
            }
            needReload=false;
            //$scope.$digest();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');
        })
        $scope.loadMore=function(){
            Projects.moreUrgentTask();
            //$scope.$broadcast('scroll.infiniteScrollComplete');
        }
        $scope.taskListByType=function(type){
            $scope.currentType=type;
            $scope.taskList=[];
            Projects.urgentTask(user.userID,type);
        }
        $scope.canLoadMore=function(){
            return Projects.canMoreUrgentTask();
        }
        $rootScope.$on('UrgentMissionUpdate',function(event,args){
            //needReload=true;
            var batchConfirmResult=[];
            if(args.batchData != undefined){
                batchConfirmResult=args.batchData.split(",");
            }
            if(args.type=='start'){
                $scope.selectedStartProcess=[];
            }
            if(args.type === 'end'){
                $scope.selectedEndProcess=[];
            }
            $scope.taskList.forEach(function(mission){
                if(args.componentID != undefined && mission.subComponentID == args.componentID && mission.processMid.styleProcessID== args.styleID){
                    if(args.type=="start"){
                        mission.processMid.startDate=new Date();
                    }
                    else if(args.type=="end"){
                        mission.processMid.endDate=new Date();
                    }
                }
                else if(args.batchData != undefined){
                    for(var i in batchConfirmResult){
                        var strA=batchConfirmResult[i].split("-");
                        if(mission.subComponentID == strA[0] && mission.processMid.styleProcessID== strA[1]) {
                            if (args.type === "start") {
                                mission.processMid.startDate = new Date();
                            }
                            else if (args.type === "end") {
                                mission.processMid.endDate = new Date();
                            }
                            console.log('mission',mission);
                        }
                    }
                }
            })
            //$scope.$digest();
        })
       // flushData();
        $scope.doRefresh = function () {
           flushData();
        }

        function flushData(){
            Projects.urgentTask(user.userID,$scope.currentType);
            $scope.$broadcast('scroll.refreshComplete');
        }

        $scope.toggleProcess=function(value,type){
            if(type==='start'){
                var index=$scope.selectedStartProcess.indexOf(value);
                if(index > -1){
                    $scope.selectedStartProcess.splice(index,1)
                }
                else {
                    $scope.selectedStartProcess.push(value)
                }
            }
            else if(type==='end'){
                var index=$scope.selectedEndProcess.indexOf(value);
                if(index > -1){
                    $scope.selectedEndProcess.splice(index,1)
                }
                else {
                    $scope.selectedEndProcess.push(value)
                }
            }
        }
        $scope.batchConfirm=function(type){
            if(type==='start'){
                $state.go('tab.batchConfirm',{type:'start',from:'urgent',data: $scope.selectedStartProcess});
            }
            else if (type === 'end'){
                $state.go('tab.batchConfirm',{type:'end',from:'urgent',data:$scope.selectedEndProcess});
            }

        }

    })
    .controller("urgentTaskProjectCtrl",function($scope, Projects,AuthService, $rootScope,$state){
        var user = AuthService.currentUser();
        if (user == undefined) {
            $rootScope.backurl = "tab.urgenttask"
            $state.go("login")
            return
        }
        $scope.currentType="doing";
        loadData();
        $scope.doRefresh = function () {
            loadData();
            $scope.$broadcast('scroll.refreshComplete');
        }
        /* $scope.loadMore=function(){
         Projects.moreTask(user.userID,$scope.currentType);
         }
         $scope.canLoadMore=function(){
         return Projects.canLoadMoreTask();
         }*/
        function loadData(){
            Projects.urgentTaskProject(user.userID,$scope.currentType).then(function(response){
                $scope.projectList=response.data;
            })
        }
        $scope.taskListByType=function(type){
            $scope.currentType=type;
            loadData();
        }
    })
    .controller("urgentTaskSubCtrl",function($scope, Projects,AuthService, $rootScope,$state,$stateParams){
        var user = AuthService.currentUser();
        if (user == undefined) {
            $rootScope.backurl = "tab.urgenttask"
            $state.go("login")
            return
        }
        $scope.currentType=$stateParams.type;
        loadData();
        $scope.doRefresh = function () {
            loadData();
            $scope.$broadcast('scroll.refreshComplete');
        }
        /* $scope.loadMore=function(){
         Projects.moreTask(user.userID,$scope.currentType);
         }
         $scope.canLoadMore=function(){
         return Projects.canLoadMoreTask();
         }*/
        function loadData(){
            Projects.urgentTaskSubComponents(user.userID,$stateParams.projectID,$scope.currentType).then(function(response){
                $scope.subList=response.data;
            })
        }
        $scope.taskListByType=function(type){
            $scope.currentType=type;
            loadData();
        }
    })
    .controller("urgentTaskMissionCtrl",function($scope, Projects,AuthService, $rootScope,$state,$stateParams){
        var user = AuthService.currentUser();
        if (user == undefined) {
            $rootScope.backurl = "tab.urgenttask"
            $state.go("login")
            return
        }
        $scope.currentType=$stateParams.type;
        loadData();
        $scope.doRefresh = function () {
            loadData();
            $scope.$broadcast('scroll.refreshComplete');
        }
        $scope.selectedStartProcess=[];
        $scope.selectedEndProcess=[];
        /* $scope.loadMore=function(){
         Projects.moreTask(user.userID,$scope.currentType);
         }
         $scope.canLoadMore=function(){
         return Projects.canLoadMoreTask();
         }*/
        function loadData(){
            Projects.urgentTaskMission(user.userID,$stateParams.subID,$scope.currentType).then(function(response){
                $scope.taskList=response.data;
            })
        }
        $scope.taskListByType=function(type){
            $scope.currentType=type;
            loadData();
        }
        //$scope.doRefresh();
        $scope.toggleProcess=function(value,type){
            if(type==='start'){
                var index=$scope.selectedStartProcess.indexOf(value);
                if(index > -1){
                    $scope.selectedStartProcess.splice(index,1)
                }
                else {
                    $scope.selectedStartProcess.push(value)
                }
            }
            else if(type==='end'){
                var index=$scope.selectedEndProcess.indexOf(value);
                if(index > -1){
                    $scope.selectedEndProcess.splice(index,1)
                }
                else {
                    $scope.selectedEndProcess.push(value)
                }
            }
        }
        $scope.batchConfirm=function(type){
            if(type==='start'){
                $state.go('tab.batchConfirm',{type:'start',from:'task',data: $scope.selectedStartProcess});
            }
            else if (type === 'end'){
                $state.go('tab.batchConfirm',{type:'end',from:'task',data:$scope.selectedEndProcess});
            }

        }
    })