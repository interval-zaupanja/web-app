<template>
    <div v-if="this.loaded">
        <div :class="this.edgeToEdge ? 'odmik2' : 'odmik'">
            <h3 v-if="this.viri.length == 1">Vir</h3>
            <h3 v-else-if="this.viri.length == 2">Vira</h3>
            <h3 v-else>Viri</h3>
        </div>
        <div :class="{odmik: !this.edgeToEdge}">
            <div 
                v-for="(vir, virIndex) in this.viri" :key="virIndex"
                class="pink-red content-container" :class="this.edgeToEdge ? '' : 'bubble bubble-outer'"
            >
                <span class="anchor-outer" :id="vir._id"></span>
                <!-- <CopyLink :path="'ankete/' + this.id + '#' + vir._id" class="side-button"/> -->
                <div>
                    <p>Objavitelj: 
                        <router-link :to="this.getObjaviteljPath(vir.objavitelj_tip) + vir.objavitelj_id">
                            {{ vir.objavitelj_ime}}
                        </router-link>
                        <span v-if="vir.objavitelj_logo_uri != null">&nbsp;<img v-if="vir.objavitelj_logo_uri != null" :src="vir.objavitelj_logo_uri" @click="$router.push(this.getObjaviteljPath(vir.objavitelj_tip) + vir.objavitelj_id)" style="max-height: 12px"/></span>
                        <Label :tip="vir.objavitelj_tip"
                            v-if="this.izvajalci.filter(e => e.id == vir.objavitelj_id).length > 0 ||
                            this.narocniki.filter(e => e.id == vir.objavitelj_id).length > 0"
                        />
                    </p>
                    <p v-if="vir.opis">Opis: {{vir.opis}}</p>
                    <p v-if="vir.opombe">Opombe: {{vir.opombe}}</p>
                </div>
                <div v-for="(lokacija, lokacijaIndex) in vir.lokacije" :key="lokacijaIndex">
                    <VirLokacija :data="lokacija" :virIndex="virIndex" :lokacijaIndex="lokacijaIndex"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

import Label from '@/components/Label.vue'
import VirLokacija from './VirLokacija.vue'

export default {
    name: 'Viri',
    props: ['data', 'izvajalci', 'narocniki', 'edgeToEdge'],
    components: {
        Label,
        VirLokacija
    },
    data() {
        return {
            viri: null,
            loaded: false,
        }
    },
    async mounted() {
        this.viri = this.data
        await this.getViriImena();
        this.loaded = true;
    },
    methods: {
        async getViriImena() {
            for (let i = 0; i < this.viri.length; i++) {
                const { data } = await axios.get(this.apiServer + "/api" + this.getObjaviteljPath(this.viri[i].objavitelj_tip) + this.viri[i].objavitelj_id)
                this.viri[i].objavitelj_ime = data.ime;
                this.viri[i].objavitelj_logo_uri = this.vrniLogoUri(data.logo_uri);
            }
        },
        getObjaviteljPath(tip) {
            if (tip === 'zaloznik') {
                return "/zalozniki/"
            } else if (tip === 'izvajalec') {
                return "/izvajalci/"
            }
        }
    }
}
</script>

<style scoped>
p {
    margin: 0px
}
</style>