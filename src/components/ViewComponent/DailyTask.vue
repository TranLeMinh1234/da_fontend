<template>
    <div id="daily-task">
        <SortTable 
            :isHaveHeader="false"
            columnColor="transparent"
            @showDetailTask="showDetailTask(taskId)"
        />
    </div>
    <Modal :isShow="isShowDetail" :configModal="configModal">
        <component :is="nameDetailComponent" :option="props" @closePopup="closePopup(callback)"></component>
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
        showDetailTask(taskId)
        {
            let me = this;
            me.showDetail('TaskDetail',{
                width: '800px',
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
            callbackOutsideComponent: null
        };
    }
}
</script>

<style scoped>
@import url(../../assets/css/ViewComponent/DailyTask.css);
</style>