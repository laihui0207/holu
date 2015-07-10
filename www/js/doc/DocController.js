/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .controller('DocCtrl',function($scope,Documentations,$ionicLoading,ServerUrl){
        Documentations.all().then(function(response){
            $scope.DocList=response.data;
        })
        $scope.ServerUrl=ServerUrl;
        $scope.doRefresh = function () {
            Documentations.all().then(function(response){
                $scope.DocList=response.data;
            }).then(function(){
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
        $scope.download = function() {
            $ionicLoading.show({
                template: 'Loading...'
            });
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
                    fs.root.getDirectory(
                        "Holu",
                        {
                            create: true
                        },
                        function(dirEntry) {
                            dirEntry.getFile(
                                "test.png",
                                {
                                    create: true,
                                    exclusive: false
                                },
                                function gotFileEntry(fe) {
                                    var p = fe.toURL();
                                    fe.remove();
                                    ft = new FileTransfer();
                                    ft.download(
                                        encodeURI("http://ionicframework.com/img/ionic-logo-blog.png"),
                                        p,
                                        function(entry) {
                                            $ionicLoading.hide();
                                            $scope.imgFile = entry.toURL();
                                        },
                                        function(error) {
                                            $ionicLoading.hide();
                                            alert("Download Error Source -> " + error.source);
                                        },
                                        false,
                                        null
                                    );
                                },
                                function() {
                                    $ionicLoading.hide();
                                    console.log("Get file failed");
                                }
                            );
                        }
                    );
                },
                function() {
                    $ionicLoading.hide();
                    console.log("Request for filesystem failed");
                });
        }
    })