<template>
    <Bar
        :data="this.data"
        :options="this.options"
        :plugins="this.plugins"
        style="height: 2000px;"
    />
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

export default {
    name: 'App',
    props: ['data'],
    components: {
        Bar
    },
    data() {
        return {
            options: {
                layout: {
                    padding: {
                        left: 90
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: context => {
                                const dataPoint = context.dataIndex
                                return " Povprečna ocena " + context.dataset.data[dataPoint]
                            }
                        }
                    }
                }
            },
            plugins: [
                /* NALAGANJE SLIK ZAČASNO IZKLJUČENO    
                {
                    id: 'imageItems',
                    beforeDatasetsDraw(chart, args, pluginOptions) {
                        const { ctx, data, options, scales: { x, y } } = chart

                        ctx.save()
                        const slike = data.datasets[0].images
                        
                        for (let i = 0; i < slike.length; i++) {
                            const imageURI = slike[i]
                            const slika = new Image()
                            slika.src = imageURI

                            var width
                            var height
                            slika.onload = () => {
                                width = slika.width
                                height = slika.height
                            }

                            height = (width / options.layout.padding.left) * height
                            height = 60 // ZAČASNA REŠITEV DOKLER NE NAJDEM NAČINA, DA SE PREBERE VIŠINA SLIKE
                            ctx.drawImage(slika, 0, y.getPixelForValue(i) - height / 2, height, options.layout.padding.left) // x, y, h, w
                        }                        
                    }
                }
                */
            ]
        }
    }
}
</script>