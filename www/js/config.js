/**
 * Created by sunlaihui on 8/2/15.
 */
angular.module("Holu.config", [])
    .constant("ENV", {
        "accessToken": '',
         ServerUrl: "http://220.178.1.10:8089/holusystem",
/*        ServerUrl: "http://localhost:8087/holusystem",*/
/*        ServerUrl: "http://192.168.199.163:8087/holusystem",*/
/*        ServerUrl: "http://10.140.200.66:8087/holusystem",*/
        "debug": false,
        'version':'1.0.0-beta'
    })
;
