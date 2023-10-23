<template>
    <div class="container" style="display: flex; justify-content: center; align-items: start">
         <div class="bubble bubble-outer yellow-white" style="max-width: 800px">
            <h3 style="text-align: center">Volitve v Državni zbor</h3>
            <DZ/>
        </div>
        <div>
            <ZadnjeAnkete/>
        </div>
    </div>
</template>

<script>
import ZadnjeAnkete from '../components/lists/ZadnjeAnkete.vue'
import DZ from '../components/charts/DZ.vue'

export default {
    name: 'Content',
    components: {
		ZadnjeAnkete,
        DZ
    }
}
</script>

<style scoped>
.container {
    display: flex;
    /* flex-wrap: wrap; */
}

.container + div {
    flex-grow: 1;
}
</style>