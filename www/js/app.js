// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('Holu', ['ionic', 'Holu.controllers', 'Holu.services', 'Holu.imageFilter','Holu.translate','textAngular'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    })
    .constant("ServerUrl", "http://220.178.1.10：8089/holusystem")
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
                /*views:{
                    'login-view':{*/
                        templateUrl: 'templates/user/login.html',
                        controller: 'LoginCtrl'
                   /* },
                    'menulist':{
                        templateUrl: 'templates/menus/logoutmenu.html',
                        controller: 'NavCtrl'
                    }
                }*/
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
            .state('tab.news', {
                url: '/news',
                views: {
                    'tab-news': {
                        templateUrl: 'templates/news/newslist.html',
                        controller: 'NewsCtrl'
                    },
                    'menuList':{
                        templateUrl: 'templates/menus/Loginedmenu.html',
                        controller: 'NavCtrl'
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
                    'tab-docs': {
                        templateUrl: 'templates/documentations/doclist.html',
                        controller: 'DocCtrl'
                    }
                }
            })
            .state('tab.notes', {
                url: '/notes',
                views: {
                    'tab-notes': {
                        templateUrl: 'templates/note/notelist.html',
                        controller: 'NoteCtrl'
                    }
                }
            })
            .state('tab.notes-new', {
                url: '/note/new',
                views: {
                    'tab-notes': {
                        templateUrl: 'templates/note/new.html',
                        controller: 'NoteCtrl'
                    }
                }
            })
            .state('tab.note-detail', {
                url: '/notes/:noteId',
                views: {
                    'tab-notes': {
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
            .state('tab.messages', {
                url: '/chats',
                views: {
                    'tab-messages': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            })
            .state('tab.project', {
                url: '/account',
                views: {
                    'tab-project': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            })

        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    });
