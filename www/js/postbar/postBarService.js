/**
 *
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .factory('PostBars', function ($http, $q, ServerUrl) {
        return ({
            postSubjects: listPostSubjects,
            postBars: listPostBarOfSubject,
            viewPost: getPostBarById,
            save: savePostBar,
            delete: deletePostBar,
            replyPost: replyPostBar,
            replies: listReplies,
            listViewUsers: listPostBarViewUsers,
            listReplyUsers: listPostBarReplyUsers,
            listViewGroups: listPostBarViewGroups,
            listReplyGroups: listPostBarReplyGroups
        })
        function listPostBarViewUsers(postBarId){
            return $http.get(ServerUrl + "/services/api/postbars/" + postBarId + "/viewUser/slv.json")
        }
        function listPostBarReplyUsers(postBarId){
            return $http.get(ServerUrl + "/services/api/postbars/" + postBarId + "/replyUser/slv.json")
        }
        function listPostBarViewGroups(postBarId){
            return $http.get(ServerUrl + "/services/api/postbars/" + postBarId + "/viewGroup/slv.json")
        }
        function listPostBarReplyGroups(postBarId){
            return $http.get(ServerUrl + "/services/api/postbars/" + postBarId + "/replyGroup/slv.json")
        }
        function listPostSubjects() {
            return $http.get(ServerUrl + "/services/api/postSubjects.json");
        }

        function listPostBarOfSubject(subjectId) {
            return $http.get(ServerUrl + "/services/api/postbars/subject/" + subjectId + ".json")
        }

        function getPostBarById(postbarId) {
            return $http.get(ServerUrl + "/services/api/postbars/" + postbarId + ".json")
        }
        function deletePostBar(id){
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(ServerUrl + "/services/api/postbars/" + id + "/delete.json").success(function () {
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

        function replyPostBar(content, postBarId, userId) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            // verify username and password
            $http({
                method: 'POST',
                url: ServerUrl + "/services/api/replies.json",
                data: "content=" + content + "&userId=" + userId + "&postBarId=" + postBarId,
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
        function listReplies(postBarId){
            return $http.get(ServerUrl+"/services/api/replies/postbar/"+postBarId+".json")
        }
        function savePostBar(title,content, subjectId, userId,viewUsers,viewGroups,replyUsers,replyGroups,postBarId) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            // verify username and password
            $http({
                method: 'POST',
                url: ServerUrl + "/services/api/postbars.json",
                data: "title=" + title + "&content=" + content + "&userId=" + userId + "&postBarId=" + postBarId+
                "&subjectId="+subjectId+"&viewUsers="+viewUsers+"&viewGroups="+viewGroups+"&replyUsers="+replyUsers+
                "&replyGroups="+replyGroups,
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
    })