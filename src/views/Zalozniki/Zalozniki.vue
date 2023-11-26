<template>
    <h1 class="odmik">Založniki</h1>
    <div v-if="!loaded" class="odmik">
        <Nalaganje/>
    </div>
    <div v-if="loaded" style="margin-left: 25px">
        <h3 class="odmik">Naročniki anket</h3>
        <BubbleGrid v-if="loaded" :items="this.narocniki" path="/zalozniki/" class="odmik"/>
        <h3 class="odmik">Drugi mediji</h3>
        <BubbleGrid v-if="loaded" :items="this.mediji" path="/zalozniki/" class="odmik"/>
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