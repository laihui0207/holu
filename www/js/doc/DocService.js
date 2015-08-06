/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .factory('Documentations',function($http,ENV){
        return ({
            all: listDoc,
            download: downloadDoc
        })
        function listDoc(){
            return $http.get(ENV.ServerUrl+"/services/api/Documentations.json")
        }
        function downloadDoc(){
            return
        }
    })