// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('Holu', ['ionic', 'Holu.controllers', 'Holu.services', 'Holu.imageFilter','Holu.translate','textAngular','Holu.SelectDirective'])

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
/*   .constant("ServerUrl", "http://220.178.1.10:8089/holusystem")*/
    .constant("ServerUrl", "http://localhost:8087/holusystem")
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
            .state('tab.project', {
                url: '/projects',
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
            .state('tab.styles', {
                url: '/componentStyle/:styleName/:companyId',
                views: {
                    'tab-project': {
                        templateUrl: 'templates/project/componentstylelist.html',
                        controller: 'ProcessCtrl'
                    }
                }
            })


        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    });
