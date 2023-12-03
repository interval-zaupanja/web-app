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

import { getImageDimensions } from '@/scripts/getImageSize.js'

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
                        left: this.data.datasets[0].images.length > 0 ? 90 : 0
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
                {
                    id: 'imageItems',
                    beforeDatasetsDraw(chart) {
                        const { ctx, data, options, scales: { y } } = chart

                        ctx.save()
                        const slike = data.datasets[0].images
                        
                        for (let i = 0; i < slike.length; i++) {
                            const imageURI = slike[i]
                            const slika = new Image()
                            slika.src = imageURI

                            const { widthSrc, heightSrc } = getImageDimensions(imageURI)

                            var width = options.layout.padding.left // širina stolpca
                            var height = Math.floor((width / widthSrc) * heightSrc)

                            var xOffset = 0
                            if (height > 80) { // dodatni popravki, če je slika previsoka
                                height = 80
                                let widthPrevious = width
                                width = (height / heightSrc) * widthSrc
                                xOffset = (widthPrevious - width) / 2
                            }
                            ctx.drawImage(slika, xOffset, y.getPixelForValue(i) - height / 2, width, height) // x, y, w, h
                        }                        
                    }
                }
            ]
        }
    }
}
</script>