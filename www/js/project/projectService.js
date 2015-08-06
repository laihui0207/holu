/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .factory('Projects',function($http,$q,ENV){
        return ({
            projects: listMyProjects,
            viewProject: getProject,
            components: listComponentsOfProject,
            subComponents: listSubComponents,
            viewComponent: getComponent,
            viewSubComponent: getSubComponent,
            processList: listProcessListOfComponents,
            componentStyles: listComponentStyleOfCompanyAndStyle,
            confirm: confirmProcess
        })
        function getProject(id){
            return $http.get(ENV.ServerUrl+"/services/api/projects/"+id+".json")
        }
        function listMyProjects(userId,parentID){
            var serivceURL=ENV.ServerUrl+"/services/api/projects/user/"+userId+".json";
            if(parentID!=undefined){
                serivceURL+="?parentID="+parentID;
            }
            return $http.get(serivceURL);
        }
        function listSubComponents(componentID,userID){
            return $http.get(ENV.ServerUrl+"/services/api/subComponents/list/"+componentID+"/"+userID+".json");
        }
        function getComponent(componentID,userID){
            return $http.get(ENV.ServerUrl+"/services/api/components/"+componentID+"/"+userID+".json");
        }
        function getSubComponent(componentID,userID){
            return $http.get(ENV.ServerUrl+"/services/api/subComponents/"+componentID+"/"+userID+".json");
        }
        function listComponentsOfProject(projectId,userID){
            return $http.get(ENV.ServerUrl+"/services/api/components/project/"+projectId+"/u/"+userID+".json");
        }
        function listProcessListOfComponents(styleID,companyId,userId){
            return $http.get(ENV.ServerUrl+"/services/api/componentStyles/processList/"+companyId+"/"+styleID+"/"+userId+".json")
        }
        function listComponentStyleOfCompanyAndStyle(companyID,styleID,userID){
            return $http.get(ENV.ServerUrl+"/services/api/componentStyles/processList/"+companyID+"/"+styleID+"/"+userID+".json")
        }
        function confirmProcess(processMid,userID){
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http({
                method: 'POST',
                url: ENV.ServerUrl + "/services/api/processMid/confirm.json",
                data: "subComponentID=" + processMid.subComponentID + "&styleProcessID=" + processMid.styleProcessID
                + "&userID=" + userID + "&processNote=" + processMid.processNote+"&startDate="+processMid.startDate
                + "&endDate="+processMid.endDate+"&positionGPS="+processMid.positionGPS,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                console.log("processMid save:" + data)
                if (data == "") {
                    deferred.reject('Failed');
                }
                else {
                    deferred.resolve(data);
                }
            }).error(function (data) {
                deferred.reject('Call Failed');
            })

            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    })