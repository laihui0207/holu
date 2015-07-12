/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .factory('Projects',function($http,$q,ServerUrl){
        return ({
            projects: listMyProjects,
            components: listComponentsOfProject,
            processList: listProcessListOfComponents,
            componentStyles: listComponentStyleOfCompanyAndStyle
        })

        function listMyProjects(userId){
            return $http.get(ServerUrl+"/services/api/projects/user/"+userId+".json");
        }
        function listComponentsOfProject(projectId){
            return $http.get(ServerUrl+"/services/api/components/project/"+projectId+".json");
        }
        function listProcessListOfComponents(styleName,companyId){
            return $http.get(ServerUrl+"/services/api/company/"+companyId+"/style/"+styleName+".json")
        }
        function listComponentStyleOfCompanyAndStyle(){

        }
    })