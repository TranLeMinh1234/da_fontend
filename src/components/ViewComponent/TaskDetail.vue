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
                <IconDropDown
                    iconClass="more-feature-icon"
                    :config="{
                        width: 250,
                        height: 75,
                        directArrow: 'top'
                    }"
                    :isShowDropDown="isShowMoreFeatureDropDown"
                    @showDropDownEvent="showMoreFeatureTaskDetail"
                    @closeDropDownEvent="closeMoreFeatureTaskDetail"
                >
                    <div class="more-feature-taskdetail pd-8">
                        <div class="d-flex pd-16 al-center feature-taskdetail-item c-poiter" @click="deleteTask()">
                            <div class="file-icon delete-line-icon pd-r-12"></div>
                            <div class="cl-red">Xóa</div>
                        </div>
                    </div>
                </IconDropDown>
                <div class="file-icon c-poiter exit-popup-icon" @click="closeTaskDetailPopup()"></div>
            </div>
        </div>
        <div class="body-task d-flex">
            <div :class="['primary-content', isAddingTask? 'mg-t-60':'']">
                <div class="name-task txt-threedots fw-600" v-if="!isAddingTask">{{dataEdit.taskName}}</div>
                <div class="user-assigned" v-if="!isAddingTask">Người giao việc: <span>{{dataEdit.assignedBy?.firstName}} {{dataEdit.assignedBy?.lastName}}</span></div>
                <div class="user-assigned" v-if="isAddingTask">Người giao việc:</div>
                <div class="one-edit-task d-flex w-100 pd-t-16 j-spread-around">
                    <div class="one-edit-item assigned-user w-48 d-flex al-center" v-if="!isCanAssignTask">
                        <img :src="linkImg(dataEdit.assignedFor?.fileAvatarName)" alt="" class="avatar mg-l-10">
                        <div class="info-assigned-user pd-l-16">
                            <div>Người thực hiện</div>
                            <div class="fw-600">{{dataEdit.assignedFor?.firstName}} {{dataEdit.assignedFor?.lastName}}</div>
                        </div>
                    </div>
                    <ItemDropDown
                        :config="{
                            width: 300,
                            height: 340,
                            directArrow: 'top'
                        }"
                        v-if="isCanAssignTask"
                        :isShowDropDown="isShowChooseUserDropDown"
                        @showDropDownEvent="showChooseUserDropDown"
                        @closeDropDownEvent="closeChooseUserDropDown"
                        class="one-edit-item assigned-user w-48 d-flex al-center"
                    >
                        <template #item>
                            <div class="w-100 h-100 d-flex al-center c-poiter">
                                <img :src="linkImg(dataEdit.assignedFor?.fileAvatarName)" alt="" class="avatar mg-l-10">
                                <div class="info-assigned-user pd-l-16">
                                    <div>Người thực hiện</div>
                                    <div class="fw-600">{{dataEdit.assignedFor?.firstName}} {{dataEdit.assignedFor?.lastName}}</div>
                                </div>
                            </div>
                        </template>
                        <template #dropdown>
                            <div class="w-100 h-100">
                                <div class="pd-10 fw-600">Chọn người thực hiện</div>
                                <div class="pd-10">
                                    <MInput 
                                        :isHaveIcon="true"
                                        padding="10px 14px 10px 32px" 
                                        icon="medium-search-icon"
                                        placeholder="Tìm thàng viên..."
                                        @enterEvent="searchAssignedUserEvent"
                                        v-model="searchAssignedUser"
                                        :isValidate="false"
                                    />
                                </div>
                                <div class="list-assigned-user">
                                    <div
                                        v-for="user in listFilterAssignedUser" :key="user.email"
                                        :class="['option-assigned-user', 'd-flex', 'al-center', 'c-poiter', 'pd-10']"
                                        @click="selectAssignedUser(user)"
                                    >
                                        <img :src="linkImg(user.fileAvatarName)" alt="">
                                        <div class="pd-l-12">
                                            <div class="fw-600">{{user.firstName}} {{user.lastName}}</div>
                                            <div>{{user.email}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </ItemDropDown>
                    <ItemDropDown
                        :config="{
                            width: 600,
                            height: 500,
                            directArrow: 'top'
                        }"
                        :isShowDropDown="isShowDeadlineDropDown"
                        @showDropDownEvent="showDeadLineTaskDetail"
                        @closeDropDownEvent="closeDeadLineTaskDetail"
                        class="one-edit-item w-48 d-flex al-center"
                    >
                        <template #item>
                            <div class="w-100 h-100 d-flex al-center c-poiter">
                                <div class="file-icon select-expire-time-icon mg-l-10"></div>
                                <div class="info-assigned-user pd-l-16" v-if="dataEdit.endTime == null && dataEdit.startTime == null">
                                    Chọn hạn hoàn thành
                                </div>
                                <div class="pd-l-16">
                                    <div class="mg-t-auto" v-if="dataEdit.startTime"><span>Từ ngày: </span><span class="fw-600">{{$commonFunction.parseDateJsToString(dataEdit.startTime)}}</span></div>
                                    <div class="mg-t-auto" v-if="dataEdit.endTime"><span>Đến ngày: </span><span class="fw-600">{{$commonFunction.parseDateJsToString(dataEdit.endTime)}}</span></div>
                                </div>
                            </div>
                        </template>
                        <template #dropdown>
                            <div class="d-flex header-deadline-dropdown">
                                <div 
                                    :class="['c-poiter','d-flex','tab-deadline',!isTabStartDeadline? 'tab-active':'','center-items']"
                                    @click="isTabStartDeadline = !isTabStartDeadline"
                                >
                                    <div>Hạn hoàn thành</div>
                                </div>
                                <div 
                                    :class="['c-poiter','d-flex','tab-deadline',isTabStartDeadline? 'tab-active':'','center-items']"
                                    @click="isTabStartDeadline = !isTabStartDeadline"
                                >
                                    <div>Thời gian bắt đầu</div>
                                </div>
                            </div>
                            <div class="date-picker d-flex">
                                <Datepicker 
                                v-show="!isTabStartDeadline"
                                style="width: 100%"
                                :format="formatDatePicker"
                                selectText="Lưu"
                                :value="dataEdit.endTime" @update:modelValue="commitEndTime"
                                inline/>
                                <Datepicker 
                                v-show="isTabStartDeadline"
                                style="width: 100%"
                                :format="formatDatePicker"
                                selectText="Lưu"
                                :value="dataEdit.endTime" @update:modelValue="commitStartTime"
                                inline/>
                            </div>
                            <div class="d-flex al-center fit-content mg-t-10 c-poiter" @click="deleteDeadlineTask">
                                <div class="file-icon delete-line-icon"></div>
                                <div class="cl-red">Xóa</div>
                            </div>
                        </template>
                    </ItemDropDown>
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
                                <div class="file-icon hole-trash-icon c-poiter" v-if="canDeleteCheckTask(checkTask)" @click="deleteCheckTask(checkTask.checkTaskId)"></div>
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
                <div class="pd-t-16 four-edit-task" v-if="dataEdit.listLabel.length > 0">
                    <div class="header d-flex al-center">
                        <div class="file-icon attach-label-icon"></div>
                        <div class="fw-600 pd-l-10">Gắn thẻ</div>
                    </div>
                    <div class="d-flex lst-label al-center fl-wrap w-100 mg-t-10">
                        <div 
                            v-for="label in dataEdit.listLabel" :key="label.labelId"
                            class="label"
                            :style="{
                                color: 'white',
                                backgroundColor: label.color,
                            }"
                        >
                            <div 
                                class="feature-label file-icon exit-cirle-icon d-none c-poiter" 
                                v-if="canDeleteLabelFromTask(label)"
                                @click="deleteLabelFromList(label.labelId)"></div>
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
                                    @click="deleteChildTask(childTask)"
                                    v-if="checkPermissionDeleteChildTask(childTask)"
                                    ></div>
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
                                :displayFeature="canEditFileAttach(fileAttach)"
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
                        :typeTask="option.typeTask"
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
                <div class="d-flex al-center remind-task extra-feature c-poiter" @click="openSettingRemindTask">
                    <div class="file-icon remind-task-icon mg-l-10"></div>
                    <div class="pd-l-14">Nhắc việc</div>
                </div>
                <div class="d-flex al-center remind-task extra-feature c-poiter" @click="confirmFinishedWork" v-if="checkCanConfirmFinishedWork">
                    <div class="file-icon confirm-finished-work-icon mg-l-14"></div>
                    <div class="pd-l-14">Xác nhận hoàn thành công việc</div>
                </div>
                <div class="d-flex al-center remind-task extra-feature c-poiter" @click="confirmNotFinishedWork" v-if="checkCanConfirmFinishedWork">
                    <div class="file-icon confirm-not-finished-work-icon mg-l-14"></div>
                    <div class="pd-l-14">Đánh dấu chưa hoàn thành công việc</div>
                </div>
                <div class="d-flex al-center remind-task extra-feature c-poiter" @click="checkFinishedWork" v-if="checkCanCheckFinishedWork">
                    <div class="file-icon finished-work-icon mg-l-14"></div>
                    <div class="pd-l-14">Đánh dấu hoàn thành công việc</div>
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
import {EnumStatusTask,EnumEditMode,EnumTypeTask,EnumAttachment, EnumModeUseControl, EnumTypeDeadline, EnumTypeGroupTask} from '../../common/js/Enum.js';
import { uuid } from 'vue-uuid';
import Modal from '../commonComponent/Modal.vue';
import IconDropDown from '../commonComponent/IconDropDown.vue';
import BaseViewDetail from '../commonComponent/BaseViewDetail.vue';
import AddLabelForm from '../ViewComponent/AddLabelForm.vue';
import SettingRemindTask from '../ViewComponent/SettingRemindTask.vue';
import { mapGetters, mapMutations } from 'vuex';
import FileAttach from '../commonComponent/FileAttach.vue';
import Comment from '../commonComponent/Comment.vue';
import {baseCallApi} from '../../common/js/BaseCallApi.js';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import ItemDropDown from '../commonComponent/ItemDropDown.vue';
import Datepicker from '@vuepic/vue-datepicker';
import MInput from '../commonComponent/MInput.vue';

export default {
    name: "TaskDetail",
    extends: BaseViewDetail,
    emits: ['closePopup'],
    components:{
        Modal,
        AddLabelForm,
        FileAttach,
        Comment,
        IconDropDown,
        ItemDropDown,
        Datepicker,
        SettingRemindTask,
        MInput
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
                    editMode: EnumEditMode.Watch,
                };
            }
        }
    },
    created(){
        let me = this;
        me.deadLineHaveToLoad = 0;

        me.formatDatePicker = (date) => 
        {
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
        }

        if(me.option.editMode == EnumEditMode.Edit)
        {
            me.loadAllData();
        }
    },
    mounted(){
        let me = this;
        if(me.option.editMode == EnumEditMode.Add)
        {
            me.$refs.inpNewTask.focus();
        }
    },
    computed:
    {
        ...mapGetters('userManage', ['userInfo','isExistsUserInfo']),
        checkCanConfirmFinishedWork()
        {
            let me = this;
            if(me.option.typeTask == EnumTypeTask.Group)
            {
                if((me.userInfo.role?.listPermissionCode?.includes("AllPermission") 
                || me.userInfo.role?.listPermissionCode?.includes("ManageTaskGroup"))
                && me.dataEdit.assignForEmail != me.userInfo.email && me.dataEdit.status == EnumStatusTask.CheckFinished)
                {
                    return true;
                }
                else 
                    return false;
            }
            else 
            {
                return false;
            }
        },
        checkCanCheckFinishedWork()
        {
            let me = this;
            if(me.option.typeTask == EnumTypeTask.Group)
            {
                if(me.dataEdit.status == EnumStatusTask.NeedExecute
                && me.dataEdit.assignForEmail == me.userInfo.email)
                {
                    return true;
                }
                else 
                    return false;
            }
            else 
            {
                return false;
            }   
        },
        isGroupTypeTask: function()
        {
            let me = this;
            return me.option.typeTask == EnumTypeTask.Group;
        },
        isCanManageTask: function()
        {
            let me = this;
            if(me.userInfo.role.listPermissionCode.includes('AllPermission') 
                || me.userInfo.role.listPermissionCode.includes('ManageTaskGroup') 
            )
            {
                return true;
            }
            return false;
        },
        isCanAssignTask: function()
        {
            let me = this;
            if(me.option.typeTask == EnumTypeTask.Group)
            {
                if(me.userInfo.role.listPermissionCode.includes('AllPermission') 
                    || me.userInfo.role.listPermissionCode.includes('ManageTaskGroup') 
                )
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
                return false;
        },
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
    watch:{
    },
    methods: {
        canDeleteLabelFromTask(label)
        {
            let me = this;
            if(me.option.typeTask == EnumTypeTask.Group)
            {
                if(me.userInfo.role.listPermissionCode.includes('AllPermission') 
                || me.userInfo.role.listPermissionCode.includes('ManageTaskGroup') 
                || (label.attachToTaskByEmail == me.userInfo.email))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return true;
            }
        },
        canEditFileAttach(canEditFileAttach)
        {
            let me = this;
            if(me.option.typeTask == EnumTypeTask.Group)
            {
                if(me.userInfo.role.listPermissionCode.includes('AllPermission') 
                || me.userInfo.role.listPermissionCode.includes('ManageTaskGroup') 
                || (canEditFileAttach.createdByEmail == me.userInfo.email))
                {
                    return true;
                }
                else
                    return false;
            }
            else
            {
                return true;
            }
        },
        canDeleteCheckTask(checkTask)
        {
            let me = this;
            if(me.option.typeTask == EnumTypeTask.Group)
            {
                if(me.userInfo.role.listPermissionCode.includes('AllPermission') 
                || me.userInfo.role.listPermissionCode.includes('ManageTaskGroup') 
                || (checkTask.createdByEmail == me.userInfo.email))
                {
                    return true;
                }
                else
                    return false;
            }
            else
            {
                return true;
            }
        },
        confirmFinishedWork()
        {
            let me = this;
            me.showDialogConfirm(
                {
                    width: '600px',
                    height: '180px',
                    borderTop: true
                },
                {
                    'title': 'Cảnh báo',
                    'content': 'Bạn có chắc muốn xác nhận công việc này đã hoàn thành?'
                },
                () =>{
                    me.callApi('put','api/task/confirmfinishwork',[
                        me.dataEdit.taskId,
                        EnumStatusTask.ConfirmedFinished + ""
                    ],null)
                    .then(res => {
                        if(res.data.success)
                        {
                            me.dataEdit.status = EnumStatusTask.ConfirmedFinished;
                        }
                    });
                }
            );
        },
        confirmNotFinishedWork()
        {
            let me = this;
            me.showDialogConfirm(
                {
                    width: '600px',
                    height: '180px',
                    borderTop: true
                },
                {
                    'title': 'Cảnh báo',
                    'content': 'Bạn có chắc muốn đánh dấu công việc này chưa hoàn thành?'
                },
                () =>{
                    me.callApi('put','api/task/confirmfinishwork',[
                        me.dataEdit.taskId,
                        EnumStatusTask.NeedExecute + ""
                    ],null)
                    .then(res => {
                        if(res.data.success)
                        {
                            me.dataEdit.status = EnumStatusTask.NeedExecute;
                        }
                    });
                }
            );
        },
        checkFinishedWork()
        {
            let me = this;
            me.callApi('put','api/task/checkfinished',{
                taskId: me.dataEdit.taskId
            },null)
            .then(res => {
                if(res.data.success)
                {
                    me.dataEdit.status = EnumStatusTask.CheckFinished;
                }
            });
        },
        checkPermissionDeleteChildTask(childTask)
        {
            let me = this;
            return childTask.createdByEmail == me.userInfo.email ||
                    me.userInfo.role.listPermissionCode.includes("AllPermission") ||
                    me.userInfo.role.listPermissionCode.includes("ManageTaskGroup");
        },
        selectAssignedUser(userSelected)
        {
            let me = this;
            me.callApi('put',`api/task/assignforuser/${me.option.groupTaskId}/${me.dataEdit.taskId}/${userSelected.email}`,null,null)
            .then(res => {
                if(res.data.success)
                {
                    me.dataEdit.assignedFor = userSelected;
                    me.dataEdit.assignForEmail = userSelected.email;
                    me.isShowChooseUserDropDown = false;
                }
            });
        },
        searchAssignedUserEvent()
        {
            let me = this;
            me.listFilterAssignedUser = me.option.listAssignedUser.filter(user => {
                let name = `${user.firstName} ${user.lastName}`;
                return name.includes(me.searchAssignedUser);
            });
        },
        openSettingRemindTask()
        {
            let me = this;
            if(me.isCanManageTaskInGroup())
            {
                if(me.dataEdit.startTime || me.dataEdit.endTime)
                {
                    me.showDetail('SettingRemindTask',{
                        width: '430px',
                        height: 'auto',
                        borderTop: true
                    }, {
                        userDoTask: me.dataEdit.assignedFor,
                        userAssigned: me.dataEdit.assignedBy,
                        taskId: me.option.taskId,
                        startTime: me.dataEdit.startTime,
                        endTime: me.dataEdit.endTime
                    }, null);
                }
                else
                {
                    me.showDialogNotification(
                        {
                            width: '430px',
                            height: '200px',
                            borderTop: true
                        },
                        {
                            'title': 'Nhắc việc',
                            'content': 'Vui lòng thiết lập lại thời gian bắt đầu hoặc thời gian kết thúc công việc để thực hiện tính năng này.'
                        },
                        () =>{
                        }
                    );
                }
            }
            else
            {
                me.showDialogNotification({
                    width: "420px",
                    height: "180px",
                    borderTop: true
                },{
                    'title': "Cảnh báo",
                    'content': "Bạn không có quyền thực hiện chức năng này."
                }, undefined);
            }
        },
        commitEndTime(newValue)
        {
            let me = this;

            let oldValue = me.dataEdit.endTime;

            if(typeof me.dataEdit.startTime == 'string')
            {
                me.dataEdit.startTime = me.$commonFunction.parseStringServerToDate(me.dataEdit.startTime);
            }

            if(newValue != null && me.dataEdit.startTime != null && newValue.getTime() < me.dataEdit.startTime.getTime())
            {
                me.showDialogNotification(
                    {
                        width: '400px',
                        height: '200px',
                        borderTop: true
                    },
                    {
                        'title': 'Cảnh báo',
                        'content': 'Thời gian bắt đầu không được nhỏ hơn hạn hoàn thành.'
                    },
                    () =>{
                    }
                );
                me.dataEdit.endTime = oldValue;
                me.isShowDeadlineDropDown = false;
            }
            else
            {
                me.showDialogConfirm(
                    {
                        width: '600px',
                        height: '200px',
                        borderTop: true
                    },
                    {
                        'title': 'Cảnh báo',
                        'content': 'Thiết lập lời nhắc nhở của công việc sẽ bị xóa bỏ nếu bạn thay đổi mốc thời gian này. Bạn có chắc muốn thay đổi thời gian đến hạn công việc.'
                    },
                    () =>{
                        me.callApi('put',`api/task/deadline`,{
                            "newDeadline" : me.$commonFunction.parseDateToStringDateServer(newValue),
                            'taskId': me.option.taskId,
                            'typeDeadline': EnumTypeDeadline.End
                        },null)
                        .then(res => {
                            if(res.data.success)
                            {
                                me.dataEdit.endTime = newValue;
                                me.isShowDeadlineDropDown = false;
                            }
                        });
                    }
                );
                me.isShowDeadlineDropDown = false;
            }

        },
        commitStartTime(newValue)
        {
            let me = this;

            let oldValue = me.dataEdit.startTime;
            
            if(typeof me.dataEdit.endTime == 'string')
            {   
                me.dataEdit.endTime = me.$commonFunction.parseStringServerToDate(me.dataEdit.endTime);
            }

            if(newValue != null && me.dataEdit.endTime != null && newValue.getTime() > me.dataEdit.endTime.getTime())
            {
                me.showDialogNotification(
                    {
                        width: '400px',
                        height: '200px',
                        borderTop: true
                    },
                    {
                        'title': 'Cảnh báo',
                        'content': 'Thời gian bắt đầu không được nhỏ hơn hạn hoàn thành.'
                    },
                    () =>{
                    }
                );
                me.dataEdit.startTime = oldValue;
                me.isShowDeadlineDropDown = false;
            }
            else
            {
                me.showDialogConfirm(
                    {
                        width: '600px',
                        height: '200px',
                        borderTop: true
                    },
                    {
                        'title': 'Cảnh báo',
                        'content': 'Thiết lập lời nhắc nhở của công việc sẽ bị xóa bỏ nếu bạn thay đổi mốc thời gian này. Bạn có chắc muốn thay đổi thời gian bắt đầu công việc.'
                    },
                    () =>{
                        me.callApi('put',`api/task/deadline`,{
                            "newDeadline" : me.$commonFunction.parseDateToStringDateServer(newValue),
                            'taskId': me.option.taskId,
                            'typeDeadline': EnumTypeDeadline.Start
                        },null)
                        .then(res => {
                            if(res.data.success)
                            {
                                me.dataEdit.startTime = newValue;
                                me.isShowDeadlineDropDown = false;
                            }
                        });
                    }
                );
                me.isShowDeadlineDropDown = false;
            }
        },
        endTimeChange(newValue)
        {
            let me = this;
            let oldValue = me.dataEdit.endTime;

            if(typeof me.dataEdit.startTime == 'string')
            {
                me.dataEdit.startTime = me.$commonFunction.parseStringServerToDate(me.dataEdit.startTime);
            }

            if(newValue != null && me.dataEdit.startTime != null && newValue.getTime() < me.dataEdit.startTime.getTime())
            {
                me.showDialogNotification(
                    {
                        width: '400px',
                        height: '200px',
                        borderTop: true
                    },
                    {
                        'title': 'Cảnh báo',
                        'content': 'Thời gian bắt đầu không được nhỏ hơn hạn hoàn thành.'
                    },
                    () =>{
                    }
                );
                me.dataEdit.endTime = oldValue;
            }
            else
            {
                me.callApi('put',`api/task/deadline`,{
                    "newDeadline" : me.$commonFunction.parseDateToStringDateServer(newValue),
                    'taskId': me.option.taskId,
                    'typeDeadline': EnumTypeDeadline.End
                },null)
                .then(res => {
                    if(res.data.success)
                    {
                    }
                });
            }
        },
        deleteDeadlineTask()
        {
            let me = this;
            me.callApi('put',`api/task/deadline`,{
                    "newDeadline" : null,
                    'taskId': me.option.taskId,
                    'typeDeadline': me.isTabStartDeadline? EnumTypeDeadline.Start : EnumTypeDeadline.End
                },null)
                .then(res => {
                    if(res.data.success)
                    {
                        if(me.isTabStartDeadline)
                        {
                            me.dataEdit.startTime = null;
                        }
                        else
                        {
                            me.dataEdit.endTime = null;
                        }

                        me.isShowDeadlineDropDown = false;
                    }
                });
        },
        showDeadLineTaskDetail()
        {
            let me = this;
            if(me.isCanManageTaskInGroup())
            {
                me.$zindexManage.generateBiggestZindex();
                me.isShowDeadlineDropDown = true;    
            }
            else
            {
                me.showDialogNotification({
                    width: "420px",
                    height: "180px",
                    borderTop: true
                },{
                    'title': "Cảnh báo",
                    'content': "Bạn không có quyền thực hiện chức năng này."
                }, undefined);
            }
        },
        closeDeadLineTaskDetail()
        {
            let me = this;
            me.$zindexManage.clearBiggestIndex();
            me.isShowDeadlineDropDown = false;
        },
        isCanManageTaskInGroup()
        {
            let me = this;
            if(me.option.typeTask == EnumTypeTask.Group)
            {
                if(me.userInfo.role.listPermissionCode.includes('AllPermission') 
                || me.userInfo.role.listPermissionCode.includes('ManageTaskGroup'))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
                return true;
        },
        showChooseUserDropDown()
        {
            let me = this;
            me.$zindexManage.generateBiggestZindex();
            me.isShowChooseUserDropDown = true;
        },
        closeChooseUserDropDown()
        {
            let me = this;
            me.$zindexManage.clearBiggestIndex();
            me.isShowChooseUserDropDown = false;
        },
        deleteTask(taskId)
        {
            let me = this;
            let taskIdDelete = taskId? taskId : me.option.taskId;
            if(me.userInfo.email == me.dataEdit.createdBy.email || me.userInfo.role.listPermissionCode.includes("AllPermission")
                || me.userInfo.role.listPermissionCode.includes("ManageTaskGroup"))
            {
                let callbackAfterDeleteTask = function()
                {
                    me.callApi('delete', `api/task/deleteCustom/${taskIdDelete}`,null)
                    .then(res => {
                        if(res.data.success)
                        {
                            let data = res.data.data;
                            let callBackDoInDailyTaskView = function(){};
                            if(me.option.typeTask == EnumTypeTask.Personal)
                            {
                                callBackDoInDailyTaskView = function(objecParent)
                                {
                                    objecParent.lstColumnTask.forEach(column => {
                                        column.lstTask = column.lstTask && column.lstTask.length > 0 ? 
                                            column.lstTask.filter(task => task.taskId != taskIdDelete) 
                                            : [];
                                    })

                                    objecParent.toast.success('Xóa công việc thành công.');
                                }
                            }
                            else
                            {
                                callBackDoInDailyTaskView = function(objecParent)
                                {
                                    let tasksAffectedSortOrder = [];
                                    objecParent.templateGroupTask.listProcess.forEach(process => {
                                        if(process.processId == me.option.processId)
                                        {
                                            process.lstTask.forEach(task => {
                                                if(task.sortOrder > me.dataEdit.sortOrder)
                                                {
                                                    task.sortOrder = task.sortOrder-1;
                                                    tasksAffectedSortOrder.push(
                                                        {
                                                            taskId: task.taskId,
                                                            processId: process.processId,
                                                            sortOrder: task.sortOrder
                                                        }
                                                    );
                                                }
                                            });
                                            process.lstTask = process.lstTask.filter(task => task.taskId != taskIdDelete);
                                            process.lstTask.sort((taskLeft,taskRight) => {
                                                return taskLeft.sortOrder - taskRight.sortOrder;
                                            });
                                        }
                                    });

                                    if(tasksAffectedSortOrder.length > 0)
                                    {
                                        objecParent.loader = objecParent.$loading.show();
                                        me.callApi('put', 'api/task/processbatch', tasksAffectedSortOrder, null)
                                        .then(res => {
                                            if(res.data.success)
                                            {
                                                objecParent.loader.hide();
                                                objecParent.toast.success('Xóa công việc thành công.');
                                            }
                                        });
                                    }
                                }
                            }                            
                            me.$emit('closePopup',
                                    callBackDoInDailyTaskView,
                                    "ViewComponent");
                        }
                    });
                }

                me.showDialogConfirm({
                    width: "500px",
                    height: "260px",
                    borderTop: true
                },{
                    'title': "Xóa công việc",
                    'content': "Sau khi thực hiện xóa công việc, tất cả các dữ liệu liên quan bao gồm: thông tin mô tả công việc, tài liệu đính kèm, các công việc con, bình luận, lịch sử hoạt động,... sẽ bị xóa khỏi hệ thống? Bạn có chắc chắn muốn thực hiện thao tác này không?"
                }, callbackAfterDeleteTask);
            }
            else
            {
                me.showDialogNotification({
                    width: "420px",
                    height: "180px",
                    borderTop: true
                },{
                    'title': "Cảnh báo",
                    'content': "Bạn không có quyền thực hiện chức năng này."
                }, undefined);
            }
        },
        showMoreFeatureTaskDetail()
        {
            let me = this;
            me.isShowMoreFeatureDropDown = true;
        },
        closeMoreFeatureTaskDetail()
        {
            let me = this;
            me.isShowMoreFeatureDropDown = false;
        },
        addNewTask()
        {
            let me = this;
            if(me.nameNewTask)
            {
                me.callApi('post', 'api/task/insertcustom', {
                    taskId: null,
                    taskName: me.nameNewTask,
                    typeTask: me.option.typeTask,
                    processId: (me.option.typeTask == EnumTypeTask.GroupPersonal) ||
                        (me.option.typeTask == EnumTypeTask.Group)  ? 
                        me.option.processId : null,
                    groupTaskId: (me.option.typeTask == EnumTypeTask.GroupPersonal) ||
                        (me.option.typeTask == EnumTypeTask.Group)  ? 
                        me.option.groupTaskId : null,
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
                        me.isAddingTask = false;
                        me.option.taskId = data.taskId;
                        me.dataEdit.taskId = data.taskId;
                        me.dataEdit.taskName = data.taskName;
                        me.dataEdit.processId = data.processId;
                        me.loadAllData();
                    }
                });
            }
            else
            {
                
            }
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
            me.callApi('get', `api/task/getfullinfo/${me.dataEdit.taskId}`,null).then(
                res => {
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
                        me.dataEdit.processId = data.processId;
                        me.dataEdit.assignForEmail = data.assignForEmail;
                        me.dataEdit.assignedFor = data.assignedFor;
                        me.dataEdit.assignedBy = data.assignedBy;
                        me.dataEdit.createdBy = data.createdBy;
                        me.dataEdit.status = data.status;

                        if(data.startTime != null)
                        {
                            me.deadLineHaveToLoad++;
                        }

                        if(data.endTime != null)
                        {
                            me.deadLineHaveToLoad++;
                        }
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
                    // me.dataRoot.listLabel = data;
                    me.dataEdit.listLabel = data;
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
        deleteChildTask(task)
        {
            let me = this;

            let callbackAfterDeleteTask = function()
            {
                me.loader = me.$loading.show();
                me.callApi('delete', `api/task/deleteCustom/${task.taskId}`,null)
                .then(res => {
                    if(res.data.success)
                    {
                        let data = res.data.data;
                        let listSortOrderUpdate = [];
                        me.listChildTaskDelete.push(task);
                        me.dataEdit.lstChildTask = me.dataEdit.lstChildTask.filter(item => item.taskId != task.taskId);
                        if(me.option.typeTask != EnumTypeTask.Personal)
                        {
                            me.dataEdit.lstChildTask.forEach(childTask => {
                                if(childTask.sortOrder >= task.sortOrder)
                                {
                                    listSortOrderUpdate.push({
                                        taskId: childTask.taskId,
                                        processId: childTask.processId,
                                        sortOrder: childTask.sortOrder - 1
                                    });
                                }
                            });

                            if(listSortOrderUpdate.length > 0)
                            {
                                me.callApi('put','api/task/processbatch',listSortOrderUpdate,null)
                                .then(res => {
                                    if(res.data.success)
                                    {
                                        me.dataEdit.lstChildTask.forEach(childTask => {
                                            if(childTask.sortOrder >= task.sortOrder)
                                            {
                                                childTask.sortOrder = childTask.sortOrder - 1;
                                            }
                                        });

                                        me.dataEdit.lstChildTask.sort((left,right) => {
                                            return left.sortOrder - right.sortOrder;
                                        });
                                        me.loader.hide();
                                    }
                                });
                            }
                            else
                            {
                                me.loader.hide();
                            }
                        }
                        }
                });
            };
            
            me.showDialogConfirm({
                width: "500px",
                height: "260px",
                borderTop: true
            },{
                'title': "Xóa công việc",
                'content': "Sau khi thực hiện xóa công việc, tất cả các dữ liệu liên quan bao gồm: thông tin mô tả công việc, tài liệu đính kèm, các công việc con, bình luận, lịch sử hoạt động,... sẽ bị xóa khỏi hệ thống? Bạn có chắc chắn muốn thực hiện thao tác này không?"
            }, callbackAfterDeleteTask);
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
            
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkyOEJDRjNERjQzRjExRTNBMDE2RjY3ODg3MTdFOTlDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjkyOEJDRjNFRjQzRjExRTNBMDE2RjY3ODg3MTdFOTlDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTI4QkNGM0JGNDNGMTFFM0EwMTZGNjc4ODcxN0U5OUMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTI4QkNGM0NGNDNGMTFFM0EwMTZGNjc4ODcxN0U5OUMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7bOPvnAAAKCElEQVR42uydW1MTzRaGySRAEkPOJ3IgBysJoBb//wdw74VHsABFoiQQQkAxEHC/X7LLTbH9MGBmZq2e97mwLLS0e/XT3at7enp8m5ubc4TMGoshIBSLUCxCsQihWIRiEYpFCMUiFItQLEIoFqFYhGIRQrEIxSIUixCKRSgWoViEUCxCsQjFIoRiEYpFKBYhFItQLEKxCKFYhGIRikUIxSIUi1AsQigWoViEYhFCsYgIAgzBHcLh8OLiYjAYDI/x+Xz/hCkQwE8mf+HHjx+j0Qi/+fnz5/cx+MlwOMRvGD2KdWvQtqxYLBaNRpfGTEy6h1+GAfz92380GAzOzs7w6+np6c3NDcXyIn6/P5FIZLNZWPVHmaYkOqZYLGIwg1udTufk5OT6+ppieYJ4PJ7JZJLJJNyy6b+AqfExsKrX63W73X6/T7HMBI0NnzCchEIhJ8fFzJiLi4uDgwMYhsHME9H2wrd0oBSmPCh1Oz1yBaT50AtTpPF6mS9WKpWqVqtY6MkpEpaQe3t7x8fHnApVgvGpXq8j0ZFWMFjearWQde3s7GAM44ilae4rlUqY+yxL9A4wJsTPY8ybGQ0csTAeNJvNOztMYjtAuVzGmLq1tYX50aRWMO2RTiKR2NjYUGHVL1BalBklp1hCqVQqa2trgYC+YRhlRslRfk6F4uaURqORTqdV1wJJIebx7e1tA1IuE8Ty+/1YZAlc/T0C9A2MXu/fv9f+IEj9VIhmePbsmRlWTUBdUCONE7o5YlmWtb6+HolEDFuCoEaol/C9EmPFQl61urpqnlW/3ELtZnXsgmI9AGTrJs2Av50TUUeK5SgrKyva14BT5vKoKcVyriuXSqU5b4CaahyY9Yk1eWIz5yVQX1GnMwwUa7IRqn0p/lBQX9RaVyKvTCzMC9FodM57oNblcpli2UIwGPROavX/SDgBa6ZYtVpN777OTNIARIBizZhUKmXYwZJHgAho2WSx2Fl1Ua1WVQzbOsTK5XILCwu0CiAOiAbFms1whbyVSt3O4uUPWgrEymQy6rYHbQXRQEwoFocrLw5a0sWKxWJOvhGvBcQEkaFYjyefz1MjjZERLVYgEODe1b+ByEh+ZiparFQq5eWt9j9mn4gPxXoMyWSSAimNj1yxJjc40p77VzZiX7iQK1YkElH9moozfU/suySW5O5IdfRGiWJRLC+JhSWPrhtj3GKa+8Mp1v8IhULcaJiyB4bDYYo1LU+ePKE0U0KxHoCiw92MFcWiWJ4Xi+dFtcdKqFjz8/M0RnWsKBbF8pJYfJijPVYUi2J5SSzujmqPlVCxPPLtNYNjJVQsj3/31oBYUSyK5SWxrq6uaIzqWFEs9YxGI4o1LZeXlzRmSmR+j06oWKZ+d9Q7saJYFMtLYn3//p3GqI6VXLG4RzoNiBLFeli8zs7O6M0fQZS48/4wTk9P6Y3eKFEsiuUxsc7Pz/lg534QH0SJYj04ahy0/jhcie17os/T9Xo92qM0PqLFOj4+5qbDPQtnxIdiPYbRaHRyckKHfgsiI/PxswKxwOHhIR3SGBnpYvX7/YuLC2p0B8QEkaFYf5VJHBwc0KQ7tNtt4dmngresut2uzCNHboFodDod4YVUIBYHrTsgGvIXyzreC0WiyjOlExAH+cOVGrHQQff29mgVQBxUPOlS8yb70dHRYDDwuFWIAOKgoqiarkjY3d318kY86o4IaCmtJrG+ffvm5SwedUcEKJYt7O/ve/NkKWqNuisqsDKxMB1sbW1JfkZmB6gvaq0rDdB3DdVwOPzw4YOnxEJ91W0Rq7zfrNfreSfZQk01nkvTenHex48ftSy8/wbUETXVWHLFNzJub2+bfXYZtUMdlRZesVhIZt+9eyf2bYK/BPVC7fTu2+m+Q/b6+vrt27fmuYUaoV6ond4qqL+c+Orq6vXr1ybNiagLaqT9hjATbr1Gz37z5o0ZuTxqgbqoHqsmBMzo5ZON08vLy0KhoLcW7XbbmEMchog1Aa0yGAwajYbf71c36GIBaNJ7lKZ9AAJt8/LlS13PE1FalNmwt3MN/LLIcDh89erV/v6+/LU6SohyorTmHeoPzJnIpMGQCNdqtXg8LrOQ/X5/d3fX1JfbzBRrAtoMK6x0Ol2tVkV9LRKLDKSDZj+SMv8jW+fn591uV9S0eHNzEwqFzP48sW9zc9PMivl8mUwmm81Go1GxhcQattPpSPOeU+G/VCkQyOVyhUJB/mdao2MqlUq73T48PDTpAKNRYvn9/sIYXftY6ABwq1QqtccYsO1ujliY+JaXl9E2GK709opyuYxafP78+cuXL9onRxPEwmxSr9fD4bAZ8zjWsEgNd3Z2VL9HqVssTCJoBiTphqWJ6CTPnz8/Ojra3d1VesxBq1iY+/L5/MrKirrHgtOTTqcTicSnT5++fv2qbmZUKdbCwkKz2ZS8jzDDxKtWq6VSqcnZDUUl17dBGo/HNzY2vGDV7SQSVRb7bEq9WJj+MPetr6/L36CyI5tExSuVCoLAqZDT34wpFotLS0sqpkUdIxZWSV6b/u6fFuXvrVgqQvnixQsPTn/3TIsIiPBuJl2sZDKJ3MLgPYVHrxYRFgSHYj2GXC7XarUsy6JJv2k5y0JwECKK9eBE9enTp1oWQW4tkxGiUqlEsaYln89jaU11pmFlZUXgS28SxULqUKvVaMz0VKtVaXOiOLFisViz2eQM+FDq9bqoXF6WWOFweHV1ldn64/ItdMhIJEKx7rKwsMCdhb9cJ66trQl5H8kS1eFEvaSlkfn5eSGJhBSxyuUyn9jMBIQRwaRY/xCPx2VuxigFwXT9jI37YmH0bjQatGG2IKTuPl11WSxkA61Wiw+Y7eiuCKyLyZbLYi0vLzO1si/ZQni9KFYwGJSQZhoMwuvWDRFuilWv17lrZSsIL4LsLbGSyaSutwOUgiC78qjHHbGQVFarVba6MyDUzmfx7ohVKBTMvh1KFAi18+dqXBBrcicM29vhnuxwOuuCWLlcjhtXDoOAO3xgy2mxMNlzuHKFYrHoZKbltFjoNzzC4IVBy1Gx0GPQb9jGXhi0HBUrnU4vLi6ygd0CwUcTGChWPp9n67qLY03gnFjBYHBpaYlN6y5oAmd2EJ0Ty7wLHZXiTENQLIqlWSzHRmAiJCdxSKxsNssWlYMDzeGEWD6fL5VKsTnlgOawe0PLCbEw8Or9YISRoDnsng2dECuRSLAtpWF3ozg0YrEhpWH3Oyy2i2VZFsUSSCQSsfXyFdvFglW8k0ggaBRbO7wTYrEVZaJbLDk3NhEnm8Z2scz4jKCR2No09orl9/v5JEcsaBr73rCwV6xQKMT28+agZdndJ9h4krHvQK+ltNzE02JxxJKfZqkUiy+mCse+BrJXLB5qEI59DcQRiyMWRyzCEeu//zo/XiIb+xqIDU8UisUrRoVjXwP9R4ABAL9wG4GYES6vAAAAAElFTkSuQmCC';
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
                    createdByEmail: me.userInfo.email,
                    processId: (me.option.typeTask == EnumTypeTask.GroupPersonal) ||
                        (me.option.typeTask == EnumTypeTask.Group)  ? 
                        me.option.processId : null,
                    groupTaskId: (me.option.typeTask == EnumTypeTask.GroupPersonal) ||
                        (me.option.typeTask == EnumTypeTask.Group)  ? 
                        me.option.groupTaskId : null,
                    assignedByEmail: me.userInfo.email,
                    AssignForEmail: me.dataEdit.assignedByEmail
                };
                me.callApi('post', 'api/task/insertChildTask', dataSave, null)
                .then(res => {
                    if(res.data.success)
                    {
                        let data = res.data.data;
                        data.isNewChildTask = true;
                        me.dataEdit.lstChildTask.push(data);
                        me.fakeNameChildTask = '';
                        me.addingChildTask = false;
                    }
                });
            }
            else
            {
                me.fakeNameChildTask = '';
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
            if(typeof callback == 'function')
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
            let listUpdate = [];
            me.dataEdit.lstCheckTask.forEach(checkTask => {
                if(checkTask.checkTaskId == checkTaskId)
                {
                    listUpdate.push({
                        checkTaskId: checkTask.checkTaskId,
                        status: !checkTask.status
                    });
                }
            });

            me.callApi('put',`api/checktask/updateStatusBatch`,listUpdate,null)
            .then(res => {
                if(res.data.success)
                {
                    me.dataEdit.lstCheckTask.forEach(checkTask => {
                    if(checkTask.checkTaskId == checkTaskId)
                        checkTask.status = !checkTask.status;
                    });       
                }
            });
        },
        checkAll()
        {
            let me = this;
            let listUpdate = [];
            me.dataEdit.lstCheckTask.forEach(checkTask => {
                listUpdate.push({
                        checkTaskId: checkTask.checkTaskId,
                        status: true
                    });
            });

            me.callApi('put',`api/checktask/updateStatusBatch`,listUpdate,null)
            .then(res => {
                if(res.data.success)
                {
                    me.dataEdit.lstCheckTask.forEach(checkTask => {
                        checkTask.status = true;
                    }); 
                }
            });
        },
        checkFalseAll()
        {
            let me = this;
            let listUpdate = [];
            me.dataEdit.lstCheckTask.forEach(checkTask => {
                listUpdate.push({
                        checkTaskId: checkTask.checkTaskId,
                        status: false
                    });
            });

            me.callApi('put',`api/checktask/updateStatusBatch`,listUpdate,null)
            .then(res => {
                if(res.data.success)
                {
                    me.dataEdit.lstCheckTask.forEach(checkTask => {
                        checkTask.status = false;
                    }); 
                }
            });
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
                    taskId: me.option.taskId,
                    createdByEmail: me.userInfo.email
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
                        me.dataEdit.listLabel = me.dataEdit.listLabel.filter(label => 
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
        closeTaskDetailPopup()
        {
            let me = this;
            let callbackWhenClosePopup = function(){};
            
            if(me.option.typeTask == EnumTypeTask.Personal)
            {
                callbackWhenClosePopup = function(objectParent){
                    let isExistsTask = false;
                    
                    if(me.option.editMode == EnumEditMode.Add && me.nameNewTask)
                    {
                        objectParent.lstColumnTask.forEach(column => {
                            if(column.lstTask && column.lstTask.length > 0)
                            {
                                let indexTaskExist = column.lstTask.findIndex(task => task.taskId == me.dataEdit.taskId);
                                if(indexTaskExist > -1)
                                {
                                    isExistsTask = true;
                                    column.lstTask[indexTaskExist] = me.dataEdit;
                                }
                            }
                        });

                        if(!isExistsTask)
                        {
                            if(me.option.typeTask == EnumTypeTask.Personal && objectParent.lstColumnTask.length > 0)
                            {
                                if(!objectParent.lstColumnTask[0].lstTask)
                                {
                                    objectParent.lstColumnTask[0].lstTask = [];
                                }
                                objectParent.lstColumnTask[0].lstTask.push(me.dataEdit);
                            }
                        }

                        objectParent.lstColumnTask.forEach(column => {
                            if(column.lstTask && column.lstTask.length > 0 && column.processId == '1')
                            {
                                me.dataEdit.lstChildTask.forEach(childTask => {
                                    column.lstTask.push(childTask);
                                });
                            }
                        });

                        objectParent.toast.success('Thêm công việc thành công.');
                        me.nameNewTask = '';
                    }
                    else if(me.option.editMode == EnumEditMode.Edit)
                    {
                        objectParent.lstColumnTask.forEach(column => {
                            if(column.lstTask && column.lstTask.length > 0)
                            {
                                let indexTaskExist = column.lstTask.findIndex(task => task.taskId == me.dataEdit.taskId);
                                if(indexTaskExist > -1)
                                {
                                    column.lstTask[indexTaskExist] = me.dataEdit;
                                }
                            }
                        });

                        objectParent.lstColumnTask.forEach(column => {
                            if(column.lstTask && column.lstTask.length > 0 && column.processId == '1')
                            {
                                me.dataEdit.lstChildTask.forEach(childTask => {
                                    let indexChildTaskExists = column.lstTask.findIndex(task => task.taskId == childTask.taskId);
                                    if(indexChildTaskExists == -1 && childTask.isNewChildTask) 
                                    {
                                        column.lstTask.push(childTask);
                                    }
                                    else
                                    {
                                        column.lstTask[indexChildTaskExists] = childTask;
                                    }
                                });
                                
                                let stringChildTaskIdDelete = me.lodash.map(me.listChildTaskDelete,'taskId').join(",");
                                column.lstTask = column.lstTask.filter(task => !stringChildTaskIdDelete.includes(task.taskId));
                            }
                        });

                        objectParent.toast.success('Cập nhật công việc thành công.');
                    }
                };
            }
            else
            {
                callbackWhenClosePopup = function(objectParent){
                    if(me.option.editMode == EnumEditMode.Add && me.nameNewTask)
                    {
                        objectParent.templateGroupTask.listProcess.forEach(process => {
                            if(process.processId == me.dataEdit.processId)
                            {
                                let indexFind = process.lstTask.findIndex(task => task.taskId == me.dataEdit.taskId);
                                if(indexFind != -1)
                                {
                                    process.lstTask[indexFind] = me.dataEdit;
                                    isExistsTask = true;
                                }
                                else
                                {
                                    process.lstTask.push(me.dataEdit);
                                }
                            }
                        });

                        objectParent.templateGroupTask.listProcess.forEach(process => {
                            if(process.lstTask && process.lstTask.length > 0 && process.processId == me.dataEdit.processId)
                            {
                                me.dataEdit.lstChildTask.forEach(childTask => {
                                    process.lstTask.push(childTask);
                                });
                            }
                        });

                        objectParent.toast.success('Thêm công việc thành công.');
                        
                        me.nameNewTask = '';
                    }
                    else if(me.option.editMode == EnumEditMode.Edit)
                    {
                        objectParent.templateGroupTask.listProcess.forEach(process => {
                            if(process.processId == me.dataEdit.processId)
                            {
                                let indexFind = process.lstTask.findIndex(task => task.taskId == me.dataEdit.taskId);
                                process.lstTask[indexFind] = me.dataEdit;
                            }
                        });

                        objectParent.templateGroupTask.listProcess.forEach(process => {
                            if(process.lstTask && process.lstTask.length > 0 && process.processId == me.dataEdit.processId)
                            {
                                me.dataEdit.lstChildTask.forEach(childTask => {
                                    let indexChildTaskExists = process.lstTask.findIndex(task => task.taskId == childTask.taskId);
                                    if(indexChildTaskExists == -1 && childTask.isNewChildTask) 
                                    {
                                        process.lstTask.push(childTask);
                                    }
                                    else
                                    {
                                        process.lstTask[indexChildTaskExists] = childTask;
                                    }
                                });
                                let stringChildTaskIdDelete = me.lodash.map(me.listChildTaskDelete,'taskId').join(",");
                                process.lstTask = process.lstTask.filter(task => !stringChildTaskIdDelete.includes(task.taskId));
                            }
                        });

                        objectParent.toast.success('Cập nhật công việc thành công.');
                    }
                };
            }
            me.$emit('closePopup',
                callbackWhenClosePopup,
                "ViewComponent");
        }
    },
    data()
    {
        return{
            listChildTaskDelete: [],

            listFilterAssignedUser: this.option.listAssignedUser,
            searchAssignedUser: '',
            isShowChooseUserDropDown: false,
            isShowDeadlineDropDown: false,
            isTabStartDeadline: false,

            isShowMoreFeatureDropDown: false,

            isAddingTask: this.option.editMode == EnumEditMode.Add,
            nameNewTask: '',
            isLoadingData: true,

            //comment            
            modeCommentControl: EnumModeUseControl,

            //modal
            nameDetailComponent: '',
            props: undefined,
            data: undefined,
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
                language: 'vi',
                toolbar: {
                    items: [
                        'bold','italic','underline','strikethrough','|',
                        'fontsize','fontcolor','fontfamily','|',
                        'alignment',
                    ]
                }
            },

            dataEdit: {
                taskId: this.option.taskId,
                taskName: '[In báo cáo/Báo cáo]Truy vấn lấy vé xuất lại',
                startTime: null,
                endTime: null,
                createdBy: {
                    email: "tlminh40300@gmail.com",
                    fileAvatar: 'c304fbcb-7520-4ad9-b6d0-c020ee826330_rPL27_5f.jpg',
                    firstName: "Trần",
                    lastName: "Lê Minh"
                },
                createdTime: '2022-10-17T10:51:30',
                description: '',
                lstCheckTask: [
                    
                ],
                listLabel: [],
                lstChildTask: [
                    
                ],
                lstFileAttachment: [
                
                ],
                lstComment: [
                    
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