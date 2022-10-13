<template>
    <div class="task-detail">
        <div class="header-feature d-flex j-end">
            <div class="lst-feature d-flex al-center j-spread-around">
                <div class="file-icon c-poiter command-direct-icon"></div>
                <div class="file-icon c-poiter child-task-icon"></div>
                <div class="file-icon c-poiter attachment-icon"></div>
                <div class="file-icon c-poiter attach-label-icon"></div>
                <div class="file-icon c-poiter copy-link-icon"></div>
                <div class="file-icon c-poiter more-feature-icon"></div>
                <div class="file-icon c-poiter exit-popup-icon" @click="clostPopup()"></div>
            </div>
        </div>
        <div class="body-task d-flex">
            <div class="primary-content">
                <div class="name-task txt-threedots fw-600">kasjdk jask jaskasjdk jask jas</div>
                <div class="user-assigned">Người giao việc: <span>Ngô Vân Hải</span></div>
                <div class="one-edit-task d-flex w-100 pd-t-16 j-spread-around">
                    <div class="one-edit-item assigned-user w-48 d-flex al-center">
                        <img src="../../assets/defaultAvatar.png" alt="" class="avatar mg-l-10">
                        <div class="info-assigned-user pd-l-16">
                            <div>Người thực hiện</div>
                            <div class="fw-600">Trần Lê Minh</div>
                        </div>
                    </div>
                    <div class="one-edit-item w-48 d-flex al-center">
                        <div class="file-icon select-expire-time-icon mg-l-10"></div>
                        <div class="info-assigned-user pd-l-16">
                            Chọn hạn hoàn thành
                        </div>
                    </div>
                </div>
                <div class="pd-t-16 two-edit-task">
                    <div v-if="dataEdit.description">
                        asd
                    </div>
                    <div v-if="!dataEdit.description">
                        <div class="d-flex al-center">
                            <div class="file-icon blue-description-edit-icon"></div>
                            <div class="color-blue-taskdetail pd-l-10">Nhập mô tả</div>
                        </div>
                        <ckeditor @blur="saveDescription" :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
                    </div>
                </div>
            </div>
            <div class="not-primary-content">
            </div>
        </div>
    </div>
</template>

<script>
import {EnumEditMode,EnumTypeTask} from '../../common/js/Enum.js';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
    name: "TaskDetail",
    components:{
    },
    props:
    {
        option:
        {
            type: Object,
            default: function(rawProps)
            {
                return rawProps.option? rawProps.option: {
                    taskId: undefined,
                    typeTask: EnumTypeTask.Personal,
                    editMode: EnumEditMode.Watch
                };
            }
        }
    },
    methods: {
        saveDescription()
        {
            let me = this;
            me.dataEdit.description = me.editorData;
            console.log(me.description);
        },
        clostPopup()
        {
            let me = this;
            me.$emit('closePopup',()=>{});
        }
    },
    data()
    {
        return{
            editor: ClassicEditor,
            editorData: '<p>Content of the editor.</p>',
            editorConfig: {
                toolbar: [ 'bold', 'italic', '|', 'link' ]
            },
            dataRoot:
            {

            },
            dataEdit: {
                description: ''
            }
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/ViewComponent/TaskDetail.css');
</style>