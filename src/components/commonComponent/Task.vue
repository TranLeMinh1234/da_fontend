<template>
    <div class="task c-poiter">
        <div class="name-task">{{data.taskName}}</div>
        <div class="fast-feature d-flex">
            <img src="../../assets/defaultAvatar.png" alt="" class="assigned-user">
            <div class="file-icon datepicker-icon"></div>
        </div>
    </div>
</template>

<script>
import {EnumEditMode,EnumTypeTask,EnumAttachment, EnumModeUseControl} from '../../common/js/Enum.js';
import { uuid } from 'vue-uuid';

export default {
    name: 'Task',
    props:
    {
        data: {
            type: Object,
            default: function(rawProps)
            {
                return rawProps.data ? rawProps.data : {
                    taskId: uuid.v1(),
                    nameTask: 'Sua loi jira'
                };
            }
        }
    },
    data(){
        return {

        }
    }
}
</script>

<style scoped>
@import url(../../assets/css/componentCommon/Task.css);
</style>