<template>
    <h1>Naročniki</h1>
    <div v-if="!loaded">
        <Nalaganje/>
    </div>
    <div v-if="loaded">
        <div v-for="narocnik in this.narocniki" :key="narocnik._id" class="bubble-outer grid-bubble">
            <TextImageBubble :text="narocnik.ime" :image="narocnik.logo_uri" @click="$router.push('/narocniki/' + narocnik._id)"/>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

import Nalaganje from '../../components/Nalaganje.vue'
import TextImageBubble from '../../components/TextImageBubble.vue'

export default {
    name: 'Narocniki',
    components: {
        Nalaganje,
        TextImageBubble
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
            const { data } = await axios.get("http://localhost:4000/api/narocniki");
            this.narocniki = data;
        }
    }
}
</script>

<style scoped>
.grid-bubble {
    display: inline-block;
    height: 150px;
    width: 250px;
}
</style>
