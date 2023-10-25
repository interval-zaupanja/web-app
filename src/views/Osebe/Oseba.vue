<template>
    <div v-if="!loaded">
        <Nalaganje/>
    </div>
    <div v-if="loaded && !not_found">
        <Breadcrumbs previous="Osebe" previousLink="/osebe" current="Podrobnosti osebe"/>
        <div style="overflow: hidden">
            <div style="display: inline-block" class="side-panel">
                <img v-if="this.slika_uri" :src="this.slika_uri">
                <div v-if="this.slika_avtor && this.slika_vir" style="color: grey; text-align: center">
                    <span v-if="this.slika_avtor">{{ this.slika_avtor }}</span> <a v-if="this.slika_vir" :href="this.slika_vir">Vir</a>
                </div>
                <ExternalLink v-if="this.wikipedia_uri" :link="this.wikipedia_uri" label="Wikipedija" style="margin: 10px 0px"/>
            </div>
            <div style="display: inline-block" class="main">
                <h1>{{ this.ime }} {{ this.ime_srednje }} {{ this.priimek }}</h1>
                <p v-if="this.stranka_id">Stranka:
                    <router-link :to="'/stranke/' + this.stranka_id">
                        {{ this.stranka_ime }}
                        <span v-if="this.stranka_ime_kratica != null"> ({{ this.stranka_ime_kratica}})</span>
                    </router-link>
                    <span v-if="this.stranka_logo_uri != null">
                        &nbsp;<img v-if="this.stranka_logo_uri != null" :src="this.stranka_logo_uri" @click="$router.push('/stranka/' + this.stranka_id)" style="max-height: 20px"/>
                    </span>
                </p>
                <p v-if="this.opis != null">Opis: {{this.opis}}</p>
                <p v-if="this.opombe != null">Opombe: {{this.opombe}}</p>
            </div>
        </div>
    </div>
    <div v-if="not_found && loaded">
        <NeObstaja ime="Oseba"/>
    </div>
</template>

<script>
import axios from 'axios'

import Nalaganje from '@/components/Nalaganje.vue';
import NeObstaja from '@/components/NeObstaja.vue';
import Breadcrumbs from '@/components/BreadcrumbsBS.vue';
import ExternalLink from '@/components/ExternalLink.vue';

export default {
    name: 'Oseba',
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
            ime_srednje: null,
            priimek: null,
            stranka_id: null,
            stranka_ime: null,
            stranka_ime_kratica: null,
            stranka_logo_uri: null,
            slika_uri: null,
            slika_vir: null,
            slika_avtor: null,
            wikipedia_uri: null,
            opis: null,
            opombe: null,
            loaded: false,
            not_found: false
        }
    },
    async mounted() {
        const status = await this.getData()
        if (!status) {
            this.not_found = true;
        } else {
            if (this.stranka_id != null) {
                const podatki = await this.getStranka(this.stranka_id)
                this.stranka_ime = podatki.ime
                this.stranka_ime_kratica = podatki.ime_kratica
                this.stranka_logo_uri = this.vrniLogoUri(podatki.logo_uri)
            }
        }
        this.loaded = true
    },
    methods: {
        async getData() {
            try {
                const { data } = await axios.get(this.apiServer + '/api/osebe/' + this.id)
                this.ime = data.ime
                this.ime_srednje = data.ime_srednje
                this.priimek = data.priimek
                this.stranka_id = data.stranka_id
                this.slika_uri = this.vrniLogoUri(data.slika_uri)
                this.slika_vir = data.slika_vir
                this.slika_avtor = data.slika_avtor
                this.wikipedia_uri = data.wikipedia_uri
                this.opis = data.opis
                this.opombe = data.opombe
                return true
            } catch (error) {
                console.log(error)
                return false
            }
        },
        async getStranka(stranka_id) {
            try {
                const { data } = await axios.get(this.apiServer + "/api/stranke/" + stranka_id);
                return data;
            } catch (error) {
                console.log(error);
                return "Ne najdem specificiarne stranke";
            }
        }
    },
    
}
</script>

<style>
.main {
    width: 60%;
}
</style>