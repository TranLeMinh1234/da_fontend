<template>
    <div class="sort-table d-flex">
        <div v-for="column in lstColumnTask" :key="column.proccessId"
            class="column-task"
            :style="{
                backgroundColor: column.columnSetting.color
            }"
            >
                <div 
                    :class="
                        [
                            'header-column', 'd-flex', 'center-items', 'c-poiter', 
                            isHaveHeader? '': 'd-none',
                        ]"
                    :style="{
                        backgroundColor: column.columnSetting.colorHeader
                    }"
                >
                        <div class="name-column txt-threedots txt-al-center">
                            {{column.name}}
                        </div>
                </div>
                <Task 
                    v-for="task in column.lstTask" 
                    :key="task.taskId" 
                    @dblclick="showDetailTask(task.taskId)"
                    :data="task"
                />
        </div>
    </div>
</template>

<script>
import Sortable from 'sortablejs';
import Task from './Task.vue';
import {EnumEditMode,EnumTypeTask} from '../../common/js/Enum.js';

export default {
    name: "SortTable",
    components: {
        Task
    },
    created(){

    },
    mounted(){
        let me = this;
        var elSortTable = me.$el;
        var lstColumnTask = me.$el.querySelectorAll('.column-task');
        var sortTable = new Sortable(elSortTable, {
            group: "column-task",
            sort: true,
            animation: 600,
            delay: 0,
            touchStartThreshold: 50, // bao nhiều px thì thực hiện sort, 
            handle: ".column-task",// phần tử click kéo đi để sort - phần tử chấp nhận tương tác   
            preventOnFilter: true,
            handle: '.header-column',
            // draggable: ".header-column", // cấu hình những ele có thể tham gia sort (khuyen khich class) - không có trong này thì không sort dc
            // ghostClass: "sortable-ghost",  // class làm mờ khi đang bị kéo
            // chosenClass: "chosen", // class áp dụng cho ele được chọn để kéo
            swapThreshold: 1,
        });

        lstColumnTask.forEach(column => {
            var columnSortTable = new Sortable(column, {
                group: "task",
                sort: true,
                animation: 300,
                delay: 0,
                touchStartThreshold: 20, // bao nhiều px thì thực hiện sort, 
                handle: ".task",// phần tử click kéo đi để sort - phần tử chấp nhận tương tác   
                preventOnFilter: true,
                put: '.column-task',
                pull: '.column-task',
                // handle: '.header-column',
                draggable: ".task", // cấu hình những ele có thể tham gia sort (khuyen khich class) - không có trong này thì không sort dc
                // ghostClass: "sortable-ghost",  // class làm mờ khi đang bị kéo
                // chosenClass: "chosen", // class áp dụng cho ele được chọn để kéo
                swapThreshold: 1,
            });
        });
    },
    watch: {
        'lstColumnTask.lstTask': function(newValue)
        {
            
        }
    },
    props: {
        columnColor: {
            type: String, 
            default: 'hsla(0,0%,100%,.05)'
        },
        isHaveHeader: {
            type: Boolean,
            default: true
        },
        lstColumnTask: {
            type: Array,
            default: []
        }
    },
    methods: {
        showDetailTask(taskId)
        {
            let me = this;
            me.$emit('showDetailTask', taskId);
        }
    },
    data(){
        return {
            
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/componentCommon/SortTable.css');
</style>