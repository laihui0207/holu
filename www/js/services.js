angular.module('Holu.services', [])
    .factory('Storage', function() {
        return {
            set: function(key, data) {
                return window.localStorage.setItem(key, window.JSON.stringify(data));
            },
            get: function (key) {
                var data = window.localStorage.getItem(key);
                if (data != "undefined" && data!=null && data!="null") {
                    return window.JSON.parse(data)
                }

                return undefined;
            },
            remove: function(key) {
                return window.localStorage.removeItem(key);
            }
        };
    })
    .factory('AuthService', function ($http, ENV, $q,$rootScope,menuItemService,Storage) {
        return ({
            login: doLogin,
            setCred: saveCred,
            clearCred: ClearCredentials,
            logged: isLogged,
            logout: doLogout,
            currentUser: getCurrentUser,
            setUser: setCurrentUser,
            signup: createUser,
            companies: getCompany
        })
        var credentailKey="holu.cred";
        var user = Storage.get("user") || {};

        function doLogin(userName, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            // verify username and password
            $http({
                method: 'POST',
                url: ENV.ServerUrl + "/services/api/users/userLogin.json",
                data: "username="+userName+"&password="+pw,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                console.log("login" + data);
                if(data==""){
                    deferred.reject('Wrong credentials.');
                }
                else {
                    $rootScope.currentUser=data;
                    Storage.set("user", data);
                    user=data;
                    //saveCred(userName,pw);
                    $rootScope.menuItems=menuItemService.menuList(true);
                    deferred.resolve(data);
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
        function createUser(newUser){
            var deferred = $q.defer();
            var promise = deferred.promise;
            // verify username and password
            $http({
                method: 'POST',
                url: ENV.ServerUrl + "/services/api/users/signup.json",
/*                data: "userName="+newUser.userName+"&password="+newUser.password+"&loginCode="+newUser.loginCode+"&userId="+
                newUser.userId+"&companyId="+newUser.companyId,*/
                data: {userName:newUser.userName,password:newUser.password,loginCode:newUser.loginCode,userNote:newUser.userNote},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                if(data==""){
                    deferred.reject('Sign up Failed');
                }
                else {
                    deferred.resolve(data);
                }
            }).error(function (data) {
                deferred.reject('Wrong credentials.');
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
        function isLogged(){
           return user == {}
        }
        function doLogout(){
            if(user==undefined || user=={}) return;
            $http.get(ENV.ServerUrl+"/services/api/users/userLogout/"+user.userID+".json").then(function(response){
               var returnuser=response.data;
            })
            user = {};
            Storage.remove("user");
        }
        function getCurrentUser(){
            return user;
        }
        function setCurrentUser(u){
            user=u;
        }
        function getCompany(){
            return $http.get(ENV.ServerUrl + "/services/api/companies/signup/company.json")
        }
        function saveCred(userName, password) {
            var authdata = Base64.encode(userName + ':' + password);
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };
            Storage.set(credentailKey,$rootScope.globals);
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            Storage.remove(credentailKey);
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

    .factory('UserService',function($http,ENV){
        return ({
            listSlv: listUser
        })
        function listUser(userID){
            return $http.get(ENV.ServerUrl+"/services/api/users/slv.json?userID="+userID)
        }
    })
    .factory('Department',function($http,ENV){
        return ({
            listSlv: listDepartment
        })
        function listDepartment(userID){
            return $http.get(ENV.ServerUrl+"/services/api/departments/slv.json?userID="+userID)
        }
    })
    .factory('UserGroup',function($http,$q,ENV){
        return({
            listSlv: listUserGroups,
            save: saveUserGroup,
            delete: deleteUserGroup
        })
        function listUserGroups(userID){
            return $http.get(ENV.ServerUrl+"/services/api/groups/slv.json?userID="+userID)
        }
        function saveUserGroup(){

        }
        function deleteUserGroup(){

        }
    })
    .factory('menuItemService',function(){
        return {
            menuList:function(Logined){
                var items=[];
                if(Logined){
                    items=[
                       /* {
                            label: 'Setting',
                            action: '/#/tab/setting'
                        },*/
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
