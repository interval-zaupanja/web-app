<template>
    <div>
        <Pie
            :options="options"
            :data="data"
        />
    </div>
</template>

<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
    components: {
        Pie
    },
    props: ['podatki'],
    data() {
        return {
            type: "pie",
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
                maintainAspectRatio: false
            },
        }
    }
};
</script>