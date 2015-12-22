/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .controller('DocCtrl', function ($scope, $rootScope, $ionicPlatform, Documentations, $ionicLoading,$cordovaToast, ENV, AuthService) {
        var user = AuthService.currentUser();
        if (user == undefined) {
            $rootScope.backurl = "tab.docs"
            $state.go("login")
            return
        }
        $scope.currentType="all";
        Documentations.fleshDoc()
        $scope.ServerUrl = ENV.ServerUrl;

        Documentations.docTypes().then(function (response) {
            $scope.docTypeList = response.data;
        })
        $rootScope.$on("Doc.updated", function () {
            $scope.DocList = Documentations.docList();
            if($scope.DocList==undefined || $scope.DocList.length==0){
                $scope.noContent=true;
            }
            else {
                $scope.noContent=false;
            }
            $scope.$broadcast('scroll.refreshComplete');
        })
        $scope.doRefresh = function () {
            Documentations.docTypes().then(function (response) {
                $scope.docTypeList = response.data;
            })
            Documentations.fleshDoc()
        }
        $scope.loadMore = function () {
            Documentations.more();
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        $scope.canLoadMore = function () {
            return Documentations.hasMore();
        }
        $scope.docListByType = function (typeId) {
            $scope.currentType=typeId;
            Documentations.setCurrentDocType(typeId);
        }
        $scope.download = function (fileName, docId) {
            /*            window.open('http://ionicframework.com/img/ionic-logo-blog.png', '_system', 'location=yes');*/
            $ionicLoading.show({
                template: 'Loading...',
                duration:10000,hideOnStateChange:true
            });
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                    fs.root.getDirectory(
                        "Holu",
                        {
                            create: true
                        },
                        function (dirEntry) {
                            dirEntry.getFile(
                                fileName,
                                {
                                    create: true,
                                    exclusive: false
                                },
                                function gotFileEntry(fe) {
                                    var p = fe.toURL();
                                    fe.remove();
                                    ft = new FileTransfer();
                                    ft.download(
                                        encodeURI(ENV.ServerUrl + "/services/api/Documentations/" + docId + "/download/" + user.id + ".json"),
                                        p,
                                        function (entry) {
                                            $ionicLoading.hide();
                                            //$scope.imgFile = entry.toURL();
                                            $cordovaToast.showLongCenter("Save file to:"+entry.toURL());
                                        },
                                        function (error) {
                                            $ionicLoading.hide();
                                            alert("Download Error Source -> " + error.source);
                                        },
                                        false,
                                        {
                                            headers: {
                                                "Authorization": user.access_token
                                            }
                                        }
                                    );
                                },
                                function () {
                                    $ionicLoading.hide();
                                    console.log("Get file failed");
                                }
                            );
                        }
                    );
                },
                function () {
                    $ionicLoading.hide();
                    console.log("Request for filesystem failed");
                });
        }
    })
    .controller('DocDetailCtrl', function ($scope, Documentations, $stateParams, ENV,AuthService) {
        var user = AuthService.currentUser();
        if (user == undefined) {
            $rootScope.backurl = "tab.docs"
            $state.go("login")
            return
        }
        Documentations.loadDoc($stateParams.docId,user.id).then(function(response){
            $scope.doc=response.data;
        })

    })