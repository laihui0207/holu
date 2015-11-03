// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('Holu', ['ionic', 'ngCordova', 'Holu.config', 'Holu.services', 'Holu.controllers', 'Holu.imageFilter',
    'Holu.translate', 'Holu.SelectDirective', 'angularMoment', 'angular-carousel'])

    .run(function ($ionicPlatform, $rootScope, $state, $timeout, $ionicHistory,
                   $cordovaToast, amMoment, $cordovaSplashscreen, $cordovaNetwork,$cordovaDevice,
                   $cordovaAppVersion,$ionicLoading, Upgrade,$ionicPopup,$cordovaFileTransfer, $cordovaFile, $cordovaFileOpener2) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                var type = $cordovaNetwork.getNetwork();
                if (type == "none") {
                    $cordovaToast.showShortCenter("~ ~ 没有网络可用 ~ ~")
                }
                var isOnline = $cordovaNetwork.isOnline();
                if (!isOnline) {
                    $cordovaToast.showShortCenter("请确认网络是否在线！")
                }
                else {
                   // console.log("network online");
                }
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
            var platform = $cordovaDevice.getPlatform();
            if(isOnline && platform=='Android'){
                checkUpdate();
            }
            function checkUpdate() {

                Upgrade.lastVersion().then(function (response) {
                    var serverAppVersion = response.data;
                    //showUpdateConfirm();
                    //获取版本
                    $cordovaAppVersion.getAppVersion().then(function (version) {
                        //如果本地于服务端的APP版本不符合
                        if (version != serverAppVersion.version) {
                            showUpdateConfirm(serverAppVersion);
                        }
                    });
                })

            }

// 显示是否更新对话框
            function showUpdateConfirm(appversion) {
                var confirmPopup = $ionicPopup.confirm({
                    title: '版本升级',
                    template: '检测到有新版本:<br/>'+appversion.releaseNote, //从服务端获取更新的内容
                    cancelText: '取消',
                    okText: '升级'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        $ionicLoading.show({
                            template: "已经下载：0%"
                        });
                        var url = Upgrade.downloadLink(); //可以从服务端获取更新APP的路径
                        var targetPath = "file:///storage/sdcard0/Download/ICMS2015.apk"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
                        var trustHosts = true
                        var options = {};
                        $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                            // 打开下载下来的APP
                            $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
                            ).then(function () {
                                    // 成功
                                }, function (err) {
                                    // 错误
                                });
                            $ionicLoading.hide();
                        }, function (err) {
                            alert('下载失败');
                        }, function (progress) {
                            //进度，这里使用文字显示下载百分比
                            $timeout(function () {

                                var downloadProgress = (progress.loaded / appversion.clientSize) * 100;
                                $ionicLoading.show({
                                    template: "已经下载：" + Math.floor(downloadProgress)+"%"
                                });
                                if (downloadProgress > 99) {
                                    $ionicLoading.hide();
                                }
                            })
                        });
                    } else {
                        // 取消更新
                    }
                });
            }
            setTimeout(function () {
                $cordovaSplashscreen.hide();
            }, 3000);

            amMoment.changeLocale('zh-cn');
            $ionicPlatform.on('resume', function () {
                $cordovaSplashscreen.show();
                setTimeout(function () {
                    $cordovaSplashscreen.hide();
                }, 3000);
            })
        });
        $ionicPlatform.registerBackButtonAction(function (e) {
            //判断处于哪个页面时双击退出
            if ($state.current.name == "tab.home" || $state.current.name == "login") {
                if ($rootScope.backButtonPressedOnceToExit) {
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.showShortBottom('再按一次退出系统');
                    setTimeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
            }
            else if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.showShortBottom('再按一次退出系统');
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
            e.preventDefault();
            return false;
        }, 101);
    })
    .run(function ($rootScope, $ionicLoading) {
        $rootScope.$on('loading:show', function () {
            $ionicLoading.show()
        })

        $rootScope.$on('loading:hide', function () {
            $ionicLoading.hide()
        })
    })
    /*  .constant("ServerUrl", "http://220.178.1.10:8089/holusystem")*/
    /*   .constant("ServerUrl", "http://localhost:8087/holusystem")*/
    /*    .constant("ServerUrl", "http://192.168.199.162:8087/holusystem")*/
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push(function ($rootScope, Storage, $cordovaToast) {
            return {
                request: function (config) {
                    var currentUser = Storage.get("user");
                    var access_token =undefined;
                    if(currentUser!=undefined){
                        access_token=currentUser.access_token;
                    }
                    if (access_token) {
                        config.headers.authorization = access_token;
                    }
                    else {
                        config.headers.authorization = "login";
                    }
/*                    if ($rootScope.networkStatus) {*/
                        $rootScope.$broadcast('loading:show');
/*                    }*/
                   /* else {
                        //$cordovaToast.showShortBottom("请确认网络是否在线！")
                    }*/
                    return config
                },
                response: function (response) {
                    $rootScope.$broadcast('loading:hide')
                    if (response.status === 401) {
                        $rootScope.$broadcast("holu.logout");
                    }
                    return response
                }
            }
        })
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.timeout = 30000;
        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function (data) {
            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            var param = function (obj) {
                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;

                for (name in obj) {
                    value = obj[name];

                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '='
                            + encodeURIComponent(value) + '&';
                    }
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            };

            return angular.isObject(data) && String(data) !== '[object File]'
                ? param(data)
                : data;
        }];

    })
    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html",
                controller: 'NavCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/user/login.html',
                controller: 'LoginCtrl'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'templates/user/signup.html',
                controller: 'LoginCtrl'
            })
            .state('tab.home', {
                url: '/home',
                views: {
                    'tab-home': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })
            // Each tab has its own nav history stack:

            /*.state('tab.dash', {
             url: '/dash',
             views: {
             'tab-dash': {
             templateUrl: 'templates/tab-dash.html',
             controller: 'DashCtrl'
             }
             }
             })*/
            .state('tab.messages', {
                url: '/messages',
                views: {
                    'tab-OA': {
                        templateUrl: 'templates/message/messagelist.html',
                        controller: 'MessageCtrl'
                    }
                }
            })
            .state('tab.message-detail', {
                url: '/messages/:messageId',
                views: {
                    'tab-OA': {
                        templateUrl: 'templates/message/messageDetail.html',
                        controller: 'MessageDetailCtrl'
                    }
                }
            })
            .state('tab.message-new', {
                url: '/message/new',
                views: {
                    'tab-OA': {
                        templateUrl: 'templates/message/new.html',
                        controller: 'MessageNewCtrl'
                    }
                }
            })
            .state('tab.message-edit', {
                url: '/message/edit/:messageId',
                views: {
                    'tab-OA': {
                        templateUrl: 'templates/message/edit.html',
                        controller: 'MessageEditCtrl'
                    }
                }
            })
            .state('tab.message-send', {
                url: '/message/send/:messageId',
                views: {
                    'tab-OA': {
                        templateUrl: 'templates/message/send.html',
                        controller: 'MessageSendCtrl'
                    }
                }
            })
            .state('tab.news', {
                url: '/news',
                views: {
                    'tab-news': {
                        templateUrl: 'templates/news/newslist.html',
                        controller: 'NewsCtrl'
                    }
                }
            })
            .state('tab.importantNews', {
                url: '/importantNews',
                views: {
                    'tab-news': {
                        templateUrl: 'templates/news/importantnewslist.html',
                        controller: 'ImportantNewsCtrl'
                    }
                }
            })
            .state('tab.news-detail', {
                url: '/news/:newsId',
                views: {
                    'tab-news': {
                        templateUrl: 'templates/news/newsDetail.html',
                        controller: 'NewsDetailCtrl'
                    }
                }
            })
            .state('tab.docs', {
                url: '/docs',
                views: {
                    'tab-OA': {
                        templateUrl: 'templates/documentations/doclist.html',
                        controller: 'DocCtrl'
                    }
                }
            })
            .state('tab.doc-detail', {
                url: '/docs/:docId',
                views: {
                    'tab-OA': {
                        templateUrl: 'templates/documentations/DocDetail.html',
                        controller: 'DocDetailCtrl'
                    }
                }
            })
            .state('tab.postsubjects', {
                url: '/postsubjects',
                views: {
                    'tab-posts': {
                        templateUrl: 'templates/postbar/subjectlist.html',
                        controller: 'PostSubjectCtrl'
                    }
                }
            })
            .state('tab.postbars', {
                url: '/postbars/:subjectId',
                views: {
                    'tab-posts': {
                        templateUrl: 'templates/postbar/postBarlist.html',
                        controller: 'PostBarCtrl'
                    }
                }
            })
            .state('tab.postbar-detail', {
                url: '/postbar/:postBarId',
                views: {
                    'tab-posts': {
                        templateUrl: 'templates/postbar/postBarDetail.html',
                        controller: 'PostBarDetailCtrl'
                    }
                }
            })
            .state('tab.postbar-new', {
                url: '/postbar/:subjectId/new',
                views: {
                    'tab-posts': {
                        templateUrl: 'templates/postbar/newPostBar.html',
                        controller: 'PostBarNewCtrl'
                    }
                }
            })
            .state('tab.postbar-edit', {
                url: '/postbar/:subjectId/edit/:postBarId',
                views: {
                    'tab-posts': {
                        templateUrl: 'templates/postbar/editPostBar.html',
                        controller: 'PostBarNewCtrl'
                    }
                }
            })
            .state('tab.notes', {
                url: '/notes',
                views: {
                    'tab-OA': {
                        templateUrl: 'templates/note/notelist.html',
                        controller: 'NoteCtrl'
                    }
                }
            })
            .state('tab.notes-new', {
                url: '/note/new',
                views: {
                    'tab-OA': {
                        templateUrl: 'templates/note/new.html',
                        controller: 'NoteNewCtrl'
                    }
                }
            })
            .state('tab.notes-edit', {
                url: '/note/edit/:noteId',
                views: {
                    'tab-OA': {
                        templateUrl: 'templates/note/edit.html',
                        controller: 'NoteEditCtrl'
                    }
                }
            })
            .state('tab.notes-send', {
                url: '/note/send/:noteId',
                views: {
                    'tab-OA': {
                        templateUrl: 'templates/note/send.html',
                        controller: 'NoteSendCtrl'
                    }
                }
            })
            .state('tab.note-detail', {
                url: '/notes/:noteId',
                views: {
                    'tab-OA': {
                        templateUrl: 'templates/note/noteDetail.html',
                        controller: 'NoteDetailCtrl'
                    }
                }
            })
            .state('tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tab-chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })
            .state('tab.chat-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/chat-detail.html',
                        controller: 'ChatDetailCtrl'
                    }
                }
            })

            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            })
            /* .state('tab.messages', {
             url: '/chats',
             views: {
             'tab-messages': {
             templateUrl: 'templates/tab-account.html',
             controller: 'AccountCtrl'
             }
             }
             })*/
            .state('tab.tasks', {
                url: '/tasks',
                views: {
                    'tab-project': {
                        templateUrl: 'templates/project/task.html',
                        controller: 'TaskCtrl'
                    }
                }
            })
            .state('tab.project', {
                url: '/projects',
                views: {
                    'tab-project': {
                        templateUrl: 'templates/project/projectlist.html',
                        controller: 'ProjectCtrl'
                    }
                }
            })
            .state('tab.subProject', {
                url: '/projects/:projectID',
                views: {
                    'tab-project': {
                        templateUrl: 'templates/project/projectlist.html',
                        controller: 'ProjectCtrl'
                    }
                }
            })
            .state('tab.component', {
                url: '/components/:projectId',
                views: {
                    'tab-project': {
                        templateUrl: 'templates/project/componentlist.html',
                        controller: 'ComponentCtrl'
                    }
                }
            })
            .state('tab.subComponent', {
                url: '/subComponent/:componentID',
                views: {
                    'tab-project': {
                        templateUrl: 'templates/project/subcomponentlist.html',
                        controller: 'SubComponentCtrl'
                    }
                }
            })
            .state('tab.styles', {
                url: '/componentStyle/:styleID/:componentID/:type',
                views: {
                    'tab-project': {
                        templateUrl: 'templates/project/componentstylelist.html',
                        controller: 'ProcessCtrl'
                    }
                }
            })
            .state('tab.process', {
                url: '/processconfirm/:projectID/:componentID/:styleProcessID/:type/:from',
                views: {
                    'tab-project': {
                        templateUrl: 'templates/project/processconfirm.html',
                        controller: 'ProcessConfirmCtrl'
                    }
                }
            })
            .state('tab.urgenttask', {
                url: '/urgenttask',
                views: {
                    'tab-project': {
                        templateUrl: 'templates/project/urgenttask.html',
                        controller: 'UrgentTaskCtrl'
                    }
                }
            })
            .state('tab.projectsummary', {
                url: '/projectsummary',
                views: {
                    'tab-summary': {
                        templateUrl: 'templates/summary/summary.html',
                        controller: 'ProjectSummaryCtrl'
                    }
                }
            })
            .state('tab.summarydetail', {
                url: '/summarydetail/:itemName/:projectName',
                views: {
                    'tab-summary': {
                        templateUrl: 'templates/summary/summaryDetail.html',
                        controller: 'SummaryDetailCtrl'
                    }
                }
            })
            .state('tab.projecttotalsummary', {
                url: '/projecttotalsummary',
                views: {
                    'tab-summary': {
                        templateUrl: 'templates/summary/totalsummary.html',
                        controller: 'ProjectTotalSummaryCtrl'
                    }
                }
            })
            .state('tab.totalsummarydetail', {
                url: '/totalsummarydetail/:itemName/:projectName',
                views: {
                    'tab-summary': {
                        templateUrl: 'templates/summary/totalsummaryDetail.html',
                        controller: 'TotalSummaryDetailCtrl'
                    }
                }
            })
            .state('tab.totalsearch', {
                url: '/totalsearch',
                views: {
                    'tab-summary': {
                        templateUrl: 'templates/summary/totalsearch.html',
                        controller: 'ProjectSearchCtrl'
                    }
                }
            })
            .state('tab.factorysearch', {
                url: '/factorysearch',
                views: {
                    'tab-summary': {
                        templateUrl: 'templates/summary/factorysearch.html',
                        controller: 'FactorySearchCtrl'
                    }
                }
            })
            .state('tab.factorysearchdetail', {
                url: '/factorysearchdetail/:itemID/:start/:end/:projectName',
                views: {
                    'tab-summary': {
                        templateUrl: 'templates/summary/factorysearchdetail.html',
                        controller: 'FactorySearchDetailCtrl'
                    }
                }
            })
            .state('tab.progress', {
                url: '/progress',
                views: {
                    'tab-summary': {
                        templateUrl: 'templates/summary/progress.html',
                        controller: 'ProgressCtrl'
                    }
                }
            })
            .state('tab.progressdetail', {
                url: '/progressdetail/:style/:itemId',
                views: {
                    'tab-summary': {
                        templateUrl: 'templates/summary/progressDetail.html',
                        controller: 'ProgressDetailCtrl'
                    }
                }
            })
        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    });
