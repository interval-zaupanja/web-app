<template>
    <h1>Osebe</h1>
    <div v-if="!loaded">
        <Nalaganje/>
    </div>
    <BubbleGrid v-if="loaded" :items="this.osebe" path="/osebe/"/>
</template>

<script>
import axios from 'axios'

import Nalaganje from '@/components/Nalaganje.vue'
import BubbleGrid from '@/components/lists/BubbleGrid.vue'

export default {
    name: 'Osebe',
    components: {
        Nalaganje,
        BubbleGrid
    },
    data() {
        return {
            osebe: [],
            loaded: false
        }
    },
    async mounted() {
        await this.getData()
        this.loaded = true;
    },
    methods: {
        async getData() {
            const { data } = await axios.get(this.apiServer + "/api/osebe")
            this.osebe = data; 
        }
    }
}
</script>