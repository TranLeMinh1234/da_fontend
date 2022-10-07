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
        </div>
    </div>
</template>

<script>
import BaseComponent from '../commonComponent/BaseComponent.vue';
export default {
    name: "Home",
    extends: BaseComponent,
    mounted()
    {
        let me = this;
        me.initHtmlCss();
    },
    methods: {
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
            ]
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/ViewComponent/Home.css');
</style>
