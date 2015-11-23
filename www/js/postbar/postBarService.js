/**
 *
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .factory('PostBars', function ($http, $q, ENV,$rootScope) {
        var subjectData={};
        var currentSubject="";
        var postBarData={};
        var pageSize=20;
        return ({
            postSubjects: listPostSubjects,
            subjectData: getSubjectData,
            moreSubject: loadMoreSubject,
            canMoreSubject: isSubjectHasNextPage,
            //================================
            postBars: listPostBarOfSubject,
            postBarData: getPostBarData,
            morePostBar: loadMorePostBar,
            canMorePostBar: isPostBarHasNextPage,
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
        function listPostSubjects() {
            var currentPage=0;
            var hasNextPage=true;
            $http.get(ENV.ServerUrl + "/services/api/postSubjects.json?page="+currentPage+"&pageSize="+pageSize)
                .then(function(response){
                    if(response.data.length < pageSize){
                        hasNextPage=false;
                    }
                    subjectData={
                        hasNextPage: hasNextPage,
                        pageIndex: currentPage,
                        data: response.data
                    }
                    $rootScope.$broadcast("SubjectRefreshed");
                })
        }
        function loadMoreSubject(){
            var currentPage=subjectData.pageIndex;
            var hasNextPage=true;
            var currentData=subjectData.data;
            $http.get(ENV.ServerUrl + "/services/api/postSubjects.json?page="+currentPage+"&pageSize="+pageSize)
                .then(function(response){
                    if(response.data.length < pageSize){
                        hasNextPage=false;
                    }
                    currentData=currentData.concat(response.data);
                    subjectData={
                        hasNextPage: hasNextPage,
                        pageIndex: currentPage,
                        data: currentData
                    }
                    $rootScope.$broadcast("SubjectRefreshed");
                })

        }
        function getSubjectData(){
            return subjectData.data;
        }
        function isSubjectHasNextPage(){
            return subjectData.hasNextPage;
        }
        function listPostBarViewUsers(postBarId,userID){
            return $http.get(ENV.ServerUrl + "/services/api/postbars/" + postBarId + "/viewUser/slv.json?userID="+userID)
        }
        function listPostBarReplyUsers(postBarId,userID){
            return $http.get(ENV.ServerUrl + "/services/api/postbars/" + postBarId + "/replyUser/slv.json?userID="+userID)
        }
        function listPostBarViewGroups(postBarId,userID){
            return $http.get(ENV.ServerUrl + "/services/api/postbars/" + postBarId + "/viewGroup/slv.json?userID="+userID)
        }
        function listPostBarReplyGroups(postBarId,userID){
            return $http.get(ENV.ServerUrl + "/services/api/postbars/" + postBarId + "/replyGroup/slv.json?userID="+userID)
        }


        function listPostBarOfSubject(subjectId) {
            var currentPage=0;
            var hasNextPage=true;
            currentSubject=subjectId;
            $http.get(ENV.ServerUrl + "/services/api/postbars/subject/" + subjectId + ".json?page="+currentPage+"&pageSize="+pageSize)
                .then(function(response){
                    if(response.data.length < pageSize){
                        hasNextPage=false;
                    }
                    postBarData[currentSubject]={
                        hasNextPage: hasNextPage,
                        pageIndex: currentPage,
                        data: response.data,
                        subjectId: subjectId
                    }
                    $rootScope.$broadcast("PostBarRefreshed");
                })
        }
        function loadMorePostBar(){
            var currentPage=postBarData[currentSubject].pageIndex;
            currentPage++;
            var currentData=postBarData[currentSubject].data;
            var subjectId=postBarData[currentSubject].subjectId;
            var hasNextPage=true;
            $http.get(ENV.ServerUrl + "/services/api/postbars/subject/" + subjectId + ".json?page="+currentPage+"&pageSize="+pageSize)
                .then(function(response){
                    if(response.data.length < pageSize){
                        hasNextPage=false;
                    }
                    currentData=currentData.concat(response.data);
                    postBarData[currentSubject]={
                        hasNextPage: hasNextPage,
                        pageIndex: currentPage,
                        data: currentData,
                        subjectId: subjectId
                    }
                    $rootScope.$broadcast("PostBarRefreshed");
                })

        }
        function getPostBarData(){
            if(postBarData[currentSubject]==undefined){
                return;
            }
            return postBarData[currentSubject].data;
        }
        function isPostBarHasNextPage(){
            if(postBarData[currentSubject]==undefined){
                return false;
            }
            return postBarData[currentSubject].hasNextPage;
        }
        function getPostBarById(postbarId) {
            return $http.get(ENV.ServerUrl + "/services/api/postbars/" + postbarId + ".json")
        }
        function deletePostBar(id){
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get(ENV.ServerUrl + "/services/api/postbars/" + id + "/delete.json").success(function () {
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
                url: ENV.ServerUrl + "/services/api/replies.json",
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
            return $http.get(ENV.ServerUrl+"/services/api/replies/postbar/"+postBarId+".json")
        }
        function savePostBar(title,content, subjectId, userId,viewUsers,viewGroups,replyUsers,replyGroups,postBarId) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            // verify username and password
            $http({
                method: 'POST',
                url: ENV.ServerUrl + "/services/api/postbars.json",
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