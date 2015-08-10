/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .controller('DocCtrl',function($scope,$ionicPlatform,Documentations,$ionicLoading,ENV){
        Documentations.all().then(function(response){
            $scope.DocList=response.data;
        })
        $scope.ServerUrl=ENV.ServerUrl;
        $scope.doRefresh = function () {
            Documentations.all().then(function(response){
                $scope.DocList=response.data;
            }).then(function(){
                $scope.$broadcast('scroll.refreshComplete');
            })
        }

        $scope.download = function(fileName,docId) {
/*            window.open('http://ionicframework.com/img/ionic-logo-blog.png', '_system', 'location=yes');*/
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
                                        encodeURI(ENV.ServerUrl+"/services/api/Documentations/"+docId+"/download.json"),
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