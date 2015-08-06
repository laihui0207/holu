/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .factory('Messages',function($http,$rootScope,$q,ENV){
        return({
            list: listMyMessage,
            view: getMessage,
            save: saveMessage,
            send: sendMessage,
            delete: deleteMessage
        })
        function listMyMessage(userId){
            return $http.get(ENV.ServerUrl+"/services/api/msgs/user/"+userId+".json")
        }
        function saveMessage(title,content,userId,messageId){
            var deferred = $q.defer();
            var promise = deferred.promise;
            // verify username and password
            $http({
                method: 'POST',
                url: ENV.ServerUrl + "/services/api/msgs.json",
                data: "title="+title+"&content="+content+"&userId="+userId+"&messageId="+messageId,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                console.log("Message save:"+data)
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
        function getMessage(id){
            return $http.get(ENV.ServerUrl+"/services/api/msgs/"+id+".json")
        }
        function sendMessage(messageId,users,groups,userId){
            var deferred = $q.defer();
            var promise = deferred.promise;
            // verify username and password
            $http({
                method: 'POST',
                url: ENV.ServerUrl + "/services/api/msgs/Send.json",
                data: "users=" + users + "&groups=" + groups + "&userId=" + userId + "&messageId=" + messageId,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                if (data == "") {
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
        function deleteMessage(messageId){
            return $http.get(ENV.ServerUrl+"/services/api/msgs/"+messageId+"/delete.json")
        }
    })