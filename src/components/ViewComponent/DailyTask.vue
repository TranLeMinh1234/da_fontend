<template>
    <div id="daily-task">
        <SortTable 
            :isHaveHeader="false"
            columnColor="transparent"
            @showDetailTask="showDetailTask"
            :lstColumnTask="lstColumnTask"
            ref="sorttable"
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
    created()
    {
        let me = this;
        me.getDailyTask(new Date(),new Date());
    },
    mounted(){

    },
    watch:
    {
       
    },
    props:{
        
    },
    methods: {
        getDailyTask(startTime,endTime)
        {
            let me = this;
            startTime?.setHours(0,0,0,0);
            endTime?.setHours(24,0,0,0);
            me.callApi('post','api/task/dailytask',{
                "startTime": me.$commonFunction.parseDateToStringDateServer(startTime),
                "endTime": me.$commonFunction.parseDateToStringDateServer(endTime)
            },null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    me.lstColumnTask[0].lstTask = [];
                    me.lstColumnTask[1].lstTask = [];
                    me.lstColumnTask[2].lstTask = [];
                    if(data && data.length > 0)
                    {
                        for(let i = 0; i < data.length; i++)
                        {
                            me.lstColumnTask[i%3].lstTask.push(data[i]);    
                        }
                    }
                }
            });
        },
        closePopup(callback)
        {
            let me = this;
            if(callback)
            {
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
                taskId: taskId,
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