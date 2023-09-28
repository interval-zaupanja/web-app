<template>
    <h1>Naročniki in založniki</h1>
    <div v-if="!loaded">
        <Nalaganje/>
    </div>
    <BubbleGrid v-if="loaded" :items="this.narocniki" path="/narocniki/"/>
</template>

<script>
import axios from 'axios';

import Nalaganje from '../../components/Nalaganje.vue'
import BubbleGrid from '../../components/lists/BubbleGrid.vue'

export default {
    name: 'Narocniki',
    components: {
        Nalaganje,
        BubbleGrid
    },
    data() {
        return {
            narocniki: [],
            loaded: false,
        }
    },
    async mounted() {
        await this.getData();
        this.loaded = true;
    },
    methods: {
        async getData() {
            const { data } = await axios.get(this.apiServer + "/api/narocniki");
            this.narocniki = data;
        }
    }
}
</script>