<template>
    <div class="setting-remind-task">
        <div class="header fw-600">
            Nhắc việc
        </div>
        <div class="setting-time">
            <div class="d-flex al-center pd-l-16">
                <div 
                    :class="['remind-checkbox',
                        isRemindStartTime? 'checkbox-remind-icon':'']"
                    @click="isRemindStartTime = !isRemindStartTime"
                ></div>
                <div class="pd-l-8">Nhắc nhở trước khi bắt đầu</div>
            </div>
            <div class="time">
                <LocalCombobox 
                    :disabled="!isRemindStartTime"
                    :class="[isRemindStartTime? '':'pe-none']"
                    :configField="{
                        displayField: 'displayTime',
                        valueField: 'valueTime'
                    }"
                    :configDropDown="{
                        height: 152
                    }"
                    :data="dataStartTime"
                    v-model="timeBeforeStartTime"
                />
            </div>
        </div>
        <div class="setting-time">
            <div class="d-flex al-center pd-l-16">
                <div 
                    :class="['remind-checkbox',
                        isRemindEndTime? 'checkbox-remind-icon':'']"
                    @click="isRemindEndTime = !isRemindEndTime"
                ></div>
                <div class="pd-l-8">Nhắc nhở trước khi hết hạn</div>
            </div>
            <div class="time">
                <LocalCombobox 
                    :disabled="!isRemindEndTime"
                    :configField="{
                        displayField: 'displayTime',
                        valueField: 'valueTime'
                    }"
                    :configDropDown="{
                        height: 152
                    }"
                    :data="dataEndTime"
                    v-model="timeBeforeEndTime"
                />
            </div>
        </div>
        <div class="pd-l-16">
            Thiết lập người nhận thông báo
        </div>
        <div class="pd-l-16">
            <div class="d-flex al-center">
                <div 
                    :class="['remind-checkbox',
                        emailWillSend.includes(option.userAssigned.email)? 'checkbox-remind-icon':'']"
                    @click="addDeletePersonBeReminded(option.userAssigned.email)"
                ></div>
                <div class="pd-l-8">Người giao việc</div>
            </div>
            <div class="d-flex al-center">
                <div 
                    :class="['remind-checkbox',
                        emailWillSend.includes(option.userDoTask.email)? 'checkbox-remind-icon':'']"
                    @click="addDeletePersonBeReminded(option.userDoTask.email)"
                ></div>
                <div class="pd-l-8">Người thực hiện công việc</div>
            </div>
        </div>
        <div class="footer d-flex al-center j-end">
            <button class="btn btn-white-silver" @click="closePopup">Hủy bỏ</button>
            <button class="btn btn-primary" @click="commitSetting">Lưu</button>
        </div>
    </div>
</template>

<script>
import LocalCombobox from '../commonComponent/LocalCombobox.vue';
import BaseComponent from '../commonComponent/BaseComponent.vue';

export default {
    name: 'SettingRemindTask',
    extends: BaseComponent,
    components: {
        LocalCombobox
    },
    created()
    {
        let me = this;
        me.dataStartTime = [
            {
                displayTime: '15 phút',
                valueTime: 15*60
            },
            {
                displayTime: '30 phút',
                valueTime: 30*60
            },
            {
                displayTime: '1 tiếng',
                valueTime: 60*60
            },
            {
                displayTime: '1 ngày',
                valueTime: 24*60*60
            }
        ];
        me.dataEndTime = [
            {
                displayTime: '15 phút',
                valueTime: 15*60
            },
            {
                displayTime: '30 phút',
                valueTime: 30*60
            },
            {
                displayTime: '1 tiếng',
                valueTime: 60*60
            },
            {
                displayTime: '1 ngày',
                valueTime: 24*60*60
            }
        ];
    },
    watch:{
        timeBeforeEndTime: function(newValue){
        }
    },
    methods:{
        commitSetting()
        {
            let me = this;
        },
        closePopup()
        {
            let me = this;
            me.$emit('closePopup');
        },
        addDeletePersonBeReminded(email)
        {
            let me = this;
            let isHaveStoredEmail = false;
            isHaveStoredEmail = me.emailWillSend.includes(email);
            if(!isHaveStoredEmail)
                me.emailWillSend.push(email);
            else
                me.emailWillSend = me.emailWillSend.filter(emailStored => emailStored != email);
        }
    },
    props: {
        option: {
            type: Object,
            default: function(rawProps)
            {
                return rawProps.option? rawProps.option: {
                    userDoTask: {},
                    userAssigned: {}
                };
            }
        }
    },
    data(){
        return {
            isRemindStartTime: false,
            isRemindEndTime: true,

            timeBeforeStartTime: null,
            timeBeforeEndTime: null,
            emailWillSend: []
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/ViewComponent/SettingRemindTask.css');
</style>