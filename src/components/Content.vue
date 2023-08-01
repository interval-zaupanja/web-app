<template>
    <div class="content">
        <div style="display: block">
            <DZ/>
            <ZadnjeAnkete/>
        </div>
    </div>
</template>

<script>
import ZadnjeAnkete from './lists/ZadnjeAnkete.vue'
import DZ from './charts/DZ.vue'

export default {
    name: 'Content',
    components: {
		ZadnjeAnkete,
		DZ
    }
}
</script>

<style scoped>
.content {
    margin: auto 0;
    margin-top: 70px;
    display: block;
    padding: 30px 10%;
}
</style>