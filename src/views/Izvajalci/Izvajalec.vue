<template>
    <div v-if="!loaded" class="odmik">
        <Nalaganje/>
    </div>
    <div v-if="loaded && !not_found" class="odmik">
        <Breadcrumbs previous="Izvajalci" previousLink="/izvajalci" current="Podrobnosti izvajalca" />
        <div style="overflow: hidden">
            <div style="display: inline-block" class="side-panel">
                <img v-if="this.logo_uri" :src="this.logo_uri"/>
                <ExternalLink v-if="this.wikipedia_uri" :link="this.wikipedia_uri" :color="this.barva" label="Wikipedija" style="margin: 10px 0px"/>
            </div>
            <div style="display: inline-block" class="main">
                <h1>{{this.ime}}</h1>
                <p v-if="this.ime_polno">{{this.ime_polno}}</p>
                <p v-if="this.opis != null">Opis: {{this.opis}}</p>
                <p v-if="this.opombe != null">Opombe: {{this.opombe}}</p>
            </div>
        </div>
        <div>
            <h3>Izvedene ankete</h3>
            <SeznamAnket :parametri="{izvajalec: this.id}"/>
        </div>
    </div>
    <div v-if="not_found && loaded" class="odmik">
        <NeObstaja ime="Izvajalec"/>
    </div>
</template>

<script>
import axios from 'axios';

import Nalaganje from '@/components/Nalaganje.vue';
import NeObstaja from '@/components/NeObstaja.vue';
import Breadcrumbs from '@/components/BreadcrumbsBS.vue';
import ExternalLink from '@/components/ExternalLink.vue';
import SeznamAnket from '@/components/lists/SeznamAnket.vue';

export default {
    name: 'Izvajalec',
    components: {
        Nalaganje,
        NeObstaja,
        Breadcrumbs,
        ExternalLink,
        SeznamAnket
    },
    props: ['id'],
    data() {
        return {
            ime: null,
            ime_polno: null,
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
        const status = await this.getData();
        if (status) {
            document.title = 'Interval zaupanja | ' + this.ime
        } else {
            this.not_found = true
        }
        this.loaded = true;
    },
    methods: {
        async getData() {
            try {
                const { data } = await axios.get(this.apiServer + "/api/izvajalci/" + this.id);
                this.ime = data.ime;
                this.ime_polno = data.ime_polno;
                this.barva = data.barva;
                this.logo_uri = this.vrniLogoUri(data.logo_uri);
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
</style>