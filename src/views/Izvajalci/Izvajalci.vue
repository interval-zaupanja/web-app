<template>
    <h1>Izvajalci</h1>
    <div v-if="!loaded">
        <Nalaganje/>
    </div>
    <BubbleGrid v-if="loaded" :items="this.izvajalci" path="/izvajalci/"/>
</template>

<script>
import axios from 'axios';

import Nalaganje from '../../components/Nalaganje.vue'
import BubbleGrid from '../../components/lists/BubbleGrid.vue'

export default {
    name: 'Izvajalci',
    components: {
        Nalaganje,
        BubbleGrid
    },
    data() {
        return {
            izvajalci: [],
            loaded: false,
        }
    },
    async mounted() {
        await this.getData();
        this.loaded = true;
    },
    methods: {
        async getData() {
            const { data } = await axios.get("http://localhost:4000/api/izvajalci");
            this.izvajalci = data;
        }
    }
}
</script>