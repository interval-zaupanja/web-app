<template>
    <div v-if="this.loaded">
        <h3 v-if="this.viri.length == 1">Vir</h3>
        <h3 v-else-if="this.viri.length == 2">Vira</h3>
        <h3 v-else>Viri</h3>
        <div v-for="vir in this.viri" :key="vir._id" class="bubble bubble-outer pink-red">
            <span class="anchor-outer" :id="vir._id"></span>
            <!-- <CopyLink :path="'/ankete/' + this.id + '#' + vir._id" class="side-button"/> -->
            <div>
                <p>Založnik: 
                    <router-link :to="this.getZaloznikPath(vir.zaloznik_tip) + vir.zaloznik_id">
                        {{ vir.zaloznik_ime}}
                    </router-link>
                    <span v-if="vir.zaloznik_logo_uri != null">&nbsp;<img v-if="vir.zaloznik_logo_uri != null" :src="vir.zaloznik_logo_uri" @click="$router.push(this.getZaloznikPath(vir.zaloznik_tip) + vir.zaloznik_id)" style="max-height: 12px"/></span>
                    <Label :tip="vir.zaloznik_tip"/>
                </p>
            </div>
            <div v-for="lokacija in vir.lokacije" :key="lokacija._id" class="bubble bubble-list yellow-gray">
                <span class="anchor-inner" :id="lokacija._id"></span>
                <div>
                    <!-- <CopyLink :path="'/ankete/' + this.id + '#' + lokacija._id" class="side-button"/> -->
                    <div style="display: inline-block">
                        <p style="margin: 0px">Tip: {{lokacija.tip}}</p>
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
    props: ['data'],
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
                const { data } = await axios.get("http://localhost:4000/api" + this.getZaloznikPath(this.viri[i].zaloznik_tip) + this.viri[i].zaloznik_id)
                this.viri[i].zaloznik_ime = data.ime;
                this.viri[i].zaloznik_logo_uri = data.logo_uri;
            }
        },
        getZaloznikPath(tip) {
            if (tip === 'narocnik') {
                return "/narocniki/"
            } else if (tip === 'izvajalec') {
                return "/izvajalci/"
            }
        }
    }
}
</script>