angular.module('Holu.services', [])
    .factory('AuthService', function ($http, ServerUrl, $q,$rootScope,menuItemService) {
        return ({
            login: doLogin,
            setCred: saveCred,
            clearCred: ClearCredentials
        })
        function doLogin(userName, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            // verify username and password
            $http({
                method: 'POST',
                url: ServerUrl + "/services/api/users/userLogin.json",
                data: "username="+userName+"&password="+pw,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                console.log("loo" + data);
                if(data==""){
                    deferred.reject('Wrong credentials.');
                }
                else {
                    $rootScope.currentUser=data;
                    $rootScope.menuItems=menuItemService.menuList(true);
                    deferred.resolve('Welcome ' + userName + '!');
                }
            }).error(function (data) {
                deferred.reject('Wrong credentials.');
                $rootScope.menuItems=menuItemService.menuList(false);
            })

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }

        function saveCred(userName, password) {
            var authdata = Base64.encode(userName + ':' + password);
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        }

        // Base64 encoding service used by AuthenticationService
        var Base64 = {

            keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        this.keyStr.charAt(enc1) +
                        this.keyStr.charAt(enc2) +
                        this.keyStr.charAt(enc3) +
                        this.keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },

            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    window.alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = this.keyStr.indexOf(input.charAt(i++));
                    enc2 = this.keyStr.indexOf(input.charAt(i++));
                    enc3 = this.keyStr.indexOf(input.charAt(i++));
                    enc4 = this.keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return output;
            }
        };
    })
    .factory('News', function ($http, ServerUrl) {
        return ({
            all: listNews,
            viewNews: getNews,
            newsTypes: getNewsTypes,
            newsListByType: getNewsListByNewsType
        })
        function listNews() {
            //return news;
            return $http.get(ServerUrl + "/services/api/news.json")
        }

        function getNews(id) {
            return $http.get(ServerUrl + "/services/api/news/" + id + ".json")
        }
        function getNewsTypes(){
            return $http.get(ServerUrl+"/services/api/newstypes.json")
        }
        function getNewsListByNewsType(typeId){
            return $http.get(ServerUrl+"/services/api/news/newstype/"+typeId+".json");
        }
    })
    .factory('Documentations',function($http,ServerUrl){
        return ({
            all: listDoc,
            download: downloadDoc
        })
        function listDoc(){
            return $http.get(ServerUrl+"/services/api/Documentations.json")
        }
        function downloadDoc(){
            return
        }
    })
    .factory('Notes',function($http,$q,ServerUrl){
        return({
            all: listNote,
            view: viewNote,
            save: saveNote,
            delete: deleteNote
        })
        function listNote(){
            return $http.get(ServerUrl+"/services/api/notes.json")
        }
        function viewNote(id){
            return $http.get(ServerUrl+"/services/api/notes/"+id+".json")
        }
        function saveNote(title,content,userId,noteId){
            var deferred = $q.defer();
            var promise = deferred.promise;
            // verify username and password
            $http({
                method: 'POST',
                url: ServerUrl + "/services/api/notes.json",
                data: "title="+title+"&content="+content+"&userId="+userId+"&noteId="+noteId,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                console.log("Note save:"+data)
                if(data==""){
                    deferred.reject('Failed');
                }
                else {
                    deferred.resolve(data);
                }
            }).error(function (data) {
                deferred.reject('Call Failed');
            })

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
        function deleteNote(noteId){
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(ServerUrl+"/services/api/notes/"+noteId+"/delete.json").success(function(){
                deferred.resolve("OK")
            }).error(function(){
                deferred.reject("Failed")
            })
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    })
    .factory('Chats', function ($http) {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
        }, {
            id: 1,
            name: 'Max Lynx',
            lastText: 'Hey, it\'s me',
            face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
        }, {
            id: 2,
            name: 'Adam Bradleyson',
            lastText: 'I should buy a boat',
            face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
        }, {
            id: 3,
            name: 'Perry Governor',
            lastText: 'Look at my mukluks!',
            face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
        }, {
            id: 4,
            name: 'Mike Harrington',
            lastText: 'This is wicked good ice cream.',
            face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
        }];

        return {
            all: function () {
                return chats;
            },
            remove: function (chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        };
    })
    .factory('menuItemService',function(){
        return {
            menuList:function(Logined){
                var items=[];
                if(Logined){
                    items=[
                        {
                            label: 'Setting',
                            action: '/#/tab/setting'
                        },
                        {
                            label: 'Logout',
                            action: '#',
                            click: 'logout()'
                        }
                    ]
                }
                else {
                    items=[
                        {
                            label: 'Login',
                            action: '/#/login'
                        }
                    ]
                }
                return items;
            }
        }
    })
;
