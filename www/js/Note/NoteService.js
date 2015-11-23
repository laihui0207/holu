/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .factory('Notes', function ($http, $q, ENV,$rootScope) {
        var NoteData={};
        var pageSize=20;

        return ({
            all: listNote,
            notes: getNoteData,
            more: loadMore,
            hasMore: canLoadMore,
            view: viewNote,
            save: saveNote,
            delete: deleteNote,
            send: sendNote
        })
        function listNote(userId) {
            var hasNextPage = true;
            var currentPage = 0;
            $http.get(ENV.ServerUrl + "/services/api/notes/user/" + userId + ".json?page=" + currentPage + "&pageSize=" + pageSize)
                .then(function (response) {
                    if (response.data.length < pageSize) {
                        hasNextPage = false;
                    }
                    NoteData = {
                        hasNextPage: hasNextPage,
                        pageIndex: currentPage,
                        data: response.data,
                        userId: userId
                    };
                    $rootScope.$broadcast("NoteRefreshed");
                })
        }
        function loadMore(){
           var currentPage=NoteData.pageIndex;
            currentPage++;
            var currentData=NoteData.data;
            var userId=NoteData.userId;
            console.log("load more useid:"+userId)
            var hasNextPage=true;
            $http.get(ENV.ServerUrl + "/services/api/notes/user/" + userId + ".json?page=" + currentPage + "&pageSize=" + pageSize)
                .then(function (response) {
                    if (response.data.length < pageSize) {
                        hasNextPage = false;
                    }
                    currentData=currentData.concat(response.data);
                    NoteData = {
                        hasNextPage: hasNextPage,
                        pageIndex: currentPage,
                        data: currentData,
                        userId: userId
                    };
                    $rootScope.$broadcast("NoteRefreshed");
                })
        }
        function canLoadMore(){
            return NoteData.hasNextPage
        }
        function getNoteData(userId){
            if(NoteData.data==undefined){
                return ;
            }
            return NoteData.data;
        }
        function viewNote(id) {
            return $http.get(ENV.ServerUrl + "/services/api/notes/" + id + ".json")
        }
        function sendNote(noteId,users,groups,departments,userId){
            var deferred = $q.defer();
            var promise = deferred.promise;
            // verify username and password
            $http({
                method: 'POST',
                url: ENV.ServerUrl + "/services/api/notes/Send.json",
/*                data: "users=" + users + "&groups=" + groups + "&userId=" + userId + "&noteId=" + noteId,*/
                data: {users:users ,groups:groups,userId:userId ,departments:departments,noteId:noteId},
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
        function saveNote(title, content, userId, noteId) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            // verify username and password
            $http({
                method: 'POST',
                url: ENV.ServerUrl + "/services/api/notes.json",
/*                data: "title=" + title + "&content=" + content + "&userId=" + userId + "&noteId=" + noteId,*/
                data: {title:title,content: content,userId:userId,noteId:noteId},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                console.log("Note save:" + data)
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

        function deleteNote(noteId) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(ENV.ServerUrl + "/services/api/notes/" + noteId + "/delete.json").success(function () {
                deferred.resolve("OK")
            }).error(function () {
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