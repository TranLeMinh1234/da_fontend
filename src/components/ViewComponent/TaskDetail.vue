<template>
    <div class="task-detail">
        <div class="header-feature d-flex j-end">
            <div class="lst-feature d-flex al-center j-spread-around">
                <div class="file-icon c-poiter command-direct-icon"></div>
                <div class="file-icon c-poiter child-task-icon"></div>
                <div class="file-icon c-poiter attachment-icon"></div>
                <div class="file-icon c-poiter attach-label-icon" @click="showFormAddLabel()"></div>
                <div class="file-icon c-poiter copy-link-icon"></div>
                <div class="file-icon c-poiter more-feature-icon"></div>
                <div class="file-icon c-poiter exit-popup-icon" @click="clostPopup()"></div>
            </div>
        </div>
        <div class="body-task d-flex">
            <div class="primary-content">
                <div class="name-task txt-threedots fw-600">kasjdk jask jaskasjdk jask jas</div>
                <div class="user-assigned">Người giao việc: <span>Ngô Vân Hải</span></div>
                <div class="one-edit-task d-flex w-100 pd-t-16 j-spread-around">
                    <div class="one-edit-item assigned-user w-48 d-flex al-center">
                        <img src="../../assets/defaultAvatar.png" alt="" class="avatar mg-l-10">
                        <div class="info-assigned-user pd-l-16">
                            <div>Người thực hiện</div>
                            <div class="fw-600">Trần Lê Minh</div>
                        </div>
                    </div>
                    <div class="one-edit-item w-48 d-flex al-center">
                        <div class="file-icon select-expire-time-icon mg-l-10"></div>
                        <div class="info-assigned-user pd-l-16">
                            Chọn hạn hoàn thành
                        </div>
                    </div>
                </div>
                <div class="pd-t-16 two-edit-task">
                    <div v-if="dataEdit.description" v-html="dataEdit.description">
                        
                    </div>
                    <div v-if="!dataEdit.description">
                        <div class="d-flex al-center">
                            <div class="file-icon blue-description-edit-icon"></div>
                            <div class="color-blue-taskdetail pd-l-10">Nhập mô tả</div>
                        </div>
                        <ckeditor @ready="onReady" :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
                    </div>
                </div>
                <div class="pd-t-16 three-edit-task">
                    <div class="header d-flex j-space-between">
                        <div class="d-flex al-center">
                            <div class="file-icon check-list-icon"></div>
                            <span class="fw-600 pd-l-10">Checklist</span>
                        </div>
                        <div v-show="isCheckAll != null && !isCheckAll" class="check-all c-poiter fw-600" @click="checkAll()">
                            Hoàn thành tất cả
                        </div>
                        <div v-show="isCheckAll != null && isCheckAll" class="check-all c-poiter fw-600" @click="checkFalseAll()">
                            Bỏ hoàn thành tất cả
                        </div>
                    </div>
                    <div class="lst-check">
                        <div 
                            v-for="(checkTask,index) in dataEdit.lstCheckTask" :key="checkTask.checkTaskId"
                            class="check-task d-flex al-center pd-8"
                        >
                            <div 
                                :class="['mg-l-4','file-icon','c-poiter', checkTask.status ? 'checked-icon':'not-checked-icon']"
                                @click="changeCheckTask(checkTask.checkTaskId)"
                            >
                            </div>
                            <div class="pd-l-10 flex-1 w-90">{{index+1}}.{{checkTask.content}}</div>
                            <div class="feature-line-checktask d-none">
                                <div class="file-icon hole-trash-icon c-poiter" @click="deleteCheckTask(checkTask.checkTaskId)"></div>
                            </div>
                        </div>
                        <div v-if="addingCheckList" class="d-flex al-center pd-8">
                            <div 
                                :class="['mg-l-4','file-icon','not-checked-icon']"
                            ></div>
                            <input 
                                class="fake-content-cklst" 
                                type="text" 
                                v-model="fakeContentCheckList"
                                placeholder="Nhập checklist"
                                @blur="commitValueFakeContentCkLst()"
                            >
                        </div>
                        <div class="add-lst d-flex al-center pd-8 c-poiter fit-content" @click="addCheckList()">
                            <div class="file-icon plush-blue-icon"></div>
                            <div class="fw-600 pd-l-6 color-blue-taskdetail">Thêm checklist</div>
                        </div>
                    </div>
                </div>
                <div class="pd-t-16 four-edit-task" v-if="dataEdit.lstLabel.length > 0">
                    <div class="header d-flex al-center">
                        <div class="file-icon attach-label-icon"></div>
                        <div class="fw-600 pd-l-10">Gắn thẻ</div>
                    </div>
                    <div class="d-flex lst-label al-center fl-wrap w-100 mg-t-10">
                        <div 
                            v-for="label in dataEdit.lstLabel" :key="label.labelId"
                            class="label"
                            :style="{
                                color: 'white',
                                backgroundColor: label.color,
                            }"
                        >
                            <div class="feature-label file-icon exit-cirle-icon d-none c-poiter" @click="deleteLabelFromList(label.labelId)"></div>
                            <div>{{label.nameLabel}}</div>
                        </div>
                        <div class="file-icon add-label-detail-icon mg-l-6 c-poiter" @click="showFormAddLabel()"></div>
                    </div>
                </div>
                <div class="pd-t-16 five-edit-task">
                    <div class="header d-flex al-center">
                        <div class="file-icon big-child-task-icon"></div>
                        <div class="fw-600 pd-l-10">Công việc con</div>
                    </div>
                    <div class="bottom-border-silver w-100 pd-t-10"></div>
                    <div class="w-100">
                        <div
                            v-for="(childTask, index) in dataEdit.lstChildTask" :key="childTask.taskId"
                            class="child-task c-poiter"
                        >
                            <div class="">{{index + 1}}.{{childTask.taskName}}</div>
                            <div class="d-flex al-center feature-line d-none">
                                <div class="file-icon hole-trash-icon c-poiter" v-show="childTask.createdByEmail == userInfo.email"></div>
                            </div>
                        </div>
                    </div>
                    <div class="add-child-task w-100" v-if="addingChildTask">
                        <input 
                            type="text" 
                            v-model="fakeNameChildTask" 
                            placeholder="Tên công việc con"
                            @blur="commitNewChildTask"
                        >
                    </div>
                    <div class="add-lst d-flex al-center pd-8 c-poiter" @click="addChildTaskInput()">
                        <div class="file-icon plush-blue-icon"></div>
                        <div class="fw-600 pd-l-6 color-blue-taskdetail">Thêm việc</div>
                    </div>
                </div>
            </div>
            <div class="not-primary-content">
            </div>
        </div>
    </div>
    <Modal :isShow="isShowDetail" :configModal="configModal">
        <component :is="nameDetailComponent" :option="props" @closePopup="closeSubPopup"></component>
    </Modal>
</template>

<script>
import {EnumEditMode,EnumTypeTask} from '../../common/js/Enum.js';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { uuid } from 'vue-uuid';
import Modal from '../commonComponent/Modal.vue';
import BaseViewDetail from '../commonComponent/BaseViewDetail.vue';
import AddLabelForm from '../ViewComponent/AddLabelForm.vue';
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: "TaskDetail",
    extends: BaseViewDetail,
    components:{
        Modal,
        AddLabelForm
    },
    props:
    {
        option:
        {
            type: Object,
            default: function(rawProps)
            {
                return rawProps.option? rawProps.option: {
                    taskId: uuid.v1(),
                    typeTask: EnumTypeTask.Personal,
                    editMode: EnumEditMode.Watch
                };
            }
        }
    },
    created(){
        let me = this;
        me.getListTaskChild();
        me.getListCheckList();
    },
    mounted(){
        let me = this;
    },
    computed:
    {
        ...mapGetters('userManage', ['userInfo','isExistsUserInfo']),
        isCheckAll: function()
        {
            let me = this;
            let result = true;
            if(!me.dataEdit.lstCheckTask || me.dataEdit.lstCheckTask.length == 0)
            {
                result = null
            }
            else
            {
                me.dataEdit.lstCheckTask?.forEach(checkTask => {
                    result = result && checkTask.status;
                })
            }
            return result;
        }
    },
    methods: {
        checkFinishLoadData()
        {
            let me = this;
            if(!me.countLoad) me.countLoad = 0;
            me.countLoad++;
            if(me.countLoad == 2)
                console.log('loaddone');
        },
        getListCheckList()
        {
            let me = this;
            me.callApi('get',`api/checkTask/getCheckTasks/${me.option.taskId}`,null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    if(data && data.length > 0)
                    {
                        me.dataRoot.lstCheckTask = data;
                        me.dataEdit.lstCheckTask = data;
                    }
                    me.checkFinishLoadData();
                }
            });
        },
        getListTaskChild()
        {
            let me = this;
            me.callApi('get',`api/task/getChildTask/${me.option.taskId}`,null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    me.dataRoot.lstChildTask = data;
                    me.dataEdit.lstChildTask = data;
                    me.checkFinishLoadData();
                }
            });
        },
        commitNewChildTask()
        {
            let me = this;
            if(me.fakeNameChildTask !== '')
            {
                let dataSave = {
                    taskId: null,
                    taskName: me.fakeNameChildTask,
                    typeTask: me.option.typeTask,
                    PathTreeTask: (me.dataEdit.PathTreeTask? me.dataEdit.PathTreeTask : '') + "/" + me.option.taskId
                };
                me.callApi('post', 'api/task/insertChildTask', dataSave, null)
                .then(res => {
                    if(res.data.success)
                    {
                        let data = res.data.data;
                        me.dataEdit.lstChildTask.push(data);
                        me.fakeContentCheckList = '';
                        me.addingChildTask = false;
                        me.toast.success('Thêm công việc con thành công');
                    }
                });
               
            }
        },
        addChildTaskInput()
        {
            let me = this;
            me.addingChildTask = true;
        },
        closeSubPopup( callback )
        {
            let me = this;
            if(callback)
            {
                callback(me);
            }
            me.isShowDetail = false;
        },
        onReady( editor )  {
            // Insert the toolbar before the editable area.
            editor.ui.getEditableElement().parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
            );
        },
        saveDescription()
        {
            let me = this;
            me.dataEdit.description = me.editorData;
        },
        changeCheckTask(checkTaskId)
        {
            let me = this;
            me.dataEdit.lstCheckTask.forEach(checkTask => {
                if(checkTask.checkTaskId == checkTaskId)
                    checkTask.status = !checkTask.status;
            });
        },
        checkAll()
        {
            let me = this;
            me.dataEdit.lstCheckTask.forEach(checkTask => {
                checkTask.status = true;
            })
        },
        checkFalseAll()
        {
            let me = this;
            me.dataEdit.lstCheckTask.forEach(checkTask => {
                checkTask.status = false;
            })
        },
        commitValueFakeContentCkLst(){
            let me = this;
            if(me.fakeContentCheckList !== '')
            {
                let dataSave =  
                {
                    checkTaskId: null,
                    content: me.fakeContentCheckList,
                    status: false,
                    taskId: me.option.taskId
                };

                me.callApi('post',`api/checktask`,dataSave,null)
                .then(res => {
                    if(res.data.success)
                    {
                        me.dataEdit.lstCheckTask.push(dataSave);
                        me.toast.success("Thêm checklist thành công!");
                    }
                });
            }
            me.addingCheckList = false;
        },
        addCheckList()
        {
            let me = this;
            me.fakeContentCheckList = '';
            me.addingCheckList = true;
        },
        deleteCheckTask(checkTaskId)
        {
            let me = this;
            me.dataEdit.lstCheckTask = me.dataEdit.lstCheckTask.filter(checkTask => 
                checkTask.checkTaskId != checkTaskId);
        },
        deleteLabelFromList(labelId)
        {
            let me = this;
            me.dataEdit.lstLabel = me.dataEdit.lstLabel.filter(label => 
                label.labelId != labelId);
        },
        showFormAddLabel()
        {
            let me = this;
            me.showDetail('AddLabelForm',{
                width: '400px',
                height: 'auto',
                borderTop: true
            }, null, null);
        },
        clostPopup()
        {
            let me = this;
            me.$emit('closePopup',()=>{});
        }
    },
    data()
    {
        return{
            //modal
            nameDetailComponent: '',
            props: undefined,
            isShowDetail: false,
            configModal: undefined,
            callbackOutsideComponent: null,

            //checklist
            addingCheckList: false,
            fakeContentCheckList: '',

            //childTask
            addingChildTask: false,
            fakeNameChildTask: '',

            //ckeditor
            editor: DecoupledEditor,
            editorData: '',
            editorConfig: {
                toolbar: {
                    items: [
                        'bold','italic','underline','strikethrough','|',
                        'fontsize','fontcolor','fontfamily','|',
                        'alignment'
                    ]
                }
            },

            //data handle
            dataRoot:
            {
                description: '',
                path: '',
                lstCheckTask: [],
                lstLabel: [],
                lstChildTask: []
            },
            dataEdit: {
                description: '',
                path: '',
                lstCheckTask: [
                    // {
                    //     checkTaskId: '1',
                    //     content: 'Tạo Database',
                    //     status: false
                    // }
                ],
                lstLabel: [],
                lstChildTask: [
                    // {
                    //     taskId: '1',
                    //     taskName: 'Task 1'
                    // },
                    // {
                    //     taskId: '2',
                    //     taskName: 'Task 2'
                    // }
                ]
            }
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/ViewComponent/TaskDetail.css');
</style>