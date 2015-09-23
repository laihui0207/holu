/**
 * Created by sunlaihui on 6/30/15.
 */

angular.module('Holu.imageFilter', [])
    .filter('image', function () {
        return function (input, scope) {
            //console.log(input)
            if(input==undefined) return
            if(input.indexOf("<img") < 0) return input;
            var newContent = input.replace(
                new RegExp("(<img.*?(?: |\t|\r|\n)?src=['\"]?)(.+?)(['\"]?(?:(?: |\t|\r|\n)+.*?)?>)", 'gi'),
                function ($0, $1, $2, $3) {
                    var url=$2;
                    if(url.substring(0,4) != "http"){
                        if(url.indexOf("/attached")>0){
                            url=url.substring(url.indexOf("/attached"))
                        }
                        var newContent=$1 + scope.ServerUrl + url +"\" ng-click=\"showImage('"+scope.ServerUrl+url+"')" + $3;
                        return newContent;
                    }
                    else {
                        var newContent=$1 +url +"\" ng-click=\"showImage('"+url+"')" + $3;
                        return newContent;
                    }

                });
            return newContent;
        };
    })
    .filter('imagePath', function () {
        return function (input,scope) {
            return scope.ServerUrl + input;
/*            return "http://220.178.1.10:8089/holusystem"+ input;*/
        }
    })