<template>
  <!-- <div style="height: 400px"> to je povzročalo probleme-->
    <Line id="drzavni-zbor" :options="options" :data="data" style="max-height: 400px"/>
  <!-- </div> -->
</template>

<script>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'DZ',
  components: {
    Line
  },
  data() {
    return {
      data: {
        labels: ['Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij', 'Julij'],
        datasets: [
            {
              label: 'SDS',
              backgroundColor: '#f87979',
              data: [40, 39, 10, 40, 39, 80, 40]
            },
            {
              label: 'SD',
              backgroundColor: '#E33A45',
              data: [20, 19, 18, 21, 22, 17, 18]
            }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  }
}
</script>