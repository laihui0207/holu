/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .factory('News', function ($http, ServerUrl) {
        return ({
            all: listNews,
            viewNews: getNews,
            newsTypes: getNewsTypes,
            newsListByType: getNewsListByNewsType
        })
        function listNews() {
            //return news;
            return $http.get(ServerUrl + "/services/api/news.json")
        }

        function getNews(id) {
            return $http.get(ServerUrl + "/services/api/news/" + id + ".json")
        }
        function getNewsTypes(){
            return $http.get(ServerUrl+"/services/api/newstypes.json")
        }
        function getNewsListByNewsType(typeId){
            return $http.get(ServerUrl+"/services/api/news/newstype/"+typeId+".json");
        }
    })