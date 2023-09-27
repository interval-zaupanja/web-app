<template>
    <div v-if="loaded">
        <h2>Vprašanja</h2>
        <div v-for="vprasanje in this.vprasanja" :key="vprasanje._id" class="bubble bubble-outer pink-red">
            <span class="anchor-outer" :id="vprasanje._id"></span>
            <div>
                <div>
                    <CopyLink :path="'ankete/' + this.id + '#' + vprasanje._id" class="side-button"/>
                    <p v-if="vprasanje.vprasanje">Vprašanje: {{vprasanje.vprasanje}}</p>
                    <p>
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
                    </p>
                    <p v-if="vprasanje.glasovanja">
                        <span v-if="vprasanje.glasovanja.length == 1">Glasovanje: </span>
                        <span v-else-if="vprasanje.glasovanja.length == 2">Glasovanji: </span>
                        <span v-else>Glasovanja: </span>

                        <span v-for="(glasovanje, indeks) in vprasanje.glasovanja" :key="glasovanje._id">
                            <router-link :to="'/glasovanja/' + glasovanje._id">
                                {{glasovanje.ime}}
                            </router-link>
                            <span v-if="indeks + 1 < vprasanje.glasovanja.length">, </span>
                        </span>
                    </p>
                    <p v-else-if="vprasanje.glasovanje_tip">
                        Tip glasovanja:
                        {{ vprasanje.glasovanje_tip.tip}}
                        <span v-if="vprasanje.glasovanje_tip.tip === 'volitve'">
                            - {{ this.vrniGlasovanjeTip(vprasanje.glasovanje_tip.volitve_tip)}}
                        </span>
                        <span v-if="vprasanje.glasovanje_tip.tip === 'referendum'">
                            - {{ vprasanje.glasovanje_tip.referendum_tip}}
                        </span>
                        ({{ vprasanje.glasovanje_tip.raven_oblasti }} raven)
                    </p>
                    <p v-if="vprasanje.predpostavljena_udelezba_procent">Predpostavljena udeležba: {{vprasanje.predpostavljena_udelezba_procent}}%</p>
                    <p v-if="vprasanje.opis">Opis: {{vprasanje.opis}}</p>
                    <p v-if="vprasanje.opombe">Opombe: {{vprasanje.opombe}}</p>
                    <div class="charts">
                        <DoughnutChart
                            v-if="vprasanje.tip === 'glasovalno' && vprasanje.glasovanje_tip.volitve_tip === 'DZ-S'"
                            :podatki="this.predelajOdgovore(vprasanje, 'procent_izvajalec')"
                            caption="Delež odgovorov"
                            :caption_condition="vprasanje.tip === 'glasovalno' && vprasanje.glasovanje_tip.volitve_tip === 'DZ-S'"
                            style="display: inline-block"
                        />
                        <DoughnutChart
                            v-if="vprasanje.tip === 'glasovalno' && vprasanje.glasovanje_tip.volitve_tip === 'DZ-S'"
                            :podatki="this.predelajOdgovore(vprasanje, 'st_mandatov_izvajalec')"
                            :caption_condition="true"
                            caption="Število mandatov (sedežev)"
                            style="display: inline-block"
                        />
                        <PieChart
                            v-if="!(vprasanje.tip === 'glasovalno' && vprasanje.glasovanje_tip.volitve_tip === 'DZ-S')"
                            :podatki="this.predelajOdgovore(vprasanje, 'procent_izvajalec')"
                            caption="Delež odgovorov"
                            :caption_condition="false"
                            style="display: inline-block"
                        />
                    </div>
                </div>
                <Odgovori v-if="vprasanje.odgovori" :odgovori="vprasanje.odgovori" :id="this.id"/>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

import CopyLink from '../../components/CopyLink.vue'
import PieChart from '@/components/charts/PieChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'

import Odgovori from '@/views/Ankete/Odgovori.vue'

export default {
    name: 'Vprasanja',
    props: ['data', 'id'],
    components: {
        CopyLink,
        PieChart,
        DoughnutChart,
        Odgovori
    },
    data() {
        return {
            vprasanja: this.data,
            loaded: false
        }
    },
    async mounted() {
        await this.getGlasovanja(this.vprasanja)
        this.loaded = true
    },
    methods: {
        predelajOdgovore(vprasanje, podatek) {
            const podatki = {
                labels: [],
                backgroundColor: [],
                data: []
            }
            for (let i = 0; i < vprasanje.odgovori.length; i++) {
                if (podatek != 'st_mandatov_izvajalec' || (podatek === 'st_mandatov_izvajalec' && vprasanje.odgovori[i].st_mandatov_izvajalec)) {
                    // LABELS
                    if (vprasanje.odgovori[i].tip === 'O' && vprasanje.odgovori[i].udelezba_tip === 'NBG') {
                        podatki.labels.push(this.vrniOdgovor('NBG', false, 1))
                    } else {
                        podatki.labels.push(
                            vprasanje.odgovori[i].odgovor_stranka_ime_kratica ??
                            this.capitalization(vprasanje.odgovori[i].odgovor, 1) ??
                            this.vrniOdgovor(vprasanje.odgovori[i].odgovor_std ?? vprasanje.odgovori[i].tip, false, 1) ?? // ali ima primat odgovor ali tip lahko, da bo treba pri nekaterih odgovorih potrebno spremeniti
                            vprasanje.odgovori[i].odgovor
                        )
                    }

                    // COLORS
                    if (vprasanje.odgovori[i].tip === 'O' && vprasanje.odgovori[i].udelezba_tip === 'NBG') {
                        podatki.backgroundColor.push(this.vrniStdBarvo('NBG'))
                    } else {
                        podatki.backgroundColor.push(
                            vprasanje.odgovori[i].barva ??
                            vprasanje.odgovori[i].odgovor_stranka_barva ??
                            this.vrniStdBarvo(
                                vprasanje.odgovori[i].odgovor_std ??
                                vprasanje.odgovori[i].tip
                            )
                        )
                    }

                    // DATA
                    if (podatek === 'procent_izvajalec') {
                        podatki.data.push(vprasanje.odgovori[i].procent_izvajalec)
                    } else if (podatek === 'st_mandatov_izvajalec') {
                        podatki.data.push(vprasanje.odgovori[i].st_mandatov_izvajalec)
                    }
                }
            }
            return podatki;
        },
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
        async getGlasovanja(vprasanja) {
            for (let i = 0; i < vprasanja.length; i++) {
                const vprasanje = vprasanja[i]
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
}
</script>

<style scoped>
.charts {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}
</style>