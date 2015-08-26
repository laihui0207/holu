/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .factory('Documentations',function($http,ENV,$rootScope){
        var datas={};
        var pageSize=10;
        var docType="all";
        return ({
            fleshDoc: listDoc,
            docList: getData,
            more: loadMore,
            hasMore: canLoadMore,
            setCurrentDocType: setDocType,
            download: downloadDoc,
            docTypes: listDocType
        })
        function listDoc(){
            var hasNextPage=true;
            var currentPage=0;
            $http.get(ENV.ServerUrl+"/services/api/Documentations.json?pageSize="+pageSize+"&page="+currentPage+"&type="+docType)
                .then(function(response){
                    if(response.data.length<pageSize){
                        hasNextPage=false;
                    }

                    datas[docType] = {
                        hasNextPage: hasNextPage,
                        pageIndex: currentPage,
                        data: response.data
                    }
                    $rootScope.$broadcast("Doc.updated");
                })
        }
        function loadMore(){
            var hasNextPage=true;
            var currentPage=datas[docType].pageIndex;
            currentPage++;
            var currentData=datas[docType].data;
            $http.get(ENV.ServerUrl+"/services/api/Documentations.json?pageSize="+pageSize+"&page="+currentPage+"&type="+docType)
                .then(function(response){
                    if(response.data.length<pageSize){
                        hasNextPage=false;
                    }
                    currentData=currentData.concat(response.data);
                    datas[docType] = {
                        hasNextPage: hasNextPage,
                        pageIndex: currentPage,
                        data: currentData
                    }
                    $rootScope.$broadcast("Doc.updated");
                })
        }
        function canLoadMore(){
            if(datas[docType]==undefined){
                return false;
            }
            return datas[docType].hasNextPage;
        }
        function getData(){
            if(datas[docType]==undefined){
                return;
            }
            return datas[docType].data;
        }
        function setDocType(type){
            docType=type;
            listDoc();
        }
        function downloadDoc(){
            return
        }
        function listDocType(){
            return  $http.get(ENV.ServerUrl+"/services/api/doctypes.json")
        }
    })