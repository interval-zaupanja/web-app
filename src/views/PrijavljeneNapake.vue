<template>
    <div>
        <div style="display: inline-block;">
            <h1>Prijavljene napake</h1>
        </div>
        <div style="display: inline-block; float: right">
            <Report tip="splosno"/>
        </div>
    </div>
    
    <div v-if="!this.loaded">
        <Nalaganje/>
    </div>
    <div v-if="this.loaded">
        <div v-for="napaka in this.napake" :key="napaka._id" class="bubble bubble-outer yellow-gray">
            <div style="display: inline-block">
                <div>Tip: {{ this.vrniTipEntitete(napaka.tip) }}</div>
                <div>ID: {{ napaka._id }}</div>
                <div v-if="napaka.opis">Opis: {{ napaka.opis }}</div>
                <div v-if="napaka.opomba">Opomba: {{ napaka.opomba }}</div>
                <div v-if="napaka.razreseno">Napaka je razrešena</div>
                <div v-else>Napaka še ni razrešena</div>
            </div>
            <div v-if="napaka.pot" style="display: inline-block; float: right">
                <router-link :to="napaka.pot" class="btn btn-primary">Odpri</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

import Nalaganje from '@/components/Nalaganje.vue';
import Report from '@/components/Report.vue'

export default {
    name: 'PrijavljeneNapake',
    components: {
        Nalaganje,
        Report
    },
    data() {
        return {
            napake: [],
            loaded: false,
        }
    },
    async mounted() {
        await this.getData();
        this.loaded = true;
    },
    methods: {
        async getData() {
            const { data } = await axios.get(this.apiServer + "/api/prijave");
            this.napake = data;
        }
    }
}
</script>