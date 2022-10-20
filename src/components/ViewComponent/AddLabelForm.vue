<template>
    <div class="add-label-form">
        <div class="header-add-label-form d-flex al-center j-space-between">
            <div class="name-form fw-600">Gắn thẻ</div>
            <div class="file-icon exit-popup-icon c-poiter" @click="closePopup()"></div>
        </div>
        <div class="pd-standard">
            <MInput 
                :isHaveIcon="true"
                padding="10px 14px 10px 32px" 
                icon="medium-search-icon"
                placeholder="Tìm thẻ"
                @enterEvent="searchLabel()"
                v-model="seachValue"
            />
        </div>
        <div class="d-flex al-center pd-standard lst-label-add fl-wrap">
            <div 
                v-for="label in lstAdd" :key="label.labelId"
                class="label"
                :style="{
                    color: 'white',
                    backgroundColor: label.color,
                }"
            >
                <div class="feature-label file-icon exit-cirle-icon d-none c-poiter" @click="deleteLabelFromList(label.labelId)"></div>
                <div>{{label.nameLabel}}</div>
            </div>
        </div>
        <div class="line-spread mg-t-10"></div>
        <div class="lst-label pd-standard">
            <div class="d-flex al-center pd-t-10 c-poiter fit-content">
                <div class="file-icon plush-blue-icon"></div>
                <div class="color-blue-taskdetail" @click="showInputLabel()">Thêm thẻ</div>
            </div>
            <div class="inp-color-label d-flex al-center j-space-between" v-if="isAddingNewLabel">
                <div>
                    <input ref="chooseColor" type="color" v-model="newLabel.color">
                </div>
                <div>
                    <input type="text" v-model="newLabel.nameLabel" placeholder="Nhập tên thẻ">
                </div>
                <div class="done-edit c-poiter color-blue-taskdetail" @click="commitNewLabel()">
                    Xong
                </div>
            </div>
            <div class="line-spread" v-if="isAddingNewLabel"></div>
            <div class="lst-choose pd-t-16">
                <div 
                    v-for="label in lstLabelAvailabelDisplay" :key="label.labelId"
                    class="d-flex al-center pd-tbt-8 label-choose c-poiter"
                    @click="addListAdd(label)"
                >
                    <div 
                        class="color-label" 
                        :style="{
                            backgroundColor: label.color
                        }"
                    ></div>
                    <div class="name-label pd-l-10">{{label.nameLabel}}</div>
                    <div class="feature-line d-flex al-center d-none">
                        <div class="file-icon blue-edit-icon c-poiter" @click="editLabel(label)"></div>
                        <div class="file-icon delete-line-icon c-poiter" @click="deleteLabel(label.labelId)"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer pd-standard d-flex j-end al-center">
            <button class="btn btn-primary" @click="commitListAdd()">Xác nhận</button>
        </div>
    </div>
</template>

<script>
import MInput from '../commonComponent/MInput.vue';
import { uuid } from 'vue-uuid';
import BaseComponent from '../commonComponent/BaseComponent.vue';

export default {
    name: 'AddLabelForm',
    extends: BaseComponent,
    emits: ['closePopup'],
    components:{
        MInput
    },
    created(){
        let me = this;
        me.loadLabel();
    },
    mounted(){},
    methods:{
        commitListAdd(){
            let me = this;
            let functionCallBack = function(objectParent)
            {
                let arrayPush = [];
                let arrayLabelIdAdd = [];
                me.lstAdd.forEach(labelAdd => {
                    let isStored = false;
                    objectParent.dataEdit.listLabel.forEach(label => {
                        if(label.labelId == labelAdd.labelId)
                            isStored = true;
                    })

                    if(!isStored)
                    {
                        arrayPush.push(labelAdd);
                        arrayLabelIdAdd.push(labelAdd.labelId);
                    }
                })
                
                me.callApi('post','api/task/label',
                {
                    "taskId": objectParent.option.taskId,
                    "listLabelId": JSON.stringify(arrayLabelIdAdd)
                },null)
                .then(res => {
                    if(res.data.success)
                    {
                        objectParent.dataEdit.listLabel = objectParent.dataEdit.listLabel.concat(arrayPush);
                    }
                    else
                    {
                        let errorCodes = res.data.errorCode;
                        switch(errorCodes[0])
                        {
                            case "EmptyData":
                                me.toast.warning('Các thẻ này đã được gắn')
                                break;
                            default:
                                break;
                        }
                    }
                });
            };
            me.closePopup(functionCallBack);
        },
        addListAdd(label){
            let me = this;
            let indexExists = me.lstAdd.findIndex(item => item.labelId == label.labelId);
            if(indexExists == -1)
                me.lstAdd.push(label);
        },
        searchLabel()
        {
            let me = this;
            if(me.seachValue)
            {
                me.lstLabelAvailabelDisplay = me.lstLabelAvailabel.filter(label => label.nameLabel.includes(me.seachValue));
            }
            else
                me.lstLabelAvailabelDisplay = me.lstLabelAvailabel;
        },
        showInputLabel()
        {
            let me = this;
            me.isAddingNewLabel = true;
        },
        deleteLabel(labelId){
            let me = this;
            me.callApi('delete', `api/label/${labelId}`,null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    me.lstLabelAvailabel = me.lstLabelAvailabel.filter(label => label.labelId !== labelId);
                    me.searchLabel();
                    me.toast.success("Xóa thẻ thành công!");
                }
            });
        },
        loadLabel()
        {
            let me = this;
            me.callApi('get','api/label/getall',null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    me.lstLabelAvailabel = data;
                    me.lstLabelAvailabelDisplay = me.lstLabelAvailabel;
                }
            })
        },
        editLabel(label)
        {
            let me = this;
            let cloneLabel = {};
            Object.assign(cloneLabel, label);
            me.newLabel = cloneLabel;
            me.isAddingNewLabel = true;
        },
        commitNewLabel(){
            let me = this;
            if(me.newLabel.nameLabel !== '')
            {
                if(!me.newLabel.labelId)
                {
                    me.callApi('post','api/label/insertCustom',me.newLabel,null)
                    .then(res => {
                        if(res.data.success)
                        {
                            let data = res.data.data;
                            me.updateLstAvailable(true, data);
                        }
                    });
                }
                else
                {
                    me.callApi('put','api/label/updateCustom',me.newLabel,null)
                    .then(res => {
                        if(res.data.success)
                        {
                            let data = res.data.data;
                            me.updateLstAvailable(false, data);
                        }
                    });
                }
            }
        },
        updateLstAvailable(isAdd, data)
        {
            let me =this;
            if(isAdd)
            {
                me.lstLabelAvailabel.push(data);
                me.searchLabel();
                me.toast.success("Thêm thẻ thành công!");
            }
            else
            {
                let indexUpdatedLabel = me.lstLabelAvailabel.findIndex(label => label.labelId == data.labelId);
                if(indexUpdatedLabel !== -1)
                {
                    me.lstLabelAvailabel[indexUpdatedLabel] = data;
                    me.searchLabel();
                }
                me.toast.success("Cập nhật thẻ thành công!");
            }
            me.isAddingNewLabel = false;
            me.newLabel.nameLabel = '';
            me.newLabel.labelId = null;
        },
        closePopup(callback)
        {
            let me = this;
            me.$emit('closePopup',callback);
        },
        deleteLabelFromList(labelId)
        {
            let me = this;
            me.lstAdd = me.lstAdd.filter(label => 
                label.labelId != labelId);
        }
    },
    data(){
        return{
            seachValue: '',
            newLabel:{
                labelId: null,
                color: '#000000',
                nameLabel: ''
            },
            isAddingNewLabel: false,
            lstLabelAvailabel: [
                
            ],
            lstLabelAvailabelDisplay: [
                
            ],
            lstAdd: []
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/ViewComponent/AddLabelForm.css');
</style>