<template>
  <div style="height: 400px" class="stick-to-the-left">
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
  Tooltip
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
  name: "DZ",
  components: {
    Line,
  },
  data() {
    return {
      type: "line",
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
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
    async getData() { // potrebno pravilno posortirati in razpeti po datumih !!!!
      const { data } = await axios.get(
        "http://localhost:4000/api/vprasanja/glasovalna/dz"
      );
      for (let i = 0; i < data.length; i++) {
        // ne vem, če se vse doda v pravilnem zaporedju
        const { anketa_id, odgovori } = data[i];
        this.data.labels.push(await this.getDate(anketa_id));
        for (let j = 0; j < odgovori.length; j++) {
          if (odgovori[j].odgovor_tip === "BG-V") {
            if (
              undefined ===
              this.data.datasets.find(
                (element) => element.label === odgovori[j].odgovor_stranka_id
              )
            ) {
              this.data.datasets.push({
                label: odgovori[j].odgovor_stranka_id,
                data: [odgovori[j].procent_anketar],
              });
            } else {
              const obstojeciVnos = this.data.datasets.find(
                (element) => element.label === odgovori[j].odgovor_stranka_id
              );
              obstojeciVnos.data.push(odgovori[j].procent_anketar);
            }
          }
        }
      }
    },
    async getDate(anketa_id) {
      const { data } = await axios.get("http://localhost:4000/api/ankete/" + anketa_id);
      return moment(data.konec,"YYYY-MM-DD").format("D/M"); // sicer ni vpisan celoten data.konec format, vendar vseeno deluje
    },
    async getPartyNamesAndColors() { // dejansko se doda kratica imena (ime_kratica)
      for (let i = 0; i < this.data.datasets.length; i++) {
        const { data } = await axios.get("http://localhost:4000/api/stranke/" + this.data.datasets[i].label);
        this.data.datasets[i].label = data.ime_kratica;
        this.data.datasets[i].backgroundColor = data.barva;
      }
    }
  },
};
</script>