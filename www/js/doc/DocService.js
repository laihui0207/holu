/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
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