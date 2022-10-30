<template>
    <div id="detail-group-task">
        <SortTable 
            :isHaveHeader="true"
            @showDetailTask="showDetailTask"
            :lstColumnTask="templateGroupTask.listProcess"
            ref="sorttable"
            :isUpdateSortableOnServer="true"
            @updateDroppedTask="updateDroppedTask"
            v-if="isDoneLoadData"
        />
    </div>
    <Modal :isShow="isShowDetail" :configModal="configModal">
        <component :is="nameDetailComponent" :option="props" @closePopup="closePopup"></component>
    </Modal>
</template>

<script>
import {EnumEditMode,EnumTypeTask,EnumAttachment, EnumModeUseControl, EnumTypeDeadline,EnumTypeGroupTask} from '../../common/js/Enum.js';
import { uuid } from 'vue-uuid';
import Modal from '../commonComponent/Modal.vue';
import BaseViewDetail from '../commonComponent/BaseViewDetail.vue';
import SortTable from '../commonComponent/SortTable.vue';
import {baseCallApi} from '../../common/js/BaseCallApi.js';
import TaskDetail from './TaskDetail.vue'; 

export default {
    name: 'DetailGroupTask',
    components: {
        Modal,
        SortTable,
        TaskDetail
    },
    extends: BaseViewDetail,
    created(){
        let me = this;
        me.paramRouter = {
            groupTaskId: me.$route.params.grouptaskid,
            typeGroupTask: parseInt(me.$route.params.typegrouptask),
            taskDetailId: me.$route.params.taskdetailid,
            templateReferenceId: me.$route.params.templateReferenceId
        };

        me.loader = me.$loading.show();
        me.loadAllData();
    },
    methods:{
        updateDroppedTask(taskInfo)
        {
            let me = this;
            let taskInfoUpdate = [];
            debugger;
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
                                    sortOrder: taskDropped.sortOrder
                                }
                            );

                            taskInfoUpdate.push(
                                {
                                    taskId: taskMoved.taskId,
                                    processId: taskInfo.toProcessId,
                                    sortOrder: taskMoved.sortOrder
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
                            if(task.sortOrder > taskDropped.sortOrder)
                            {
                                task.sortOrder = task.sortOrder--;
                                taskInfoUpdate.push(
                                    {
                                        taskId: task.taskId,
                                        processId: taskInfo.fromProcessId,
                                        sortOrder: task.sortOrder
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
                        taskDropped.sortOrder = taskInfo.newIndex;
                        process.lstTask.forEach(task => {
                            if(task.sortOrder >= taskInfo.newIndex)
                            {
                                task.sortOrder++;   
                                taskInfoUpdate.push(
                                    {
                                        taskId: task.taskId,
                                        processId: taskInfo.toProcessId,
                                        sortOrder: task.sortOrder
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
                                sortOrder: taskDropped.sortOrder
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
            me.getListUserJoined();
            me.getInfoTemplate();
            me.getAllTask();
        },
        getListUserJoined(){
            let me = this;
            me.callApi('get', `api/grouptask/usersjoined/${me.paramRouter.groupTaskId}`, null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    me.listUser = data;
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
                    me.checkDoneLoadData();
                }
            });
            
        },
        getAllTask(){
            let me = this;
            me.callApi('get', `api/grouptask/alltask/${me.paramRouter.groupTaskId}`,null)
            .then(res => {
                if(res.data.success)
                {   
                    let data = res.data.data;
                    me.listTask = data;
                    me.checkDoneLoadData();
                }
            });
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

            if(me.countDoneLoadData == 3)
            {
                me.isDoneLoadData = true;
                me.loader.hide();

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

                    });
                })

                let currentUser = me.listUser.find(user => user.email == me.userInfo.email);
                me.setRoleForUser(currentUser.role);
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
                editMode: EnumEditMode.Edit
            },null);
        }
    },
    data()
    {
        return {
            isDoneLoadData: false,
            templateGroupTask: {
                listProcess: []
            },

            listTask: [],

            nameDetailComponent: '',
            props: null,
            isShowDetail: false,
            configModal: null,
            callbackOutsideComponent: null,
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/ViewComponent/DetailGroupTask.css');
</style>