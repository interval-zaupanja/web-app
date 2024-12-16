<template>
    <div>
        <h1 class="odmik">Volitve</h1>
        <div class="odmik">
            <div v-if="!loaded">
                <Nalaganje size="medium"/>
            </div>
            <BubbleGrid v-if="loaded" :items="this.volitve" path="/glasovanja/"/>
        </div>
    </div>
    <div>
        <h1 class="odmik">Referendumi</h1>
        <div class="odmik">
            <div v-if="!loaded">
                <Nalaganje/>
            </div>
            <BubbleGrid v-if="loaded" :items="this.referendumi" path="/glasovanja/"/>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

import Nalaganje from '../../components/Nalaganje.vue'
import BubbleGrid from '../../components/lists/BubbleGrid.vue'

export default {
    name: 'Glasovanja',
    components: {
        Nalaganje,
        BubbleGrid
    },
    data() {
        return {
            volitve: [],
            referendumi: [],
            loaded: false
        }
    },
    async mounted() {
        await this.getData();
        this.loaded = true;
    },
    methods: {
        async getData() {
            const { data } = await axios.get(this.apiServer + "/api/glasovanja")
            data.forEach((glasovanje) => {
                if (glasovanje.tip.tip === 'referendum') {
                    this.referendumi.push(glasovanje)
                } else if (glasovanje.tip.tip === 'volitve') {
                    this.volitve.push(glasovanje)
                }
            })
        }
    }
}
</script>