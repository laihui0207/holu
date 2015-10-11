/**
 * Created by sunlaihui on 9/20/15.
 */
angular.module('Holu')
    .factory('Summary', function ($http, $q, ENV, $rootScope) {
        return {
            Summary: getSummaryData,
            SummaryDetail: getSummaryDetailData,
            Detail: getDetailData,
            Progress: getProgressData,
            ProgressDetail: getProgressDetailData
        }
        function getSummaryData(userId,sumDate,itemStyle,status){
            return $http.get(ENV.ServerUrl+"/services/api/Summary/"+userId+".json");
        }
        function getSummaryDetailData(userId,sumDate,itemStyle,status){
            return $http.get(ENV.ServerUrl+"/services/api/Summary/"+userId+"/item.json");
        }
        function getDetailData(userId,itemID){
            return $http.get(ENV.ServerUrl+"/services/api/Summary/"+userId+"/Detail/"+itemID+".json");
        }
        function getProgressData(userId,itemStyle){
            return $http.get(ENV.ServerUrl+"/services/api/Summary/"+userId+"/"+itemStyle+"/progress.json");
        }
        function getProgressDetailData(userId,itemStyle,itemId){
            return $http.get(ENV.ServerUrl+"/services/api/Summary/"+userId+"/"+itemStyle+"/progress/"+itemId+".json");
        }
    })