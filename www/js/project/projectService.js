/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .factory('Projects',function($http,$q,ENV){
        return ({
            projects: listMyProjects,
            subProjects: listSubProject,
            viewProject: getProject,
            components: listComponentsOfProject,
            processList: listProcessListOfComponents,
            componentStyles: listComponentStyleOfCompanyAndStyle
        })
        function getProject(id){
            return $http.get(ENV.ServerUrl+"/services/api/projects/"+id+".json")
        }
        function listMyProjects(userId){
            return $http.get(ENV.ServerUrl+"/services/api/projects/user/"+userId+".json");
        }
        function listSubProject(userID,parentID){
            return $http.get(ENV.ServerUrl+"/services/api/projects/user/"+userID+"/"+parentID+".json");
        }
        function listComponentsOfProject(projectId){
            return $http.get(ENV.ServerUrl+"/services/api/components/project/"+projectId+".json");
        }
        function listProcessListOfComponents(styleName,companyId,userId){
            return $http.get(ENV.ServerUrl+"/services/api/componentStyles/company/"+companyId+"/style/"+styleName+"/user/"+userId+".json")
        }
        function listComponentStyleOfCompanyAndStyle(){

        }
    })