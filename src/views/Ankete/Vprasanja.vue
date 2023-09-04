<template>
    <div>
        <h2>Vprašanja</h2>
        <div v-for="vprasanje in vprasanja" :key="vprasanje._id" class="bubble bubble-outer pink-red">
            <span class="anchor-outer" :id="vprasanje._id"></span>
            <div>
                <div>
                    <CopyLink :path="'/ankete/' + this.id + '#' + vprasanje._id" class="side-button"/>
                    <p v-if="vprasanje.vprasanje">Vprašanje: {{vprasanje.vprasanje}}</p>
                    <p>
                        Tip vprašanja: {{vprasanje.tip}}
                        <span v-if="vprasanje.tip === 'zaupanje'">
                            - {{ vprasanje.zaupanje_tip}}
                        </span>
                    </p>
                    <p v-if="vprasanje.tip === 'glasovalno'">
                        Glasovanje:
                            <span v-if="vprasanje.glasovanje_id">
                                <router-link :to="'/glasovanja/' + vprasanje.glasovanje_id">
                                    {{vprasanje.glasovanje_ime}}
                                </router-link>
                            (</span>{{ vprasanje.glasovanje_tip.raven_oblasti}}
                            - {{ vprasanje.glasovanje_tip.tip}}
                            <span v-if="vprasanje.glasovanje_tip.tip === 'volitve'">
                                - {{ this.vrniGlasovanjeTip(vprasanje.glasovanje_tip.volitve_tip)}}
                            </span>
                            <span v-if="vprasanje.glasovanje_tip.tip === 'referendum'">
                                - {{ vprasanje.glasovanje_tip.referendum_tip}}<span v-if="vprasanje.glasovanje_id">)</span>
                            </span>
                    </p>
                    <p v-if="vprasanje.opis">Opis: {{vprasanje.opis}}</p>
                    <p v-if="vprasanje.opombe">Opombe: {{vprasanje.opombe}}</p>
                    <div class="charts">
                        <PieChart
                            :podatki="this.predelajOdgovore(vprasanje, 'procent_izvajalec')"
                            style="display: inline-block"
                        />
                        <PieChart
                            v-if="vprasanje.tip === 'glasovalno' && vprasanje.glasovanje_tip.volitve_tip === 'DZ-S'"
                            :podatki="this.predelajOdgovore(vprasanje, 'st_mandatov_izvajalec')"
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
import CopyLink from '../../components/CopyLink.vue'
import PieChart from '@/components/charts/PieChart.vue'

import Odgovori from '@/views/Ankete/Odgovori.vue'

export default {
    name: 'Vprasanja',
    props: ['vprasanja', 'id'],
    components: {
        CopyLink,
        PieChart,
        Odgovori
    },
    methods: {
        predelajOdgovore(vprasanje, podatek) {
            const podatki = {
                labels: [],
                backgroundColor: [],
                data: []
            }
            for (let i = 0; i < vprasanje.odgovori.length; i++) {
                // LABELS
                if (vprasanje.odgovori[i].tip === 'O' && vprasanje.odgovori[i].udelezba_tip === 'NBG') {
                    podatki.labels.push(this.vrniOdgovor('NBG', false, 1))
                } else {
                    podatki.labels.push(
                        vprasanje.odgovori[i].odgovor_stranka_ime_kratica ??
                        vprasanje.odgovori[i].odgovor ??
                        this.vrniOdgovor(vprasanje.odgovori[i].odgovor_std ?? vprasanje.odgovori[i].tip, false, 1) ?? // ali ima primat odgovor ali tip lahko, da bo treba pri nekaterih odgovorih potrebno spremeniti
                        vprasanje.odgovori[i].odgovor
                    )
                }

                // COLORS
                if (vprasanje.odgovori[i].tip === 'O' && vprasanje.odgovori[i].udelezba_tip === 'NBG') {
                    podatki.backgroundColor.push(this.vrniStdBarvo('NBG'))
                } else {
                    podatki.backgroundColor.push(
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
            return podatki;
        }
    }
}
</script>

<style scoped>
.charts {
    display: flex;
    justify-content: center;
}
</style>