<template>
    <div>
        <h1>Založniki</h1>
        <div v-if="!loaded">
            <Nalaganje/>
        </div>
        <div v-if="loaded" style="margin-left: 25px">
            <h3>Naročniki</h3>
            <BubbleGrid v-if="loaded" :items="this.narocniki" path="/zalozniki/"/>
            <h3>Drugi mediji</h3>
            <BubbleGrid v-if="loaded" :items="this.mediji" path="/zalozniki/"/>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

import Nalaganje from '../../components/Nalaganje.vue'
import BubbleGrid from '../../components/lists/BubbleGrid.vue'

export default {
    name: 'Zalozniki',
    components: {
        Nalaganje,
        BubbleGrid
    },
    data() {
        return {
            narocniki: [],
            mediji: [],
            loaded: false,
        }
    },
    async mounted() {
        await this.getData();
        this.loaded = true;
    },
    methods: {
        async getData() {
            const { data } = await axios.get(this.apiServer + "/api/zalozniki")
            for (let i = 0; i < data.length; i++) {
                const zaloznik = data[i];
                if (zaloznik.tip === 'narocnik') {
                    this.narocniki.push(zaloznik)
                } else if (zaloznik.tip === 'medij') {
                    this.mediji.push(zaloznik)
                }
            }
        }
    }
}
</script>