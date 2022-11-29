<template>
    <div id="statistic">
        <TabView
            :tabs="tabs"
        >
            <template #tab1>
                <div class="d-flex w-100 al-center">
                    <div class="general-chart">
                        <DoughnutChart 
                            chartId="general-chart"
                            datasetIdKey="label"
                            :width="200"
                            :height="200"
                            :title="{
                                display: true,
                                textDisplay: 'Tổng quan',
                                padding: {
                                    top: 20,
                                }
                            }"
                            :chartData="dataGeneral"
                        />
                    </div>
                    <div class="task-each-member">
                        <div class="container-chart">
                            <BarChart 
                                chartId="task-each-member"
                                datasetIdKey="label"
                                :width="560"
                                :height="168"
                                :title="{
                                    display: true,
                                    textDisplay: 'Số lượng công việc theo người liên quan',
                                    padding: {
                                        bottom: 30
                                    }
                                }"
                                :stacked="true"
                                indexAxis="y"
                                :chartData="dataTaskEachMember"
                            />
                        </div>
                    </div>
                </div>
                <div class="status-tasks-each-member">
                    <div class="w-100 d-flex al-center j-space-between">
                        <div class="title-chart">Tình trạng thực hiện công việc</div>
                        <div class="filter-chart">
                            <LocalCombobox 
                                :configField="{
                                    displayField: 'titleTime',
                                    valueField: 'valueTime'
                                }"
                                :configDropDown="{
                                    height: 130,
                                }"
                                :data="dataFilterTime"
                                v-model="valueTimeFilter"
                                @selectItem="selectTimeFilter"
                            />
                        </div>
                    </div>
                    <div class="table-statistic">
                        <table>
                            <thead>
                                <tr>
                                    <td style="text-align: left">Tên nhân viên</td>
                                    <td style="text-align: left">Email</td>
                                    <td>Số lượng công việc</td>
                                    <td>Đúng hạn, vượt tiến độ</td>
                                    <td>Chậm tiến độ</td>
                                    <td>Cần thực hiện</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in dataStatusExecuteTask" :key="item.email">
                                    <td style="text-align: left">
                                        <div class="d-flex al-center">
                                            <img :src="linkImg(item.fileAvatarName)" alt="">
                                            <div class="mg-l-12">
                                                {{item.userName}}
                                            </div>
                                        </div>
                                    </td>
                                    <td style="text-align: left">{{item.email}}</td>
                                    <td>{{item.total}}</td>
                                    <td>{{item.totalTaskOverProgess}}</td>
                                    <td>{{item.totalTaskLateDeadline}}</td>
                                    <td>{{item.totalTaskNeedDone}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style="padding: 10px"></div>
            </template>
            <template #tab2>
                <div class="num-personal-tasks">
                    <div class="w-100 d-flex al-center j-space-between">
                        <div class="title-chart">Số lượng công việc theo thời gian</div>
                        <div class="filter-chart">
                            <LocalCombobox 
                                :configField="{
                                    displayField: 'titleTime',
                                    valueField: 'valueTime'
                                }"
                                :configDropDown="{
                                    height: 130,
                                }"
                                :data="dataFilterTime"
                                v-model="valueTimeFilterNumOfTaskPersonal"
                                @selectItem="selectTimeFilterNumOfTaskPersonal"
                            />
                        </div>
                    </div>
                    <div class="num-personal-tasks-chart">
                        <LineChart 
                            chartId="num-personal-tasks-chart"
                            datasetIdKey="label"
                            :width="300"
                            :height="80"
                            :title="{
                                    display: true,
                                    textDisplay: '',
                                    padding: {
                                }
                            }"
                            :chartData="dataNumOfTaskPersonal"
                        />
                    </div>
                </div>
            </template>
        </TabView>
    </div>
</template>

<script>
import { defaults } from 'chart.js';
import BaseComponent from '../commonComponent/BaseComponent.vue';
import BarChart from './BarChart.vue';
import DoughnutChart from '../commonComponent/DoughnutChart.vue';
import LineChart from '../commonComponent/LineChart.vue';
import TabView from '../commonComponent/TabView.vue';
import LocalCombobox from '../commonComponent/LocalCombobox.vue';
import {baseCallApi} from '../../common/js/BaseCallApi.js';

export default {
    name: 'Statistic',
    extends: BaseComponent,
    components: {
        BarChart,
        TabView,
        DoughnutChart,
        LocalCombobox,
        LineChart
    },
    emits: ['closeView'],
    props: {
        option: {
            type: Object,
            default: function(rawProps)
            {
                return rawProps?.option;
            }
        }
    },
    created(){
        let me = this;

        me.tabs = [
            {
                title: 'Thông số nhóm'
            },
            {
                title: 'Thông số cá nhân'
            }
        ];

        me.dataFilterTime = me.$commonFunction.getDataTimeFilter();
        me.dataTime = me.$commonFunction.getDistanceTimeFilter(me.valueTimeFilter);
        if(!me.option?.groupTask)
        {
            me.$router.push({name: 'DailyTask'});
        }
        else
        {
            me.loadAllData();
        }

        
        
    },
    methods: {
        linkImg(fileName)
        {
            let me = this;
            if(fileName)
            {
                return baseCallApi.doMain + '' + `/file/img/${fileName}`;
            }
            
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkyOEJDRjNERjQzRjExRTNBMDE2RjY3ODg3MTdFOTlDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjkyOEJDRjNFRjQzRjExRTNBMDE2RjY3ODg3MTdFOTlDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTI4QkNGM0JGNDNGMTFFM0EwMTZGNjc4ODcxN0U5OUMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTI4QkNGM0NGNDNGMTFFM0EwMTZGNjc4ODcxN0U5OUMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7bOPvnAAAKCElEQVR42uydW1MT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';
        },
        selectTimeFilter(timeValueSelect)
        {
            let me = this;
            me.dataTime = me.$commonFunction.getDistanceTimeFilter(timeValueSelect);
            if(me.dataTime)
            {
                me.getStatusExecuteTask();
            }
        },
        selectTimeFilterNumOfTaskPersonal(timeValueSelect)
        {
            let me = this;
            me.dataTime = me.$commonFunction.getDistanceTimeFilter(timeValueSelect);
            debugger
            if(me.dataTime)
            {
                me.getNumOfTaskPersonal();
            }
        },
        loadAllData()
        {
            let me = this;
            me.getGeneralCount();
            me.getTaskEachMember();
            me.getStatusExecuteTask();
            me.getNumOfTaskPersonal();
        },
        getNumOfTaskPersonal()
        {
            let me = this;
            me.callApi('post',`api/grouptask/numoftaskpersonal`,
            {
                groupTaskId: me.option.groupTask.groupTaskId,
                startTime: me.$commonFunction.parseDateToStringDateServer(me.dataTime.startTime),
                endTime: me.$commonFunction.parseDateToStringDateServer(me.dataTime.endTime)
            },null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    let labels = [],
                        dataInDataSets = [];
                    
                    data?.forEach(record => {
                        labels.push(me.$commonFunction.parseDateJsToString(record.DateValue));
                        dataInDataSets.push(record.CountTaskInDay);
                    });

                    me.dataNumOfTaskPersonal = {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Số lượng công việc',
                                backgroundColor: '#adcbf2',
                                borderColor: '#adcbf2',
                                fill: true,
                                data: dataInDataSets
                            }
                        ]
                    };                   
                    me.checkDoneLoadDataTab2();
                }
            });
        },
        getGeneralCount(){
            let me = this;
            me.callApi('get',`api/grouptask/generalcount/${me.option.groupTask.groupTaskId}`,null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    me.dataGeneral = {
                        labels: ['Việc đã hoàn thành','Số việc chưa hoàn thành'],
                        datasets: [
                            {
                                backgroundColor: ['#41B883', '#d7e3dc'],
                                data: [data[1],data[2]]
                            }
                        ]
                    };
                    me.checkDoneLoadDataTab1();
                }
            });
        },
        getTaskEachMember()
        {
            let me = this;
            me.callApi('get',`api/grouptask/taskeachmember/${me.option.groupTask.groupTaskId}`,null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    let listLabels = [],
                        dataTotalTask = [],
                        dataTotalCompleteTask = [],
                        dataTotalNotCompleteTask = [],
                        datasets = [];

                    data?.forEach(element => {
                        listLabels.push(element.userName);
                        dataTotalTask.push(element.total);
                        dataTotalCompleteTask.push(element.totalComplete);
                        dataTotalNotCompleteTask.push(element.totalNotComplete);
                    });

                    datasets.push({
                        label: "công việc đã hoàn thành",
                        data: dataTotalCompleteTask,
                        backgroundColor: '#1bed88'
                    });

                    datasets.push({
                        label: "công việc chưa hoàn thành",
                        data: dataTotalNotCompleteTask,
                        backgroundColor: '#d7e3dc'
                    });

                    me.dataTaskEachMember = {
                        labels: listLabels,
                        datasets: datasets
                    };

                    me.checkDoneLoadDataTab1();
                }
            });
        },
        getStatusExecuteTask()
        {
            let me = this;
            me.isLoadStatusExecuteTask = true;
            me.callApi('post', 'api/grouptask/getstatusexecutetask', {
                groupTaskId: me.option.groupTask.groupTaskId,
                startTime: me.$commonFunction.parseDateToStringDateServer(me.dataTime.startTime),
                endTime: me.$commonFunction.parseDateToStringDateServer(me.dataTime.endTime)
            }, null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    me.dataStatusExecuteTask = data;
                    me.isLoadStatusExecuteTask = false;

                    me.checkDoneLoadDataTab1();
                }
            });
        },
        checkDoneLoadDataTab1(){
            let me = this;
            if(!me.countDoneLoadDataTab1)
            {
                me.countDoneLoadDataTab1 = 1;
            }
            else
            {
                me.countDoneLoadDataTab1++;
            }

            if(me.countDoneLoadDataTab1 == 3)
            {
                me.isLoaddingTab1 = false;
            }
        },
        checkDoneLoadDataTab2(){
            let me = this;
            if(!me.countDoneLoadDataTab2)
            {
                me.countDoneLoadDataTab2 = 1;
            }
            else
            {
                me.countDoneLoadDataTab2++;
            }

            if(me.countDoneLoadDataTab2 == 3)
            {
                me.isLoaddingTab2 = false;
            }
        },
    },
    data()
    {
        return {
            isLoaddingTab2: true,
            isLoaddingTab1: true,
            isLoadStatusExecuteTask: false,
            isLoaddingTab2: true,
            valueTimeFilter: 1,
            valueTimeFilterNumOfTaskPersonal: 1,
            dataFilterTime: [],
            tabs: [],
            dataGeneral: [],
            dataTaskEachMember:{},
            dataStatusExecuteTask: [],
            dataNumOfTaskPersonal: {},
            isLoadingData: true,
            currentGroup: null
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/ViewComponent/Statistic.css');
</style>