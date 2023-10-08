<template>
    <div v-if="!loaded">
        <Nalaganje/>
    </div>
    <div v-if="loaded && !not_found">
        <Breadcrumbs previous="Glasovanja" previousLink="/glasovanja" current="Podrobnosti glasovanja"/>
        <div style="overflow: hidden">
            <h1>{{this.ime}}</h1>
            <div style="display: inline-block" class="side-panel">
                <ExternalLink v-if="this.wikipedia_uri != null" :link="this.wikipedia_uri" label="Wikipedija" style="margin: 15px 0px"/>
            </div>
            <div style="display: inline-block" class="main">
                <p>
                    Tip: {{this.tip.tip}} - 
                    <span v-if="this.tip.tip === 'referendum'">{{this.tip.referendum_tip}}</span>
                    <span v-if="this.tip.tip === 'volitve'">{{this.vrniGlasovanjeTip(this.tip.volitve_tip)}}</span>
                    ({{this.tip.raven_oblasti}} raven)
                </p>
                <p v-if="this.pg_zacetek && this.pg_konec">Predčasno glasovanje: {{ new Date(this.pg_zacetek).toLocaleDateString('en-GB') }} - {{ new Date(this.pg_konec).toLocaleDateString('en-GB') }}</p>
                <p v-if="this.gg">Glavno glasovanje: {{ new Date(this.gg).toLocaleDateString('en-GB') }}</p>
            </div>
            <div>
                <p v-if="this.opis">Opis: {{this.opis}}</p>
                <p v-if="this.opombe">Opombe: {{this.opombe}}</p>
                <p v-if="this.tip.referendum_tip === 'zakonodajno-zavrnitveni'">{{this.razlage.zakonodajno_zavrnitveni_referendum}}</p>
            </div>
        </div>
        <div>
            <Referendum :glasovanje_id="this.id" :pg_zacetek="this.pg_zacetek" :pg_konec="this.pg_konec" :gg="this.gg" :izid="this.izid"/>
        </div>     
    </div>
    <div v-if="not_found && loaded">
        <NeObstaja ime="Anketa"/>
    </div>
</template>

<script>
import axios from 'axios'

import Nalaganje from '../../components/Nalaganje.vue'
import NeObstaja from '../../components/NeObstaja.vue'
import Breadcrumbs from '@/components/BreadcrumbsBS.vue';
import ExternalLink from '@/components/ExternalLink.vue';
import Referendum from '@/components/charts/Referendum.vue'

export default {
    name: 'Glasovanje',
    components: {
        Nalaganje,
        NeObstaja,
        Breadcrumbs,
        ExternalLink,
        Referendum,
    },
    props: ['id'],
    data() {
        return {
            tip: null,
            ime: null ,
            wikipedia_uri: null,
            pg_zacetek: null,
            pg_konec: null,
            gg: null,
            opis: null,
            opombe: null,
            st_volilnih_upravicencev: null,
            udelezba_st_volilnih_upravicencev: null,
            udelezba_delez_volilnih_upravicencev: null,
            izid: null,
            loaded: false,
            not_found: false
        }        
    },
    async mounted() {
        const status = await this.getData();
        if (!status) {
            this.not_found = true;
        }
        this.loaded = true;
    },
    methods: {
        async getData() {
            try {
                const { data } = await axios.get(this.apiServer + "/api/glasovanja/" + this.id)
                this.tip = data.tip
                this.ime = data.ime
                this.wikipedia_uri = data.wikipedia_uri
                this.pg_zacetek = data.pg_zacetek
                this.pg_konec = data.pg_konec
                this.gg = data.gg
                this.opis = data.opis
                this.opombe = data.opombe
                this.st_volilnih_upravicencev = data.st_volilnih_upravicencev,
                this.udelezba_st_volilnih_upravicencev = data.udelezba_st_volilnih_upravicencev,
                this.udelezba_delez_volilnih_upravicencev = data.udelezba_delez_volilnih_upravicencev,
                this.izid = data.izid
                return true
            } catch (error) {
                console.log(error)
                return false
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
</style>