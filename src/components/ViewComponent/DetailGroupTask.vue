<template>
    <div id="detail-group-task">
        <SortTable 
            :isHaveHeader="true"
            :lstColumnTask="templateGroupTask.listProcess"
            :isAddTaskOnColumn="true"
            ref="sorttable"
            :groupTaskInfo="groupTaskInfo"
            :isAddProcess="isCanManageTaskInGroup"
            :isUpdateSortableOnServer="true"
            @showDetailTask="showDetailTask"
            @updateDroppedTask="updateDroppedTask"
            @updateDroppedProcess="updateDroppedProcess"
            @addNewTaskInProcess="addNewTaskInProcess"
            @addNewProcess="addNewProcess"
            v-if="isDoneLoadData && !isRefreshSortable"
        />
        <div
            :class="['filter-bar']"
        >
            <div class="d-flex center-items filter-item reload-task">
                <div class="file-icon white-refresh-icon c-poiter" @click="loadAllData">
                </div>
                <div class="num-of-notification" v-if="numberOfNewUpdate">{{numberOfNewUpdate}}</div>
            </div>
            <div class="d-flex center-items filter-item reload">
                <div class="file-icon normal-white-filter-icon c-poiter">
                </div>
            </div>
            <div class="list-user-joined">
                <div 
                    :class="['user-joined', 'd-flex', 'center-items', 'c-poiter', filterCondition.user?.email == user.email ? 'filter-active': '']"
                    v-for="user in listUser" :key="user.email"
                    :title="user.lastName"
                    @click="filterTaskByUserExecute(user)"
                >
                    <img :src="linkImg(user.fileAvatarName)" alt="">
                </div>
            </div>
        </div>
        <Modal :isShow="isShowDetail" :configModal="configModal">
            <component :is="nameDetailComponent" :option="props" @closePopup="closePopup"></component>
        </Modal>
    </div>
    
</template>

<script>
import {EnumEditMode,EnumTypeTask,EnumAttachment, EnumModeUseControl, EnumTypeDeadline,EnumTypeGroupTask} from '../../common/js/Enum.js';
import { uuid } from 'vue-uuid';
import Modal from '../commonComponent/Modal.vue';
import BaseViewDetail from '../commonComponent/BaseViewDetail.vue';
import SortTable from '../commonComponent/SortTable.vue';
import {baseCallApi} from '../../common/js/BaseCallApi.js';
import TaskDetail from './TaskDetail.vue'; 
import AddMemberForm from './AddMemberForm.vue';

export default {
    name: 'DetailGroupTask',
    components: {
        Modal,
        SortTable,
        TaskDetail,
        AddMemberForm
    },
    extends: BaseViewDetail,
    emits: ['closeView'],
    watch:{
        $route (to, from){
            let me = this;
            if(to.fullPath.includes("DetailGroupTask"))
            {
                me.paramRouter = {
                    groupTaskId: me.$route.params.grouptaskid,
                    typeGroupTask: parseInt(me.$route.params.typegrouptask),
                    taskDetailId: me.$route.params.taskdetailid,
                    templateReferenceId: me.$route.params.templateReferenceId
                };

                me.groupTaskInfo = me.paramRouter;
                
                me.countDoneLoadData = null;
                me.loadAllData();
            }
        }
    },
    created(){
        let me = this;

        me.paramRouter = {
            groupTaskId: me.$route.params.grouptaskid,
            typeGroupTask: parseInt(me.$route.params.typegrouptask),
            taskDetailId: me.$route.params.taskdetailid,
            templateReferenceId: me.$route.params.templateReferenceId
        }

        me.groupTaskInfo = me.paramRouter;
        me.loadAllData();
    },
    computed:{
        isCanManageTaskInGroup: function()
        {
            let me = this;
            if(me.paramRouter.typeGroupTask == EnumTypeGroupTask.Group)
            {
                if(me.userInfo.role.listPermissionCode.includes('AllPermission') 
                || me.userInfo.role.listPermissionCode.includes('ManageTaskGroup'))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
                return true;
        },
    },
    methods:{
        closePopup(callBack)
        {
            let me = this;
            if(typeof callBack == 'function')
            {
                callBack(me);
            }

            me.isShowDetail = false;
        },
        openAddMemberForm()
        {
            let me = this;
            me.showDetail('AddMemberForm',{
                width: '900px',
                height: 'auto',
                borderTop: true
            },
            {
                listUser: me.listUser,
                emailUserCreatedGroupTask: me.groupTaskInfoFromServer.createdByEmail,
                groupTaskId: me.paramRouter.groupTaskId,
                nameGroupTask: me.groupTaskInfoFromServer.nameGroupTask
            },null);
        },
        increaseNumberOfNewUpdate()
        {
            let me = this;
            me.numberOfNewUpdate = me.numberOfNewUpdate + 1;
        },
        setNumberOfNewUpdate(value){
            let me = this;
            me.numberOfNewUpdate = value;
        },
        deleteCustom()
        {
            let me = this;
            let listTaskIdDelete = [];
            me.templateGroupTask.listProcess.forEach(process => {
                process.lstTask.forEach(task => {
                    listTaskIdDelete.push(task.taskId);
                });
            });
            me.showDialogConfirm(
                {
                    width: '600px',
                    height: '200px',
                    borderTop: true
                },
                {
                    'title': 'Cảnh báo',
                    'content': 'Bạn có chắc muốn xóa nhóm công việc này?'
                },
                () =>{
                    me.loader = me.$loading.show();
                    me.callApi('put',`api/grouptask/deleteCustom`,
                    {
                        listTaskId: listTaskIdDelete,
                        groupTaskId: me.paramRouter.groupTaskId
                    }
                    ,null)
                    .then(res => {
                        if(res.data.success)
                        {
                            me.$emit('closeView',(objectParent)=>{
                                if( me.paramRouter.typeGroupTask == EnumTypeGroupTask.Personal)
                                {
                                    objectParent.lstGroupPersonalTask = objectParent.lstGroupPersonalTask.filter(groupTask => groupTask.groupTaskId != me.paramRouter.groupTaskId);
                                    objectParent.lstGroupPersonalTaskHeader = objectParent.lstGroupPersonalTask.filter(groupTask => groupTask.groupTaskId != me.paramRouter.groupTaskId);
                                }
                                else if( me.paramRouter.typeGroupTask == EnumTypeGroupTask.Group)
                                {
                                    objectParent.lstGroupCommunityTask = objectParent.lstGroupCommunityTask.filter(groupTask => groupTask.groupTaskId != me.paramRouter.groupTaskId);
                                    objectParent.lstGroupCommunityTaskHeader = objectParent.lstGroupCommunityTask.filter(groupTask => groupTask.groupTaskId != me.paramRouter.groupTaskId);
                                }

                                objectParent.$router.push({name: 'DailyTask'});
                                me.loader.hide();
                            });
                        }
                    });
                }
            );
        },
        addNewProcess(newProcess)
        {
            let me = this;
            newProcess.lstTask = [];
            me.templateGroupTask.listProcess.push(newProcess);
        },
        addNewTaskInProcess(process)
        {
            let me = this;

            me.showDetail('TaskDetail',{
                width: '900px',
                height: 'auto',
                borderTop: true
            },{
                taskId: null,
                groupTaskId: me.paramRouter.groupTaskId,
                typeGroupTask: me.paramRouter.typeGroupTask,
                typeTask: me.paramRouter.typeGroupTask == EnumTypeGroupTask.Personal ? EnumTypeTask.GroupPersonal : EnumTypeTask.Group,
                processId: process.processId,
                editMode: EnumEditMode.Add,
                listAssignedUser: me.listUser
            },null);
        },
        updateDroppedProcess(processInfo)
        {
            let me = this;
            if(processInfo.newIndex != processInfo.oldIndex)
            {
                let processesAffected = [];
                let processDroped = me.templateGroupTask.listProcess.find(process => process.processId == processInfo.processId);
                processesAffected.push(
                    {
                        processId: processInfo.processId,
                        sortOrder: processInfo.newIndex,
                        groupTaskId: me.paramRouter.groupTaskId
                    }
                );

                let maxIndexChange = Math.max(processInfo.newIndex,processInfo.oldIndex),
                    minIndexChange = Math.min(processInfo.newIndex,processInfo.oldIndex);
                me.templateGroupTask.listProcess.forEach(process => {
                    if(
                        process.processId != processInfo.processId &&
                        processInfo.newIndex < processInfo.oldIndex &&
                        process.sortOrder >=  minIndexChange &&
                        process.sortOrder <  maxIndexChange
                    )
                    {
                        process.sortOrder = process.sortOrder + 1;
                        processesAffected.push(
                            {
                                processId: process.processId,
                                sortOrder: process.sortOrder,
                                groupTaskId: me.paramRouter.groupTaskId
                            }
                        );
                    }
                    else if(
                        process.processId != processInfo.processId &&
                        processInfo.newIndex > processInfo.oldIndex &&
                        process.sortOrder <=  maxIndexChange &&
                        process.sortOrder >  minIndexChange
                    )
                    {
                        process.sortOrder = process.sortOrder - 1;
                        processesAffected.push(
                            {
                                processId: process.processId,
                                sortOrder: process.sortOrder,
                                groupTaskId: me.paramRouter.groupTaskId
                            }
                        );
                    }
                });
                
                processDroped.sortOrder = processInfo.newIndex;
                me.templateGroupTask.listProcess.sort((objectLeft,objectRight) => {
                    return objectLeft.sortOrder - objectRight.sortOrder;
                });

                me.loader = me.$loading.show();
                me.isRefreshSortable = true;

                if(processesAffected.length > 0)
                {
                    me.callApi('put', 'api/template/process/sortorder', processesAffected, null)
                    .then(res => {
                        if(res.data.success)
                        {
                            me.isRefreshSortable = false;
                            setTimeout(() => {
                               me.loader.hide(); 
                            }, 1000);
                        }
                    });
                }
            }
        },
        filterTaskByUserExecute(user)
        {
            let me = this;
            if(me.filterCondition.user && me.filterCondition.user.email == user.email)
            {
                me.filterCondition.user = null;
            }
            else
            {
                me.filterCondition.user = user;
            }

            me.getTasksFilter();
        },
        updateDroppedTask(taskInfo)
        {
            let me = this;
            let taskInfoUpdate = [];
            if(taskInfo.toProcessId == taskInfo.fromProcessId)
            {
                if(taskInfo.newIndex != taskInfo.oldIndex)
                {
                    me.templateGroupTask.listProcess.forEach(process => {
                        if(process.processId == taskInfo.toProcessId)
                        {
                            let taskDropped = process.lstTask.find(task => task.taskId == taskInfo.taskId);
                            let taskMoved = process.lstTask.find(task => task.sortOrder == taskInfo.newIndex);
                            taskDropped.sortOrder = taskInfo.newIndex;
                            taskMoved.sortOrder = taskInfo.oldIndex;

                            taskInfoUpdate.push(
                                {
                                    taskId: taskDropped.taskId,
                                    processId: taskInfo.toProcessId,
                                    sortOrder: taskDropped.sortOrder,
                                    groupTaskId: me.groupTaskInfo.groupTaskId
                                }
                            );

                            taskInfoUpdate.push(
                                {
                                    taskId: taskMoved.taskId,
                                    processId: taskInfo.toProcessId,
                                    sortOrder: taskMoved.sortOrder,
                                    groupTaskId: me.groupTaskInfo.groupTaskId
                                }
                            );
                        }
                    });
                }
            }
            else if(taskInfo.toProcessId != taskInfo.fromProcessId)
            {
                let taskDropped = {};
                me.templateGroupTask.listProcess.forEach(process => {
                    if(process.processId == taskInfo.fromProcessId)
                    {
                        taskDropped = process.lstTask.find(task => task.taskId == taskInfo.taskId);
                        process.lstTask.forEach(task => {
                            if(task.sortOrder > taskDropped.sortOrder && task.taskId != taskDropped.taskId)
                            {
                                task.sortOrder = task.sortOrder - 1;
                                taskInfoUpdate.push(
                                    {
                                        taskId: task.taskId,
                                        processId: taskInfo.fromProcessId,
                                        sortOrder: task.sortOrder,
                                        groupTaskId: me.groupTaskInfo.groupTaskId
                                    }
                                );
                            }
                        });
                        process.lstTask = process.lstTask.filter(task => task.taskId != taskInfo.taskId);

                        process.lstTask.sort((taskLeft,taskRight) => {
                            return taskLeft.sortOrder - taskRight.sortOrder;
                        });
                    }
                });

                me.templateGroupTask.listProcess.forEach(process => {
                    if(process.processId == taskInfo.toProcessId)
                    {
                        process.lstTask.forEach(task => {
                            if(task.sortOrder >= taskInfo.newIndex && task.taskId != taskDropped.taskId)
                            {
                                task.sortOrder = task.sortOrder + 1;   
                                taskInfoUpdate.push(
                                    {
                                        taskId: task.taskId,
                                        processId: taskInfo.toProcessId,
                                        sortOrder: task.sortOrder,
                                        groupTaskId: me.groupTaskInfo.groupTaskId
                                    }
                                );
                            }
                        });
                        taskDropped.sortOrder = taskInfo.newIndex;
                        process.lstTask.push(taskDropped);
                        process.lstTask.sort((taskLeft,taskRight) => {
                            return taskLeft.sortOrder - taskRight.sortOrder;
                        });

                        taskInfoUpdate.push(
                            {
                                taskId: taskDropped.taskId,
                                processId: taskInfo.toProcessId,
                                sortOrder: taskDropped.sortOrder,
                                groupTaskId: me.groupTaskInfo.groupTaskId
                            }
                        );
                    }
                })
            }

            if(taskInfoUpdate.length > 0)
            {
                me.loader = me.$loading.show();
                me.callApi('put', 'api/task/processbatch', taskInfoUpdate,null)
                .then(res => {
                    if(res.data.success)
                    {
                        me.loader.hide();
                    }
                });
            }
        
        },
        loadAllData()
        {
            let me = this;
            me.countDoneLoadData = 0;
            me.isDoneLoadData = false;
            me.loader = me.$loading.show();
            me.getById();
            me.getListUserJoined();
            me.getInfoTemplate();
            me.getAllTask();
        },
        getById()
        {
            let me = this;
            me.callApi('get', `api/grouptask/${me.paramRouter.groupTaskId}`, null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    me.groupTaskInfoFromServer = data;
                    me.checkDoneLoadData();
                }
            });
        },
        getListUserJoined(){
            let me = this;
            me.callApi('get', `api/grouptask/usersjoined/${me.paramRouter.groupTaskId}`, null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    me.listUser = data;
                    let indexExists = me.listUser.findIndex(user => user.email == me.userInfo.email);
                    if(indexExists == -1)
                    {
                        me.$router.push({name:'DailyTask'});
                    }
                    me.checkDoneLoadData();
                }
            });
        },
        getInfoTemplate(){
            let me = this;
            me.callApi('get', `api/grouptask/infotemplate/${me.paramRouter.groupTaskId}/${me.paramRouter.templateReferenceId}`,null)
            .then(res => {
                if(res.data.success)
                {   
                    let data = res.data.data;
                    me.templateGroupTask = data;
                    me.templateGroupTask.listProcess.forEach(process => {
                        process.lstTask = [];
                    });
                    me.checkDoneLoadData();
                }
            });
            
        },
        getAllTask(){
            let me = this;
            me.callApi('post', `api/grouptask/alltask`,{
                groupTaskId: me.paramRouter.groupTaskId
            },null)
            .then(res => {
                if(res.data.success)
                {   
                    let data = res.data.data;
                    me.listTask = data;
                    if(!data)
                    {
                        me.listTask = [];
                    }
                    me.checkDoneLoadData();
                }
            });
        },
        getTasksFilter()
        {
            let me = this;
            me.loader = me.$loading.show();
            me.callApi('post', `api/grouptask/alltask`,{
                groupTaskId: me.paramRouter.groupTaskId,
                executingUserEmail: me.filterCondition.user?.email
            },null)
            .then(res => {
                if(res.data.success)
                {   
                    let data = res.data.data;
                    me.listTask = data;

                    me.templateGroupTask.listProcess.forEach(process => {
                        process.lstTask = []
                    });

                    me.listTask.forEach(task => {
                        me.templateGroupTask.listProcess.forEach(process => {
                            if(process.processId == task.processId)
                            {
                                process.lstTask.push(task);
                            }

                        });
                    })
                    me.loader.hide();
                }
            });
        },
        linkImg(fileName)
        {
            let me = this;
            if(fileName)
            {
                return baseCallApi.doMain + '' + `/file/img/${fileName}`;
            }
            
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkyOEJDRjNERjQzRjExRTNBMDE2RjY3ODg3MTdFOTlDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjkyOEJDRjNFRjQzRjExRTNBMDE2RjY3ODg3MTdFOTlDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTI4QkNGM0JGNDNGMTFFM0EwMTZGNjc4ODcxN0U5OUMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTI4QkNGM0NGNDNGMTFFM0EwMTZGNjc4ODcxN0U5OUMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7bOPvnAAAKCElEQVR42uydW1MT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';
        },
        checkDoneLoadData()
        {
            let me = this;
            if(!me.countDoneLoadData)
            {
                me.countDoneLoadData = 1;
            }
            else
            {
                me.countDoneLoadData++;
            }

            if(me.countDoneLoadData == 4)
            {
                me.isDoneLoadData = true;
                me.loader.hide();
                me.numberOfNewUpdate = 0;
                let taskOpen = null;

                me.templateGroupTask.listProcess.sort((objectLeft,objectRight) => {
                    return objectLeft.sortOrder - objectRight.sortOrder;
                });

                me.listTask.forEach(task => {
                    me.templateGroupTask.listProcess.forEach(process => {
                        if(!process.lstTask)
                        {
                            process.lstTask = [];
                        }

                        if(process.processId == task.processId)
                        {
                            process.lstTask.push(task);
                        }

                        if(task.taskId == me.paramRouter.taskDetailId)
                        {
                            taskOpen = task;
                        }

                    });
                })

                let currentUser = me.listUser.find(user => user.email == me.userInfo.email);
                me.setRoleForUser(currentUser.role);
                
                if(me.paramRouter.taskDetailId != 'all')
                {
                    let me = this;
                    me.callApi('get',`api/task/checkexists/${me.paramRouter.taskDetailId}`,null)
                    .then(res => {
                        if(res.data.success)
                        {
                            let data = res.data.data;
                            if(data)
                            {
                                me.showDetail('TaskDetail',{
                                    width: '900px',
                                    height: 'auto',
                                },{ 
                                    taskId: me.paramRouter.taskDetailId,
                                    groupTaskId: me.paramRouter.groupTaskId,
                                    typeGroupTask: me.paramRouter.typeGroupTask,
                                    typeTask: me.paramRouter.typeGroupTask == EnumTypeGroupTask.Personal ? EnumTypeTask.GroupPersonal : EnumTypeTask.Group,
                                    processId: taskOpen.processId,
                                    editMode: EnumEditMode.Edit,
                                    listAssignedUser: me.listUser
                                },null);
                            }
                        }
                    });
                }
            }
        },
        showDetailTask(task)
        {
            let me = this;
            me.showDetail('TaskDetail',{
                width: '900px',
                height: 'auto',
            },{ 
                taskId: task.taskId,
                groupTaskId: me.paramRouter.groupTaskId,
                typeGroupTask: me.paramRouter.typeGroupTask,
                typeTask: me.paramRouter.typeGroupTask == EnumTypeGroupTask.Personal ? EnumTypeTask.GroupPersonal : EnumTypeTask.Group,
                processId: task.processId,
                editMode: EnumEditMode.Edit,
                listAssignedUser: me.listUser
            },null);
        }
    },
    data()
    {
        return {
            numberOfNewUpdate: 0,
            isDoneLoadData: false,
            templateGroupTask: {
                listProcess: []
            },

            groupTaskInfo: {},

            filterCondition:{
                user: null,
            },

            listTask: [],
            listUser: [],

            nameDetailComponent: '',
            props: {},
            isShowDetail: false,
            configModal: null,
            callbackOutsideComponent: null,
            isRefreshSortable: false
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/ViewComponent/DetailGroupTask.css');
</style>