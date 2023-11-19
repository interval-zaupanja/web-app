<template>
    <h1 class="odmik">Stranke</h1>
    <div class="odmik">
        <div v-if="!loaded">
            <Nalaganje/>
        </div>
        <BubbleGrid v-if="loaded" :items="this.stranke" path="/stranke/" size="medium"/>        
    </div>
</template>

<script>
import axios from 'axios';

import Nalaganje from '../../components/Nalaganje.vue';
import BubbleGrid from '../../components/lists/BubbleGrid.vue'

export default {
    name: 'Stranke',
    components: {
        Nalaganje,
        BubbleGrid
    },
    data() {
        return {
            stranke: [],
            loaded: false
        }
    },
    async mounted() {
        await this.getData();
        this.loaded = true;
    },
    methods: {
        async getData() {
            const { data } = await axios.get(this.apiServer + "/api/stranke");
            this.stranke = data;
        }
    }
}
</script>
