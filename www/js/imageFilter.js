/**
 * Created by sunlaihui on 6/30/15.
 */

angular.module('Holu.imageFilter', [])
    .filter('image', function () {
        return function (input, scope) {
            console.log(input)
            if(input==undefined) return
            var newContent = input.replace(
                new RegExp("(<img.*?(?: |\t|\r|\n)?src=['\"]?)(.+?)(['\"]?(?:(?: |\t|\r|\n)+.*?)?>)", 'gi'),
                function ($0, $1, $2, $3) {
                    return $1 + scope.ServerUrl + $2 + $3;
                });
            console.log(newContent);
            return newContent;
        };
    })
    .filter('imagePath', function () {
        return function (input, scope) {
            return scope.ServerUrl + input;
        }
    })