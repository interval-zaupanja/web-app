<template>
    <div>
        <Doughnut
            :options="options"
            :data="data"
        />
    </div>
</template>

<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
    components: {
        Doughnut
    },
    props: ['podatki', 'caption', 'caption_condition', 'enota'],
    data() {
        return {
            type: "doughnut",
            data: {
                labels: this.podatki.labels,
                datasets: [
                    {
                        backgroundColor: this.podatki.backgroundColor,
                        data: this.podatki.data
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: this.caption_condition,
                        text: this.caption,
                        position: 'bottom',
                        color: "#404040",
                        font: {
                            size: 13
                        }
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: context => {
                                const dataPoint = context.dataIndex                        
                                return " " + context.dataset.data[dataPoint] + this.enota
                            }
                        }
                    }
                }
            }
        }
    }
};
</script>