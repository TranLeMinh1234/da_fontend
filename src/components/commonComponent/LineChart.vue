<template>
    <Line
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
import { Line } from 'vue-chartjs';
import 'chartjs-adapter-moment';
import { Chart as ChartJS,TimeScale,PointElement, LineElement, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Filler} from 'chart.js';

ChartJS.register(TimeScale, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement, Filler);

export default {
    name:"LineChart",
    components: 
    {
        Line
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
            default: 'line-chart'
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
                scales: {
                    x: {
                        grid: {
                            display:false
                        }
                    },
                    y: {
                        type: 'linear',
                        ticks: {
                            stepSize: 1,
                        },
                        beginAtZero: true,
                        grid: {
                            display:false
                        }
                    },
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
                            font: {
                                size: 14
                            }
                        },
                    },    
                    datalabels: {
                        align: 'center'
                    }
                },
                
            }
        }
    }
}
</script>

<style scoped>

</style>