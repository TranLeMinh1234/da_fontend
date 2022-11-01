<template>
    <div class="sort-table d-flex">
        <div v-for="(column,index) in lstColumnTask" :key="column.proccessId"
            class="column-task"
            :processId="column.processId"
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
                        backgroundColor: column.columnSetting.colorHeader,
                    }"
                >
                        <div 
                            class="name-column txt-threedots txt-al-center fw-500 fs-20"
                            :style="{
                                color: 'white' //column.columnSetting.colorText
                            }"
                        >
                            {{column.processName}}
                        </div>
                </div>
                <div class="task-container">
                    <div 
                        class="item-container"
                        :processId="column.processId"
                    >
                        <Task 
                            v-for="task in column.lstTask" 
                            :key="task.taskId" 
                            @dblclick="showDetailTask(task)"
                            :data="task"
                        />
                    </div>
                    <div class="d-flex center-items mg-t-10" v-if="isAddTaskOnColumn">
                        <div class="d-flex center-items add-task-column-button c-poiter" @click="addNewTaskInProcess(column)">
                            <div class="add-task-column-icon file-icon"></div>
                        </div>
                    </div>
                </div>
        </div>
        <div
            :class="['column-add-new-process']"
            :style="{
                backgroundColor: columnColorResult(lstColumnTask.length)
            }"
            v-if="isAddProcess"
        >
            <div class="header-column d-flex center-items">
                <div v-if="!isAddingProcess" class="d-flex center-items c-poiter" @click="goAddingProcess">
                    <div class="file-icon add-task-column-icon"></div>
                    <div class="fs-20 fw-500 txt-blue pd-l-10">Thêm bước quy trình</div>
                </div>
                <div v-if="isAddingProcess" class="d-flex center-items w-80">
                    <MInput 
                        placeholder="Nhập tên bước quy trình..."
                        v-model="newNameProcess"
                        :isValidate="false"
                        @blur="commitNewProcess"
                    />
                </div>
            </div>
        </div>
        <Modal :isShow="isShowDetail" :configModal="configModal">
            <component :is="nameDetailComponent" :option="props" @closePopup="closePopup"></component>
        </Modal>
    </div>
</template>

<script>
import Sortable from 'sortablejs';
import Task from './Task.vue';
import Modal from './Modal.vue';
import {EnumEditMode,EnumTypeTask,EnumTypeGroupTask} from '../../common/js/Enum.js';
import BaseViewDetail from './BaseViewDetail.vue';
import TaskDetail from '../ViewComponent/TaskDetail.vue'; 
import MInput from './MInput.vue';
import { uuid } from 'vue-uuid';

export default {
    name: "SortTable",
    extends: BaseViewDetail,
    emits: ['addNewTaskInProcess','updateDroppedTask','addNewProcess'],
    components: {
        Task,
        Modal,
        TaskDetail,
        MInput
    },
    created(){

    },
    mounted(){
        let me = this;
        var elSortTable = me.$el;
        var lstColumnTask = me.$el.querySelectorAll('.item-container');
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
            onEnd: function(event)
            {
                me.updateDroppedProcess(event);
            }
        });

        lstColumnTask.forEach(column => {
            var columnSortTable = new Sortable(column, {
                group: {
                    name: "task",
                    put: 'task',
                    pull: 'task',   
                },
                sort: true,
                animation: 300,
                emptyInsertThreshold: 100,
                delay: 0,
                touchStartThreshold: 1, // bao nhiều px thì thực hiện sort, 
                handle: ".task",// phần tử click kéo đi để sort - phần tử chấp nhận tương tác   
                preventOnFilter: true,
                // handle: '.header-column',
                draggable: ".task", // cấu hình những ele có thể tham gia sort (khuyen khich class) - không có trong này thì không sort dc
                // ghostClass: "sortable-ghost",  // class làm mờ khi đang bị kéo
                // chosenClass: "chosen", // class áp dụng cho ele được chọn để kéo
                swapThreshold: 1,

                onEnd: function(event)
                {
                    me.updateDroppedTask(event);
                },
            });
        });
    },
    watch: {
        'lstColumnTask': function(newValue,oldValue)
        {
        }
    },
    computed: {
        
    },
    props: {
        groupTaskInfo: {
            type: Object,
            default: function(rawProps){
                return rawProps.groupTaskInfo? rawProps.groupTaskInfo: {};
            }
        },
        isUpdateSortableOnServer:
        {
            type: Boolean,
            default: false
        },
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
        },
        isAddTaskOnColumn: {
            type: Boolean,
            default: false
        },
        isAddProcess: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        randomHexColor()
        {
            return '#'+Math.floor(Math.random()*16777215).toString(16);
        },
        commitNewProcess()
        {
            let me = this;
            if(me.newNameProcess)
            {
                let newProcess = {
                    processId: uuid.v1(),
                    processName: me.newNameProcess,
                    description: '',
                    columnSetting: {
                        columnSettingId: uuid.v1(),
                        color: me.randomHexColor(),
                        colorText: me.randomHexColor(),
                        colorHeader: me.randomHexColor()
                    },
                    sortOrder: me.lstColumnTask.length+1,
                    templateGroupTaskReferenceId: me.groupTaskInfo.templateReferenceId,
                    isNewProcess: true,
                    isEditing: true
                };

                me.callApi('post', `api/template/insertprocess`, newProcess ,null)
                .then(res => {
                    if(res.data.success)
                    {
                        let data = res.data.data;
                        me.$emit('addNewProcess',data);
                        me.$nextTick(()=>{
                            let listTaskContainer = me.$el.querySelectorAll('.item-container');
                            let columnSortTable = new Sortable(listTaskContainer[listTaskContainer.length-1], {
                                group: {
                                    name: "task",
                                    put: 'task',
                                    pull: 'task',   
                                },
                                sort: true,
                                animation: 300,
                                emptyInsertThreshold: 100,
                                delay: 0,
                                touchStartThreshold: 1, // bao nhiều px thì thực hiện sort, 
                                handle: ".task",// phần tử click kéo đi để sort - phần tử chấp nhận tương tác   
                                preventOnFilter: true,
                                // handle: '.header-column',
                                draggable: ".task", // cấu hình những ele có thể tham gia sort (khuyen khich class) - không có trong này thì không sort dc
                                // ghostClass: "sortable-ghost",  // class làm mờ khi đang bị kéo
                                // chosenClass: "chosen", // class áp dụng cho ele được chọn để kéo
                                swapThreshold: 1,

                                onEnd: function(event)
                                {
                                    me.updateDroppedTask(event);
                                },
                            });
                        });
                        me.isAddingProcess = false;
                    }
                });
            }


            me.isAddingProcess = false;
        },
        goAddingProcess()
        {
            let me = this;
            me.newNameProcess = '';
            me.isAddingProcess = true;
        },
        addNewTaskInProcess(process)
        {
            let me = this;

            me.$emit('addNewTaskInProcess', process);
        },
        updateDroppedProcess(event)
        {
            let me = this;
            if(me.isUpdateSortableOnServer)
            {
                let processId = event.item.getAttribute('processId'),
                    newIndex = event.newIndex,
                    oldIndex = event.oldIndex;

                me.$emit('updateDroppedProcess', {
                    processId: processId,
                    newIndex: newIndex+1,
                    oldIndex: oldIndex+1
                })
            }
        },
        updateDroppedTask(event)
        {
            let me = this;
            if(me.isUpdateSortableOnServer)
            {
                let taskId = event.item.getAttribute('taskId'),
                    toProcessId = event.to.getAttribute('processId'),
                    fromProcessId = event.from.getAttribute('processId'),
                    newIndex = event.newIndex,
                    oldIndex = event.oldIndex;
                
                me.$emit('updateDroppedTask', {
                    taskId: taskId,
                    toProcessId: toProcessId,
                    fromProcessId: fromProcessId,
                    newIndex: newIndex+1,
                    oldIndex: oldIndex+1
                })
            }
        },
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
            newNameProcess: '',
            isAddingProcess: false,

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
@import url('../../assets/css/componentCommon/SortTable.css');
</style>