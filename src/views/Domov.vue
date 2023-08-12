<template>
    <div>
        <DZ/>
        <ZadnjeAnkete/>
        <PieChart/>
    </div>
</template>

<script>
import ZadnjeAnkete from '../components/lists/ZadnjeAnkete.vue'
import DZ from '../components/charts/DZ.vue'
import PieChart from '../components/charts/PieChart.vue'

export default {
    name: 'Content',
    components: {
		ZadnjeAnkete,
		DZ,
        PieChart
    }
}
</script>