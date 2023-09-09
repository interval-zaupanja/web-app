<template>
    <div style="height: 400px">
        <Scatter
        v-if="loaded"
        :options="options"
        :data="data"
        style="max-height: 400px"
        />
    </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import 'chartjs-adapter-date-fns'; // moment alternative (TEMPORARY!!!)

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import { Scatter } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,  
  Title,
  Tooltip,
  Legend
);

export default {
    name: 'Referendum',
    components: {
        Scatter
    },
    props: ['glasovanje_id'],
    data() {
        return {
            type: 'scatter',
            data: {
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        position: 'bottom'
                    },
                    y: {
                        ticks: {
                            callback: function (value) {
                                return value + "%"
                            }
                        }
                    }
                }
            },
            loaded: false,
            not_found: false
        }
    },
    async mounted() {
        const status = await this.getData();
        if (status) {
            this.not_found = true;
        }
        this.loaded = true;
    },
    methods: {
        async getData() {
            try {
                const { data } = await axios.get("http://localhost:4000/api/vprasanja/glasovanje/" + this.glasovanje_id)
                for (let i = 0; i < data.length; i++) {
                    const { anketa_id, odgovori } = data[i];
                    for (let j = 0; j < odgovori.length; j++) {
                        var label_current = this.vrniOdgovor(odgovori[j].odgovor_std ?? odgovori[j].tip, false, 1) ?? odgovori[j].odgovor
                        var color_current = this.vrniStdBarvo(odgovori[j].odgovor_std ?? odgovori[j].tip)
                        if (odgovori[j].tip === 'O' && odgovori[j].udelezba_tip === 'NBG') {
                            label_current = this.vrniOdgovor('NBG', false, 1)
                            color_current = this.vrniStdBarvo('NBG')
                        }

                        if (undefined === this.data.datasets.find((element) => element.label === label_current)) {
                            this.data.datasets.push({
                                label: label_current,
                                data: [{
                                    x: await this.getDate(anketa_id),
                                    y: odgovori[j].procent_izvajalec
                                }],
                                backgroundColor: color_current,
                                borderColor: color_current,
                                borderWidth: 2,
                                showLine: true,
                            })
                        } else {
                            const obstojeciVnos = this.data.datasets.find((element) => element.label === label_current)
                            obstojeciVnos.data.push({x: await this.getDate(anketa_id), y: odgovori[j].procent_izvajalec})
                        }
                    }
                }
            } catch (error) {
                console.log(error)
                return false;
            }
        },
        async getDate(anketa_id) {
            const { data } = await axios.get("http://localhost:4000/api/ankete/" + anketa_id);
            return moment(data.sredina, "YYYY-MM-DD").format("YYYY-MM-DD"); // sicer ni vpisan celoten data.konec format, vendar vseeno deluje
        }
    }
}
</script>