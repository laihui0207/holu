/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .factory('Projects',function($http,$q,ENV,$rootScope){
        var ProjectsData={};
        var pageSize=20;
        var currentProject="";
        var currentComponent="";
        var currentSubComponent="";
        var componentsData={};
        var subComponentData={};
        var urgentTasks={};
        var urgentTaskType="doing"
        var taskType="doing";
        var taskData={};

        return ({

            projects: listMyProjects,
            moreProject: loadMoreProject,
            canMoreProject: isProjectHasNextPage,
            projectData: getProjectData,
            viewProject: getProject,
            //===========================
            components: listComponentsOfProject,
            currentProject: setCurrentProject,
            moreComponent: loadMoreComponent,
            canMoreComponent: isComponentHasNextPage,
            componentData: getComponentData,
            subComponents: listSubComponents,
            moreSubComponent: loadMoreSubComponent,
            canMoreSubComponent: isSubcomponentHasNextPage,
            subComponentData: getSubComponentData,
            viewComponent: getComponent,
            parentComponent: getParentComponent,
            viewSubComponent: getSubComponent,
            //====================================
            processList: listProcessListOfComponents,
            componentStyles: listComponentStyleOfCompanyAndStyle,
            confirm: confirmProcess,
            processMid: getProcessMid,
            //////////========================
            urgentTask: getUrgentTask,
            moreUrgentTask: loadMoreUrgentTask,
            canMoreUrgentTask: isUrgentTaskNextPage,
            urgentTaskData: getUrgentData,
/*            setUrgentTaskType: setUrgentType,*/
            ////////task==============
            //myProjects: getMyProject,
            myTasks: getMyTask,
            moreTask:loadMoreTask,
            canLoadMoreTask: isCanLoadMoreTask,
            taskData: getTaskData
/*            setTaskType: setTaskType*/
        })


        function getUrgentTask(userId,taskType){
            urgentTaskType=taskType;
            var serviceURL=ENV.ServerUrl+"/services/api/tasks/subComponents/"+userId+".json";
            urgentTasks[urgentTaskType]={
                subComponentList:[],
                userId:userId,
                index:0,
                data:[]
            }
            $http.get(serviceURL).then(function(response){
                urgentTasks[urgentTaskType]={
                    subComponentList:response.data,
                    userId:userId,
                    index:0,
                    data:[]
                }
                loadMoreUrgentTask();
/*                $rootScope.$broadcast("UrgentTaskRefreshed");*/
                //$rootScope.$broadcast("UrgentTaskUpdated");
            });
        }
       /* function setUrgentType(userId,taskType){
            urgentTaskType=taskType;
            getUrgentTask(userId,taskType);
        }*/
        function loadMoreUrgentTask() {
            var index=urgentTasks[urgentTaskType].index;
            var subComponentList=urgentTasks[urgentTaskType].subComponentList
            var subComponentID=subComponentList[index].subComponentID;
            var userId=urgentTasks[urgentTaskType].userId;
            var serviceURL = ENV.ServerUrl + "/services/api/tasks/" + userId + "/"+subComponentID+".json?type="+urgentTaskType;
            $http.get(serviceURL).then(function (response) {
                index++;
                var currentData = urgentTasks[urgentTaskType].data;
                currentData = currentData.concat(response.data)
                urgentTasks[urgentTaskType] = {
                    index: index,
                    data: currentData,
                    userId: userId,
                    subComponentList: subComponentList
                }
                $rootScope.$broadcast("UrgentTaskRefreshed");
            });
        }
        function isUrgentTaskNextPage(){
            if(urgentTasks[urgentTaskType]==undefined) return false;
            return urgentTasks[urgentTaskType].index < urgentTasks[urgentTaskType].subComponentList.length ;
        }
        function getUrgentData(){
            if(urgentTasks[urgentTaskType].data==undefined){
                return ;
            }
            return urgentTasks[urgentTaskType].data;
        }
        function getMyProject(userId){
            return $http.get(ENV.ServerUrl+"/services/api/projects/all/"+userId+".json");
        }
        function getMyTask(userId,type){
            taskType=type;
            taskData[taskType]={
                components: [],
                index:0,
                data:[]
            }
            $http.get(ENV.ServerUrl+"/services/api/components/"+userId+".json")
                .then(function(response){
                    taskData[taskType]={
                        components: response.data,
                        index:0,
                        data:[]
                    }
                    loadMoreTask(userId);
                });
        }
        function loadMoreTask(userId){
            var index=taskData[taskType].index;
            var components=taskData[taskType].components;
            var componentId=components[index].componentID;
            $http.get(ENV.ServerUrl+"/services/api/componentStyles/task/"+userId+".json?type="+taskType+"&cplist="+componentId).then(function(response){
                index++;
                var data=taskData[taskType].data;
                data=data.concat(response.data);
                taskData[taskType]={
                    components: components,
                    index: index,
                    data: data
                }
                $rootScope.$broadcast("TaskListUpdated");
            })
        }
        function isCanLoadMoreTask(){
            if(taskData[taskType]==undefined) return false;
            return taskData[taskType].index < taskData[taskType].components.length
        }
        function getTaskData(){
            return taskData[taskType].data;
        }
        function getProject(id){
            return $http.get(ENV.ServerUrl+"/services/api/projects/"+id+".json")
        }
        function getProcessMid(userId,componentID,styleProcessID){
            return $http.get(ENV.ServerUrl+"/services/api/processMid/"+userId+"/"+componentID+"/"+styleProcessID+".json");
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

        function getComponent(componentID,userID){
            return $http.get(ENV.ServerUrl+"/services/api/components/"+componentID+"/"+userID+".json");
        }
        function getParentComponent(componentID,userID){
            return $http.get(ENV.ServerUrl+"/services/api/subComponents/"+componentID+"/"+userID+"/parent.json");
        }
        function getSubComponent(componentID,userID){
            return $http.get(ENV.ServerUrl+"/services/api/subComponents/"+componentID+"/"+userID+".json");
        }
        function listComponentsOfProject(projectId,userID){
            var currentPage=0;
            var hasNextPage=true;
            currentProject=projectId;
            $http.get(ENV.ServerUrl+"/services/api/components/project/"+projectId+"/u/"+userID+".json?page="+currentPage+"&pageSize="+pageSize)
                .then(function(response){
                    if(response.data.length < pageSize){
                        hasNextPage=false;
                    }
                    componentsData[currentProject]={
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
            var currentPage=componentsData[currentProject].pageIndex;
            currentPage++;
            var currentData=componentsData[currentProject].data;
            var userID=componentsData[currentProject].userId;
            var projectId=componentsData[currentProject].projectId;
            var hasNextPage=true;

            $http.get(ENV.ServerUrl+"/services/api/components/project/"+projectId+"/u/"+userID+".json?page="+currentPage+"&pageSize="+pageSize)
                .then(function(response){
                    if(response.data.length < pageSize){
                        hasNextPage=false;
                    }
                    currentData=currentData.concat(response.data);
                    componentsData[currentProject]={
                        hasNextPage: hasNextPage,
                        pageIndex: currentPage,
                        data: currentData,
                        userId: userID,
                        projectId: projectId
                    }
                    $rootScope.$broadcast("ComponentRefreshed");
                })

        }
        function setCurrentProject(projectID){
            currentProject=projectID;
        }
        function isComponentHasNextPage(){
            if(componentsData[currentProject]==undefined){
                return false;
            }

            return componentsData[currentProject].hasNextPage;
        }
        function getComponentData(){
            if(componentsData[currentProject].data==undefined){
                return
            }
            return componentsData[currentProject].data;
        }
        function listSubComponents(componentID,userID){
            var currentPage=0;
            var hasNextPage=true;
            currentComponent=componentID;
            $http.get(ENV.ServerUrl+"/services/api/subComponents/list/"+componentID+"/"+userID+".json?page="+currentPage+"&pageSize="+pageSize)
                .then(function(response){
                    if(response.data.length < pageSize){
                        hasNextPage=false;
                    }

                    subComponentData[currentComponent]={
                        hasNextPage: hasNextPage,
                        pageIndex: currentPage,
                        data: response.data,
                        componentId: componentID,
                        userId: userID
                    }
                    $rootScope.$broadcast("SubComponentRefreshed");
                })
        }
        function loadMoreSubComponent(){
            var currentPage=subComponentData[currentComponent].pageIndex;
            currentPage++;
            var hasNextPage=true;
            var currentData=subComponentData[currentComponent].data;
            var componentID=subComponentData[currentComponent].componentId;
            var userID=subComponentData[currentComponent].userId;
            $http.get(ENV.ServerUrl+"/services/api/subComponents/list/"+componentID+"/"+userID+".json?page="+currentPage+"&pageSize="+pageSize)
                .then(function(response){
                    if(response.data.length < pageSize){
                        hasNextPage=false;
                    }
                    currentData=currentData.concat(response.data)
                    subComponentData[currentComponent]={
                        hasNextPage: hasNextPage,
                        pageIndex: currentPage,
                        data: currentData,
                        componentId: componentID,
                        userId: userID
                    }
                    $rootScope.$broadcast("SubComponentRefreshed");
                })
        }
        function getSubComponentData(){
            return subComponentData[currentComponent].data;
        }

        function isSubcomponentHasNextPage(){
            if(subComponentData[currentComponent]==undefined){
                return false;
            }
            return subComponentData[currentComponent].hasNextPage;
        }
        function listProcessListOfComponents(styleID,companyId,userId,componentID){
            return $http.get(ENV.ServerUrl+"/services/api/componentStyles/processList/"+styleID+"/"+userId+"/"+componentID+".json")
        }
        function listComponentStyleOfCompanyAndStyle(companyID,styleID,userID){
            return $http.get(ENV.ServerUrl+"/services/api/componentStyles/processList/"+companyID+"/"+styleID+"/"+userID+".json")
        }
        function confirmProcess(processMid,type,userID){
            var deferred = $q.defer();
            var promise = deferred.promise;
            var confirmUrl=ENV.ServerUrl + "/services/api/processMid/confirm.json";
            if(type=='start'){
                confirmUrl=ENV.ServerUrl + "/services/api/processMid/startconfirm.json";
            } else if(type == 'end'){
                confirmUrl=ENV.ServerUrl + "/services/api/processMid/endconfirm.json";
            } else if (type == 'note'){
                confirmUrl=ENV.ServerUrl + "/services/api/processMid/confirmquestion.json";
            }
            $http({
                method: 'POST',
                url: confirmUrl,
                data: "subComponentID=" + processMid.subComponentID + "&styleProcessID=" + processMid.styleProcessID
                + "&userID=" + userID + "&processNote=" + processMid.processNote+"&startDate="+processMid.startDate
                + "&endDate="+processMid.endDate+"&positionGPS="+processMid.positionGPS+"&positionName="+processMid.positionName,
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