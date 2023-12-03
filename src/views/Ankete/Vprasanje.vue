<template>
    <div v-if="loaded" :class="{odmik: !this.edgeToEdge}">
        <div
            class="pink-red content-container"
            :class="{'bubble bubble-outer': !this.edgeToEdge, 'container-selected': this.$route.hash === '#' + vprasanje._id}"
        >
            <span class="anchor-outer" :id="vprasanje._id"></span>
            <div>
                <div>
                    <div style="float: right">
                        <ExpandCollapse
                            :razsiri="this.razsiri"
                            @click="this.razsiri = !this.razsiri"
                            style="display: inline-block; margin-right: 10px;"
                        />
                        <Report
                            tip="vprasanje"
                            :id="vprasanje._id"
                            :pot="'ankete/' + this.id + '#' + vprasanje._id"
                            :showOnHover="false"
                        />
                        <CopyLink :path="'ankete/' + this.id + '#' + vprasanje._id" style="margin-left: 10px"/>
                    </div>
                    <div v-if="vprasanje.vprasanje">Vprašanje: {{vprasanje.vprasanje}}</div>
                    <div>
                        <div>
                            Tip vprašanja: {{vprasanje.tip}}
                            <span v-if="vprasanje.zaupanje_tip">
                                - {{ vprasanje.zaupanje_tip}}
                            </span>
                            <span v-if="vprasanje.glasovalno_tip.casovna_komponenta">
                                - {{ vprasanje.glasovalno_tip.casovna_komponenta}}
                            </span>
                            <span v-if="vprasanje.glasovalno_tip.kvalitativna_meritev">
                                - {{ this.kvalitativnaMeritev(vprasanje.glasovalno_tip.kvalitativna_meritev)}}
                            </span>
                        </div>
                        <div v-if="vprasanje.glasovanja">
                            <span v-if="vprasanje.glasovanja.length == 1">Glasovanje: </span>
                            <span v-else-if="vprasanje.glasovanja.length == 2">Glasovanji: </span>
                            <span v-else>Glasovanja: </span>

                            <span v-for="(glasovanje, indeks) in vprasanje.glasovanja" :key="glasovanje._id">
                                <router-link :to="'/glasovanja/' + glasovanje._id">
                                    {{glasovanje.ime}}
                                </router-link>
                                <span v-if="indeks + 1 < vprasanje.glasovanja.length">, </span>
                            </span>
                        </div>
                        <div v-else-if="vprasanje.glasovanje_tip">
                            Tip glasovanja:
                            {{ vprasanje.glasovanje_tip.tip}}
                            <span v-if="vprasanje.glasovanje_tip.tip === 'volitve'">
                                - {{ this.vrniGlasovanjeTip(vprasanje.glasovanje_tip.volitve_tip)}}
                            </span>
                            <span v-if="vprasanje.glasovanje_tip.tip === 'referendum'">
                                - {{ vprasanje.glasovanje_tip.referendum_tip}}
                            </span>
                            ({{ vprasanje.glasovanje_tip.raven_oblasti }} raven)
                        </div>
                    </div>
                    <div v-if="this.razsiri">
                        <div v-if="vprasanje.predpostavljena_udelezba_procent">Predpostavljena udeležba: {{vprasanje.predpostavljena_udelezba_procent}}%</div>
                        <div v-if="vprasanje.opis">Opis: {{vprasanje.opis}}</div>
                        <div v-if="vprasanje.opombe">Opombe: {{vprasanje.opombe}}</div>
                        <div>
                            <div v-if="vprasanje.tip === 'glasovalno' && vprasanje.glasovanje_tip.volitve_tip === 'DZ-S'" class="charts">
                                <DoughnutChart
                                    :podatki="this.predelajOdgovore(vprasanje, 'procent_izvajalec')"
                                    :caption_condition="this.predelajOdgovore(vprasanje, 'st_mandatov_izvajalec') ?? this.izracunajMandate(vprasanje, 'procent_izvajalec')"
                                    caption="Delež odgovorov"
                                    enota="%"
                                    class="chart"
                                />
                                <MandatiChart v-if="this.predelajOdgovore(vprasanje, 'st_mandatov_izvajalec') ?? this.izracunajMandate(vprasanje, 'procent_izvajalec')"
                                    :podatki="this.predelajOdgovore(vprasanje, 'st_mandatov_izvajalec') ?? this.izracunajMandate(vprasanje, 'procent_izvajalec')"
                                    class="chart"
                                />
                            </div>
                            <div v-else-if="vprasanje.tip === 'priljubljenost'">
                                <Priljubljenost
                                    :podatki="vprasanje"
                                    orientacija="horizontalno"
                                />
                            </div>
                            <div v-else class="charts">
                                <PieChart
                                    :podatki="this.predelajOdgovore(vprasanje, 'procent_izvajalec')"
                                    enota="%"
                                    style="display: inline-block"
                                    class="chart"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="vprasanje.odgovori && vprasanje.tip != 'priljubljenost' && this.razsiri">
                    <div>
                        <div style="display: inline-block;">
                            <h3 style="margin: 0">Odgovori</h3>
                        </div>
                        <ExpandCollapse
                            :razsiri="this.razsiriOdgovore"
                            @click="this.razsiriOdgovore = !this.razsiriOdgovore"
                            style="float: right"
                        />
                    </div>
                    <div v-if="this.razsiriOdgovore">
                        <Odgovor
                            v-for="(odgovor, index) in vprasanje.odgovori" :key="index"
                            :odgovor="odgovor"
                            :vprasanje_id="vprasanje._id"
                            :index="index"
                            :anketa_id="this.id"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

import CopyLink from '../../components/CopyLink.vue'
import Report from '../../components/Report.vue'
import ExpandCollapse from '@/components/ExpandCollapse.vue'

import PieChart from '@/components/charts/PieChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import MandatiChart from '@/components/charts/MandatiChart.vue'

import Odgovor from '@/views/Ankete/Odgovor.vue'

import { predelajOdgovore } from '@/scripts/predelajOdgovore.js'
import { izracunajMandate } from  '@/scripts/izracunajMandate.js'
import Priljubljenost from '../Priljubljenost.vue'

export default {
    name: 'Vprasanja',
    props: ['data', 'id', 'edgeToEdge'],
    components: {
        CopyLink,
        Report,
        PieChart,
        DoughnutChart,
        MandatiChart,
        Odgovor,
        Priljubljenost,
        ExpandCollapse
    },
    data() {
        return {
            vprasanje: this.data,
            loaded: false,
            razsiri: true,
            razsiriOdgovore: true
        }
    },
    async mounted() {
        await this.getGlasovanje(this.vprasanje)
        this.loaded = true
    },
    methods: {
        predelajOdgovore,
        izracunajMandate,
        kvalitativnaMeritev(oznaka) {
            switch (oznaka) {
                case 'izid':
                    return oznaka
                case 'udelezba':
                    return 'udeležba'
                case 'izid-izrojena-udelezba':
                    return 'izid z izrojeno udeležbo'
                case 'drugo':
                    return 'drugo'
                default:
                    return oznaka
            }
        },
        async getGlasovanje(vprasanje) {
            if (vprasanje.glasovanja_id.length > 0) {
                vprasanje.glasovanja = []
            }
            for (let j = 0; j < vprasanje.glasovanja_id.length; j++) {
                const { data } = await axios.get(this.apiServer + "/api/glasovanja/" + vprasanje.glasovanja_id[j])
                vprasanje.glasovanja.push({
                    _id: vprasanje.glasovanja_id[j],
                    ime: data.ime
                })
            }
        }
    }
}
</script>

<style scoped>
.charts {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin: 15px 0;
}

.chart {
    max-height: 600px;
    min-height: 400px;
    width: 500px;
    max-width: 100%;
    margin: 15px 30px
}
</style>