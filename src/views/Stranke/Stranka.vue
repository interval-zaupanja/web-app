<template>
    <div v-if="!loaded" class="odmik">
        <Nalaganje/>
    </div>
    <div v-if="loaded && !not_found" class="odmik">
        <Breadcrumbs previous="Stranke" previousLink="/stranke" current="Podrobnosti stranke" />
        <div style="overflow: hidden">
            <div style="display: inline-block" class="side-panel">
                <img v-if="this.logo_uri" :src="this.logo_uri"/>
                <ExternalLink v-if="this.wikipedia_uri" :link="this.wikipedia_uri" :color="this.barva" label="Wikipedija" style="margin: 15px 0px"/>
            </div>
            <div style="display: inline-block" class="main">
                <h1>
                    {{this.ime}} <span v-if="this.ime_kratica != null">({{this.ime_kratica}})</span>
                </h1>
                <p v-if="this.opis != null">Opis: {{this.opis}}</p>
                <p v-if="this.opombe != null">Opombe: {{this.opombe}}</p>
            </div>
        </div>
        <div>
            <h2>Volitve v Državni zbor</h2>
            <DZ :stranka_id="this.id"/>
        </div>
    </div>
    <div v-if="not_found && loaded" class="odmik">
        <NeObstaja ime="Anketa"/>
    </div>
</template>

<script>
import axios from 'axios';

import Nalaganje from '../../components/Nalaganje.vue';
import NeObstaja from '../../components/NeObstaja.vue';
import Breadcrumbs from '@/components/BreadcrumbsBS.vue';
import ExternalLink from '@/components/ExternalLink.vue';
import DZ from '@/components/charts/DZ.vue'

export default {
    name: 'Stranka',
    components: {
        Nalaganje,
        NeObstaja,
        Breadcrumbs,
        ExternalLink,
        DZ
    },
    props: ['id'],
    data() {
        return {
            ime: null,
            ime_kratica: null,
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
        if (status) {
            document.title = `Interval zaupanja | ${this.ime}`
        } else {
            this.not_found = true;
        }
        this.loaded = true;
    },
    methods: {
        async getData() {
            try {
                const { data } = await axios.get(this.apiServer + "/api/stranke/" + this.id);
                this.ime = data.ime;
                this.ime_kratica = data.ime_kratica;
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