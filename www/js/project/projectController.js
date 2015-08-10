/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .controller('ProjectCtrl', function ($scope, Projects, $rootScope, AuthService, $state, $stateParams,$ionicLoading) {
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
        $scope.$on("ProjectRefreshed",function(){
            $scope.projectList=Projects.projectData();
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
        $scope.$on("holu.logout",function(){
            needReload=true;
        })
    })
    .controller('ComponentCtrl', function ($scope, Projects,$state, $rootScope, $stateParams,AuthService,$ionicLoading) {
        var user=AuthService.currentUser();
        var needReload=true;
        if (user == undefined) {
            $rootScope.backurl = "tab.project"
            $state.go("login")
            return
        }
        Projects.viewProject($stateParams.projectId).then(function (response) {
            $scope.project = response.data
        })
        $scope.$on("ComponentRefreshed",function(){
            $scope.componentList=Projects.componentData();
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
    })
    .controller('SubComponentCtrl',function($scope, Projects,$state, $rootScope, $stateParams,AuthService,$ionicLoading){
        var user=AuthService.currentUser();
        if (user == undefined) {
            $rootScope.backurl = "tab.project"
            $state.go("login")
            return
        }
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
    .controller('ProcessCtrl', function ($scope, Projects, $rootScope,AuthService, $stateParams,$ionicLoading) {
        var user=AuthService.currentUser();
        if (user == undefined) {
            $rootScope.backurl = "tab.project"
            $state.go("login")
            return
        }
        $scope.currentUser=user;
        var componentType=$stateParams.type;
        $scope.componentID=$stateParams.componentID;
        if(componentType=='parent'){
            Projects.viewComponent($stateParams.componentID,user.userID).then(function(response){
                $scope.component=response.data;
            })
        }
        else if(componentType=='sub'){
            Projects.viewSubComponent($stateParams.componentID,user.userID).then(function(response){
                $scope.subComponent=response.data;
            })
            Projects.viewComponent($stateParams.componentID,user.userID).then(function(response){
                $scope.component=response.data;
            })
        }
        Projects.processList($stateParams.styleID, user.company.companyId,user.userID,$stateParams.componentID).then(function (response) {
            $scope.componentStyleList = response.data
        })
        $scope.doRefresh = function () {
            Projects.processList($stateParams.styleName, user.company.companyId,user.userID,$stateParams.componentID).then(function (response) {
                $scope.componentStyleList = response.data
            }).then(function () {
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
        $scope.confirmProcess = function () {

        }
    })
    .controller('ProcessConfirmCtrl', function ($scope, Projects,$state, $rootScope,AuthService,$cordovaGeolocation,
                                                $cordovaDatePicker,$stateParams,$ionicLoading,$translate,$ionicPopup) {
        var user=AuthService.currentUser();
        if (user == undefined) {
            $rootScope.backurl = "tab.project"
            $state.go("login")
            return
        }
        $translate(['SaveFailed', 'SaveFailedHeader','APICallFailed','SaveSuccess','SaveSuccessHeader']).then(function (translations) {
            $scope.SaveFailed = translations.LoginFailHeader;
            $scope.SaveFailedHeader = translations.SaveFailedHeader;
            $scope.SaveSuccess = translations.SaveSuccess;
            $scope.SaveSuccessHeader = translations.SaveSuccessHeader;
            $scope.APICallFailed = translations.LoginFailMessage;
        });
        $scope.user=user;
/*        $scope.address="中国安徽省合肥市包河区常青路";*/
        $scope.processMid = {
            styleProcessID: $stateParams.styleProcessID,
            subComponentID: $stateParams.componentID,
            userID: user.userID
        }
        $scope.processMid.styleProcessID=$stateParams.styleProcessID;
        $scope.processMid.subComponentID=$stateParams.componentID;

        Projects.viewProject($stateParams.projectID).then(function (response) {
            $scope.project = response.data

        })
        Projects.viewComponent($stateParams.componentID,user.userID).then(function(response){
            $scope.component=response.data;
        })
        $scope.save = function () {
            Projects.confirm($scope.processMid, user.userID)
                .success(function (data) {
                    if (data.styelProcessID == $scope.processMid.styelProcessID) {
                        $rootScope.$broadcast('ProcessUpdate', data);
                        var alertPopup = $ionicPopup.alert({
                            title: $scope.SaveSuccessHeader,
                            template: $scope.SaveSuccess
                        });
                        //$state.go("tab.notes")
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
        $translate(['Done','cancel']).then(function (translations) {
            $scope.Done = translations.Done;
            $scope.cancel = translations.cancel;
        });
        $scope.getPosition=function(){
            var posOptions = {timeout: 10000, enableHighAccuracy: true};
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    qq.maps.convertor.translate(new qq.maps.LatLng(position.coords.latitude, position.coords.longitude), 1, function (res) {
                        latlng = res[0];
                        geocoder = new qq.maps.Geocoder({
                            complete: function (result) {
                                $scope.processMid.positionGPS=result.detail.address;
                            }
                        });
                        geocoder.getAddress(latlng);
                    });


                }, function(err) {
                    // error
                    console.log("GPS failed")
                });

        }
        $scope.getPosition();
    })
