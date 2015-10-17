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
            ProgressDetail: getProgressDetailData,
            searchByDate: getSummaryBetweenDate,
            searchFactoryItemByDate: getFactoryItemBetweenDate
        }
        function getSummaryData(userId,sumDate,itemStyle,status){
            var queryString=ENV.ServerUrl+"/services/api/Summary/"+userId+".json";
            if(sumDate!=undefined){
                queryString+="?sumDate="+sumDate;
            }
            return $http.get(queryString);
        }
        function getSummaryDetailData(userId,sumDate,itemStyle,status){
            var queryString=ENV.ServerUrl+"/services/api/Summary/"+userId+"/item.json";
            if(sumDate!=undefined){
                queryString+="?sumDate="+sumDate;
            }
            return $http.get(queryString);
        }
        function getDetailData(userId,itemID,sumDate){
            var queryString=ENV.ServerUrl+"/services/api/Summary/"+userId+"/Detail/"+itemID+".json";
            if(sumDate!=undefined){
                queryString+="?sumDate="+sumDate;
            }
            return $http.get(queryString);
        }
        function getProgressData(userId,itemStyle){
            return $http.get(ENV.ServerUrl+"/services/api/Summary/"+userId+"/"+itemStyle+"/progress.json");
        }
        function getProgressDetailData(userId,itemStyle,itemId){
            return $http.get(ENV.ServerUrl+"/services/api/Summary/"+userId+"/"+itemStyle+"/progress/"+itemId+".json");
        }
        function getSummaryBetweenDate(userId,start,end,itemStyle){
            return $http.get(ENV.ServerUrl+"/services/api/Summary/"+userId+"/search.json?start="+start+"&end="+end+"&itemStyle="+itemStyle);
        }
        function getFactoryItemBetweenDate(userId,start,end,itemStyle,itemID){
            return $http.get(ENV.ServerUrl+"/services/api/Summary/"+userId+"/searchDetail/"+itemID+".json?start="+start+"&end="+end+"&itemStyle="+itemStyle);
        }
    })