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
            processList: listProcessListOfComponents,
            componentStyles: listComponentStyleOfCompanyAndStyle
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
            return $http.get(ENV.ServerUrl+"/services/api/subComponents/"+componentID+"/"+userID+".json");
        }
        function getComponent(componentID,userID){
            return $http.get(ENV.ServerUrl+"/services/api/components/"+componentID+"/"+userID+".json");
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
    })