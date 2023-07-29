<template>
    <div class="content">
        <Placeholder/>
        <ZadnjeAnkete/>
    </div>
</template>

<script>
import Placeholder from './Placeholder.vue'
import ZadnjeAnkete from './lists/ZadnjeAnkete.vue'

export default {
    name: 'Content',
    components: {
        Placeholder,
        ZadnjeAnkete
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