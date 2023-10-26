<template>
    <Bar :data="this.data" :options="this.options" style="height: 1000px;"/>
</template>

<script>
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

console.log("TEST")

export default {
    name: 'App',
    props: ['data'],
    components: {
        Bar
    },
    data() {
        return {
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        onClick: function(evt) {
                            console.log(evt)
                        }
                    }
                }
            },
            plugins: [
                {
                    id: 'imageItems',
                    beforeDatasetsDraw(chart, args, pluginOptions) {
                        const { ctx, data, scales: { x, y } } = chart
                    }
                }
            ]
        }
    }
}
</script>