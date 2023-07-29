<template>
    <div class="content">
        <Placeholder/>
        <ZadnjeAnkete/>
        <DZ/>
    </div>
</template>

<script>
import Placeholder from './Placeholder.vue'
import ZadnjeAnkete from './lists/ZadnjeAnkete.vue'
import DZ from './charts/DZ.vue'

export default {
    name: 'Content',
    components: {
		Placeholder,
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