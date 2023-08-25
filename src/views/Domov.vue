<template>
    <div class="container">
        <DZ class="stretch"/>
        <ZadnjeAnkete/>
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
    flex-wrap: wrap;
}

.container > * {
    flex-grow: 1;
}
</style>