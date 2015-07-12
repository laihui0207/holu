/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .factory('Notes', function ($http, $q, ServerUrl) {
        return ({
            all: listNote,
            view: viewNote,
            save: saveNote,
            delete: deleteNote,
            send: sendNote
        })
        function listNote() {
            return $http.get(ServerUrl + "/services/api/notes.json")
        }

        function viewNote(id) {
            return $http.get(ServerUrl + "/services/api/notes/" + id + ".json")
        }
        function sendNote(noteId,users,groups,userId){
            var deferred = $q.defer();
            var promise = deferred.promise;
            // verify username and password
            $http({
                method: 'POST',
                url: ServerUrl + "/services/api/notes/Send.json",
                data: "users=" + users + "&groups=" + groups + "&userId=" + userId + "&noteId=" + noteId,
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
                url: ServerUrl + "/services/api/notes.json",
                data: "title=" + title + "&content=" + content + "&userId=" + userId + "&noteId=" + noteId,
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
            $http.get(ServerUrl + "/services/api/notes/" + noteId + "/delete.json").success(function () {
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