/**
 * Created by sunlaihui on 7/11/15.
 */
angular.module('Holu')
    .factory('Projects',function($http,$q,ENV,$rootScope){
        var ProjectsData={};
        var pageSize=50;
        var currentProject="";
        var currentComponent="";
        var currentSubComponent="";
        var componentsData={};
        var subComponentData={};
        var urgentTasks={};
        var urgentTaskIndex=0;
        var urgentTaskType="doing"
        var taskType="doing";
        var taskData={};
        var taskIndex=0;
        var taskMission={};
        return ({
            componentStyle: getComponentStyle,
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
            batchConfirm: batchConfirmProcess,
            //////////========================
            urgentTaskProject: getUrgentTaskProject,
            urgentTaskSubComponents: getUrgentTaskSubComponents,
            urgentTaskMission: getUrgentTaskMission,
            urgentTask: getUrgentTask,
            moreUrgentTask: loadMoreUrgentTask,
            canMoreUrgentTask: isUrgentTaskNextPage,
            urgentTaskData: getUrgentData,
            urgentTaskCount: getUrgentTaskCount,
/*            setUrgentTaskType: setUrgentType,*/
            ////////task==============
            myTaskProjects: getMyTaskProject,
            myStyleListOfProject: getTaskStyleListByProject,
            myTaskMissions: getMyMissions,
            moreTaskMission: getMoreTaskMission,
            canMoreTaskMission: isHaveMoreTaskMission,
            taskMissionData: getTaskMissionData,
            myTasks: getMyTask,
            moreTask:loadMoreTask,
            canLoadMoreTask: isCanLoadMoreTask,
            taskData: getTaskData,
            myTaskCount: getMyTaskCount
/*            setTaskType: setTaskType*/
        })

        function getComponentStyle(componentProcessID){
            return $http.get(ENV.ServerUrl+"/services/api/componentStyles/"+componentProcessID+".json");
        }
        function getUrgentTaskProject(userID,taskType){
            return $http.get(ENV.ServerUrl+"/services/api/tasks/projects/"+userID+".json?type="+taskType);
        }
        function getUrgentTaskSubComponents(userID,projectId,taskType){
            return $http.get(ENV.ServerUrl+"/services/api/tasks/sub/"+projectId+"/"+userID+".json?type="+taskType);
        }
        function getUrgentTaskMission(userID,subID,taskType){
            return $http.get(ENV.ServerUrl+"/services/api/tasks/"+userID+"/"+subID+".json?type="+taskType);
        }
        function getUrgentTaskCount(userID){
            $http.get(ENV.ServerUrl+"/services/api/tasks/"+userID+".json?type=doing").then(function(response){
                $rootScope.urgentTaskCount=response.data.length;
            })
        }
        function getMyTaskCount(userID){
            $http.get(ENV.ServerUrl+"/services/api/processMid/missions/"+userID+"/count.json").then(function(response){
                $rootScope.taskCount=response.data;
            })
        }
        function getUrgentTask(userId,taskType){
            urgentTaskType=taskType;
            var serviceURL=ENV.ServerUrl+"/services/api/tasks/subComponents/"+userId+".json";
            urgentTasks[urgentTaskType]={
                subComponentList:[],
                userId:userId,
            };
            urgentTaskIndex=0;
            $http.get(serviceURL).then(function(response){
                urgentTasks[urgentTaskType]={
                    subComponentList:response.data,
                    userId:userId,
                }
                loadUrgentTask(userId);
            });
        }
        function loadUrgentTask(userId){
            var subComponentList=urgentTasks[urgentTaskType].subComponentList
            var subComponentID=subComponentList[urgentTaskIndex];
            if(subComponentID==undefined) {
                $rootScope.$broadcast("UrgentTaskRefreshed");
                return;
            }
            urgentTaskIndex++;
            var serviceURL = ENV.ServerUrl + "/services/api/tasks/" + userId + "/"+subComponentID+".json?type="+urgentTaskType;
            $http.get(serviceURL).then(function (response) {
                urgentTasks[urgentTaskType] = {
                    data: response.data,
                    userId: userId,
                    subComponentList: subComponentList
                }
                $rootScope.$broadcast("UrgentTaskRefreshed");
            });
        }
        function loadMoreUrgentTask() {
            var subComponentList=urgentTasks[urgentTaskType].subComponentList
            var subComponentID=subComponentList[urgentTaskIndex];
            var userId=urgentTasks[urgentTaskType].userId;
            urgentTaskIndex++;
            var serviceURL = ENV.ServerUrl + "/services/api/tasks/" + userId + "/"+subComponentID+".json?type="+urgentTaskType+"&noneedloading=true";
            $http.get(serviceURL).then(function (response) {
                var currentData = urgentTasks[urgentTaskType].data;
                currentData = currentData.concat(response.data)
                urgentTasks[urgentTaskType] = {
                    data: currentData,
                    userId: userId,
                    subComponentList: subComponentList
                }
                $rootScope.$broadcast("UrgentTaskRefreshed");
            });
        }
        function isUrgentTaskNextPage(){
            if(urgentTasks[urgentTaskType]==undefined) return false;
            return urgentTasks[urgentTaskType].subComponentList.length >0 && urgentTaskIndex < urgentTasks[urgentTaskType].subComponentList.length ;
        }
        function getUrgentData(){
            if(urgentTasks[urgentTaskType].data==undefined){
                return ;
            }
            return urgentTasks[urgentTaskType].data;
        }
        function getMyTaskProject(userId,type){
            return $http.get(ENV.ServerUrl+"/services/api/processMid/projects/"+userId+".json?type="+type);
        }
        function getTaskStyleListByProject(userId,projectID,type){
            return $http.get(ENV.ServerUrl+"/services/api/processMid/styles/"+projectID+"/"+userId+".json?type="+type);
        }
        function getMyMissions(userId,projectID,styleID,type,isManager){
            var hasNextPage=true;
            var currentPage=0;
            taskMission={
                projectID: projectID,
                styleID: styleID,
                type: type,
                userID: userId
            };
            console.log(taskMission);
            $http.get(ENV.ServerUrl+"/services/api/processMid/missions/"+projectID+"/"+styleID+"/"
                +userId+".json?type="+type+"&pageSize="+pageSize+"&page="+currentPage)
                .then(function(response){
                    console.log(response.data);
                    if(!isManager || response.data.length == 0 || response.data[0].subComponentList.length < pageSize ){
                        hasNextPage=false;
                    }
                    taskMission={
                        hasNextPage: hasNextPage,
                        pageIndex: currentPage,
                        data:response.data,
                        projectID: projectID,
                        styleID: styleID,
                        type: type,
                        userID: userId
                    }
                    $rootScope.$broadcast("TaskMission.updated");
                });
        }
        function getMoreTaskMission(){
            var currentPage=taskMission.pageIndex;
            var hasNextPage=true;
            currentPage++;
            var currentData=taskMission.data;
            var projectID=taskMission.projectID;
            var styleID=taskMission.styleID;
            var userId=taskMission.userID;
            var type=taskMission.type;

            $http.get(ENV.ServerUrl+"/services/api/processMid/missions/"+projectID+"/"+styleID+"/"
                    +userId+".json?type="+type+"&pageSize="+pageSize+"&page="+currentPage)
                .then(function(response){
                    if(response.data.length == 0 || response.data[0].subComponentList.length < pageSize){
                        hasNextPage=false;
                    }
                    currentData=currentData.concat(response.data)
                    taskMission={
                        hasNextPage: hasNextPage,
                        pageIndex: currentPage,
                        data:currentData,
                        projectID: projectID,
                        styleID: styleID,
                        type: type,
                        userID: userId
                    }
                    $rootScope.$broadcast("TaskMission.updated");
                });
        }
        function isHaveMoreTaskMission(){
            if(taskMission==undefined) return false;
            return  taskMission.hasNextPage;
        }
        function getTaskMissionData(){
            if(taskMission===undefined) return;
            return taskMission.data;
        }
        function getMyTask(userId,type,isAdmin){
            taskType=type;
            taskData[taskType]={
                components: [],
                isAdmin: isAdmin
            };
            taskIndex=0;
            var url=ENV.ServerUrl+"/services/api/projects/all/"+userId+".json";
            if(isAdmin){
                url=ENV.ServerUrl+"/services/api/components/"+userId+".json";
            }
            $http.get(url)
                .then(function(response){
                    taskData[taskType]={
                        components: response.data,
                        isAdmin: isAdmin
                    }
                    loadTask(userId);
                });
        }
        function loadTask(userId){
            var components=taskData[taskType].components;
            var isAdmin=taskData[taskType].isAdmin;
            var componentId=components[taskIndex];
            if(componentId==undefined){
                $rootScope.$broadcast("TaskListUpdated");
                return;
            }
            //if user is not admin the component id is project ID
            var url=ENV.ServerUrl+"/services/api/componentStyles/task/"+userId+"/"+componentId+".json?type="+taskType;
            if (isAdmin){
                url=ENV.ServerUrl+"/services/api/componentStyles/task/"+userId+".json?type="+taskType+"&cplist="+componentId;
            }
            taskIndex++;
            $http.get(url).then(function(response){
                taskData[taskType]={
                    components: components,
                    isAdmin: isAdmin,
                    data: response.data
                };
                if(taskData[taskType].data.length==0 && isCanLoadMoreTask()){
                    loadMoreTask(userId);
                }
                else {
                    $rootScope.$broadcast("TaskListUpdated");
                }
            })
        }
        function loadMoreTask(userId){
            var components=taskData[taskType].components;
            var isAdmin=taskData[taskType].isAdmin;
            var componentId=components[taskIndex];
            var url=ENV.ServerUrl+"/services/api/componentStyles/task/"+userId+"/"+componentId+".json?type="+taskType+"&noneedloading=true";
            if (isAdmin){
                url=ENV.ServerUrl+"/services/api/componentStyles/task/"+userId+".json?type="+taskType+"&cplist="+componentId+"&noneedloading=true";
            }
            taskIndex++;
            $http.get(url).then(function(response){
                var data=taskData[taskType].data;
                data=data.concat(response.data);
                taskData[taskType]={
                    components: components,
                    isAdmin: isAdmin,
                    data: data
                }
                if(taskData[taskType].data.length==0 && isCanLoadMoreTask()){
                    loadMoreTask(userId);
                }
                else {
                    $rootScope.$broadcast("TaskListUpdated");
                }
            })
        }
        function isCanLoadMoreTask(){
            if(taskData[taskType]==undefined) return false;
            return taskData[taskType].components.length>0 && taskIndex < taskData[taskType].components.length
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
        function batchConfirmProcess(data,processMid,type,userID){
            var deferred = $q.defer();
            var promise = deferred.promise;
            var confirmUrl=ENV.ServerUrl + "/services/api/processMid/BatchStartConfirm.json";
            $http({
                method: 'POST',
                url: confirmUrl,
                data: "Data="+data+"&type="+type
                + "&userID=" + userID +"&positionGPS="+processMid.positionGPS+"&positionName="+processMid.positionName,
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