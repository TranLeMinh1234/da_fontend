<template>
    <div id="statistic">
        <div class="general d-flex j-space-between">
            <div 
                class="general-item"
                v-for="(item, index) in dataGeneral" :key="index"
            >
                <div class="header">
                    {{headerGeneralItem(index)}}
                </div>
                <div class="content">
                    {{contentGeneralItem(index) + " công việc"}}
                </div>
            </div>
        </div>
        <div class="task-each-member">
            <div class="container-chart">
                <BarChart 
                    chartId="task-each-member"
                    datasetIdKey="label"
                    :width="800"
                    :height="200"
                    :title="{
                        display: true,
                        textDisplay: 'Số lượng công việc theo người liên quan',
                        padding: {
                            top: 10,
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
</template>

<script>
import { defaults } from 'chart.js';
import BaseComponent from '../commonComponent/BaseComponent.vue';
import BarChart from './BarChart.vue';
export default {
    name: 'Statistic',
    extends: BaseComponent,
    components: {
        BarChart
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
        contentGeneralItem(index)
        {
            let me = this;
            let stringReturn = "";
            if(!me.isLoadingData)
            {
                stringReturn = me.dataGeneral[index]+"";
            }

            return stringReturn;
        },
        headerGeneralItem(index)
        {
            let me = this;
            let stringReturn = "";
            if(!me.isLoadingData)
            {
                switch(index)
                {
                    case 0:
                        stringReturn = "Tổng:";
                        break;
                    case 1:
                        stringReturn = "Hoàn thành:";
                        break;
                    case 2:
                        stringReturn = "Chưa hoàn thành:";
                        break;
                    default:
                        break;
                }
            }

            return stringReturn;
        },
        loadAllData()
        {
            let me = this;
            me.getGeneralCount();
            me.getTaskEachMember();
        },
        getGeneralCount(){
            let me = this;
            me.callApi('get',`api/grouptask/generalcount/${me.option.groupTask.groupTaskId}`,null)
            .then(res => {
                if(res.data.success)
                {
                    let data = res.data.data;
                    me.dataGeneral = data;
                    me.checkDoneLoadData();
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

                    me.checkDoneLoadData();
                }
            });
        },
        checkDoneLoadData(){
            let me = this;
            if(!me.countDoneLoadData)
            {
                me.countDoneLoadData = 1;
            }
            else
            {
                me.countDoneLoadData++;
            }

            if(me.countDoneLoadData == 2)
            {
                me.isLoadingData = false;
            }
        },
    },
    data()
    {
        return {
            dataGeneral: [],
            dataTaskEachMember:{},
            isLoadingData: true,
            currentGroup: null
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/ViewComponent/Statistic.css');
</style>