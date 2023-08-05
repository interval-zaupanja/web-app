<template>
    <div>
        <DZ/>
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