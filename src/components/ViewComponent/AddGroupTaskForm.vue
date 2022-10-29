<template>
    <div class="add-grouptask-form">
        <div class="header pd-16 fs-24 fw-600">
            Thêm nhóm công việc
        </div>
        <div class="body-content pd-16">
            <div class="fs-18">Tên nhóm công việc*:</div>
            <MInput 
                placeholder="Nhập tên nhóm công việc..."
                v-model="newGroupTask.nameGroupTask"
                :isValidate="false"
            />
            <div class="fs-18 pd-t-16 fw-500">Loại nhóm công việc:</div>
            <LocalCombobox 
                :configField="{
                    displayField: 'nameTypeGroupTask',
                    valueField: 'typeGroupTask'
                }"
                :configDropDown="{
                    height: 80
                }"
                :data="dataTypeGroupTask"
                v-model="newGroupTask.typeGroupTask"
            />
            <div class="fs-18 pd-t-16 fw-500">Mẫu quy trìn công việc:</div>
            <LocalCombobox 
                :configField="{
                    displayField: 'nameTemplateGroupTask',
                    valueField: 'templateGroupTaskId'
                }"
                :configDropDown="{
                    height: 140
                }"
                v-if="isDoneLoadData"
                :data="listTemplateGroupTask"
                v-model="newGroupTask.templateReferenceId"
            />
            <div class="fs-18 pd-t-16 fw-500">Mô tả:</div>
            <MTextarea 
                v-model="newGroupTask.description" 
                placeholder="Nhập mô tả..."
                :isValidate="false"
            />
            <div class="mg-t-26">
                <div class="d-flex al-center j-space-between">
                    <div class="fw-500 fw-18">Thành viên {{listUser.length > 0 ? `(${listUser.length})` : ''}}</div>
                    <div class="fw-600 color-blue-taskdetail c-poiter" @click="openAddUserForm">Thêm thành viên</div>
                </div>
                <div class="list-user">
                   <div 
                    v-for="user in listUser" :key="user.email"
                    class="d-flex mg-t-10 j-space-between">
                        <div class="d-flex al-center pd-l-12 user-info">
                            <img :src="linkImg(user.fileAvatarName)" alt="" class="user-avar">
                            <div class="pd-l-12">
                                <div>{{user?.firstName}} {{user?.lastName}}</div>
                                <div>{{user?.email}}</div>
                            </div>
                        </div>
                        <div class="role-user d-flex al-center j-space-between">
                            <div class="w-80">
                                <LocalCombobox 
                                    :disabled="user.email == userInfo.email"
                                    v-if="isDoneLoadData"
                                    class="mg-r-12"
                                    :haveBorder="false"
                                    :configField="{
                                        displayField: 'nameRole',
                                        valueField: 'roleId'
                                    }"
                                    :configDropDown="{
                                        height: 80,
                                        width: 140
                                    }"
                                    :data="listRole"
                                    v-model="user.role.roleId"
                                />
                            </div>
                            <div class="file-icon lock-icon mg-r-10" v-if="user.email == userInfo.email"></div>
                            <div 
                                class="file-icon exit-popup-icon mg-r-10" 
                                v-if="user.email != userInfo.email"
                                @click="deleteUserJoined(user)"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer d-flex al-center j-end pd-16">
            <button class="btn btn-white-silver" @click="closePopup">Hủy bỏ</button>
            <button class="btn btn-primary mg-r-16" @click="commitNewGroupTask">Lưu</button>
        </div>
    </div>
    <Modal :isShow="isShowDetail" :configModal="configModal" ref="modal">
        <component :is="nameDetailComponent" :option="props" @closePopup="closeSubPopup"></component>
    </Modal>
</template>

<script>
import BaseViewDetail from '../commonComponent/BaseViewDetail.vue';
import MInput from '../commonComponent/MInput.vue';
import Modal from '../commonComponent/Modal.vue';
import {EnumEditMode,EnumTypeTask,EnumAttachment, EnumModeUseControl, EnumTypeDeadline, EnumTypeGroupTask} from '../../common/js/Enum.js';
import LocalCombobox from '../commonComponent/LocalCombobox.vue';
import MTextarea from '../commonComponent/MTextarea.vue';
import {baseCallApi} from '../../common/js/BaseCallApi.js';
import AddUserJoinedGroupTask from './AddUserJoinedGroupTask.vue';

export default {
    name: 'AddGroupTaskForm',
    extends: BaseViewDetail,
    emits: ['closePopup'],
    components: {
        Modal,
        MInput,
        LocalCombobox,
        MTextarea,
        AddUserJoinedGroupTask
    },
    props: {
        option: {
            type: Object,
            default: function(rawProps)
            {
                return rawProps.option ? rawProps.option: {};
            }
        }
    },
    created(){
        let me = this;
        me.dataTypeGroupTask = [
            {
                typeGroupTask: 1,
                nameTypeGroupTask: 'Cá nhân'
            },
            {
                typeGroupTask: 2,
                nameTypeGroupTask: 'Hội nhóm'
            }
        ]

        me.listUser.push(me.userInfo);
        me.loaddAllData();
    },
    methods:{
        commitNewGroupTask()
        {
            let me = this;
            let isValid = true;

            if(!me.newGroupTask.nameGroupTask)
            {
                me.showDialogNotification({
                    width: '430px',
                    height: '200px',
                    borderTop: true
                },
                {
                    'title': 'Cảnh báo',
                    'content': 'Tên nhóm công việc không được bỏ trống.'
                },
                undefined);
                isValid = false;
            }

            if(isValid)
            {
                me.loader = me.$loading.show();

                me.callApi('post','api/grouptask/insertcustom', {
                    groupTask: me.newGroupTask,
                    listUser: me.listUser
                }, null)
                .then(res => {
                    if(res.data.success)
                    {
                        let data = res.data.data;
                        me.toast.success('Thêm nhóm công việc thành công.');
                        me.loader.hide();
                        me.$emit('closePopup', ()=>{});
                    }
                    else
                    {
                        let errorCode = res.data.errorCode[0];
                        switch(errorCode)
                        {
                            case '':
                                break;
                            default: 
                                break;
                        }
                    }
                });
            }
        },
        deleteUserJoined(userDelete)
        {
            let me = this;
            me.listUser = me.listUser.filter(user => user.email != userDelete.email);
        },
        closeSubPopup(callback)
        {
            let me = this;
            if(typeof callback == 'function')
            {
                callback(me);
            }
            me.isShowDetail = false;
        },
        openAddUserForm()
        {
            let me = this;
            me.showDetail('AddUserJoinedGroupTask',{
                    width: '630px',
                    height: 'auto',
                    borderTop: true
                }, {
                    listRole: me.listRole
                }, null);
        },
        closePopup(callback)
        {
            let me = this;
            me.$emit('closePopup',()=>{});
        },
        loaddAllData()
        {
            let me = this;
            me.getAllRole();
            me.getTemplateGroupTask();
        },
        getTemplateGroupTask()
        {
            let me = this;
            me.callApi('get','api/template/getall', null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    if(!data || (data && data.length == 0))
                    {
                        me.showDialogNotification({
                            width: '430px',
                            height: '200px',
                            borderTop: true
                        },
                        {
                            'title': 'Nhắc nhở thiết lập',
                            'content': 'Bạn chưa có mẫu quá trình công việc nào. Vui lòng thêm ít nhất một mẫu.'
                        },
                        undefined);
                        me.$emit('closePopup',()=>{});
                    };

                    me.listTemplateGroupTask = data;
                    me.checkDoneLoadData();
                }
            });
        },
        getAllRole(){
            let me = this;
            me.callApi('get','api/role/getall', null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    me.listRole = data;
                    me.setRoleForUser(me.listRole.find(role => role.listPermissionCode.includes("AllPermission")));
                    me.checkDoneLoadData();
                }
            });
        },
        checkDoneLoadData()
        {
            let me = this;
            if(!me.countDoneLoadData)
            {
                me.countDoneLoadData = 1;
            }
            else
                me.countDoneLoadData++;

            if(me.countDoneLoadData == 2)
            {
                me.isDoneLoadData = true;
            }
        },
        closeSubPopup(callback)
        {
            let me = this;
            if(typeof callback == 'function')
            {
                callback(me);
            }
            me.isShowDetail = false;
        },
        linkImg(fileName)
        {
            let me = this;
            if(fileName)
            {
                return baseCallApi.doMain + '' + `/file/img/${fileName}`;
            }
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkyOEJDRjNERjQzRjExRTNBMDE2RjY3ODg3MTdFOTlDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjkyOEJDRjNFRjQzRjExRTNBMDE2RjY3ODg3MTdFOTlDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTI4QkNGM0JGNDNGMTFFM0EwMTZGNjc4ODcxN0U5OUMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTI4QkNGM0NGNDNGMTFFM0EwMTZGNjc4ODcxN0U5OUMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7bOPvnAAAKCElEQVR42uydW1MT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';
        }
    },
    data()
    {
        return {
            newGroupTask: {
                groupTaskId: null,
                nameGroupTask: '',
                typeGroupTask: 1,
                templateReferenceId: null,
                description: ''
            },
            listRole: [],
            listUser: [],
            listTemplateGroupTask: [],

            nameDetailComponent: '',
            props: null,
            isShowDetail: false,
            configModal: null,
            callbackOutsideComponent: null,
            isDoneLoadData: false
        }
    }
}
</script>


<style scoped>
@import url('../../assets/css/ViewComponent/AddGroupTaskForm.css');
</style>