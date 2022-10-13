<template>
    <div class="task c-poiter">
        <div class="name-task">{{nameTask}}</div>
        <div class="fast-feature d-flex">
            <img src="../../assets/defaultAvatar.png" alt="" class="assigned-user">
            <div class="file-icon datepicker-icon"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Task',
    props:
    {
        nameTask: {
            type: String,
            default: ' [In báo cáo/Báo cáo]Truy vấn lấy vé xuất lại '
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