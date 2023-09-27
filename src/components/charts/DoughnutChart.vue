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
    props: ['podatki', 'caption', 'caption_condition'],
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
                        position: 'bottom'
                    },
                    title: {
                        display: this.caption_condition,
                        text: this.caption
                    }
                }
            }
        }
    }
};
</script>