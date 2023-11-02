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
    height: 200px;
    margin: 0 auto 5px auto;
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