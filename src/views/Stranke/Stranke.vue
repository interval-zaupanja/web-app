<template>
    <h1>Stranke</h1>
    <div v-if="!loaded">
        <Nalaganje/>
    </div>
    <BubbleGrid v-if="loaded" :items="this.stranke" path="/stranke/"/>
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
            loaded: false,
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

<style scoped>
.stranka {
    padding: 15px;
	margin: 10px;
	background-image: linear-gradient(to right,  rgba(148, 117, 108, 0.29), rgba(255, 210, 144, 0.29));
	border-radius: 15px;

    display: inline-block;
    height: 150px;
    width: 250px;
}

.container {
    height: inherit;
    width: inherit;
    display: table; /* !!! */
}

.cell-container {
    display: table-row;
    height: 0;
}

.img-cell-container {
    height: auto;
}

.img-container {
    height: auto;
    width: 160px;
    /* display: flex;
    justify-content: center;
    align-items: center; */
}

p {
    text-align: center; /* to se zaradi <a> poruši; ne vem, kako popraviti */
}

img {
    max-height: 80px;
    max-width: 160px;
    margin-left: auto;
    margin-right: auto;
}

/* Removing link styles */
a:link {
    color: inherit;
    text-decoration: inherit;
}

a:visited {
    color: inherit;
    text-decoration: inherit;
}

a:hover {
    color: inherit;
    text-decoration: inherit;
}

a:active {
    color: inherit;
    text-decoration: inherit;
}
</style>
