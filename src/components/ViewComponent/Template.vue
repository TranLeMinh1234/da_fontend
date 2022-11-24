<template>
    <div id="template-bg" class="d-flex center-items">
        <div id="template" class="d-flex center-items">
            <div class="lst-template">
                <div class="w-80 h-10">
                    <MInput 
                        :isHaveIcon="true"
                        padding="10px 14px 10px 32px" 
                        icon="medium-search-icon"
                        placeholder="Tìm mẫu quy trình công việc..."
                        @enterEvent="searchTemplate"
                        v-model="searchTemplateValue"
                    />
                </div>
                <div class="d-flex al-center j-space-between">
                    <div class="cl-black fw-600 fs-18">Danh sách mẫu quy trình công việc</div>
                    <button class="btn btn-primary mg-r-16" @click="addNewTemplate">Thêm mẫu quy trình</button>
                </div>
                <div class="cl-black list">
                    <div
                        v-for="(template,index) in listTemplate" :key="template.templateGroupTaskId"
                        class="template-item"
                        @click="changeDetailTemplate(index)"
                    >
                        <div v-if="canDeleteTemplate(template)" class="delete-template-item d-flex center-items" @click="deleteTemplate(template.templateGroupTaskId)">
                            <div class="file-icon exit-popup-icon"></div>
                        </div>
                        <div class="txt-threedots">{{template?.nameTemplateGroupTask}}</div>
                        <div class="d-flex mg-t-10">
                            <img :src="linkImg(template?.createdBy?.fileAvatarName)" alt="" class="user-avar">
                            <div class="pd-l-12">
                                <div><i>{{nameAuthor(template)}}</i></div>
                                <div><i>{{emailAuthor(template)}}</i></div>
                            </div>
                        </div>
                        <div class="mg-t-10">Tạo ngày: {{dateCreated(template)}}</div>
                    </div>
                </div>
            </div>
            <div class="detail-template cl-black" v-if="!isAddingNewTemplate && listTemplate.length > 0">
                <div class="pd-16 fw-600 fs-24 txt-threedots name-template">{{listTemplate[indexTemplateEdit]?.nameTemplateGroupTask}}</div>
                <div class="grid-edit">
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 5%">STT</th>
                                <th style="width: 15%">Tên bước quy trình</th>
                                <th style="width: 25%">Mô tả</th>
                                <th style="width: 10%">Màu cột</th>
                                <th style="width: 10%">Màu chữ</th>
                                <th style="width: 10%">Màu tiêu đề cột</th>
                                <th style="width: 2%"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(process,index) in listTemplate[indexTemplateEdit].listProcess" :key="process.processId"
                            >
                                <td>
                                    <!-- <div v-if="index!=0" class="connect-step"></div> -->
                                    <div class="d-flex center-items cl-white step">
                                        <div>{{index + 1}}</div>
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex center-items">
                                        <div class="mg-auto" v-if="!process.isEditing">{{process.processName}}</div>
                                        <MInput 
                                            v-if="process.isEditing"
                                            v-model="process.processName"
                                            :isValidate="false"
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex center-items">
                                        <div class="mg-auto"  v-if="!process.isEditing">{{process.description}}</div>
                                        <MInput 
                                            v-if="process.isEditing"
                                            v-model="process.description"
                                            :isValidate="false"
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex center-items">
                                        <input type="color" v-model="process.columnSetting.color" :disabled="process.isEditing? false: true">
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex center-items">
                                        <input type="color" v-model="process.columnSetting.colorText" :disabled="process.isEditing? false: true">
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex center-items">
                                        <input type="color" v-model="process.columnSetting.colorHeader" :disabled="process.isEditing? false: true">
                                    </div>
                                </td>
                                <td>
                                    <div class="p-relative">
                                        <div class="d-flex center-items d-none feature-line" v-if="process.isEditing && canEditTemplate()">
                                            <div class="file-icon delete-line-icon c-poiter" @click="commitOriginal(process)"></div>
                                            <div class="file-icon green-tick-icon c-poiter mg-l-6" @click="commitEditProcess(process)"></div>
                                        </div> 
                                        <div class="d-flex center-items d-none feature-line" v-if="!process.isEditing && canEditTemplate()">
                                            <div class="file-icon exit-popup-icon c-poiter" @click="deleteProcess(process)"></div>
                                            <div class="file-icon edit-icon c-poiter mg-l-6" @click="prepareEditProcess(process)"></div>
                                        </div> 
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex center-items">
                                        <div v-if="canEditTemplate()" class="add-new-process d-flex center-items c-poiter" @click="addFakeProcess">
                                            <div class="file-icon plush-white-icon"></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="detail-template cl-black" v-if="isAddingNewTemplate">
                <div class="edit-new-template w-100 pd-16 d-flex al-center j-space-between">
                    <div class="w-60">
                        <input type="text" v-model="newTemplate.nameTemplateGroupTask" placeholder="Tên mẫu quy trình mới...">
                    </div>
                    <div class="d-flex al-center w-24 j-end">
                        <button class="btn btn-white-silver" @click="isAddingNewTemplate = false">Hủy bỏ</button>
                        <button class="btn btn-primary mg-l-10" @click="commitNewTemplate">Lưu mẫu</button>
                    </div>
                </div>
                <div class="grid-edit">
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 5%">STT</th>
                                <th style="width: 20%">Tên bước quy trình</th>
                                <th style="width: 30%">Mô tả</th>
                                <th style="width: 10%">Màu cột</th>
                                <th style="width: 10%">Màu chữ</th>
                                <th style="width: 10%">Màu tiêu đề cột</th>
                                <th style="width: 10%"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(process,index) in newTemplate.listProcess" :key="process.processId"
                            >
                                <td>
                                    <!-- <div v-if="index!=0" class="connect-step"></div> -->
                                    <div class="d-flex center-items cl-white step">
                                        <div>{{index + 1}}</div>
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex center-items">
                                        <div class="mg-auto"  v-if="!process.isEditing">{{process.processName}}</div>
                                        <MInput 
                                            v-if="process.isEditing"
                                            v-model="process.processName"
                                            :isValidate="false"
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex center-items">
                                        <div class="mg-auto"  v-if="!process.isEditing">{{process.description}}</div>
                                        <MInput 
                                            v-if="process.isEditing"
                                            v-model="process.description"
                                            :isValidate="false"
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex center-items">
                                        <input type="color" v-model="process.columnSetting.color" :disabled="process.isEditing? false: true">
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex center-items">
                                        <input type="color" v-model="process.columnSetting.colorText" :disabled="process.isEditing? false: true">
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex center-items">
                                        <input type="color" v-model="process.columnSetting.colorHeader" :disabled="process.isEditing? false: true">
                                    </div>
                                </td>
                                <td>
                                    <div class="p-relative">
                                        <div class="d-flex center-items d-none feature-line" v-if="process.isEditing">
                                            <div class="file-icon exit-popup-icon c-poiter" @click="deleteFakeProcessWhenAddingNewTemplate(process)"></div>
                                        </div> 
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex center-items">
                                        <div class="add-new-process d-flex center-items c-poiter" @click="addFakeProcess">
                                            <div class="file-icon plush-white-icon"></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BaseComponent from '../commonComponent/BaseComponent.vue';
import MInput from '../commonComponent/MInput.vue';
import {EnumEditMode,EnumTypeTask,EnumAttachment, EnumModeUseControl, EnumTypeDeadline} from '../../common/js/Enum.js';
import { uuid } from 'vue-uuid';
import {baseCallApi} from '../../common/js/BaseCallApi.js';

export default {
    name: "Template",
    extends: BaseComponent,
    emits: ['closeView'],
    components: {
        MInput
    },
    created(){
        let me = this;
        me.loadAllData();
    },
    computed: {
        
    },
    methods:{
        canDeleteTemplate(template)
        {
            let me = this;
            if(template?.createdByEmail != 'admin')
            {
                return true;
            }
            return false;
        },
        canEditTemplate()
        {
            let me = this;
            if(me.listTemplate[me.indexTemplateEdit]?.createdByEmail != 'admin')
            {
                return true;
            }
            return false;
        },
        dateCreated(template)
        {
            let me = this;
            let dateDisplay = me.$commonFunction.parseDateJsToString(template?.createdTime);
            return dateDisplay ? dateDisplay : '--/--/----';
        },
        nameAuthor()
        {
            let me = this;
            return (!template?.createdBy?.firstName && !template?.createdBy?.lastName) ? 'admin' : `${template?.createdBy?.firstName} ${template?.createdBy?.lastName}`;
        },
        emailAuthor(template)
        {
            let me = this;
            return template?.createdBy?.email ? template?.createdBy?.email : 'tlminh10300@gmail.com';
        },
        loadAllData()
        {
            let me = this;
            me.getTemplate();
        },
        getTemplate()
        {
            let me = this;
            me.callApi('get', 'api/template/getall/havepermission',null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    me.listTemplate = data;
                    if(!me.listTemplate || (me.listTemplate && me.listTemplate.length == 0))
                    {
                        me.listTemplate = [];
                        me.isAddingNewTemplate = true;
                    }
                    else
                    {
                        me.isAddingNewTemplate = false;
                    }
                    me.checkLoadDone();
                }
             });
        },
        commitEditProcess(processEdit)
        {
            let me = this;
            if(processEdit.isNewProcess)
            {
                me.callApi('post', `api/template/insertprocess`, processEdit ,null)
                .then(res => {
                    if(res.data.success)
                    {
                        let data = res.data.data;
                        for(var propertyName in data)
                        {
                            processEdit[propertyName] = data[propertyName];
                        }
                        processEdit.isEditing = false;
                    }
                });
            }
            else
            {
                me.callApi('put', `api/template/process`, processEdit ,null)
                .then(res => {
                    if(res.data.success)
                    {
                        me.listTempProcess = me.listTempProcess.filter(process => process.processId != processEdit.processId);
                        processEdit.isEditing = false;
                    }
                });
            }
        },
        deleteProcess(processDelete)
        {
            let me = this;
            me.callApi('delete', `api/template/process/${processDelete.processId}/${processDelete.columnSetting.columnSettingId}`)
            .then(res => {
                if(res.data.success)
                {
                    me.listTemplate[me.indexTemplateEdit].listProcess = 
                        me.listTemplate[me.indexTemplateEdit].listProcess.filter(process => process.processId != processDelete.processId);
                }
                else
                {
                    errorCode = res.data.errorCode[0];
                    switch(errorCode)
                    {
                        case 'ExistsTaskInProcess':
                            me.showDialogNotification({
                                    width: '430px',
                                    height: '180px',
                                    borderTop: true
                                },
                                {
                                    'title': 'Cảnh báo',
                                    'content': 'Tồn tại công việc phát sinh. Bạn không được phép xóa bước quy trình này.'
                                },
                                undefined);
                            break;
                        default: 
                            break;
                    }
                }
            });
        },
        commitOriginal(processEditing)
        {
            let me = this;
            if(processEditing.isNewProcess)
            {
                me.listTemplate[me.indexTemplateEdit].listProcess = 
                    me.listTemplate[me.indexTemplateEdit].listProcess.filter(process => process.processId != processEditing.processId);
            }
            else
            {
                let processOriginal = me.listTempProcess.find(processTemp => processTemp.processId == processEditing.processId);
                if(processOriginal)
                {
                    for(var propertyName in processOriginal)
                    {
                        processEditing[propertyName] = processOriginal[propertyName];
                    }
                }

                me.listTempProcess = me.listTempProcess.filter(process => process.processId != processEditing.processId);
            }
        },
        prepareEditProcess(processEditing)
        {
            let me = this;
            let indexProcess = me.listTempProcess.findIndex(processTemp => processTemp.processId == processEditing.processId)
            if(indexProcess == -1)
            {
                let cloneProcess = {};
                let cloneColumnSetting = {};
                Object.assign(cloneProcess,processEditing);
                Object.assign(cloneColumnSetting,processEditing.columnSetting);
                cloneProcess.columnSetting = cloneColumnSetting;
                cloneProcess.isEditing = false;
                me.listTempProcess.push(cloneProcess);
            }

            processEditing.isEditing = true;
        },
        deleteFakeProcessWhenAddingNewTemplate(processFake){
            let me = this;
            me.newTemplate.listProcess = me.newTemplate.listProcess.filter(process => process.processId != processFake.processId);
            if(me.newTemplate.listProcess.length == 0)
            {
                me.addFakeProcess();
            }
        },
        checkLoadDone()
        {
            let me = this;
            if(!me.countLoadDone)
            {
                me.countLoadDone = 1;
            }
            else
            {
                me.countLoadDone++;
            }

            if(me.countLoadDone == 2)
            {
                me.isLoadingDataDone = true;
            }
        },
        deleteTemplate(templateId){
            let me = this;
            me.callApi('delete',`api/template/deletecustom/${templateId}`, null).then(
                res => {
                    if(res.data.success)
                    {
                        let data = res.data.data;
                        me.listTemplate = me.listTemplate.filter(template => template.templateGroupTaskId != templateId);
                        if(!me.listTemplate || (me.listTemplate && me.listTemplate.length == 0))
                        {
                            me.listTemplate = [];
                            me.addNewTemplate();
                        }
                    }
                }
            );
        },        
        commitNewTemplate()
        {
            let me = this;
            let isValid = true;
            if(!me.newTemplate.nameTemplateGroupTask)
            {
                me.showDialogNotification(
                    {
                        width: '430px',
                        height: '180px',
                        borderTop: true
                    },
                    {
                        'title': 'Cảnh báo',
                        'content': 'Tên mẫu quy trình không được bỏ trống.'
                    },
                    undefined
                );
                isValid = false;
            }

            if(isValid)
            {
                me.newTemplate.listProcess.forEach(process => {
                    if(!process.processName)
                    {
                        me.showDialogNotification(
                            {
                                width: '430px',
                                height: '180px',
                                borderTop: true
                            },
                            {
                                'title': 'Cảnh báo',
                                'content': 'Tên quy trình không được bỏ trống.'
                            },
                            undefined
                        );
                        isValid = false;
                    }
                });
            }

            if(isValid)
            {
                for(let i = 1; i <= me.newTemplate.listProcess.length; i++)
                {
                    me.newTemplate.listProcess[i-1].sortOrder = i;
                }

                me.callApi('post','api/template/insertcustom', me.newTemplate ,null)
                .then(res => {
                    if(res.data.success)
                    {
                        me.toast.success('Thêm mẫu quy trình công việc thành công');
                        let data = res.data.data;
                        me.listTemplate.push(data);
                    }
                });
            }
        },
        addNewTemplate()
        {
            let me = this;
            me.newTemplate = {
                templateGroupTaskId: uuid.v1(),
                nameTemplateGroupTask: '',
                listProcess: [
                    {
                        processId: uuid.v1(),
                        processName: '',
                        description: '',
                        columnSetting: {
                            columnSettingId: uuid.v1(),
                            color: me.randomHexColor(),
                            colorText: me.randomHexColor(),
                            colorHeader: me.randomHexColor()
                        },
                        isNewProcess: true,
                        isEditing: true
                    }
                ],
                createdBy: {},
                createdByEmail: '',
                createdTime: null
            };
            me.isAddingNewTemplate = true;
        },
        addFakeProcess()
        {
            let me = this;
            if(me.isAddingNewTemplate)
            {
                me.newTemplate.listProcess.push(
                    {
                        processId: uuid.v1(),
                        processName: '',
                        description: '',
                        columnSetting: {
                            columnSettingId: uuid.v1(),
                            color: me.randomHexColor(),
                            colorText: me.randomHexColor(),
                            colorHeader: me.randomHexColor()
                        },
                        sortOrder: me.newTemplate.listProcess.length,
                        isNewProcess: true,
                        isEditing: true
                    }
                );
            }
            else
            {
                me.listTemplate[me.indexTemplateEdit].listProcess.push(
                    {
                        processId: uuid.v1(),
                        processName: '',
                        description: '',
                        templateGroupTaskReferenceId: me.listTemplate[me.indexTemplateEdit].templateGroupTaskId,
                        sortOrder: null,
                        columnSetting: {
                            columnSettingId: uuid.v1(),
                            color: "#00ffff",
                            colorText: '#000000',
                            colorHeader: '#2196f3'
                        },
                        isNewProcess: true,
                        isEditing: true
                    }
                );
            }
        },
        changeDetailTemplate(index)
        {
            let me = this;
            me.listTemplate[me.indexTemplateEdit].listProcess.forEach(process => {
                me.listTempProcess.forEach(processTemp => {
                    if(processTemp.processId == process.processId)
                    {
                        process = processTemp;
                    }
                })
            });

            me.listTemplate[me.indexTemplateEdit].listProcess = me.listTemplate[me.indexTemplateEdit].listProcess.filter(process => !process.isNewProcess);
            
            me.isAddingNewTemplate = false;
            me.listTempProcess = [];
            me.indexTemplateEdit = index; 
        },
        searchTemplate()
        {
            let me = this;
        },
        linkImg(fileName)
        {
            let me = this;
            if(fileName)
            {
                return baseCallApi.doMain + '' + `/file/img/${fileName}`;
            }
            
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkyOEJDRjNERjQzRjExRTNBMDE2RjY3ODg3MTdFOTlDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjkyOEJDRjNFRjQzRjExRTNBMDE2RjY3ODg3MTdFOTlDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTI4QkNGM0JGNDNGMTFFM0EwMTZGNjc4ODcxN0U5OUMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTI4QkNGM0NGNDNGMTFFM0EwMTZGNjc4ODcxN0U5OUMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7bOPvnAAAKCElEQVR42uydW1MT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';
        },
        randomHexColor()
        {
            return '#'+Math.floor(Math.random()*16777215).toString(16);
        }
    },
    data(){
        return {
            searchTemplateValue: '',
            indexTemplateEdit: 0,
            isAddingNewTemplate: false,
            isLoadingDataDone: false,
            listTemplate: [],
                // {
                //     TemplateGroupTaskId: '1',
                //     nameTemplateGroupTask: 'Template 1 Template 1Template 1Template 1Template 1Template 1Template 1Template 1Template 1Template 1Template 1',
                //     listProcess: [
                //         {
                //             proccessId: '1',
                //             processName: 'Quá',
                //             description: '',
                //             columnSetting: {
                //                 columnSettingId: '2',
                //                 color: "#000000",
                //                 colorText: '#000000',
                //                 ColorHeader: '#000000'
                //             }
                //         },
                //         {
                //             proccessId: '2',
                //             processName: 'Quá trình 2',
                //             description: '',
                //             columnSetting: {
                //                 columnSettingId: '2',
                //                 color: "#000000",
                //                 colorText: '#000000',
                //                 ColorHeader: '#000000'
                //             }
                //         },
                //         {
                //             proccessId: '3',
                //             processName: 'Quá trình 3',
                //             description: '',
                //             columnSetting: {
                //                 columnSettingId: '3',
                //                 color: "#000000",
                //                 colorText: '#000000',
                //                 ColorHeader: '#000000'
                //             }
                //         }
                //     ],
                //     createdBy: {
                //         email: 'tlminh10300@gmail.com',
                //         firstName: 'Trần',
                //         lastName: 'Lê Minh'
                //     },
                //     createdByEmail: '',
                //     createdTime: new Date()
                // },
                // {
                //     TemplateGroupTaskId: '2',
                //     nameTemplateGroupTask: 'Template 2',
                //     listProcess: [
                //         {
                //             processName: 'Quá trình 1',
                //             description: '',
                //             columnSetting: {
                //                 columnSettingId: '1',
                //                 color: "#000000",
                //                 colorText: '#000000',
                //                 ColorHeader: '#000000'
                //             }
                //         }
                //     ],
                //     createdByEmail: '',
                //     createdBy: {
                //         email: 'tlminh10300@gmail.com',
                //         firstName: 'Trần',
                //         lastName: 'Lê Minh'
                //     },
                //     createdTime: new Date()
                // }
            //],
            listTempProcess: [],
            newTemplate: {
                templateGroupTaskId: uuid.v1(),
                nameTemplateGroupTask: '',
                listProcess: [
                    {
                        processId: uuid.v1(),
                        processName: '',
                        description: '',
                        columnSetting: {
                            columnSettingId: uuid.v1(),
                            color: this.randomHexColor(),
                            colorText: this.randomHexColor(),
                            colorHeader: this.randomHexColor()
                        },
                        sortOrder: 0,
                        isNewProcess: true,
                        isEditing: true
                    }
                ],
                createdBy: {},
                createdByEmail: '',
                createdTime: null
            }
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/ViewComponent/Template.css');
</style>