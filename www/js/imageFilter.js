/**
 * Created by sunlaihui on 6/30/15.
 */

angular.module('Holu.imageFilter', [])
    .filter('image', function () {
        return function (input, scope) {
            //console.log(input)
            if(input==undefined) return
            console.log("imageFilter: input=="+input)
            var newContent = input.replace(
                new RegExp("(<img.*?(?: |\t|\r|\n)?src=['\"]?)(.+?)(['\"]?(?:(?: |\t|\r|\n)+.*?)?>)", 'gi'),
                function ($0, $1, $2, $3) {
                    console.log("ImageFilter: $0=="+$0)
                    var url=$2;
                    if(url.substring(0,4) != "http"){
                        if(url.indexOf("/attached")>0){
                            url=url.substring(url.indexOf("/attached"))
                        }
                        return $1 + scope.ServerUrl + url + $3;
                    }
                    else {
                        return $0;
                    }

                });
            //console.log(newContent);
            return newContent;
        };
    })
    .filter('imagePath', function () {
        return function (input, scope) {
            return scope.ServerUrl + input;
        }
    })