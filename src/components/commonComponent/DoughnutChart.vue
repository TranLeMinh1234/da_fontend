<template>
    <Doughnut
        :chart-options="chartOptions"
        :chartData="chartData"
        :chart-id="chartId"
        :dataset-id-key="datasetIdKey"
        :plugins="plugins"
        :css-classes="cssClasses"
        :styles="styles"
        :width="width"
        :height="height"
    />
</template>

<script>
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

export default {
    name:"DoughnutChart",
    components: 
    {
        Doughnut
    },
    created(){
        let me = this;
    },
    mounted(){
        let me = this;
    },
    computed:
    {
        
    },
    props: {
        chartId: {
            type: String,
            default: 'doughnut-chart'
        },
        datasetIdKey: {
            type: String,
            default: 'label'
        },
        width: {
            type: Number,
            default: 400
        },
        height: {
            type: Number,
            default: 400
        },
        cssClasses: {
            default: '',
            type: String
        },
        styles: {
            type: Object,
            default: () => {}
        },
        plugins: {
            type: Object,
            default: () => {}
        },
        title: {
            type: Object,
            default: () => {}
        },
        chartData: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        
    },
    data()
    {
        return {
            chartOptions: {
                animation: {
                    duration: 0
                },
                aspectRatio: 0.8,
                responsiveAnimationDuration: 0,
                plugins: {
                    title: {
                        display: this.title.display,
                        text: this.title.textDisplay,
                        padding: this.title.padding,
                        font: {
                            size: 20,
                        }
                    },
                    legend: {
                        labels: {
                            font: {
                                size: 14
                            }
                        },
                    },    

                },
                
            }
        }
    }
}
</script>

<style scoped>

</style>