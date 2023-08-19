<template>
    <div>
        <h1>Volitve</h1>
        <div v-if="!loaded">
            <Nalaganje/>
        </div>
    </div>
    <div>
        <h1>Referendumi</h1>
        <div v-if="!loaded">
            <Nalaganje/>
        </div>
        <div v-if="loaded">
            <div v-for="referendum in this.referendumi" :key="referendum._id" class="glasovanje">
                <a :href="'/glasovanja/' + referendum._id">
                    <div class="container">
                        <div class="cell-container">
                            <p>{{referendum.ime}}</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

import Nalaganje from '../../components/Nalaganje.vue';

export default {
    name: 'Glasovanja',
    components: {
        Nalaganje
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
            const { data } = await axios.get("http://localhost:4000/api/glasovanja")
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

<style scoped>
.glasovanje {
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
