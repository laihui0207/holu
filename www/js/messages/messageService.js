/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .factory('Messages',function($http,$rootScope,$q,ENV){
        var messages={};
        var currentPage=0;
        var pageSize=10;
        var unReadMessagesCount=0;
        var messageType="all";
        return({
            list: listMyMessage,
            messages: getMessageData,
            more: loadMore,
            hasMore: canLoadMore,
            messageType: setMessageType,
            view: getMessage,
            save: saveMessage,
            send: sendMessage,
            delete: deleteMessage,
            readed: updateMessageStatus,
            refreshNewMessagecount: getNewMessageCount,
            getNewMessageCount: getCountDate,
            reply: replyMessage
        })
        function getNewMessageCount(userId){
            $http.get(ENV.ServerUrl+"/services/api/msgs/user/"+userId+"/count.json")
                .then(function(response){
                    unReadMessagesCount=response.data;
                    $rootScope.newMessageCount=unReadMessagesCount;
                    //$rootScope.$broadcast("holu.messageCountUpdate");
                });
        }
        function getCountDate(){
            return unReadMessagesCount;
        }
        function updateMessageStatus(messageId,userId){
            $http.get(ENV.ServerUrl+"/services/api/msgs/"+messageId+"/"+userId+"/read.json").then(function(resposne){
                $rootScope.$broadcast('MessageUpdate');
                $rootScope.$broadcast('holu.messageCountUpdate');
            })
        }
        function getMessageData(){
            if(messages[messageType]==undefined){
                return;
            }
            return messages[messageType].data;
        }
        function listMyMessage(userId){
            var hasNextPage=true;
            var currentPage=0;
            $http.get(ENV.ServerUrl+"/services/api/msgs/user/"+userId+".json?type="+messageType+"&page="+currentPage+"&pageSize="+pageSize).then(function(response){
                if(response.data.length < pageSize){
                    hasNextPage=false;
                }
                messages[messageType]={
                    hasNextPage: hasNextPage,
                    pageIndex: currentPage,
                    data: response.data,
                    userId: userId
                }
                $rootScope.$broadcast('MessageFlushed');
            })
        }
        function setMessageType(type,userId){
            messageType=type;
            listMyMessage(userId)
        }
        function loadMore(){
            var userId=messages[messageType].userId;
            var currentData=messages[messageType].data;
            var currentPage=messages[messageType].pageIndex;
            currentPage++;
            $http.get(ENV.ServerUrl+"/services/api/msgs/user/"+userId+".json?type="+messageType+"&page="+currentPage+"&pageSize="+pageSize).then(function(response){
                if(response.data.length < pageSize){
                    hasNextPage=false;
                }
                currentData=currentData.concat(response.data);
                messages[messageType]={
                    hasNextPage: hasNextPage,
                    pageIndex: currentPage,
                    data: currentData,
                    userId: userId
                }
                $rootScope.$broadcast('MessageFlushed');
            })
        }
        function canLoadMore(){
            if(messages[messageType]==undefined){
                return false;
            }
            return messages[messageType].hasNextPage;
        }
        function saveMessage(title,content,userId,messageId){
            var deferred = $q.defer();
            var promise = deferred.promise;
            // verify username and password
            $http({
                method: 'POST',
                url: ENV.ServerUrl + "/services/api/msgs.json",
/*                data: "title="+title+"&content="+content+"&userId="+userId+"&messageId="+messageId,*/
                data: {title:title,content:content,userId:userId,messageId:messageId},
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
        function sendMessage(messageId,users,groups,departments,userId){
            var deferred = $q.defer();
            var promise = deferred.promise;
            // verify username and password
            $http({
                method: 'POST',
                url: ENV.ServerUrl + "/services/api/msgs/Send.json",
/*                data: "users=" + users + "&groups=" + groups + "&userId=" + userId + "&messageId=" + messageId,*/
                data: {users:users ,groups:groups ,departments:departments,userId:userId,messageId:messageId},
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
        function replyMessage(messageId,userId,content){
            var deferred = $q.defer();
            var promise = deferred.promise;
            // verify username and password
            $http({
                method: 'POST',
                url: ENV.ServerUrl + "/services/api/messageReply.json",
                data: {userId:userId,messageId:messageId,content:content},
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