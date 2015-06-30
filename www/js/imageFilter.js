/**
 * Created by sunlaihui on 6/30/15.
 */

angular.module('Holu.imageFilter',[])
    .filter('image',function(){
        return function(input,scope){
            content=input;
            var newContent=content.replace(new RegExp("(<img.*?(?: |\t|\r|\n)?src=['\"]?)(.+?)(['\"]?(?:(?: |\t|\r|\n)+.*?)?>)", 'gi'), function ($0, $1, $2, $3) {
                return $1 + scope.ServerUrl + $2 + $3;
            });
            return newContent;
        };
    })
    .filter('imagePath',function(input,scope){
        return scope.ServerUrl+input;
    })