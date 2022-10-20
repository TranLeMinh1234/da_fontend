<template>
    <div class="comment">
        <div class="w-100 d-flex p-relative">
            <img 
                :src="linkImg(data.user?.fileAvatarName)" 
                alt="" 
                :class="['user-avar']"
                v-if="modeOwn == modeCommentControl.Edit">
            <div class="content-comment" v-if="!isEditing && modeOwn == modeCommentControl.Edit">
                <div class="name-user fw-600">{{data.user?.firstName}} {{data.user?.lastName}}</div>
                <div class="content pd-t-10">{{data?.content}}</div>
            </div>
            <div class="edit-comment" v-if="(isEditing && modeOwn == modeCommentControl.Edit) || modeOwn == modeCommentControl.Add" :style="{
                marginLeft: mode == modeCommentControl.Add? '0px':'20px'
            }">
                <CommentInput 
                    v-model="data.content"
                    @attachNewFileCommentAdd="attachNewFileCommentAdd"
                    :mode="modeOwn"
                    @commitComment="commitComment"
                    :taskId="taskId"
                    :commentId="data.commentId"
                />
            </div>
            <div class="feature-comment" v-if="!isEditing && modeOwn == modeCommentControl.Edit">
                <IconDropDown
                    :config="{
                        width: 160,
                        height: 100,
                        directArrow: 'top',
                    }"
                    iconClass="more-feature-blue-icon"
                    :isShowDropDown="isShowDropDownFeature"
                    @showDropDownEvent="showDropDownEvent"
                    @closeDropDownEvent="closeDropDownEvent"
                >
                    <div class="w-100 d-flex center-items pd-8 attachfile-feature-item c-poiter mg-t-10" @click="ChangeModeEdit">
                        <div class="file-icon edit-icon"></div>
                        <div class="pd-l-8">Sửa bình luận</div>
                    </div>
                    <div class="w-100 d-flex center-items pd-8 attachfile-feature-item c-poiter" @click="deleteComment">
                        <div class="file-icon delete-line-icon"></div>
                        <div class="pd-l-8">Xóa</div>
                    </div>
                </IconDropDown>
            </div>
        </div>
        <div class="lst-attach-file d-flex al-center fl-wrap" :style="{
            margin: modeOwn == modeCommentControl.Add? '8px 0px 0px 18px':'8px 0px 0px 48px',
        }">
            <FileAttach
                v-for="fileAttach in data.lstFileAttachment" :key="fileAttach.fileId"
                :data="fileAttach"
                :displayFeature="isEditing || modeOwn == modeCommentControl.Add"
                @deleteFileAttach="deleteFileAttach"
            />
        </div>
    </div>
</template>

<script>
import { uuid } from 'vue-uuid';
import {baseCallApi} from '../../common/js/BaseCallApi.js';
import IconDropDown from './IconDropDown.vue';
import FileAttach from '../commonComponent/FileAttach.vue';
import CommentInput from '../commonComponent/CommentInput.vue';
import BaseComponent from '../commonComponent/BaseComponent.vue';
import {EnumModeUseControl,EnumTypeTask,EnumAttachment} from '../../common/js/Enum.js';
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: 'Comment',
    emits: ['deleteFileAttach','attachNewFileCommentAdd','commitComment','deleteComment'],
    extends: BaseComponent,
    components: {
        IconDropDown,
        FileAttach,
        CommentInput
    },
    watch: {
        'data.content': function(newValue)
        {
            let me = this;
        }
    },
    props: {
        data: {
            type: Object,
            default: function(rawProps)
            {
                return rawProps.data ? rawProps.data : {
                    commentId: uuid.v1(),
                    createdByEmail: me.userInfo.email,
                    createdTime: null,
                    content: '',
                    lstFileAttachment: [],
                    user:null,
                };
            }
        },
        mode: {
            type: Number,
            default: EnumModeUseControl.Edit
        },
        taskId: {
            type: String,
            default: ''
        },
    },
    computed:{
        ...mapGetters('userManage', ['userInfo','isExistsUserInfo']),
    },
    created()
    {
        let me = this;
    },
    methods: {
        deleteComment(){
            let me = this;
            me.$emit('deleteComment', me.data.commentId);
        },
        commitComment()
        {
            let me = this;
            if(me.modeOwn == EnumModeUseControl.Add)
            {
                me.callApi('post',`api/comment/${me.taskId}`, me.data,null)
                .then(res => {
                    if(res.data.success)
                    {
                        let data = res.data.data;
                        data.user = me.userInfo;
                        me.$emit('commitComment',data, me.mode);
                    }
                });
            }
            else
            {
                me.callApi('put',`api/comment`, me.data,null)
                .then(res => {
                    if(res.data.success)
                    {
                        let data = res.data.data;
                        me.isEditing = false;
                        me.modeOwn = EnumModeUseControl.Edit;
                        me.$emit('commitComment',me.data, me.mode);
                    }
                });
            }
        },
        attachNewFileCommentAdd(newFile)
        {
            let me = this;
            me.$emit('attachNewFileCommentAdd', me.data.commentId, newFile, me.mode);
        },
        ChangeModeEdit()
        {
            let me = this;
            me.modeOwn = EnumModeUseControl.Edit;
            me.isEditing = true;
        },
        deleteFileAttach(fileId){
            let me = this;
            me.$emit('deleteFileAttach',me.data.commentId,fileId, me.mode);
        },
        linkImg(fileName)
        {
            let me = this;
            if(fileName)
            {
                return baseCallApi.doMain + '' + `/file/img/${fileName}`;
            }
            
            return '';
        },
        showDropDownEvent(){
            let me = this;
            me.isShowDropDownFeature = true;
        },
        closeDropDownEvent(){
            let me = this;
            me.isShowDropDownFeature = false;
        },
    },
    data(){
        return {
            modeCommentControl: EnumModeUseControl,
            isEditing: false,
            isShowDropDownFeature: false,
            modeOwn: this.mode
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/componentCommon/Comment.css');
</style>