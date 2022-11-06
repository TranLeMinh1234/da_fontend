<template>
    <div 
        id="Home"
        class="bgr-image-cover d-flex"
    >
        <div
            id="menu-Home"
            :class="[!isShowMenu ? 'd-none':'']"
        >
            <div class="logo-app d-flex">
                <div class="file-icon app-icon"></div>
                <div class="txt-white">Công việc</div>
            </div>
            <div class="basic-menu">
                <router-link class="option-link d-flex" to="/">
                    <div class="logo-option file-icon home-icon"></div>
                    <div class="name-option">Tổng quan</div>
                </router-link>
                <router-link class="option-link d-flex" to="/">
                    <div class="logo-option file-icon task-myself-icon"></div>
                    <div class="name-option">Việc của tôi</div>
                </router-link>
                <router-link class="option-link d-flex" to="/">
                    <div class="logo-option file-icon chart-icon"></div>
                    <div class="name-option">Báo cáo</div>
                </router-link>
            </div>
            <div class="group-task-menu">
                <div class="feature d-flex center-items">
                    <div class="search-group-task d-flex">
                        <div class="medium-search-icon file-icon"></div>
                        <input type="text" placeholder="Tìm kiếm">
                    </div>
                    <div @click="compactAllGroup()" class="file-icon compact-icon c-poiter"></div>
                    <div class="file-icon setting-icon c-poiter"></div>
                </div>
                <div class="group-task">
                    <div class="d-flex type-group">
                        <div 
                            :class="['file-icon', isShowPersonalGroup ? 'down-arrow-icon':'expand-menu-icon']"
                            @click="showHidePersonalGroup()"
                        >
                        </div>
                        <div class="lst-group-title">Cá nhân</div>
                    </div>
                    <div class="lst-group" v-show="isShowPersonalGroup">
                        <div v-for="groupPersonal in lstGroupPersonalTask" :key="groupPersonal.groupTaskId" 
                            class="item-lst d-flex al-center"
                            :title="groupPersonal.nameGroupTask"
                            @click="goDetailGroupTask(groupPersonal)"
                        >
                            <div class="file-icon personal-group-icon"></div>
                            <div class="name-group txt-threedots">{{groupPersonal.nameGroupTask}}</div>
                        </div>
                    </div>
                    <div class="d-flex type-group">
                        <div 
                            :class="['file-icon', isShowCommunityGroup ? 'down-arrow-icon':'expand-menu-icon']"
                            @click="showHideCommunityGroup()"
                        >
                        </div>
                        <div class="lst-group-title">Hội nhóm</div>
                    </div>
                    <div class="lst-group" v-show="isShowCommunityGroup">
                        <div v-for="groupCommunity in lstGroupCommunityTask" :key="groupCommunity.groupTaskId" 
                            class="item-lst d-flex al-center"
                            :title="groupCommunity.nameGroupTask"
                            @click="goDetailGroupTask(groupCommunity)"
                        >
                            <div class="file-icon personal-group-icon"></div>
                            <div class="name-group txt-threedots">{{groupCommunity.nameGroupTask}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="compact-menu">
            <div class="cirle c-poiter" @click="showHideMenu()">
                <div v-show="isShowMenu" class="file-icon compact-menu-icon"></div>
                <div v-show="!isShowMenu" class="file-icon expand-menu-icon"></div>
            </div>
        </div>
        <div id="primary-content">
            <div class="welcome-info" v-show="isShowClock">
                <div class="hello-sentence">Xin chào Trần Lê Minh</div>
                <div class="clock"></div>
            </div>
            <div :class="['header', 'd-flex', 'al-center', 'j-space-between', isDifferentDailyTask ? 'white-header': '']">
                <div style="width: 100px">
                    <div 
                        class="file-icon black-home-icon c-poiter mg-l-32"
                        v-show="isDifferentDailyTask"
                        @click="changeDailyTaskView"
                        ></div>
                </div>
                <div class="header-feature d-flex al-center j-spread-around pd-r-16">
                    <div class="btn-add-all">
                        <button 
                            :class="['btn-icon', 'btn-silver', 
                            'd-flex', 'al-center', 'c-poiter',
                            isDifferentDailyTask ? 'blue-add-btn':'']"
                        >
                            <div class="d-flex al-center" @click="openFormAddNewTask">
                                <div class="file-icon plush-white-icon"></div>
                                <div>Thêm công việc</div>
                            </div>
                            <div class="bulkhead mg-l-6"></div>
                            <div class="mg-l-10">
                                <IconDropDown
                                    :config="{
                                        width: 380,
                                        height: 130,
                                        arrowPositionX:100,
                                        arrowPositionY:0,
                                        directArrow: 'top',
                                    }"
                                    :isHaveArrow="true"
                                    iconClass="down-arrow-icon"
                                    :isShowDropDown="isShowAddOption"
                                    @showDropDownEvent="showAddOptionEvent"
                                    @closeDropDownEvent="closeAddOptionEvent"
                                >
                                    <div class="menu-add-home mg-t-10">
                                        <div class="d-flex al-center menu-add-item c-poiter" @click="changeViewAddTemplate">
                                            <div class="file-icon add-template-icon mg-l-10"></div>
                                            <div class="pd-l-10">Thêm mẫu quá trình công việc</div>
                                        </div>
                                        <div class="d-flex al-center menu-add-item c-poiter" @click="openFormAddGroupTask">
                                            <div class="file-icon add-group-task-icon mg-l-10"></div>
                                            <div class="pd-l-10">Thêm nhóm công việc</div>
                                        </div>
                                    </div>
                                </IconDropDown>    
                            </div>
                        </button>
                    </div>
                    <IconDropDown
                        v-show="!isDifferentDailyTask"
                        :config="{
                            width: 650,
                            height: 100,
                            arrowPositionX:200,
                            directArrow: 'top',
                        }"
                        iconClass="big-white-filter-icon"
                        :isShowDropDown="isShowFilterDailyTask"
                        @showDropDownEvent="showFilterDailyTaskEvent"
                        @closeDropDownEvent="closeFilterDailyTaskEvent"
                    >
                        <div class="w-100 d-flex al-center pd-8">
                            <div class="d-flex al-center pd-r-16 pd-l-16">
                                <div class="pd-r-16">Từ ngày:</div>
                                <Datepicker 
                                    style="width: 200px" 
                                    v-model="filterDailyTask.startTime" 
                                    :format="formatDatePicker"
                                    @internalModelChange="StartDateFilterChange"/>
                            </div>
                            <div class="d-flex al-center pd-l-16">
                                <div class="pd-r-16">Đến ngày:</div>
                                <Datepicker 
                                    style="width: 200px" 
                                    v-model="filterDailyTask.endTime" 
                                    :format="formatDatePicker"
                                    @internalModelChange="EndDateFilterChange"/>
                            </div>
                        </div>
                        <div class="d-flex al-center j-end w-96">
                            <button class="btn btn-white-silver" @click="closeFilterDailyTask">Hủy</button>
                            <button class="btn btn-primary mg-l-10" @click="excuteFilterDailyTask">Lọc</button>
                        </div>
                    </IconDropDown>
                    <div :class="['file-icon',isDifferentDailyTask? 'big-black-search-icon':'big-white-search-icon','c-poiter']"></div>
                    <Notification 
                        ref="notification"
                        :icon="isDifferentDailyTask? 'bell-black-icon':'bell-white-icon'"
                    />
                    <div :class="['file-icon',isDifferentDailyTask? 'more-feature-black-icon':'more-feature-white-icon','c-poiter']"></div>
                    <PersonalSetting />
                </div>
            </div>
            <div class="body">
                <router-view v-slot="{ Component }">
                    <component ref="view" :is="Component" />
                </router-view>
            </div>
        </div>
    </div>
    <Modal :isShow="isShowDetail" :configModal="configModal">
        <component ref="dynamicComponent" :is="nameDetailComponent" :option="props" @closePopup="closePopup"></component>
    </Modal>
</template>

<script>
import BaseViewDetail from '../commonComponent/BaseViewDetail.vue';
import Modal from '../commonComponent/Modal.vue';
import {EnumEditMode,EnumTypeTask,EnumTypeGroupTask,EnumTypeNotification} from '../../common/js/Enum.js';
import TaskDetail from './TaskDetail.vue';
import IconDropDown from '../commonComponent/IconDropDown.vue';
import Datepicker from '@vuepic/vue-datepicker';
import AddGroupTaskForm from './AddGroupTaskForm.vue';
import DetailGroupTask from './DetailGroupTask.vue';
import Notification from '../commonComponent/Notification.vue';
import PersonalSetting from './PersonalSetting.vue';
import '@vuepic/vue-datepicker/dist/main.css'

export default {
    name: "Home",
    extends: BaseViewDetail,
    components: {
        Modal,
        TaskDetail,
        IconDropDown,
        Datepicker,
        AddGroupTaskForm,
        DetailGroupTask,
        Notification,
        PersonalSetting
    },
    created(){
        let me = this;
        
        me.formatDatePicker = (date) => 
        {
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
        };
        
        //init socket 
        me.$webSocketManage.startConnect(me.tokenCallApi);

        me.loadAllData();
    },
    computed:
    {
        isDailyTaskView() {
            let me = this;
            return this.$route.fullPath.includes('DailyTask');
        }
    },
    watch: {
        '$route.path': function(newValue){
            let me = this;
            if(newValue.includes('DetailGroupTask'))
            {
                me.isDifferentDailyTask = true;
                me.isShowClock = false;
                me.isShowMenu = false;
            }
        }
    },
    mounted()
    {
        let me = this;
        me.initHtmlCss();

        me.$webSocketManage.eventOnMessage = function(event)
        {
            let data = JSON.parse(event.data);
            debugger;
            switch(data.TypeNoti)
            {
                case EnumTypeNotification.AddUserGroupTask:
                    me.$refs.notification.increaseNumberOfNewNotification();
                    me.toast.info('Bạn đã được thêm vào nhóm công việc mới.');
                    break;
                case EnumTypeNotification.DeleteUserFromGroupTask:
                    me.$refs.notification.increaseNumberOfNewNotification();
                    me.toast.info(`Bạn đã bị xóa khỏi nhóm công việc ${data.GroupTask.NameGroupTask}`);
                    break;
                case EnumTypeNotification.AssignedTask:
                    me.$refs.notification.increaseNumberOfNewNotification();
                    me.toast.info(`Công việc "${data.Task?.TaskName ? data.Task?.TaskName : data.TaskName}" đã được phân công cho bạn.`);
                    break;
                case EnumTypeNotification.DeletedTask:
                    me.$refs.notification.increaseNumberOfNewNotification();
                    me.toast.info(`Công việc "${data.Task?.TaskName ? data.Task?.TaskName : data.TaskName}" đã bị xóa.`);
                    break;
                case EnumTypeNotification.CommentedTask:
                    me.$refs.notification.increaseNumberOfNewNotification();
                    me.toast.info(`${data.CreatedBy.FirstName} ${data.CreatedBy.LastName} đã bình luận công việc "${data.Task.TaskName}".`);
                    break;
                case EnumTypeNotification.RemindTask:
                    me.$refs.notification.increaseNumberOfNewNotification();
                    me.toast.info('Bạn có hạn hoàn thành công việc');
                    break;
                default:
                    break;
            }
        };
    },
    methods: {
        goDetailGroupTask(groupTask)
        {
            let me = this;
            me.isDifferentDailyTask = true;
            me.isShowClock = false;
            me.isShowMenu = false;
            me.$router.push({name: 'DetailGroupTask', params: {
                grouptaskid: groupTask.groupTaskId,
                typegrouptask: groupTask.typeGroupTask,
                taskdetailid: 'all',
                templateReferenceId: groupTask.templateReferenceId,
            }});
        },
        loadAllData()
        {
            let me = this;
            me.getAllGroup();
        },
        getAllGroup(){
            let me = this;
            me.callApi('get', 'api/grouptask/havejoined',null)
            .then(res=> {
                if( res.data.success )
                {
                    let data = res.data.data;
                    me.lstGroupCommunityTask = data.lstGroupCommunityTask;
                    me.lstGroupPersonalTask = data.lstGroupPersonalTask;
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
        openFormAddGroupTask()
        {
            let me = this;
            me.showDetail('AddGroupTaskForm',{
                width: '500px',
                height: 'auto',
                borderTop: true
            },{
                
            },null);
            me.isShowAddOption = false;
        },
        changeDailyTaskView()
        {
            let me = this;
            me.isShowMenu = true;
            me.isShowClock = true;
            me.isDifferentDailyTask = false;
            me.$router.push({name: 'DailyTask'});
        },
        changeViewAddTemplate()
        {
            let me = this;
            me.isShowMenu = false;
            me.isShowClock = false;
            me.isDifferentDailyTask = true;
            me.isShowAddOption = false;
            me.$router.push({name: 'Template'});
        },
        showAddOptionEvent()
        {
            let me = this;
            me.isShowAddOption = true;
        },
        closeAddOptionEvent()
        {
            let me = this;
            me.isShowAddOption = false;
        },
        closeFilterDailyTask()
        {
            let me = this;
            me.isShowFilterDailyTask = false;
        },
        excuteFilterDailyTask()
        {
            let me = this;
            me.$refs.view.getDailyTask(me.filterDailyTask.startTime,me.filterDailyTask.endTime);
            me.isShowFilterDailyTask = false;
        },
        StartDateFilterChange(value,whichDate)
        {
            let me = this;
            if(!value)
                me.filterDailyTask.startTime = new Date();
        },
        EndDateFilterChange(value,whichDate)
        {
            let me = this;
            if(!value)
                me.filterDailyTask.endTime = new Date();
        },
        showFilterDailyTaskEvent(){
            let me = this;
            me.isShowFilterDailyTask = true;
        },
        closeFilterDailyTaskEvent()
        {
            let me = this;
            me.isShowFilterDailyTask = false;
        },
        initHtmlCss()
        {
            let me = this;
            let groupTaskMenuEle = document.querySelector('.group-task-menu');
            let lstTaskGroupEle = document.querySelector('.group-task');
            let logoAppEle = document.querySelector('.logo-app');
            let basicMenuEle = document.querySelector('.basic-menu');
            let featureEle = document.querySelector('.feature');
            let compactMenu = document.querySelector('.compact-menu');
            groupTaskMenuEle.style.height = document.body.offsetHeight - logoAppEle.offsetHeight - basicMenuEle.offsetHeight + "px";
            lstTaskGroupEle.style.height = groupTaskMenuEle.offsetHeight - featureEle.offsetHeight + "px";

            //init clock
            let clock = document.querySelector('.clock');
            me.timeNow = new Date();
            let intervalClock = setInterval(()=>{
                clock.innerHTML = me.convertDatePMAM(me.timeNow);
                me.timeNow.setSeconds(me.timeNow.getSeconds() + 1);
            },1000);

            if(me.$route.path.includes('DailyTask'))
            {
                me.isDifferentDailyTask = false;
                me.isShowClock = true;
                me.isShowMenu = true;
            }
            else
            {
                me.isShowClock = false;
                me.isShowMenu = false;
                me.isDifferentDailyTask = true;
            }
        },
        closePopup(callbackInsideComponent, typeComponent)
        {
            let me = this;
            me.nameDetailComponent = '';
            me.configModal = undefined;
            me.props = undefined;
            me.callbackOutsideComponent = undefined;
            if(callbackInsideComponent)
            {
                if(typeComponent == "ViewComponent")
                    callbackInsideComponent(me.$refs.view);
                else
                    callbackInsideComponent(me.$refs.dynamicComponent);
            }
            me.isShowDetail = false;
        },
        openFormAddNewTask()
        {
            let me = this;
            
            switch(me.$route.name)
            {
                case "DetailGroupTask":
                    me.paramRouter = {
                        groupTaskId: me.$route.params.grouptaskid,
                        typeGroupTask: parseInt(me.$route.params.typegrouptask),
                        taskDetailId: me.$route.params.taskdetailid,
                        templateReferenceId: me.$route.params.templateReferenceId
                    };
                    
                    me.showDetail('TaskDetail',{
                        width: '900px',
                        height: 'auto',
                        borderTop: true
                    },{
                        taskId: null,
                        groupTaskId: me.paramRouter.groupTaskId,
                        typeGroupTask: me.paramRouter.typeGroupTask,
                        typeTask: me.paramRouter.typeGroupTask == EnumTypeGroupTask.Personal ? EnumTypeTask.GroupPersonal : EnumTypeTask.Group,
                        processId: me.$refs.view.templateGroupTask.listProcess[0].processId,
                        editMode: EnumEditMode.Add,
                        listAssignedUser: me.$refs.view.listUser
                    },null);
                    break;
                default:
                    me.showDetail('TaskDetail',{
                            width: '900px',
                            height: 'auto',
                            borderTop: true
                        },{
                            taskId: null,
                            typeTask: EnumTypeTask.Personal,
                            editMode: EnumEditMode.Add
                        },null);
                    break;
            }
        },
        showHideMenu()
        {
            let me = this;
            me.isShowMenu = !me.isShowMenu;
        },
        showHidePersonalGroup()
        {
            let me = this;
            me.isShowPersonalGroup = !me.isShowPersonalGroup;
        },
        showHideCommunityGroup()
        {
            let me = this;
            me.isShowCommunityGroup = !me.isShowCommunityGroup;
        },
        compactAllGroup()
        {
            let me = this;
            me.isShowCommunityGroup = false;
            me.isShowPersonalGroup = false;
        },
        convertDatePMAM(date)
        {
            if(!date)
                return "";
            else
            {
                let hours = date.getHours();
                let minutes = date.getMinutes();
                return hours%12 + ":" + (minutes < 10 ? '0'+minutes:minutes) + " " + (hours > 12 ? "PM":"AM");
            }
        }
    },
    data()
    {
        return {
            filterDailyTask: {
                startTime: new Date(),
                endTime: new Date(),
            },
            isShowFilterDailyTask: false,
            isShowAddOption: false,

            isShowMenu: true,
            isDifferentDailyTask: true,
            isShowClock: true,
            isShowPersonalGroup: true,
            isShowCommunityGroup: true,
            isDoneLoadData: false,
            lstGroupPersonalTask: [
                {
                    nameGroup: 'Công việc cá nhân'
                }
            ],
            lstGroupCommunityTask: [
                {
                    nameGroup: 'Công việc hội nhóm'
                }
            ],

            nameDetailComponent: '',
            props: null,
            isShowDetail: false,
            configModal: null,
            callbackOutsideComponent: null
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/ViewComponent/Home.css');
</style>
