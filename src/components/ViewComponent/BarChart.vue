<template>
    <Bar
        :chart-options="chartOptions"
        :chart-data="chartData"
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
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
    name:"Test",
    components: 
    {
        Bar
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
            default: 'bar-chart'
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
        stacked: {
            type: Boolean,
            default: false
        },
        indexAxis: {
            type: String,
            default: 'x'
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
                borderWidth: 1,
                responsive: true,
                indexAxis: this.indexAxis,
                barPercentage: 0.8,
                categoryPercentage: 1,
                // bỏ kẻ sọc ngnang
                scales: {
                    x: {
                        type: 'linear',
                        ticks: {
                            stepSize: 1
                        },
                        stacked: this.stacked,
                        grid: {
                            display:false
                        }
                    },
                    y: {
                        stacked: this.stacked,
                        grid: {
                            display:false
                        },
                        ticks:{
                            stepSize: 1
                        }
                    }
                },
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
                            // This more specific font property overrides the global property
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