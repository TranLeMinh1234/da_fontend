<template>
    
    <div class="task-detail">
        <div class="background-adding-task" v-if="isAddingTask">
            <input type="text" v-model="nameNewTask" placeholder="Nhập tên công việc" ref="inpNewTask" @blur="addNewTask">
        </div>
        <div class="header-feature d-flex j-end">
            <div class="lst-feature d-flex al-center j-spread-around">
                <div class="file-icon c-poiter command-direct-icon"></div>
                <div class="file-icon c-poiter child-task-icon"></div>
                <div class="file-icon c-poiter attachment-icon" @click="uploadFileAttachment"></div>
                <div class="file-icon c-poiter attach-label-icon" @click="showFormAddLabel()"></div>
                <div class="file-icon c-poiter copy-link-icon"></div>
                <div class="file-icon c-poiter more-feature-icon"></div>
                <div class="file-icon c-poiter exit-popup-icon" @click="clostPopup()"></div>
            </div>
        </div>
        <div class="body-task d-flex">
            <div :class="['primary-content', isAddingTask? 'mg-t-60':'']">
                <div class="name-task txt-threedots fw-600" v-if="!isAddingTask">{{dataEdit.taskName}}</div>
                <div class="user-assigned" v-if="!isAddingTask">Người giao việc: <span>{{dataEdit.assignedBy?.firstName}} {{dataEdit.assignedBy?.lastName}}</span></div>
                <div class="user-assigned" v-if="isAddingTask">Người giao việc:</div>
                <div class="one-edit-task d-flex w-100 pd-t-16 j-spread-around">
                    <div class="one-edit-item assigned-user w-48 d-flex al-center">
                        <img :src="linkImg(dataEdit.assignedFor?.fileAvatarName)" alt="" class="avatar mg-l-10">
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
                    
                    <div v-if="!isEditingDescription">
                        <div class="d-flex al-center fit-content c-poiter"  @click="changeModeEditingDescription(true)">
                            <div class="file-icon description-task-icon"></div>
                            <div class="pd-l-10 fw-600">Nhập mô tả</div>
                        </div>
                        <div class="w-100" v-html="dataEdit.description">

                        </div>
                    </div>
                    <div v-if="isEditingDescription">
                        <div class="d-flex al-center fit-content" @click="changeModeEditingDescription(true)">
                            <div class="file-icon blue-description-edit-icon"></div>
                            <div class="color-blue-taskdetail pd-l-10">Nhập mô tả</div>
                        </div>
                        <ckeditor @ready="onReady" :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
                        <div class="d-flex mg-t-10">
                            <button class="btn btn-white-silver" @click="changeModeEditingDescription(false)">Hủy bỏ</button>
                            <button class="btn btn-primary mg-l-10" @click="commitDescription">Lưu</button>
                        </div>

                    </div>
                </div>
                <div class="pd-t-16 three-edit-task">
                    <div class="header d-flex j-space-between">
                        <div class="d-flex al-center">
                            <div class="file-icon check-list-icon"></div>
                            <span class="fw-600 pd-l-10">Checklist</span>
                        </div>
                        <div v-show="isCheckAll != null && !isCheckAll" class="check-all c-poiter fw-600" @click="checkAll()">
                            Hoàn thành tất cả
                        </div>
                        <div v-show="isCheckAll != null && isCheckAll" class="check-all c-poiter fw-600" @click="checkFalseAll()">
                            Bỏ hoàn thành tất cả
                        </div>
                    </div>
                    <div class="lst-check">
                        <div 
                            v-for="(checkTask,index) in dataEdit.lstCheckTask" :key="checkTask.checkTaskId"
                            class="check-task d-flex al-center pd-8"
                        >
                            <div 
                                :class="['mg-l-4','file-icon','c-poiter', checkTask.status ? 'checked-icon':'not-checked-icon']"
                                @click="changeCheckTask(checkTask.checkTaskId)"
                            >
                            </div>
                            <div class="pd-l-10 flex-1 w-90">{{index+1}}.{{checkTask.content}}</div>
                            <div class="feature-line-checktask d-none">
                                <div class="file-icon hole-trash-icon c-poiter" @click="deleteCheckTask(checkTask.checkTaskId)"></div>
                            </div>
                        </div>
                        <div v-if="addingCheckList" class="d-flex al-center pd-8">
                            <div 
                                :class="['mg-l-4','file-icon','not-checked-icon']"
                            ></div>
                            <input 
                                class="fake-content-cklst" 
                                type="text" 
                                v-model="fakeContentCheckList"
                                placeholder="Nhập checklist"
                                @blur="commitValueFakeContentCkLst()"
                            >
                        </div>
                        <div class="add-lst d-flex al-center pd-8 c-poiter fit-content" @click="addCheckList()">
                            <div class="file-icon plush-blue-icon"></div>
                            <div class="fw-600 pd-l-6 color-blue-taskdetail">Thêm checklist</div>
                        </div>
                    </div>
                </div>
                <div class="pd-t-16 four-edit-task" v-if="dataEdit.lstLabel.length > 0">
                    <div class="header d-flex al-center">
                        <div class="file-icon attach-label-icon"></div>
                        <div class="fw-600 pd-l-10">Gắn thẻ</div>
                    </div>
                    <div class="d-flex lst-label al-center fl-wrap w-100 mg-t-10">
                        <div 
                            v-for="label in dataEdit.lstLabel" :key="label.labelId"
                            class="label"
                            :style="{
                                color: 'white',
                                backgroundColor: label.color,
                            }"
                        >
                            <div class="feature-label file-icon exit-cirle-icon d-none c-poiter" @click="deleteLabelFromList(label.labelId)"></div>
                            <div>{{label.nameLabel}}</div>
                        </div>
                        <div class="file-icon add-label-detail-icon mg-l-6 c-poiter" @click="showFormAddLabel()"></div>
                    </div>
                </div>
                <div class="pd-t-16 five-edit-task">
                    <div class="header d-flex al-center">
                        <div class="file-icon big-child-task-icon"></div>
                        <div class="fw-600 pd-l-10">Công việc con</div>
                    </div>
                    <div class="bottom-border-silver w-100 pd-t-10"></div>
                    <div class="w-100">
                        <div
                            v-for="(childTask, index) in dataEdit.lstChildTask" :key="childTask.taskId"
                            class="child-task c-poiter"
                        >
                            <div class="">{{index + 1}}.{{childTask.taskName}}</div>
                            <div class="d-flex al-center feature-line d-none">
                                <div 
                                    class="file-icon hole-trash-icon c-poiter" 
                                    @click="deleteChildTask(childTask.taskId)"
                                    v-show="childTask.createdByEmail == userInfo.email"></div>
                            </div>
                        </div>
                    </div>
                    <div class="add-child-task w-100" v-if="addingChildTask">
                        <input 
                            type="text" 
                            v-model="fakeNameChildTask" 
                            placeholder="Tên công việc con"
                            @blur="commitNewChildTask"
                        >
                    </div>
                    <div class="add-lst d-flex al-center pd-8 c-poiter" @click="addChildTaskInput()">
                        <div class="file-icon plush-blue-icon"></div>
                        <div class="fw-600 pd-l-6 color-blue-taskdetail">Thêm việc</div>
                    </div>
                </div>
                <div class="pd-t-16 six-edit-task" v-if="dataEdit.lstFileAttachment.length > 0">
                    <div class="header d-flex al-center">
                        <div class="file-icon big-attachment-icon"></div>
                        <div class="fw-600 pd-l-10">Tệp đính kèm</div>
                    </div>
                    <div class="w-100">
                        <div class="lst-attach-file d-flex al-center fl-wrap">
                            <FileAttach
                                v-for="fileAttach in dataEdit.lstFileAttachment" :key="fileAttach.fileId"
                                :data="fileAttach"
                                @deleteFileAttach="deleteFileAttach"
                                :displayFeature="true"
                            />
                        </div>
                    </div>
                    <div class="add-lst d-flex al-center pd-8 c-poiter fit-content" @click="uploadFileAttachment(event)">
                        <div class="file-icon plush-blue-icon"></div>
                        <div class="fw-600 pd-l-6 color-blue-taskdetail">Thêm tệp</div>
                    </div>
                </div>
                <div class="pd-t-16 seven-edit-task">
                    <div class="header d-flex al-center">
                        <div class="file-icon big-attachment-icon"></div>
                        <div class="fw-600 pd-l-10">Bình luận</div>
                    </div>
                    <div class="bottom-border-silver w-100 pd-t-10"></div>
                    <Comment 
                        class="mg-t-10"
                        v-for="comment in dataEdit.lstComment" :key="comment.commentId"
                        :data="comment"
                        @deleteFileAttach="deleteFileAttachComment"
                        @commitComment="commitComment"
                        :mode="modeCommentControl.Edit"
                        :taskId="option.taskId"
                        @deleteComment="deleteComment"
                        @attachNewFileCommentAdd="attachNewFileCommentAdd"
                    />
                    <Comment 
                        class="mg-t-10"
                        :data="dataEdit.CommentFake"
                        @deleteFileAttach="deleteFileAttachComment"
                        @attachNewFileCommentAdd="attachNewFileCommentAdd"
                        @commitComment="commitComment"
                        :mode="modeCommentControl.Add"
                        :taskId="option.taskId"
                    />
                </div>
            </div>
            <div class="not-primary-content">
                <div class="d-flex al-center remind-task extra-feature c-poiter">
                    <div class="file-icon remind-task-icon mg-l-10"></div>
                    <div class="pd-l-10">Nhắc việc</div>
                </div>
                <div class="d-flex extra-info-task created-by-task" v-if="!isAddingTask">
                    <div class="file-icon created-by-icon mg-t-2"></div> 
                    <div class="info pd-l-14">
                        <div>Đã tạo bởi</div>
                        <div class="fw-600">
                            {{dataEdit.createdBy.firstName}} {{dataEdit.createdBy.lastName}}
                        </div>
                        <div class="">
                            {{formatCreatedTime(dataEdit.createdTime)}}
                        </div>
                    </div>   
                </div>
            </div>
        </div>
    </div>
    <Modal :isShow="isShowDetail" :configModal="configModal" ref="modal">
        <component :is="nameDetailComponent" :option="props" @closePopup="closeSubPopup"></component>
    </Modal>
    <input type="file" class="d-none" id="inp-attach-file" accept="image/*">
</template>

<script>
import {EnumEditMode,EnumTypeTask,EnumAttachment, EnumModeUseControl} from '../../common/js/Enum.js';
import { uuid } from 'vue-uuid';
import Modal from '../commonComponent/Modal.vue';
import BaseViewDetail from '../commonComponent/BaseViewDetail.vue';
import AddLabelForm from '../ViewComponent/AddLabelForm.vue';
import { mapGetters, mapMutations } from 'vuex';
import FileAttach from '../commonComponent/FileAttach.vue';
import Comment from '../commonComponent/Comment.vue';
import {baseCallApi} from '../../common/js/BaseCallApi.js';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

export default {
    name: "TaskDetail",
    extends: BaseViewDetail,
    emits: ['closePopup'],
    components:{
        Modal,
        AddLabelForm,
        FileAttach,
        Comment
    },
    props:
    {
        option:
        {
            type: Object,
            default: function(rawProps)
            {
                return rawProps.option? rawProps.option: {
                    taskId: uuid.v1(),
                    typeTask: EnumTypeTask.Personal,
                    editMode: EnumEditMode.Watch
                };
            }
        }
    },
    created(){
        let me = this;
        if(me.option.editMode == EnumEditMode.Edit)
        {
            me.loadAllData();
        }
    },
    mounted(){
        let me = this;
        if(me.option.editMode == EnumEditMode.Add)
        {
            debugger;
            me.$refs.inpNewTask.focus();
        }
    },
    computed:
    {
        ...mapGetters('userManage', ['userInfo','isExistsUserInfo']),
        isCheckAll: function()
        {
            let me = this;
            let result = true;
            if(!me.dataEdit.lstCheckTask || me.dataEdit.lstCheckTask.length == 0)
            {
                result = null
            }
            else
            {
                me.dataEdit.lstCheckTask?.forEach(checkTask => {
                    result = result && checkTask.status;
                })
            }
            return result;
        }
    },
    methods: {
        addNewTask()
        {
            let me = this;
            me.callApi('post', 'api/task/insertcustom', {
                taskId: null,
                taskName: me.nameNewTask,
                typeTask: me.option.typeTask,
                description: null,
                AssignedByEmail: null,
                CreatedByEmail: null,
                CreatedTime: null,
                PathTreeTask: null,
                StartTime: null,
                EndTime: null,
                SortOrder: null,
                AssignForEmail: null
            },null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    me.nameNewTask = '';
                    me.isAddingTask = false;
                    me.option.taskId = data.taskId;
                    me.dataEdit.taskId = data.taskId;
                    me.dataEdit.taskName = data.taskName;
                    me.loadAllData();
                }
            });
            me.nameNewTask = '';
        },
        loadAllData()
        {
            let me = this;
            if(me.option.editMode == EnumEditMode.Edit || me.isAddingTask == false)
            {
                me.getInfoTask();
            }
            me.getListTaskChild();
            me.getListCheckList();
            me.getFileAttachment();
            me.getListLabel();
            me.getCommentsTask();
        },
        getInfoTask()
        {
            let me = this;
            debugger;
            me.callApi('get', `api/task/getfullinfo/${me.dataEdit.taskId}`,null).then(
                res => {
                    debugger;
                    if(res.data.success)
                    {
                        let data = res.data.data;
                        me.dataEdit.taskId = data.taskId;
                        me.dataEdit.taskName = data.taskName;
                        me.dataEdit.createdTime = data.createdTime;
                        me.dataEdit.PathTreeTask = data.PathTreeTask;
                        me.dataEdit.typeTask = data.typeTask;
                        me.dataEdit.assignedBy = {};
                        me.dataEdit.description = data.description;
                        me.dataEdit.sortOrder = data.sortOrder;
                        me.dataEdit.groupTask = data.groupTask;
                        me.dataEdit.startTime = data.startTime;
                        me.dataEdit.endTime = data.endTime;
                        me.dataEdit.assignForEmail = data.assignForEmail;
                        me.dataEdit.assignedFor = data.assignedFor;
                        me.dataEdit.assignedBy = data.assignedBy;
                        me.dataEdit.createdBy = data.createdBy;
                    }
                }
            );
        },
        commitDescription()
        {
            let me = this;
            me.callApi('put','api/task/description', {
                taskId: me.option.taskId,
                description: me.editorData
            },null)
            .then(res => {
                if(res.data.success)
                {
                    me.dataEdit.description = me.editorData;
                    me.isEditingDescription = false;
                }
            });
        },
        changeModeEditingDescription(status)
        {
            let me = this;
            me.isEditingDescription = status;
        },
        deleteComment(commentId){
            let me = this;
            me.callApi(`delete`,`api/comment/${commentId}`)
            .then(res => {
                if(res.data.success)
                {
                    me.dataEdit.lstComment = me.dataEdit.lstComment.filter(comment => comment.commentId != commentId);
                }
            });
        },
        getCommentsTask()
        {
            let me = this;
            me.callApi('get',`api/task/comment/${me.option.taskId}`)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    me.dataEdit.lstComment = data;
                    me.checkFinishLoadData();
                }
            });
        },
        commitComment(commentAfterEdit,modeOfComment){
            let me = this;
            if(modeOfComment == EnumModeUseControl.Add)
            {
                Object.assign(me.dataEdit.CommentFake.lstFileAttachment, commentAfterEdit.lstFileAttachment);
                me.dataEdit.CommentFake.commentId = uuid.v1();
                me.dataEdit.CommentFake.content = '';
                me.dataEdit.CommentFake.lstFileAttachment = [];
                me.dataEdit.lstComment.push(commentAfterEdit);
            }
            else
            {
                let commentEditing = me.dataEdit.lstComment.find(comment => comment.commentId == commentAfterEdit.commentId);
                let deletedFiles = commentEditing?.lstDeletedFileTemp;
                if( deletedFiles && deletedFiles.length > 0)
                {
                    me.callApi('post', 'file/deletemulti', deletedFiles, null)
                    .then(res => {
                        if(res.data.success)
                        {
                            me.dataEdit.lstComment.forEach(comment => {
                                if(comment.commentId == commentAfterEdit.commentId)
                                    comment.lstDeletedFileTemp = [];
                            })
                        }
                    });
                }
            }
        },
        attachNewFileCommentAdd(commentId, newFile, modeOfComment){
            let me = this;  
            if(modeOfComment == EnumModeUseControl.Add)
                me.dataEdit.CommentFake.lstFileAttachment.push(newFile);
            else
            {
                me.dataEdit.lstComment.forEach(comment => {
                    if(comment.commentId == commentId)
                        comment.lstFileAttachment.push(newFile);
                })
            }

        },
        deleteFileAttachComment(commentId,fileId,modeOfComment)
        {
            let me = this;
            if(modeOfComment == EnumModeUseControl.Add)
            {
                me.callApi('delete',`file/${fileId}`)
                .then(res => 
                    {
                        if(res.data.success)    
                        {
                            me.dataEdit.CommentFake.lstFileAttachment = 
                            me.dataEdit.CommentFake.lstFileAttachment.filter(file => {
                                return file.fileId != fileId;
                            });
                           
                        }
                    }
                );
            }
            else
            {
                me.dataEdit.lstComment.forEach(comment => {
                    if(comment.commentId == commentId)
                    {
                        comment.lstFileAttachment = comment.lstFileAttachment.filter(file => file.fileId != fileId);
                        if(!comment.lstDeletedFileTemp)
                        {
                            comment.lstDeletedFileTemp = [];
                        }
                        comment.lstDeletedFileTemp.push(fileId);
                    }
                });
            }
        },
        getListLabel(){
            let me = this;
            me.callApi('get',`api/task/label/${me.option.taskId}`)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    if(!data)
                    {
                        data = [];
                    }
                    // me.dataRoot.lstLabel = data;
                    me.dataEdit.lstLabel = data;
                    me.checkFinishLoadData();
                }
            });
        },
        getFileAttachment()
        {
            let me = this;
            me.callApi('get',`file/getattachfile/${me.option.taskId}`)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    // me.dataRoot.lstFileAttachment = data;
                    me.dataEdit.lstFileAttachment = data;
                    me.checkFinishLoadData();
                }
            });
        },
        uploadFileAttachment(event)
        {
            let me = this;
            let inpUploadAttachFile = document.getElementById('inp-attach-file');
            inpUploadAttachFile.onchange = function(eventChange)
            {
                me.formData = new FormData();
                for(let i = 0; i < inpUploadAttachFile.files.length; i++)
                {
                    let file = inpUploadAttachFile.files[i];
                    me.formData.append('formFiles', file);
                    me.formData.append('typeAttachment', EnumAttachment.AttachTask);
                    me.formData.append('attachmentId', me.option.taskId);
                    me.callApi('post','file/upload',me.formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(resUpload => {
                        
                        if(resUpload.data.success)
                        {
                            let data = resUpload.data.data;
                            me.dataEdit.lstFileAttachment.push(data);
                        }
                    });
                }
            };
            inpUploadAttachFile.click();
        },
        deleteFileAttach(fileId){
            let me = this;
            me.callApi('delete',`file/${fileId}`)
            .then(res => 
                {
                    if(res.data.success)    
                    {
                        me.dataEdit.lstFileAttachment = me.dataEdit.lstFileAttachment.filter(item => item.fileId != fileId);
                    }
                }
            );
        },
        deleteChildTask(taskId)
        {
            let me = this;
            me.dataEdit.lstChildTask = me.dataEdit.lstChildTask.filter(item => item.taskId != taskId);
        },
        checkFinishLoadData()
        {
            let me = this;
            if(!me.countLoad) 
                me.countLoad = 0;
            me.countLoad++;
            if(me.countLoad == 5 && me.option.editMode == EnumEditMode.Edit)
            {
                
            }
            else if(me.countLoad == 4 && me.option.editMode == EnumEditMode.Add)
            {

            }
        },
        linkImg(fileName)
        {
            let me = this;
            if(fileName)
            {
                return baseCallApi.doMain + '' + `/file/img/${fileName}`;
            }
            
            return '../../assets/defaultAvatar.png';
        },
        getListCheckList()
        {
            let me = this;
            me.callApi('get',`api/checkTask/getCheckTasks/${me.option.taskId}`,null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    if(data && data.length > 0)
                    {
                        // me.dataRoot.lstCheckTask = data;
                        me.dataEdit.lstCheckTask = data;
                    }
                    me.checkFinishLoadData();
                }
            });
        },
        getListTaskChild()
        {
            let me = this;
            me.callApi('get',`api/task/getChildTask/${me.option.taskId}`,null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    // me.dataRoot.lstChildTask = data;
                    me.dataEdit.lstChildTask = data;
                    me.checkFinishLoadData();
                }
            });
        },
        commitNewChildTask()
        {
            let me = this;
            if(me.fakeNameChildTask !== '')
            {
                let dataSave = {
                    taskId: uuid.v1(),
                    taskName: me.fakeNameChildTask,
                    typeTask: me.option.typeTask,
                    PathTreeTask: (me.dataEdit.PathTreeTask? me.dataEdit.PathTreeTask : '') + "/" + me.option.taskId,
                    createdByEmail: me.userInfo.email
                };
                me.callApi('post', 'api/task/insertChildTask', dataSave, null)
                .then(res => {
                    if(res.data.success)
                    {
                        let data = res.data.data;
                        me.dataEdit.lstChildTask.push(data);
                        me.fakeContentCheckList = '';
                        me.addingChildTask = false;
                    }
                });
            }
            else
            {
                me.fakeContentCheckList = '';
                me.addingChildTask = false;
            }
        },
        formatCreatedTime(time)
        {
            let me = this;
            let dateObject = me.$commonFunction.parseStringServerToDate(time);
            return time? 
            `${dateObject.getDate()}/${dateObject.getMonth()+1}/${dateObject.getFullYear()} ${dateObject.getHours()}:${dateObject.getMinutes()}`
            : 'Không xác định';
        },
        addChildTaskInput()
        {
            let me = this;
            me.addingChildTask = true;
        },
        closeSubPopup( callback )
        {
            let me = this;
            if(callback)
            {
                callback(me);
            }
            me.isShowDetail = false;
        },
        onReady( editor )  {
            editor.ui.getEditableElement().parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
            );
        },
        saveDescription()
        {
            let me = this;
            me.dataEdit.description = me.editorData;
        },
        changeCheckTask(checkTaskId)
        {
            let me = this;
            me.dataEdit.lstCheckTask.forEach(checkTask => {
                if(checkTask.checkTaskId == checkTaskId)
                    checkTask.status = !checkTask.status;
            });
        },
        checkAll()
        {
            let me = this;
            me.dataEdit.lstCheckTask.forEach(checkTask => {
                checkTask.status = true;
            })
        },
        checkFalseAll()
        {
            let me = this;
            me.dataEdit.lstCheckTask.forEach(checkTask => {
                checkTask.status = false;
            })
        },
        commitValueFakeContentCkLst(){
            let me = this;
            if(me.fakeContentCheckList !== '')
            {
                let dataSave =  
                {
                    checkTaskId: uuid.v1(),
                    content: me.fakeContentCheckList,
                    status: false,
                    taskId: me.option.taskId
                };

                me.callApi('post',`api/checktask`,dataSave,null)
                .then(res => {
                    if(res.data.success)
                    {
                        me.dataEdit.lstCheckTask.push(dataSave);
                        me.addingCheckList = false;
                        me.fakeContentCheckList = '';
                    }
                });
            }
            else
            {
                me.addingCheckList = false;
                me.fakeContentCheckList = '';    
            }
        },
        addCheckList()
        {
            let me = this;
            me.fakeContentCheckList = '';
            me.addingCheckList = true;
        },
        deleteCheckTask(checkTaskId)
        {
            let me = this;
            me.callApi('delete',`api/checktask/${checkTaskId}`)
            .then(res => {
                if(res.data.success)
                {
                    me.dataEdit.lstCheckTask = me.dataEdit.lstCheckTask.filter(checkTask => 
                        checkTask.checkTaskId != checkTaskId);        
                }
            });
        },
        deleteLabelFromList(labelId)
        {
            let me = this;
            me.callApi('delete',`api/task/label/${me.option.taskId}/${labelId}`)
            .then(
                res => {
                    if(res.data.success)
                    {
                        me.dataEdit.lstLabel = me.dataEdit.lstLabel.filter(label => 
                            label.labelId != labelId);
                    }
                }
            );
        },
        showFormAddLabel()
        {
            let me = this;
            me.showDetail('AddLabelForm',{
                width: '400px',
                height: 'auto',
                borderTop: true
            }, null, null);
        },
        clostPopup()
        {
            let me = this;
            let callbackWhenClosePopup = function(objecParent){
                let isExistsTask = false;
                objecParent.lstColumnTask.forEach(column => {
                    column.lstTask?.forEach(task => {
                        if(task.taskId == me.dataEdit.taskId)
                        {
                            isExistsTask = true;
                            task = me.dataEdit;
                            // objecParent.$nextTick(() => {

                            // })
                        }
                    });
                })

                if(!isExistsTask)
                {
                    if(me.option.typeTask == EnumTypeTask.Personal && objecParent.lstColumnTask.length > 0)
                    {
                        if(!objecParent.lstColumnTask[0].lstTask)
                        {
                            objecParent.lstColumnTask[0].lstTask = [];
                        }
                        objecParent.lstColumnTask[0].lstTask.push(me.dataEdit);
                    }
                }
            };
            me.$emit('closePopup',
                callbackWhenClosePopup,
                "ViewComponent");
        }
    },
    data()
    {
        return{


            isAddingTask: this.option.editMode == EnumEditMode.Add,
            nameNewTask: '',
            isLoadingData: true,

            //comment            
            modeCommentControl: EnumModeUseControl,

            //modal
            nameDetailComponent: '',
            props: undefined,
            isShowDetail: false,
            configModal: undefined,
            callbackOutsideComponent: null,

            //checklist
            addingCheckList: false,
            fakeContentCheckList: '',

            //childTask
            addingChildTask: false,
            fakeNameChildTask: '',

            //ckeditor
            isEditingDescription: false,
            editor: DecoupledEditor,
            editorData: '',
            editorConfig: {
                toolbar: {
                    items: [
                        'bold','italic','underline','strikethrough','|',
                        'fontsize','fontcolor','fontfamily','|',
                        'alignment',
                    ]
                }
            },

            //data handle
            // dataRoot:
            // {
            //     description: '',
            //     path: '',
            //     lstCheckTask: [],
            //     lstLabel: [],
            //     lstChildTask: []
            // },
            dataEdit: {
                taskId: this.option.taskId,
                taskName: '[In báo cáo/Báo cáo]Truy vấn lấy vé xuất lại',
                createdBy: {
                    email: "tlminh40300@gmail.com",
                    fileAvatar: 'c304fbcb-7520-4ad9-b6d0-c020ee826330_rPL27_5f.jpg',
                    firstName: "Trần",
                    lastName: "Lê Minh"
                },
                createdTime: '2022-10-17T10:51:30',
                description: '',
                path: '',
                lstCheckTask: [
                    // {
                    //     checkTaskId: '1',
                    //     content: 'Tạo Database',
                    //     status: false
                    // }
                ],
                lstLabel: [],
                lstChildTask: [
                    // {
                    //     taskId: '1',
                    //     taskName: 'Task 1'
                    // },
                ],
                lstFileAttachment: [
                //    {
                //         fileId: '0f3a7af9-2609-4c3a-b900-c35982178eaa',
                //         fileName: '0f3a7af9-2609-4c3a-b900-c35982178eaa_acdbb4bc-d5b8-4a0f-88b1-376efbf966a3.jpg',
                //         extensionOfFile: '.jpg',
                //         filePath: '',
                //         typeAttachment: 1,
                //         attachmentId: this.option.taskId,
                //         createdTime: null,
                //         createdByEmail: null
                //    }
                ],
                lstComment: [
                    // {
                    //     commentId: uuid.v1(),
                    //     createdByEmail: null,
                    //     createdTime: new Date(),
                    //     content: 'alo 123',
                    //     lstFileAttachment: [
                    //         {
                    //             fileId: '0f3a7af9-2609-4c3a-b900-c35982178eaa',
                    //             fileName: '0f3a7af9-2609-4c3a-b900-c35982178eaa_acdbb4bc-d5b8-4a0f-88b1-376efbf966a3.jpg',
                    //             extensionOfFile: '.jpg',
                    //             filePath: '',
                    //             typeAttachment: EnumAttachment.AttachComment,
                    //             attachmentId: this.option.taskId,
                    //             createdTime: null,
                    //             createdByEmail: null
                    //        },
                    //     ],
                    //     user: 
                    //     {
                    //         email: "tlminh40300@gmail.com",
                    //         fileAvatar: 'c304fbcb-7520-4ad9-b6d0-c020ee826330_rPL27_5f.jpg',
                    //         firstName: "Trần",
                    //         lastName: "Lê Minh"
                    //     }
                    // }
                ],
                CommentFake: {
                    commentId: uuid.v1(),
                    createdByEmail: null,
                    createdTime: null,
                    content: '',
                    lstFileAttachment: [],
                    user: null
                },
                assignedFor:  {},
                assignedBy : {},
                createdBy : {}
            }
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/ViewComponent/TaskDetail.css');
</style>