<template>
    <div id="daily-task">
        <SortTable 
            :isHaveHeader="false"
            columnColor="transparent"
            @showDetailTask="showDetailTask"
            :lstColumnTask="lstColumnTask"
        />
    </div>
    <Modal :isShow="isShowDetail" :configModal="configModal">
        <component :is="nameDetailComponent" :option="props" @closePopup="closePopup"></component>
    </Modal>
</template>

<script>
import BaseViewDetail from '../commonComponent/BaseViewDetail.vue';
import SortTable from '../commonComponent/SortTable.vue';
import { defineAsyncComponent } from 'vue';
import Modal from '../commonComponent/Modal.vue';
import {EnumEditMode,EnumTypeTask} from '../../common/js/Enum.js';

export default {
    name: 'DailyTask',
    extends: BaseViewDetail,
    components: {
        SortTable,
        TaskDetail: defineAsyncComponent(()=> import('../ViewComponent/TaskDetail.vue')),
        Modal
    },
    mounted(){

    },
    props:{
        
    },
    methods: {
        getDailyTask()
        {
            let me = this;
            me.callApi('get','api/task/dailytask')
            .then();
        },
        closePopup(callback)
        {
            let me = this;
            if(callback)
            {
                debugger;
                callback(me);
            }
            me.isShowDetail = false;
        },
        openFormAddNewTask()
        {
            let me = this;
            me.showDetail('TaskDetail',{
                width: '900px',
                height: 'auto',
            },{
                taskId: null,
                typeTask: EnumTypeTask.Personal,
                editMode: EnumEditMode.Add
            },null);
        },
        showDetailTask(taskId)
        {
            let me = this;
            me.showDetail('TaskDetail',{
                width: '900px',
                height: 'auto',
            },{
                taskId: taskId?taskId:'515219ba-4c98-11ed-bdc3-0242ac120002',
                typeTask: EnumTypeTask.Personal,
                editMode: EnumEditMode.Edit
            },null);
        }
    },
    data()
    {
        return{
            nameDetailComponent: '',
            props: null,
            isShowDetail: false,
            configModal: null,
            callbackOutsideComponent: null,

            lstColumnTask: [
                {
                    proccessId: '1',
                    proccessName: 'Cột 1',
                    columnSetting: {
                        color: '',
                        colorText: 'white',
                        colorHeader: ''
                    },
                    sortOrder: 1,
                    lstTask: [
                        {
                            taskId: '515219ba-4c98-11ed-bdc3-0242ac120002',
                            taskName: 'Sua loi jira'
                        }
                    ]
                },
                {
                    proccessId: '2',
                    proccessName: 'Cột 2',
                    columnSetting: {
                        color: '',
                        colorText: 'white',
                        colorHeader: ''
                    },
                    sortOrder: 2
                },
                {
                    proccessId: '3',
                    proccessName: 'Cột 3',
                    columnSetting: {
                        color: '',
                        colorText: 'white',
                        colorHeader: ''
                    },
                    sortOrder: 3
                }
            ],
        };
    }
}
</script>

<style scoped>
@import url(../../assets/css/ViewComponent/DailyTask.css);
</style>