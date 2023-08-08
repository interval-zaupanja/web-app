<template>
    <div v-if="!loaded">
        <Nalaganje/>
    </div>
    <div v-if="loaded && !not_found">
        <Breadcrumbs previous="Naročniki" previousLink="/narocniki" current="Podrobnosti naročnika" />
        <div>
            <div>
                <h1>{{this.ime}}</h1>
            </div>
            <div style="display: inline-block" class="side-panel">
                <div>
                    <img :src="this.logo_uri"/>
                </div>
                <ExternalLink v-if="this.wikipedia_uri != null" :link="this.wikipedia_uri" label="Wikipedija"/>
            </div>
            <div style="display: inline-block" class="main">
                <p v-if="this.opis != null">Opis: {{this.opis}}</p>
                <p v-if="this.opombe != null">Opombe: {{this.opombe}}</p>
            </div>
        </div>
    </div>
    <div v-if="not_found && loaded">
        <NeObstaja ime="Naročnik"/>
    </div>
</template>

<script>
import axios from 'axios';

import Nalaganje from '../../components/Nalaganje.vue';
import NeObstaja from '../../components/NeObstaja.vue';
import Breadcrumbs from '@/components/BreadcrumbsBS.vue';
import ExternalLink from '@/components/ExternalLink.vue';

export default {
    name: 'Narocnik',
    components: {
        Nalaganje,
        NeObstaja,
        Breadcrumbs,
        ExternalLink
    },
    props: ['id'],
    data() {
        return {
            ime: null,
            barva: null,
            logo_uri: null,
            wikipedia_uri: null,
            opis: null,
            opombe: null,
            loaded: false,
            not_found: false
        }
    },
    async mounted() {
        const status = this.getData();
        if (!status) {
            this.not_found = true;
        }
        this.loaded = true;
    },
    methods: {
        async getData() {
            try {
                const { data } = await axios.get("http://localhost:4000/api/narocniki/" + this.id);
                this.ime = data.ime;
                this.barva = data.barva;
                this.logo_uri = data.logo_uri;
                this.wikipedia_uri = data.wikipedia_uri;
                this.opis = data.opis;
                this.opombe = data.opombe;
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        }
    }
}
</script>

<style scoped>
.main {
    width: 60%;
}

.side-panel {
    float: right;
}

img {
    max-height: 200px;
    max-width: 300px;
}
</style>