<template>
    <div class="container">
         <div class="containerBody">
            <Bar
                :data="this.data"
                :options="this.options"
                :plugins="this.plugins"
            />
        </div>
    </div>
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
import ChartDataLabels from 'chartjs-plugin-datalabels';

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
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'x',
                scales: {
                    y: {
                        beginAtZero: true,
                        display: false,
                    },
                    x: {
                        border: {
                            display: false
                        },
                        grid: {
                            display: false
                        },
                        ticks: {
                            autoSkip: false,
                            maxRotation: 0,
                            minRotation: 0,
                            callback: (index) => {
                                let label = this.data.labels[index]
                                if(label == null){
                                    return ''
                                }
                                if (label.length > 15) {
                                    // okoli sredine label iščemo presledek
                                    let iMiddleChar = Math.floor(label.length / 2)
                                    let iChar = iMiddleChar
                                    let offset = 1
                                    while (label[iChar] != ' ' && (iChar > 0 && iChar < label.length)) {
                                        iChar = iMiddleChar + offset
                                        if (offset > 0) {
                                            offset *= -1
                                        } else {
                                            offset = offset * -1 + 1 
                                        }
                                    }
                                    
                                    // label razdelimo na dva dela
                                    label = [label.substring(0, iChar), label.substring(iChar)]
                                }
                                return label
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        enabled: false,
                        callbacks: {
                            label: context => {
                                const dataPoint = context.dataIndex
                                return " Povprečna ocena " + context.dataset.data[dataPoint]
                            }
                        }
                    },
                    legend: {
                        display: false
                    },
                    datalabels: {
                        color: '#FFFFFF',
                        formatter: function (value) {
                            return value.toLocaleString('sl-SI') // če hočemo decimalno vejico namesto pike
                        },
                        font: {
                            weight: 'bold',
                            size: 25,
                            family: 'graphik'
                        },
                        anchor: 'end',
                        align: 'bottom'
                    }
                }
            },
            plugins: [
                // /* NALAGANJE SLIK ZAČASNO IZKLJUČENO    
                {
                    id: 'imageItems',
                    afterDatasetsDraw(chart) {
                        const { ctx, data, scales: { x } } = chart

                        ctx.save()
                        const slike = data.datasets[0].images
                        
                        for (let i = 0; i < slike.length; i++) {
                            const slika = new Image()
                            slika.src = slike[i]

                            const { widthSrc, heightSrc } = getImageDimensions(slike[i])

                            var width = 70 // širina stolpca
                            var height = (width / widthSrc) * heightSrc
                            ctx.drawImage(slika, x.getPixelForValue(i) - width / 2, x.top - height, width, height) // x, y, h, w
                        }                        
                    }
                },
                // */
               ChartDataLabels
            ],
        }
    },
    mounted() {
        const containerBody = document.querySelector('.containerBody')
        containerBody.style.width = this.data.labels.length * 100 + 'px'
    }
}
</script>

<style scoped>
.container {
    max-width: max-content;
    overflow-x: scroll;
    margin-bottom: 10px
}

.containerBody {
    height: 280px;
    margin: 0 auto;
}

::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
}

::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .5);
    box-shadow: 0 0 1px rgba(255, 255, 255, .5);
}
</style>