<template>
    <div 
        class="attach-file"
        :style="{
            backgroundColor: checkImgFileExtension(data.extensionOfFile) ? 'black' : 'silver'
        }"
    >
        <div :class="['feature', displayFeature? '':'d-none']">
            <IconDropDown
                :config="{
                    width: 130,
                    height: 100,
                    directArrow: 'top',
                }"
                iconClass="more-feature-blue-icon"
                :isShowDropDown="isShowDropDownFeature"
                @showDropDownEvent="showDropDownEvent"
                @closeDropDownEvent="closeDropDownEvent"
            >
                <div class="w-100 d-flex center-items pd-8 attachfile-feature-item c-poiter mg-t-10" @click="Download">
                    <div class="file-icon download-icon"></div>
                    <div class="pd-l-8">Tải xuống</div>
                </div>
                <div class="w-100 d-flex center-items pd-8 attachfile-feature-item c-poiter" @click="DeleteFileAttach">
                    <div class="file-icon delete-line-icon"></div>
                    <div class="pd-l-8">Xóa</div>
                </div>
            </IconDropDown>
        </div>
        <img 
            v-if="checkImgFileExtension(data.extensionOfFile)" 
            :src="linkImg(data.fileName)" 
            alt=""
        >
        <div 
            v-if="!checkImgFileExtension(data.extensionOfFile)"
            class="file-display d-flex center-items"
            >
            <div class="file-icon file-attach-icon"></div>
        </div>
        <div class="file-attach-info pd-8">
            <div 
                class="file-attach-name txt-threedots w-98 color-blue-taskdetail"
                :title="data.fileName"
            >
                {{data.fileName}}
            </div>
            <div class="createdTime">
                {{formatCreatedTime(data.createdTime)}}
            </div>
        </div>
    </div>
</template>

<script>
import { uuid } from 'vue-uuid';
import {baseCallApi} from '../../common/js/BaseCallApi.js';
import IconDropDown from './IconDropDown.vue'

export default {
    name: 'FileAttach',
    components: {
        IconDropDown
    },
    props: {
        data: {
            type: Object,
            default: function(rawProps)
            {
                return rawProps.data? rawProps.data : {
                    fileId: uuid.v1(),
                    fileName: '0f3a7af9-2609-4c3a-b900-c35982178eaa_acdbb4bc-d5b8-4a0f-88b1-376efbf966a3.jpg',
                    extensionOfFile: '.jpg',
                    filePath: '',
                    typeAttachment: 1,
                    attachmentId: null,
                    createdTime: null,
                    createdByEmail: null
                };
            }
        },
        displayFeature: {
            type: Boolean,
            default: true
        }
    },
    methods:{
        DeleteFileAttach(){
            let me = this;
            me.$emit('deleteFileAttach', me.data.fileId);
        },
        Download()
        {
            let me = this;
            window.open(baseCallApi.doMain + '' + `/file/download/${me.data.fileName}`);
        },
        closeDropDownEvent(){
            let me = this;
            me.isShowDropDownFeature = false;
        },
        showDropDownEvent(){
            let me = this;
            me.isShowDropDownFeature = true;
        },
        formatCreatedTime(time)
        {
            let me = this;
            let dateObject = me.$commonFunction.parseStringServerToDate(time);
            return time? 
            `${dateObject.getDate()}/${dateObject.getMonth()+1}/${dateObject.getFullYear()} ${dateObject.getHours()}:${dateObject.getMinutes()}`
            : 'Không xác định';
        },
        linkImg(fileName)
        {
            let me = this;
            return baseCallApi.doMain + '' + `/file/img/${fileName}`;
        },
        checkImgFileExtension(fileExtension)
        {
            let imgExtensions = ['.jpg','.png','.jfif'];
            return imgExtensions.includes(fileExtension);
        }
    },
    data(){
        return {
            isShowDropDownFeature: false
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/componentCommon/FileAttach.css');
</style>