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
                        <div v-for="(groupPersonal, index) in lstGroupPersonalTask" :key="index" 
                            class="item-lst d-flex al-center"
                            :title="groupPersonal.nameGroup"
                        >
                            <div class="file-icon personal-group-icon"></div>
                            <div class="name-group txt-threedots">{{groupPersonal.nameGroup}}</div>
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
                        <div v-for="(groupCommunity, index) in lstGroupCommunityTask" :key="index" 
                            class="item-lst d-flex al-center"
                            :title="groupCommunity.nameGroup"
                        >
                            <div class="file-icon personal-group-icon"></div>
                            <div class="name-group txt-threedots">{{groupCommunity.nameGroup}}</div>
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
            <div class="welcome-info">
                <div class="hello-sentence">Xin chào Trần Lê Minh</div>
                <div class="clock"></div>
            </div>
            <div class="header d-flex al-center j-end">
                <div class="header-feature d-flex al-center j-spread-around pd-r-16">
                    <div class="btn-add-all">
                        <button class="btn-icon btn-silver d-flex al-center c-poiter">
                            <div class="d-flex al-center" @click="openFormAddNewTask">
                                <div class="file-icon plush-white-icon"></div>
                                <div>Thêm công việc</div>
                            </div>
                            <div class="bulkhead mg-l-6"></div>
                            <div class="file-icon down-arrow-icon mg-l-10"></div>
                        </button>
                    </div>
                    <IconDropDown
                        :config="{
                            width: 650,
                            height: 100,
                            arrowPositionX:200,
                            arrowPositionY:200,
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
                    <div class="file-icon big-white-search-icon c-poiter"></div>
                    <div class="file-icon bell-white-icon c-poiter"></div>
                    <div class="file-icon more-feature-white-icon c-poiter"></div>
                    <div class="personal-setting bgr-image-cover"></div>
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
import {EnumEditMode,EnumTypeTask} from '../../common/js/Enum.js';
import TaskDetail from './TaskDetail.vue';
import IconDropDown from '../commonComponent/IconDropDown.vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default {
    name: "Home",
    extends: BaseViewDetail,
    components: {
        Modal,
        TaskDetail,
        IconDropDown,
        Datepicker
    },
    created(){
        let me = this;
        
        me.formatDatePicker = (date) => 
        {
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
        }
    },
    computed:
    {
        isDailyTaskView() {
            let me = this;
            return this.$route.fullPath.includes('DailyTask');
        }
    },
    watch: {
        
    },
    mounted()
    {
        let me = this;
        me.initHtmlCss();
    },
    methods: {
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
            me.showDetail('TaskDetail',{
                width: '900px',
                height: 'auto',
            },{
                taskId: null,
                typeTask: EnumTypeTask.Personal,
                editMode: EnumEditMode.Add
            },null);
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

            isShowMenu: true,
            isShowPersonalGroup: true,
            isShowCommunityGroup: true,
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
