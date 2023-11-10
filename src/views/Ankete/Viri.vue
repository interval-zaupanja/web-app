<template>
    <div v-if="this.loaded">
        <h3 v-if="this.viri.length == 1">Vir</h3>
        <h3 v-else-if="this.viri.length == 2">Vira</h3>
        <h3 v-else>Viri</h3>
        <div v-for="vir in this.viri" :key="vir._id" class="bubble bubble-outer pink-red">
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
            <div v-for="lokacija in vir.lokacije" :key="lokacija._id" class="bubble bubble-list yellow-gray">
                <span class="anchor-inner" :id="lokacija._id"></span>
                <div>
                    <!-- <CopyLink :path="'ankete/' + this.id + '#' + lokacija._id" class="side-button"/> -->
                    <div style="display: inline-block">
                        <p style="margin: 0px">Tip: {{lokacija.tip}}</p>
                        <p v-if="lokacija.datum_in_cas_objave" style="margin: 0px">Objavljeno
                            {{new Date(lokacija.datum_in_cas_objave).toLocaleDateString('en-GB')}}
                            ob
                            {{new Date(lokacija.datum_in_cas_objave).toLocaleTimeString('en-GB',{ timeStyle: 'short' })}}
                        </p>
                        <p v-if="lokacija.opis">Opis: {{lokacija.opis}}</p>
                        <p v-if="lokacija.opombe">Opombe: {{lokacija.opombe}}</p>
                    </div>
                    <div v-if="lokacija.tip === 'splet'" style="display: inline-block; float: right">
                        <ExternalLink :link="lokacija.uri" label="Odpri spletno stran"/>
                    </div> 
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

import Label from '@/components/Label.vue'
import ExternalLink from '@/components/ExternalLink.vue'

export default {
    name: 'Viri',
    props: ['data', 'izvajalci', 'narocniki'],
    components: {
        Label,
        ExternalLink
    },
    data() {
        return {
            viri: null,
            loaded: false
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