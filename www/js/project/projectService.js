/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .factory('Projects',function($http,$q,ENV,$rootScope){
        var ProjectsData={};
        var pageSize=5;

        var componentsData={};

        return ({
            projects: listMyProjects,
            moreProject: loadMoreProject,
            canMoreProject: isProjectHasNextPage,
            projectData: getProjectData,
            viewProject: getProject,
            //===========================
            components: listComponentsOfProject,
            moreComponent: loadMoreComponent,
            canMoreComponent: isComponentHasNextPage,
            componentData: getComponentData,
            subComponents: listSubComponents,
            viewComponent: getComponent,
            viewSubComponent: getSubComponent,
            //====================================
            processList: listProcessListOfComponents,
            componentStyles: listComponentStyleOfCompanyAndStyle,
            confirm: confirmProcess
        })
        function getProject(id){
            return $http.get(ENV.ServerUrl+"/services/api/projects/"+id+".json")
        }
        function listMyProjects(userId,parentID){
            var currentPage=0;
            var hasNextPage=true;
            var serviceURL=ENV.ServerUrl+"/services/api/projects/user/"+userId+".json?page="+currentPage+"&pageSize="+pageSize;
            if(parentID!=undefined){
                serviceURL+="&parentID="+parentID;
            }
            $http.get(serviceURL).then(function(response){
                if(response.data.length < pageSize){
                    hasNextPage=false;
                }
                ProjectsData={
                    hasNextPage: hasNextPage,
                    pageIndex: currentPage,
                    data: response.data,
                    userId: userId
                }
                if(parentID!=undefined){
                    ProjectsData.parentId=parentID;
                }
                $rootScope.$broadcast("ProjectRefreshed");
            })
        }
        function loadMoreProject(){
            console.log("load more")
            var currentPage=ProjectsData.pageIndex;
            currentPage++;
            var hasNextPage=true;
            var currentData=ProjectsData.data;
            var userId=ProjectsData.userId;
            var parentID=ProjectsData.parentId;
            var serviceURL=ENV.ServerUrl+"/services/api/projects/user/"+userId+".json?page="+currentPage+"&pageSize="+pageSize;
            if(parentID!=undefined){
                serviceURL+="&parentID="+parentID;
            }
            $http.get(serviceURL).then(function(response){
                if(response.data.length < pageSize){
                    hasNextPage=false;
                }
                currentData=currentData.concat(response.data);
                ProjectsData={
                    hasNextPage: hasNextPage,
                    pageIndex: currentPage,
                    data: currentData,
                    userId: userId
                }
                if(parentID!=undefined){
                    ProjectsData.parentId=parentID;
                }
                $rootScope.$broadcast("ProjectRefreshed");
            })
        }
        function isProjectHasNextPage(){
            return ProjectsData.hasNextPage;
        }
        function getProjectData(){
            if(ProjectsData.data==undefined){
                return ;
            }
            return ProjectsData.data;
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
            var currentPage=0;
            var hasNextPage=true;
            $http.get(ENV.ServerUrl+"/services/api/components/project/"+projectId+"/u/"+userID+".json?page="+currentPage+"&pageSize="+pageSize)
                .then(function(response){
                    if(response.data.length < pageSize){
                        hasNextPage=false;
                    }
                    componentsData={
                        hasNextPage: hasNextPage,
                        pageIndex: currentPage,
                        data: response.data,
                        userId: userID,
                        projectId: projectId
                    }
                    $rootScope.$broadcast("ComponentRefreshed");
                })
        }
        function loadMoreComponent(){
            var currentPage=componentsData.pageIndex;
            currentPage++;
            var currentData=componentsData.data;
            var userID=componentsData.userId;
            var projectId=componentsData.projectId;
            var hasNextPage=true;

            $http.get(ENV.ServerUrl+"/services/api/components/project/"+projectId+"/u/"+userID+".json?page="+currentPage+"&pageSize="+pageSize)
                .then(function(response){
                    if(response.data.length < pageSize){
                        hasNextPage=false;
                    }
                    currentData=currentData.concat(response.data);
                    componentsData={
                        hasNextPage: hasNextPage,
                        pageIndex: currentPage,
                        data: currentData,
                        userId: userID,
                        projectId: projectId
                    }
                    $rootScope.$broadcast("ComponentRefreshed");
                })

        }
        function isComponentHasNextPage(){
            return componentsData.hasNextPage;
        }
        function getComponentData(){
            if(componentsData.data==undefined){
                return
            }
            return componentsData.data;
        }
        function listProcessListOfComponents(styleID,companyId,userId,componentID){
            return $http.get(ENV.ServerUrl+"/services/api/componentStyles/processList/"+companyId+"/"+styleID+"/"+userId+"/"+componentID+".json")
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