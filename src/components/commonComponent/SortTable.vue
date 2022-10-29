<template>
    <div class="sort-table d-flex">
        <div v-for="(column,index) in lstColumnTask" :key="column.proccessId"
            class="column-task"
            :style="{
                backgroundColor: columnColorResult(index)
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
                        <div 
                            class="name-column txt-threedots txt-al-center fw-500 fs-20"
                            :style="{
                                color: column.columnSetting.colorText
                            }"
                        >
                            {{column.processName}}
                        </div>
                </div>
                <Task 
                    v-for="task in column.lstTask" 
                    :key="task.taskId" 
                    @dblclick="showDetailTask(task)"
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
        
    },
    computed: {
        
    },
    props: {
        columnColor: {
            type: String, 
            default: ''
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
         columnColorResult: function(index)
        {
            let me = this;
            if(me.columnColor)
                return me.columnColor;
            else
                return index%2==0? 'transparent' : 'hsla(0,0%,100%,.05)';
        },
        showDetailTask(task)
        {
            let me = this;
            me.$emit('showDetailTask', task);
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