<template>
  <div style="height: 100%; max-width: 100%; margin: 30px">
    <h3>Volitve v Državni zbor</h3>
    <Line
      id="drzavni-zbor"
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
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

export default {
  name: "DZ",
  components: {
    Line,
  },
  props: ["stranka_id"],
  data() {
    return {
      type: "line",
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            autocolors: false,
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: 4,
                        yMax: 4,
                        borderDash: [6, 6],
                        borderDashOffset: 0,  
                        borderColor: this.barve.prag,
                        borderWidth: 2,
                        label: {
                          display: true,
                          content: "4% parlamentarni prag",
                          color: this.barve.prag,
                          backgroundColor: 'rgba(0, 0, 0, 0)',
                          position: 'middle',
                          rotation: 0,
                          yAdjust: 10
                        }
                    },
                },
            }
        }
      },
      loaded: false,
    };
  },
  async mounted() {
    await this.getData();
    await this.getPartyNamesAndColors();
    this.loaded = true;
  },
  methods: {
    async getData() {
      // potrebno pravilno razpeti po datumih !!!!
      const { data } = await axios.get("http://localhost:4000/api/vprasanja/glasovalna/dz");
      for (let i = 0; i < data.length; i++) {
        const { anketa_id, odgovori } = data[i];
        var dodaj = false;
        for (let j = 0; j < odgovori.length; j++) {
          if ((this.stranka_id != null && this.stranka_id == odgovori[j].stranka_id) || this.stranka_id == null) { // če želimo podatek le za eno stranko
            if (odgovori[j].tip === "O" && odgovori[j].doloceno_tip === 'stranka') {
              if (
                undefined ===
                this.data.datasets.find(
                  (element) => element.label === odgovori[j].stranka_id
                )
              ) {
                this.data.datasets.push({
                  label: odgovori[j].stranka_id,
                  data: [odgovori[j].procent_izvajalec],
                  tension: 0.4 // SMOOTHENING EXPERIMENT; PREVERI NATO, ĆE DEJANSKO DELA
                });
              } else {
                const obstojeciVnos = this.data.datasets.find(
                  (element) => element.label === odgovori[j].stranka_id
                );
                obstojeciVnos.data.push(odgovori[j].procent_izvajalec);
              }
            } // KAJ PA TISTI, KI NE VEDO?
            dodaj = true;
          }
        }

        if (dodaj) { // v primeru, da this.stranka_id != null, poskrbi, da se datum doda, le v primeru, da je stranka med odgovori
          this.data.labels.push(await this.getDate(anketa_id));
        }
      }
    },
    async getDate(anketa_id) {
      const { data } = await axios.get("http://localhost:4000/api/ankete/" + anketa_id);
      return moment(data.konec, "YYYY-MM-DD").format("D/M"); // sicer ni vpisan celoten data.konec format, vendar vseeno deluje
    },
    async getPartyNamesAndColors() {
      // dejansko se doda kratica imena (ime_kratica)
      for (let i = 0; i < this.data.datasets.length; i++) {
        const { data } = await axios.get(
          "http://localhost:4000/api/stranke/" + this.data.datasets[i].label
        );
        this.data.datasets[i].label = data.ime_kratica;
        this.data.datasets[i].backgroundColor = data.barva;
        this.data.datasets[i].borderColor = data.barva;
      }
    },
  },
};
</script>

<style scoped>
h3 {
  text-align: center;
}
</style>