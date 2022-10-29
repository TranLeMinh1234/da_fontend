<template>
    <div id="detail-group-task">
        <SortTable 
            :isHaveHeader="true"
            @showDetailTask="showDetailTask"
            :lstColumnTask="templateGroupTask.listProcess"
            ref="sorttable"
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
                        if(process.processId == task.processId)
                        {
                            if(!process.lstTask)
                            {
                                process.lstTask = [];
                                process.lstTask.push(task);
                            }
                            else
                            {
                                process.lstTask.push(task);
                            }
                        }
                    });
                })
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