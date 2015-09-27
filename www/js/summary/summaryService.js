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
            return $http.get(ENV.ServerUrl+"/services/api/Summary/"+userId+".json?itemStyle="+itemStyle+"&startorend="+status+"&sumdate="+sumDate);
        }
        function getSummaryDetailData(userId,sumDate,itemStyle,status){
            return $http.get(ENV.ServerUrl+"/services/api/Summary/"+userId+"/item.json?itemStyle="+itemStyle+"&startorend="+status+"&sumdate="+sumDate);
        }
        function getDetailData(userId,itemID,sumDate,itemStyle,status){
            return $http.get(ENV.ServerUrl+"/services/api/Summary/"+userId+"/Detail/"+itemID+".json?itemStyle="+itemStyle+"&startorend="+status+"&sumdate="+sumDate);
        }
        function getProgressData(userId,itemStyle){
            return $http.get(ENV.ServerUrl+"/services/api/Summary/"+userId+"/"+itemStyle+"/progress.json");
        }
        function getProgressDetailData(userId,itemStyle,itemId){
            return $http.get(ENV.ServerUrl+"/services/api/Summary/"+userId+"/"+itemStyle+"/progress/"+itemId+".json");
        }
    })