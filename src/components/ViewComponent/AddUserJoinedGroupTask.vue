<template>
    <div class="add-user-joined-form">
        <div class="header pd-16 fs-24 fw-600" v-show="step == 1">Chọn thành viên</div>
        <div class="header pd-16 d-flex al-center" v-if="step == 2">
            <div class="file-icon arrow-back-icon c-poiter" @click="step = 1"></div>
            <div class="fs-24 fw-600">Phân vai trò</div>
        </div>
        <div class="body-content">
            <div class="choose-user pd-16" v-show="step == 1">
                <div></div>
                <MInput 
                    :isHaveIcon="true"
                    padding="10px 14px 10px 32px" 
                    icon="medium-search-icon"
                    placeholder="Nhập người dùng tìm kiếm..."
                    v-model="searchUser"
                    :isValidate="false"
                    @enterEvent="filterUsersCanChoose('search')"
                />
                <div class="table-choose-user">
                    <table>
                        <thead>
                            <tr>
                                <td style="width: 5%">
                                    <div
                                        :class="['check-select-table','mg-auto',
                                        isCheckAll ? 'file-icon checkbox-blue-icon': '']"
                                        @click="selectAll"
                                    >
                                    </div>
                                </td>
                                <td style="width: 35%">Họ và tên</td>
                                <td style="width: 60%">Email</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="user in listUserChoose" :key="user.email"
                            >
                                <td style="width: 5%">
                                    <div
                                        :class="['check-select-table','mg-auto',
                                        user.isSelected ? 'file-icon checkbox-blue-icon': '']"
                                        @click="selectUser(user)"
                                    >
                                    </div>
                                </td>
                                <td style="width: 35%">
                                    {{user.firstName}} {{user.lastName}}
                                </td>
                                <td style="width: 60%">
                                    {{user.email}}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="w-100 edit-paging">
                        <div class="d-flex al-center j-space-between">
                            <div>
                                Tổng số <b>{{numberOfRecords}}</b> bản ghi
                            </div>
                            <div class="d-flex al-center">
                                <div class="file-icon left-arrow-icon c-poiter" @click="filterUsersCanChoose('before')"></div>
                                <div>{{(indexPaging-1)*10+1}} đến {{(indexPaging-1)*10+10}}</div>
                                <div class="file-icon right-arrow-icon c-poiter" @click="filterUsersCanChoose('next')"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="choose-role pd-16" v-show="step == 2">
                <table style="width: 100%">
                    <thead>
                        <tr>
                            <td style="width: 35%">Họ và tên</td>
                            <td style="width: 60%">Email</td>
                            <td style="width: 5%"></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="user in listUserChosen" :key="user.email"
                        >
                            <td  class="txt-al-center txt-threedots" style="width: 35%">{{user.firstName}} {{user.lastName}}</td>
                            <td class="txt-al-center txt-threedots" style="width: 60%">{{user.email}}</td>
                            <td class="p-relative" style="width: 5%">
                                <div class="file-icon delete-line-icon mg-auto c-poiter" @click="deleteChosenUser(user)"></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="pd-10 fs-18 fw-500">Vai trò</div>
                <div class="d-flex al-center j-space-between w-80 pd-l-10">
                    <div 
                        v-for="role in option.listRole" :key="role.roleId"
                        class="d-flex al-center"
                        @click="chooseRole(role)"
                    >
                        <div
                            :class="[role.roleId == roleIdChoose? 'bg-radio-active':'bg-radio']"
                        >
                            <div v-if="role.roleId == roleIdChoose" class="active-circle" ></div>
                        </div>
                        <div class="pd-l-12">{{role.nameRole}}</div>
                    </div>
                </div>
                <div class="explain-role pd-10">
                    <div  
                        v-for="role in option.listRole" :key="role.roleId"
                        v-show="role.roleId == roleIdChoose"
                    >
                        {{role.description}}
                    </div>
                </div>
            </div>
        </div>
        <div class="footer d-flex al-center j-end pd-16">
            <button class="btn btn-white-silver mg-r-12" @click="closePopup">Hủy</button>
            <button 
                :class="['btn', 'btn-primary', haveSelectedUser? '': 'pe-none']" 
                @click="changeNextStep"
                v-if="step == 1"
            >
                Tiếp tục
            </button>
            <button class="btn btn-primary" v-if="step == 2" @click="commitListUserJoin">Đồng ý</button>
        </div>
    </div>
</template>

<script>
import {EnumEditMode,EnumTypeTask,EnumAttachment, EnumModeUseControl, EnumTypeDeadline, EnumTypeGroupTask} from '../../common/js/Enum.js';
import {baseCallApi} from '../../common/js/BaseCallApi.js';
import MInput from '../commonComponent/MInput.vue';
import BaseComponent from '../commonComponent/BaseComponent.vue';

export default {
    name: 'AddUserJoinedGroupTask',
    extends: BaseComponent,
    emits: ['closeSubPopup'],
    components: {
        MInput
    },
    created()
    {
        let me = this;
        me.loadAllData();
    },
    computed: {
        haveSelectedUser()
        {
            let me = this;
            let isHaveSelectedUser = false;
            me.listUserChoose.forEach(user => {
                if(user.isSelected)
                {
                    isHaveSelectedUser = true;
                }
            });

            return isHaveSelectedUser;
        },
        isCheckAll: function()
        {
            let me = this;
            let isCheckAll = true;
            me.listUserChoose.forEach(user => {
                if(!user.isSelected)
                {
                    isCheckAll = false;
                }
            });

            return isCheckAll;
        }
    },
    methods: {
        commitListUserJoin()
        {
            let me = this;
            me.listUserChosen.forEach(user => {
                user.role = me.option.listRole.find(role => role.roleId == me.roleIdChoose);
            });

            me.$emit('closePopup', (objectParent)=>{
                me.listUserChosen.forEach(userChosen => {
                    let indexFind = objectParent.listUser.findIndex(user => user.email == userChosen.email);
                    if(indexFind == -1)
                    {
                        objectParent.listUser.push(userChosen);
                    }
                })
            })
        },
        deleteChosenUser(user)
        {
            let me = this;
            me.listUserChosen = me.listUserChosen.filter(userChosen => userChosen.email != user.email);
            if(me.listUserChosen.length == 0)
            {
                me.step = 1;
            }
        },
        chooseRole(roleChosen)
        {
            let me = this;
            me.roleIdChoose = roleChosen.roleId;
        },
        changeNextStep()
        {
            let me = this;
            me.step = 2;
            me.listUserChoose.forEach(userSelected => {
                if(userSelected.isSelected)
                {
                    let indexFind = me.listUserChosen.findIndex(userSettingRole => userSettingRole.email == userSelected.email);
                    if(indexFind == -1)
                    {
                        let userClone = {};
                        Object.assign(userClone,userSelected);
                        me.listUserChosen.push(userClone);
                    }
                }
            });
        },
        filterUsersCanChoose(codeExecute)
        {
            let me = this;
            switch(codeExecute)
            {
                case 'next':
                    me.indexPaging++;
                    break;
                case 'before':
                    me.indexPaging--;
                    if(me.indexPaging < 1)
                    {
                        me.indexPaging = 1;
                    }
                    break;
                default:
                    break;
            }

            me.getUserToChoose();
        },
        selectUser(userSelected)
        {
            let me = this;
            userSelected.isSelected = !userSelected.isSelected;
        },
        selectAll()
        {
            let me = this;
            if(me.isCheckAll)
            {
                me.listUserChoose.forEach(user => {
                    user.isSelected = false;
                })
            }
            else
            {
                me.listUserChoose.forEach(user => {
                    user.isSelected = true;
                })
            }
        },
        loadAllData()
        {
            let me = this;
            me.getUserToChoose();
        },
        getUserToChoose()
        {
            let me = this;
            me.callApi('get',`api/user/getpagingcustom`,{
                from: (me.indexPaging-1)*10,
                take: 10,
                searchValue: me.searchUser
            })
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    me.listUserChoose = data.listUserChoose;
                    me.numberOfRecords = data.numberOfRecords;
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
            {
                me.countDoneLoadData++;
            }

            if(me.countDoneLoadData == 1)
            {
                me.isDoneLoadData = true;
            }
        },
        closePopup(callBack)
        {
            let me = this;
            me.$emit('closePopup', ()=>{});
        }
    },
    props: {
        option: {
            typeof: Object,
            default: function(rawProps)
            {
                return rawProps.option? rawProps.option : {
                    listRole: []
                };
            }
        }
    },
    data()
    {
        return {
            indexPaging: 1,
            listUserChoose: [],
            listUserChosen: [],
            roleIdChoose: this.option.listRole[2].roleId,
            numberOfRecords: 0,
            searchUser: '',
            step: 1,
            isDoneLoadData: false
        };
    }
}
</script>

<style scoped>
@import url('../../assets/css/ViewComponent/AddUserJoinedGroupTask.css');
</style>