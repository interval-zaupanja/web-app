<template>
    <div style="height: 400px">
        <Line
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

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default {
    name: 'Referendum',
    components: {
        Line
    },
    props: ['glasovanje_id'],
    data() {
        return {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
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
                        if (
                            undefined ===
                            this.data.datasets.find(
                                (element) => element.label === odgovori[j].odgovor
                            )
                        ) {
                            this.data.datasets.push({
                                label: this.vrniOdgovor(odgovori[j].odgovor ?? odgovori[j].odgovor_tip, false, true) ?? odgovori[j].odgovor, // preveri, če je odgovor standardiziran in vrne željeno obliko
                                backgroundColor: this.vrniStdBarvo(odgovori[j].odgovor ?? odgovori[j].odgovor_tip),
                                data: [odgovori[j].procent_izvajalec],
                            })
                        } else {
                            const obstojeciVnos = this.data.datasets.find(
                                (element) => element.label === odgovori[j].odgovor
                            )
                            obstojeciVnos.data.push(odgovori[j].procent_izvajalec)
                        }
                    }
                    this.data.labels.push(await this.getDate(anketa_id));
                }

            } catch (error) {
                console.log(error)
                return false;
            }
        },
        async getDate(anketa_id) {
            const { data } = await axios.get("http://localhost:4000/api/ankete/" + anketa_id);
            return moment(data.konec, "YYYY-MM-DD").format("D/M"); // sicer ni vpisan celoten data.konec format, vendar vseeno deluje
        }
    }
}
</script>