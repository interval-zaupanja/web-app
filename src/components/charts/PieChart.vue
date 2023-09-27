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
    props: ['podatki', 'caption', 'caption_condition'],
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
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: this.caption_condition,
                        text: this.caption,
                        color: "#404040",
                        font: {
                            size: 13
                        }
                    }
                }
            }
        }
    }
};
</script>