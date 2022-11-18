<template>
    <div class="add-member-form">
        <div class="header d-flex al-center j-space-between">
            <div class="name-form fw-600 fs-24 c-poiter">Danh sách thành viên</div>
            <div class="file-icon exit-popup-icon c-poiter" @click="closePopup"></div>
        </div>
        <div class="body">
            <div class="d-flex al-center j-end">
                <div class="d-flex al-center j-end c-poiter" @click="openFormChooseUser">
                    <div class="file-icon plush-blue-icon"></div>
                    <div class="fw-500 fs-18 color-blue-taskdetail">Thêm nhân viên</div>
                </div>
            </div>
            <div class="table mg-t-10">
                <table>
                    <thead>
                        <tr>
                            <td style="width: 30%">Họ và tên</td>
                            <td style="width: 45%">Email</td>
                            <td style="width: 20%;padding-left: 12px">Vai trò</td>
                            <td style="width: 5%"></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(user, index) in listUserDisplay" :key="user.email"
                            :class="[index%2==0? 'even-row':'odd-row']"
                        >
                            <td 
                                style="width: 30%"
                            >
                                {{user.firstName}} {{user.lastName}}
                            </td>
                            <td 
                                style="width: 45%"
                            >
                                {{user.email}}
                                </td>
                            <td 
                                style="width: 20%"
                            >
                                <LocalCombobox 
                                    :disabled="user.email == option.emailUserCreatedGroupTask"
                                    class="mg-r-12"
                                    :haveBorder="false"
                                    v-if="!isLoadingData"
                                    :configField="{
                                        displayField: 'nameRole',
                                        valueField: 'roleId'
                                    }"
                                    :configDropDown="{
                                        height: 80,
                                    }"
                                    :data="listRole"
                                    :dataRow="user"
                                    :modelValue="user.role.roleId" 
                                    @update:modelValue="commitRoleOfUser"
                                    @selectItem="selectRoleUser"
                                />
                            </td>
                            <td style="width: 5%" class="h-100 c-poiter">
                                <div 
                                    class="file-icon delete-line-icon" 
                                    v-if="user.email != option.emailUserCreatedGroupTask"
                                    @click="deleteMember(user)"
                                ></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="w-100 edit-paging">
                    <div class="d-flex al-center j-space-between">
                        <div>
                            Tổng số <b>{{listUser.length}}</b> bản ghi
                        </div>
                        <div class="d-flex al-center">
                            <div class="file-icon left-arrow-icon c-poiter" @click="changePage('before')"></div>
                            <div>{{(indexPaging-1)*10+1}} đến {{(indexPaging-1)*10+10}}</div>
                            <div class="file-icon right-arrow-icon c-poiter" @click="changePage('next')"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer d-flex al-center j-end">
            <!-- <button class="btn btn-white-silver mg-r-10" @click="closePopup">Hủy bỏ</button>
            <button class="btn btn-primary">Lưu</button> -->
        </div>
        <Modal :isShow="isShowDetail" :configModal="configModal">
            <component :is="nameDetailComponent" :option="props" @closePopup="closeSubPopup"></component>
        </Modal>
    </div>
</template>

<script>
import LocalCombobox from '../commonComponent/LocalCombobox.vue';
import BaseViewDetail from '../commonComponent/BaseViewDetail.vue';
import Modal from '../commonComponent/Modal.vue';
import AddUserJoinedGroupTask from './AddUserJoinedGroupTask.vue';
export default {
    name: 'AddMemberForm',
    emits: ["closePopup"],
    extends: BaseViewDetail,
    components: {
      LocalCombobox,
      Modal,
      AddUserJoinedGroupTask
    },
    props: {
        option:
        {
            type: Object,
            default: function(rawProps)
            {
                return rawProps.option? rawProps.option: {
                    listUser: []
                };
            }
        }
    },
    created()
    {
        let me = this;
        me.loadAllData();
    },
    methods:
    {
        commitRoleOfUser(dataSelect,dataRow)
        {
            let me = this;
        },
        selectRoleUser(dataSelect,dataRow)
        {
            let me = this;
            me.callApi('put',`api/grouptask/updaterolemember`,{
                roleId: dataSelect,
                groupTaskId: me.option.groupTaskId,
                email: dataRow.email,
                nameGroupTask: me.option.nameGroupTask
            },null)
            .then(res => {
                if(res.data.success)
                {
                    
                }
            });
        },
        deleteMember(user)
        {
            let me = this;
            let callbackAfterDeleteMember = function()
            {
                me.callApi('delete', `api/grouptask/members/${user.email}/${me.option.groupTaskId}/${me.option.nameGroupTask}`,null)
                .then(res => {
                    if(res.data.success)
                    {
                        me.listUser = me.listUser.filter(member => member.email != user.email);
                        me.prePareListUserDisplay();
                    }
                });
            };

            me.showDialogConfirm({
                width: "500px",
                height: "190px",
                borderTop: true
            },{
                'title': "Xóa thành viên",
                'content': "Bạn có chắc muốn xóa thành viên này khỏi nhóm công việc?"
            }, callbackAfterDeleteMember);
        },
        openFormChooseUser()
        {
            let me = this;
            me.showDetail('AddUserJoinedGroupTask',{
                width: '630px',
                height: 'auto',
                borderTop: true
            }, {
                listRole: me.listRole,
                listUserExists: me.listUser,
                nameParentComponent: 'AddMemberForm'
            }, null);
        },
        changePage(typeChange)
        {
            let me = this;
            if(typeChange == "next")
            {
                me.indexPaging++;
            }
            else if(typeChange == "before")
            {
                me.indexPaging--;
                if(me.indexPaging <= 0)
                {
                    me.indexPaging = 1;
                }
            }

            me.prePareListUserDisplay();
        },
        closePopup()
        {
            let me = this;
            me.$emit('closePopup',(objecParent)=>{
                objecParent.listUser = me.listUser;
            });
        },
        closeSubPopup(callBack)
        {
            let me = this;
            if(typeof callBack == 'function')
            {
                callBack(me);
            }
            me.isShowDetail = false;
        },
        loadAllData()
        {
            let me = this;
            me.getAllRole();
            me.prePareListUserDisplay();
        },
        prePareListUserDisplay()
        {
            let me = this;
            let minIndex = (me.indexPaging - 1) * 10 + 1,
                maxIndex = Math.min((me.indexPaging - 1) * 10 + 10,me.listUser.length);
            me.listUserDisplay = [];

            if(minIndex <= me.listUser.length)
            {
                for(let i = minIndex-1; i < maxIndex;i++)
                {
                    me.listUserDisplay.push(me.listUser[i]);
                }
            }

            me.checkDoneLoadData();
        },
        getAllRole(){
            let me = this;
            me.callApi('get','api/role/getall', null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    me.listRole = data;
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

            if(me.countDoneLoadData == 2)
            {
                me.isLoadingData = false;
            }
        }
    },
    data()
    {
        return {
            listUserDisplay: [],
            isLoadingData: true,
            indexPaging: 1,
            listUserNew: [],
            listUser: this.option.listUser,

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
@import url('../../assets/css/ViewComponent/AddMemberForm.css');
</style>