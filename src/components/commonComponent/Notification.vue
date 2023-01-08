<template>
    <IconDropDown
        :config="{
            width: 550,
            arrowPositionX:200,
            directArrow: 'top',
        }"
        :iconClass="icon"
        :isShowDropDown="isShowListNotification"
        :isShowNumberNotification="true"
        :numberOfNotification="numberOfNewNotification"
        @showDropDownEvent="showListNotification"
        @closeDropDownEvent="closeListNotification"
    >
        <div class="list-notification">
            <div class="loadding-notification d-flex pd-16" v-if="isLoading && numberOfNewNotification > 0">
                <div>
                    <div class="img-loading loadding-skeleton"></div>
                </div>
                <div class="pd-l-12 w-100">
                    <div class="loadding-skeleton w-100 h-32px" style="height: 30px;border-radius: 12px"></div>
                    <div class="loadding-skeleton w-20 mg-t-10 h-32px" style="height: 20px;border-radius: 12px"></div>
                </div>
            </div>
            <div class="loadding-notification d-flex pd-16" v-if="isLoading && numberOfNewNotification > 0">
                <div>
                    <div class="img-loading loadding-skeleton"></div>
                </div>
                <div class="pd-l-12 w-100">
                    <div class="loadding-skeleton w-100 h-32px" style="height: 30px;border-radius: 12px"></div>
                    <div class="loadding-skeleton w-20 mg-t-10 h-32px" style="height: 20px;border-radius: 12px"></div>
                </div>
            </div>
            <div 
                :class="['notification','d-flex','al-self-start','pd-16']"
                v-for="notification in listNotification" :key="notification.notificationId"
                @click="goViewRelate(notification)"
            >
                <div>
                    <img :src="linkImg(notification?.createdBy?.fileAvatarName, notification)" alt="">
                </div>
                <div
                    :class="['info-notification','pd-l-16']"
                >
                    <div class="info" v-html="getInfoNotification(notification)">
                    </div>
                    <div class="time-notification">
                        {{$commonFunction.parseDateTimeJsToString(notification.createdTime)}}
                    </div>
                </div>
            </div>
            <div class="loadding-notification d-flex pd-16" v-if="isLoading && numberOfNewNotification == 0">
                <div>
                    <div class="img-loading loadding-skeleton"></div>
                </div>
                <div class="pd-l-12 w-100">
                    <div class="loadding-skeleton w-100 h-32px" style="height: 30px;border-radius: 12px"></div>
                    <div class="loadding-skeleton w-20 mg-t-10 h-32px" style="height: 20px;border-radius: 12px"></div>
                </div>
            </div>
            <div class="loadding-notification d-flex pd-16" v-if="isLoading && numberOfNewNotification == 0">
                <div>
                    <div class="img-loading loadding-skeleton"></div>
                </div>
                <div class="pd-l-12 w-100">
                    <div class="loadding-skeleton w-100 h-32px" style="height: 30px;border-radius: 12px"></div>
                    <div class="loadding-skeleton w-20 mg-t-10 h-32px" style="height: 20px;border-radius: 12px"></div>
                </div>
            </div>
            <div class="loadding-notification d-flex pd-16" v-if="isLoading && numberOfNewNotification == 0">
                <div>
                    <div class="img-loading loadding-skeleton"></div>
                </div>
                <div class="pd-l-12 w-100">
                    <div class="loadding-skeleton w-100 h-32px" style="height: 30px;border-radius: 12px"></div>
                    <div class="loadding-skeleton w-20 mg-t-10 h-32px" style="height: 20px;border-radius: 12px"></div>
                </div>
            </div>
            <div class="empty-container d-flex pd-16 center-items" v-if="!isLoading && listNotification?.length == 0">
                <div style="color: silver"><i>Bạn Không có thông báo.</i></div>
            </div>
        </div>
    </IconDropDown>
</template>

<script>
import IconDropDown from './IconDropDown.vue';
import BaseComponent from './BaseComponent.vue';
import {baseCallApi} from '../../common/js/BaseCallApi.js';
import {EnumTypeNotification, EnumTypeTask} from '../../common/js/Enum.js';

export default {
    name: 'Notification',
    extends: BaseComponent,
    components: {
        IconDropDown
    },
    created()
    {
        let me = this;
        me.loadNumberOfNewNotification();
    },
    mounted()
    {
        let me = this;
        me.boxNotificationElement = document.querySelector('.list-notification');
        me.boxNotificationElement.onscroll = function(event)
        {
            let notificationContainer = event.target;
            if(notificationContainer.offsetHeight + notificationContainer.scrollTop>= notificationContainer.scrollHeight)
            {
                me.loadData('scroll');
            }
        }
    },
    props: {
        icon: {
            type: String,
            default: ""
        }
    },
    watch:{

    },
    computed: {
    },
    methods: {
        loadNumberOfNewNotification()
        {
            let me = this;
            me.callApi('get','api/notification/numberofnewnotification',null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    me.numberOfNewNotification = data;
                }
            });
        },
        increaseNumberOfNewNotification()
        {
            let me = this;
            me.numberOfNewNotification++;
        },
        goViewRelate(notification)
        {
            let me = this;

            switch(notification.typeNoti)
            {
                case EnumTypeNotification.AddUserGroupTask:
                    me.$router.push({name: 'DetailGroupTask', params: {
                        grouptaskid: notification.groupTask.groupTaskId,
                        typegrouptask: notification.groupTask.typeGroupTask,
                        taskdetailid: 'all',
                        templateReferenceId: notification.groupTask.templateReferenceId,
                    }});
                    break;
                case EnumTypeNotification.DeleteUserFromGroupTask:
                    break;
                case EnumTypeNotification.AssignedTask:
                    me.$router.push({name: 'DetailGroupTask', params: {
                        grouptaskid: notification.groupTask.groupTaskId,
                        typegrouptask: notification.groupTask.typeGroupTask,
                        taskdetailid: notification.taskRelateId,
                        templateReferenceId: notification.groupTask.templateReferenceId,
                    }});
                    break;
                case EnumTypeNotification.DeletedTask:
                    break;
                case EnumTypeNotification.RemindEndTimeTask:
                    if(notification?.task?.typeTask != EnumTypeTask.Personal)
                    {
                        me.$router.push({name: 'DetailGroupTask', params: {
                            grouptaskid: notification.groupTask.groupTaskId,
                            typegrouptask: notification.groupTask.typeGroupTask,
                            taskdetailid: notification.taskRelateId,
                            templateReferenceId: notification.groupTask.templateReferenceId,
                        }});
                    }
                    break;
                case EnumTypeNotification.RemindStartTimeTask:
                    if(notification?.task?.typeTask != EnumTypeTask.Personal)
                    {
                        me.$router.push({name: 'DetailGroupTask', params: {
                            grouptaskid: notification.groupTask.groupTaskId,
                            typegrouptask: notification.groupTask.typeGroupTask,
                            taskdetailid: notification.taskRelateId,
                            templateReferenceId: notification.groupTask.templateReferenceId,
                        }});
                    }
                    break;
                case EnumTypeNotification.CommentedTask:
                    me.$router.push({name: 'DetailGroupTask', params: {
                        grouptaskid: notification.groupTask.groupTaskId,
                        typegrouptask: notification.groupTask.typeGroupTask,
                        taskdetailid: notification.taskRelateId,
                        templateReferenceId: notification.groupTask.templateReferenceId,
                    }});
                    break;
                case EnumTypeNotification.ChangeRoleGroupTask:
                    break;
                default: 
                    break;
            }

            me.isShowListNotification = false;
        },
        getInfoNotification: function(notification)
        {
            let me = this;
            let stringInfo = '';
            switch(notification.typeNoti)
            {
                case EnumTypeNotification.AddUserGroupTask:
                    stringInfo = `<b>${notification.createdBy.firstName} ${notification.createdBy.lastName}</b> đã mời bạn vào nhóm công việc <b>${notification?.groupTask?.nameGroupTask ? notification?.groupTask?.nameGroupTask : notification?.nameGroupTask}</b> với vai trò <b>${notification.role.nameRole}</b>.`;
                    break;
                case EnumTypeNotification.DeleteUserFromGroupTask:
                    stringInfo = `<b>${notification.createdBy.firstName} ${notification.createdBy.lastName}</b> đã xóa bạn khỏi nhóm công việc <b>${notification.groupTask.nameGroupTask}</b>.`;
                    break;
                case EnumTypeNotification.AssignedTask:
                    stringInfo = `<b>${notification.createdBy.firstName} ${notification.createdBy.lastName}</b> đã phân công công việc <b>${notification.task?.taskName ? notification.task.taskName : notification.taskName}</b> cho bạn.`;
                    break;
                case EnumTypeNotification.DeletedTask:
                    stringInfo = `<b>${notification.createdBy.firstName} ${notification.createdBy.lastName}</b> đã xóa công việc <b>${notification.task?.taskName ? notification.task.taskName : notification.taskName}</b>.`;
                    break;
                case EnumTypeNotification.RemindEndTimeTask:
                    stringInfo = `Công việc "${notification.task?.taskName ? notification.task?.taskName : notification.taskName}" đến hạn hoàn thành vào lúc <b>${me.$commonFunction.parseDateTimeJsToTimeString(notification?.task?.endTime)}</b> ngày <b>${me.$commonFunction.parseDateJsToString(notification?.task?.endTime)}</b>.`;
                    break;
                case EnumTypeNotification.RemindStartTimeTask:
                    stringInfo = `Công việc "${notification.task?.taskName ? notification.task?.taskName : notification.taskName}" sẽ bắt đầu vào lúc <b>${me.$commonFunction.parseDateTimeJsToTimeString(notification?.task?.startTime)}</b> ngày <b>${me.$commonFunction.parseDateJsToString(notification?.task?.startTime)}</b>.`;
                    break;
                case EnumTypeNotification.CommentedTask:
                    stringInfo = `<b>${notification.createdBy.firstName} ${notification.createdBy.lastName}</b> đã bình luận công việc <b>${notification.task?.taskName ? notification.task.taskName : notification.taskName}</b>.`;
                    break;
                case EnumTypeNotification.DeleteGroupTask:
                    stringInfo = `<b>${notification.createdBy.firstName} ${notification.createdBy.lastName}</b> đã xóa nhóm công việc <b>${notification.nameGroupTask}</b>.`;
                    break;
                case EnumTypeNotification.ChangeRoleGroupTask:
                    stringInfo = `<b>${notification.createdBy.firstName} ${notification.createdBy.lastName}</b> đã phân vai trò <b>${notification.role.nameRole}</b> cho bạn trong nhóm <b>${notification?.groupTask?.nameGroupTask ? notification?.groupTask?.nameGroupTask : notification?.nameGroupTask}</b>.`;
                    break;
                default: 
                    break;
            }

            return stringInfo;
        },
        linkImg(fileName, notification)
        {
            let me = this;
            if(fileName)
            {
                return baseCallApi.doMain + '' + `/file/img/${fileName}`;
            }
            
            if(notification?.typeNoti == EnumTypeNotification.RemindEndTimeTask || notification?.typeNoti == EnumTypeNotification.RemindStartTimeTask)
                return require('../../assets/remind.jpg');
            else
                return require('../../assets/defaultAvatar.png');
        },
        showListNotification()
        {
            let me = this;
            me.isShowListNotification= true;
            me.loadData('show');
        },
        loadData(typeLoading)
        {
            let me = this;
            let startIndexPaging = me.listNotification.length,
                numberOfRecordTake = 0;
                
            if(typeLoading == 'show')
            {
                if(me.isLoadFirstTime)
                {
                    startIndexPaging = 0;
                    numberOfRecordTake = 10;
                }
                else if(me.numberOfNewNotification > 0)
                {
                    startIndexPaging = 0;
                    numberOfRecordTake = me.numberOfNewNotification;
                }
            }
            else if(typeLoading == 'scroll')
            {
                startIndexPaging = me.listNotification.length;
                numberOfRecordTake = 10;
            }

            if(numberOfRecordTake > 0)
            {
                this.isLoading = true;
                setTimeout(()=>{
                    me.callApi('get',`api/notification/${me.userInfo.email}/${startIndexPaging}/${numberOfRecordTake}`,null)
                    .then(res => {
                        if(res.data.success)
                        {
                            let data = res.data.data;
                            if(typeLoading == 'show')
                            {
                                if(me.isLoadFirstTime)
                                {
                                    me.listNotification = data;
                                }
                                else if(me.numberOfNewNotification > 0)
                                {
                                    me.listNotification = me.listNotification.forEach(notification => {
                                        let indexFind = data.findIndex(notificationNew => notificationNew.notificationId == notification.notificationId);
                                        if(indexFind == -1)
                                        {
                                            data.push(notification);
                                        }
                                    });
                                    
                                    me.listNotification = data;
                                    me.numberOfNewNotification = 0;
                                }

                                me.isLoadFirstTime = false;
                            }
                            else if(typeLoading == 'scroll')
                            {
                                if(data.length > 0)
                                {
                                    data.forEach(notificationNew => {
                                        let indexFind = me.listNotification.findIndex(notification => notificationNew.notificationId == notification.notificationId);
                                        if(indexFind == -1)
                                        {
                                            me.listNotification.push(notificationNew);
                                        }
                                    });
                                }
                                else
                                {
                                    me.boxNotificationElement.scrollTo(0,me.boxNotificationElement.offsetHeight - 160 > 0 ? me.boxNotificationElement.offsetHeight - 160 : 0);
                                }
                            }
                            me.numberOfNewNotification = 0;
                            me.isLoading = false;
                        }
                    });
                },1000);
            }
        },
        closeListNotification()
        {
            let me = this;
            me.isShowListNotification = false;
        }
    },
    data()
    {
        return {
            isLoadFirstTime: true,
            indexPaging: 0,
            numberOfNewNotification: 0,
            isLoading: true,
            isShowListNotification: false,

            listNotification: []
        };
    }
}
</script>

<style scoped>
@import url('../../assets/css/componentCommon/Notification.css');
</style>