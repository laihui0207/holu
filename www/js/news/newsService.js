/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .factory('News', function ($http, ENV,$rootScope) {
        var datas={};
        var importantDatas={};
        var pageSize=10;
        var newsType="all"
        return ({
            lastedNews: listLastNews,
            fleshNews: listNews,
            newsList: getData,
            more: loadMoreNews,
            hasMore: canLoadMore,
            setCurrentNewsType: setNewsType,
            viewNews: getNews,
            newsTypes: getNewsTypes,
            newsListByType: getNewsListByNewsType,
            fleshImportantNews: listImportantNews,
            importantNewsList: getImportantData,
            moreImportant: loadMoreImportantNews,
            hasMoreImportant: canLoadMoreImportant,
        })
        function listLastNews(){
           return $http.get(ENV.ServerUrl + "/services/api/news.json?pageSize=3&page=0&type=all");
        }
        function listNews() {
            //return news;
            var hasNextPage=true;
            var currentPage=0;
            $http.get(ENV.ServerUrl + "/services/api/news.json?pageSize="+pageSize+"&page="+currentPage+"&type="+newsType).then(function(response){
                if(response.data.length<pageSize){
                    hasNextPage=false;
                }

                datas[newsType] = {
                    hasNextPage: hasNextPage,
                    pageIndex: currentPage,
                    data: response.data
                }
                $rootScope.$broadcast("News.updated");
            })
        }
        function loadMoreNews(){
            var currentPage=datas[newsType].pageIndex;
            var hasNextPage=true;
            currentPage++;
            var currentData=datas[newsType].data;
            $http.get(ENV.ServerUrl + "/services/api/news.json?pageSize="+pageSize+"&&page="+currentPage+"&type="+newsType).then(function(response){
                if(response.data.length<pageSize){
                    hasNextPage=false;
                }
                currentData=currentData.concat(response.data);
                datas[newsType] = {
                    hasNextPage: hasNextPage,
                    pageIndex: currentPage,
                    data: currentData
                }
                $rootScope.$broadcast("News.updated");
            })
        }
        function setNewsType(type){
            newsType=type;
            listNews();
        }
        function getData(){
            if(datas[newsType]==undefined){
                return;
            }
            return datas[newsType].data;
        }
        function canLoadMore(){
            if(datas[newsType]==undefined){
                return false;
            }
            return datas[newsType].hasNextPage;
        }
        function getNews(id) {
            return $http.get(ENV.ServerUrl + "/services/api/news/" + id + ".json")
        }
        function getNewsTypes(){
            return $http.get(ENV.ServerUrl+"/services/api/newstypes.json")
        }
        function getNewsListByNewsType(typeId){
            return $http.get(ENV.ServerUrl+"/services/api/news/newstype/"+typeId+".json");
        }
        function listImportantNews() {
            //return news;
            var hasNextPage=true;
            var currentPage=0;
            $http.get(ENV.ServerUrl + "/services/api/news/important.json?pageSize="+pageSize+"&page="+currentPage).then(function(response){
                if(response.data.length<pageSize){
                    hasNextPage=false;
                }

                importantDatas = {
                    hasNextPage: hasNextPage,
                    pageIndex: currentPage,
                    data: response.data
                }
                $rootScope.$broadcast("ImportantNews.updated");
            })
        }
        function loadMoreImportantNews(){
            var currentPage=importantDatas.pageIndex;
            var hasNextPage=true;
            currentPage++;
            var currentData=importantDatas.data;
            $http.get(ENV.ServerUrl + "/services/api/news/important.json?pageSize="+pageSize+"&&page="+currentPage).then(function(response){
                if(response.data.length<pageSize){
                    hasNextPage=false;
                }
                currentData=currentData.concat(response.data);
                importantDatas = {
                    hasNextPage: hasNextPage,
                    pageIndex: currentPage,
                    data: currentData
                }
                $rootScope.$broadcast("ImportantNews.updated");
            })
        }
        function getImportantData(){
            if(importantDatas==undefined){
                return;
            }
            return importantDatas.data;
        }
        function canLoadMoreImportant(){
            if(importantDatas==undefined){
                return false;
            }
            return importantDatas.hasNextPage;
        }
    })