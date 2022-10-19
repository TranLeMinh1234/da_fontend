<template>
    <div class="comment-input">
        <div class="background-input">
            <textarea 
                :type="type" 
                v-on="listeners" 
                ref="mInputElement" 
                v-model="valueValidate"
                :placeholder="placeholder"
                :title="title"
                :class="[isValid? '':'error',mode == modeCommentControl.Add ? 'add-mode' : '']"
                :style="{
                    padding: padding
                }"
            ></textarea>
            <div class="feature-comment d-flex al-center">
                <div class="file-icon attachment-icon c-poiter" @click="chooseFile"></div>
                <div class="file-icon commnet-icon mg-l-10 c-poiter" @click="commitComment"></div>
            </div>
        </div>
        <input type="file" id="inp-file-cmt" class="d-none">
    </div>
</template>

<script>
import BaseDataControl from './BaseDataControl.vue';
import {validateRule} from '../../common/js/validateRule.js';
import {EnumModeUseControl,EnumTypeTask,EnumAttachment} from '../../common/js/Enum.js';
import { uuid } from 'vue-uuid';
import BaseComponent from '../commonComponent/BaseComponent.vue';

export default {
    name: "MInput",
    extends: BaseComponent,
    emits: ['commitComment','attachNewFileCommentAdd','update:modelValue'],
    props:{
        mode: {
            type: Number,
            default: EnumModeUseControl.Add
        },
        taskId: {
            type: String,
            default: null
        },
        padding:{
            type: String,
            default: '7px 110px 7px 14px'
        },
        type: {
            type: String,
            default: 'text'
        },
        placeholder: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        commentId: {
            type: String,
            default: uuid.v1()
        },
        rule: {
            type: String, 
            default: ""
        },
        modelValue: {
            type: String,
            default: ""
        },
        nameField: {
            type: String,
            default: ''
        }
    },
    created()
    {
        let me = this;
    },
    watch: {
        'modelValue': function(newValue)
        {
            let me = this;
            me.valueValidate = newValue;
        }
    },
    computed:
    {
        listeners()
        {
            let me = this;
            return {
                input: function(event)
                {
                    me.valueValidate = event.target.value;
                    me.$emit('update:modelValue',me.valueValidate);
                },
                keyup: function(event)
                {
                    switch(event.code){
                        case 'Enter':
                        case 'NumpadEnter':
                            me.$emit('enterEvent');
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    },
    methods: {
        commitComment()
        {
            let me = this;
            me.$emit('commitComment');
        },
        chooseFile()
        {
            let me = this;
            let inpUploadAttachFile = document.getElementById('inp-file-cmt');
            inpUploadAttachFile.onchange = function(eventChange)
            {
                me.formData = new FormData();
                for(let i = 0; i < inpUploadAttachFile.files.length; i++)
                {
                    let file = inpUploadAttachFile.files[i];
                    me.formData.append('formFiles', file);
                    me.formData.append('typeAttachment', EnumAttachment.AttachComment);
                    me.formData.append('attachmentId', me.commentId);
                    me.callApi('post','file/upload',me.formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(resUpload => {
                        
                        if(resUpload.data.success)
                        {
                            let data = resUpload.data.data;
                            me.$emit('attachNewFileCommentAdd', data);
                        }
                    });
                    
                }
            };
            inpUploadAttachFile.click();
        }
    },
    data()
    {
        let me = this;
        return {
            modeCommentControl: EnumModeUseControl,
            isValid: true,
            valueValidate: me.modelValue,
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/componentCommon/CommentInput.css');
</style>