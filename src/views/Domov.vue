<template>
    <div>
         <div class="odmik">
            <h3 style="text-align: center">Katero stranko bi volili?</h3>
            <DZ style="max-width: 800px; margin-left: auto; margin-right: auto;"/>
        </div>
        <div style="margin: 15px 0">
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
</style>