<template>
    <div v-if="!loaded">
        <Nalaganje/>
    </div>
    <div v-if="loaded && !not_found">
        <Breadcrumbs previous="Ankete" previousLink="/ankete" current="Podrobnosti ankete"/>
        <div>
            <div class="infobox">
                <div style="display: inline-block">
                    <!-- <p>Identifikator ankete: {{ this.id }}</p> -->
                    <p v-if="this.izvajalci.length > 0">
                        <span v-if="this.izvajalci.length == 1">Izvajalec: </span>
                        <span v-else-if="this.izvajalci.length == 2">Izvajalca: </span>
                        <span v-else>Izvajalci: </span>

                        <span v-for="(izvajalec, indeks) in this.izvajalci" :key="izvajalec.id">
                            <router-link :to="'/izvajalci/' + izvajalec.id">
                                {{ izvajalec.ime}}
                            </router-link>
                            <span v-if="izvajalec.logo_uri != null">&nbsp;<img v-if="izvajalec.logo_uri != null" :src="izvajalec.logo_uri" @click="$router.push('/izvajalci/' + izvajalec.id)" style="max-height: 20px"/>
                            </span>
                            <span v-if="indeks + 1 < this.izvajalci.length">, </span>
                        </span>
                    </p>
                    <p v-if="this.narocniki.length > 0">
                        <span v-if="this.narocniki.length == 1">Naročnik: </span>
                        <span v-else-if="this.narocniki.length == 2">Naročnika: </span>
                        <span v-else>Naročniki: </span>

                        <span v-for="(narocnik, indeks) in this.narocniki" :key="narocnik.id">
                            <router-link :to="'/narocniki/' + narocnik.id">
                                {{ narocnik.ime}}
                            </router-link>
                            <span v-if="narocnik.logo_uri != null">&nbsp;<img v-if="narocnik.logo_uri != null" :src="narocnik.logo_uri" @click="$router.push('/narocniki/' + narocnik.id)" style="height: 16px"/></span>
                            <span v-if="indeks + 1 < this.narocniki.length">, </span>
                        </span>
                    </p>
                    <p v-if="this.metode.length > 0">
                        <span v-if="this.metode.length == 1">Metoda anketiranja: </span>
                        <span v-else-if="this.metode.length == 2">Metodi anketiranja: </span>
                        <span v-else>Metode anketiranja: </span>
                        
                        <span v-for="(metoda, indeks) in this.metode" :key="metoda.id">
                            {{ metoda }}<span v-if="indeks + 1 < this.metode.length">, </span>
                        </span>
                    </p>
                    <p>Začetek anketiranja: {{ new Date(this.zacetek).toLocaleDateString('en-GB') }}</p>
                    <p>Konec anketiranja: {{ new Date(this.konec).toLocaleDateString('en-GB') }}</p>
                    <p v-if="this.opis">Opis: {{ this.opis }}</p>
                    <p v-if="this.opombe">Opombe: {{ this.opombe }}</p>
                </div>
                <div>
                    <Vzorec v-if="this.vzorec" style="margin: 0px 15px 15px 15px" :data="this.vzorec"/>
                </div>
            </div>
            
            <Viri v-if="this.viri" :viri="this.viri"/>
                
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
                        <div>
                            <h3>Odgovori</h3>
                            <div v-for="odgovor in vprasanje.odgovori" :key="odgovor._id" class="bubble bubble-list yellow-gray">
                                <span class="anchor-inner" :id="odgovor._id"></span>
                                <div>
                                    <div style="float: right">
                                        <div>
                                            <CopyLink :path="'/ankete/' + this.id + '#' + odgovor._id" class="side-button"/>
                                        </div>
                                        <div v-if="odgovor.odgovor_stranka_logo_uri != null" style="float: right">
                                            <a :href="'/stranke/' + odgovor.stranka_id">
                                                <img :src="odgovor.odgovor_stranka_logo_uri" style="max-height: 40px; max-width: 160px; margin-top: 10px"/>
                                            </a>
                                        </div>
                                    </div>
                                    <div>
                                        <span>
                                            <span v-if="odgovor.stranka_id">
                                                <p>
                                                    Odgovor:
                                                    <a :href="'/stranke/' + odgovor.stranka_id">
                                                        {{ odgovor.odgovor_stranka_ime }}
                                                        <span v-if="odgovor.odgovor_stranka_ime_kratica != null"> ({{ odgovor.odgovor_stranka_ime_kratica}})</span>
                                                    </a>
                                                </p>
                                            </span>
                                            <span v-if="odgovor.odgovor || odgovor.odgovor_std">
                                                Odgovor: {{ this.vrniOdgovor(odgovor.odgovor ?? odgovor.odgovor_std, true, 1) }}
                                            </span>
                                        </span>
                                        <p>Tip odgovora: {{ this.vrniOdgovor(odgovor.tip, true, 0)}}</p>
                                        <p>
                                            {{ odgovor.procent_izvajalec }}%
                                            <span v-if="(odgovor.procent_zgornja_meja_izvajalec - odgovor.procent_spodnja_meja_izvajalec) > 0">
                                                ± {{ (odgovor.procent_zgornja_meja_izvajalec - odgovor.procent_spodnja_meja_izvajalec) / 2 }}%
                                                ({{ odgovor.procent_spodnja_meja_izvajalec }}% - {{ odgovor.procent_zgornja_meja_izvajalec }}%)
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="not_found && loaded">
        <NeObstaja ime="Anketa"/>
    </div>
</template>

<script>
import axios from 'axios';

import Nalaganje from '../../components/Nalaganje.vue'
import NeObstaja from '../../components/NeObstaja.vue'
import CopyLink from '../../components/CopyLink.vue'
import Breadcrumbs from '@/components/BreadcrumbsBS.vue'
import PieChart from '@/components/charts/PieChart.vue'
import Vzorec from '@/components/Vzorec.vue'
import Viri from '@/views/Ankete/Viri.vue'

export default {
    components: {
        Nalaganje,
        NeObstaja,
        CopyLink,
        Breadcrumbs,
        PieChart,
        Vzorec,
        Viri
    },
    props: ['id'],
    data() {
        return {
            izvajalci: [],
            narocniki: [],
            vzorec: null,
            metode: null,
            zacetek: null,
            konec: null,
            opis: null,
            opombe: null,
            viri: null,
            vprasanja: null,
            loaded: false,
            not_found: false,
            hash: this.$route.hash
        }
    },
    async mounted() {
        const status = await this.getData();
        if (status) {
            await this.getIzvajalci();
            await this.getNarocniki();
            await this.getVprasanja();

            // Dodajanje podrobnosti strank
            for (let i = 0; i < this.vprasanja.length; i++) {
                if (this.vprasanja[i].tip === 'glasovalno') {
                    const odgovori = this.vprasanja[i].odgovori;
                    if (this.vprasanja[i].glasovanje_id) {
                        this.vprasanja[i].glasovanje_ime = await this.getGlasovanjeIme(this.vprasanja[i].glasovanje_id)
                    }
                    for (let j = 0; j < odgovori.length; j++) {
                        if (odgovori[j].stranka_id) {
                            const podatki = await this.getStranka(odgovori[j].stranka_id)
                            odgovori[j].odgovor_stranka_ime = podatki.ime;
                            odgovori[j].odgovor_stranka_ime_kratica = podatki.ime_kratica;
                            odgovori[j].odgovor_stranka_logo_uri = podatki.logo_uri;
                            odgovori[j].odgovor_stranka_barva = podatki.barva;
                        }
                    }
                }
            }
        } else {
            this.not_found = true;
        }
        this.loaded = true;
        // setTimeout(function (hash) { // ne deluje oz. samo občasno
        //     console.log(hash);
        //     if (hash) {
        //         const el_id = hash.replace('#', '')
        //         const el = document.getElementById(el_id);
        //         el.scrollIntoView({ behavior: 'smooth' })
        //     }
        // }, 1000, this.hash);
    },
    methods: {
        async getData() {
            try {
                const { data } = await axios.get("http://localhost:4000/api/ankete/" + this.id);
                for (let i = 0; i < data.izvajalci_id.length; i++) {
                    this.izvajalci.push({id: data.izvajalci_id[i]})
                }
                for (let i = 0; i < data.narocniki_id.length; i++) {
                    this.narocniki.push({id: data.narocniki_id[i]})
                }
                this.vzorec = data.vzorec;
                this.metode = data.metode;
                this.zacetek = data.zacetek;
                this.konec = data.konec;
                this.opis = data.opis;
                this.opombe = data.opombe;
                this.viri = data.viri;
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        async getIzvajalci() {
            // Dodajanje podrobnosti izvajalcev
            for (let i = 0; i < this.izvajalci.length; i++) {
                try {
                    const { data } =  await axios.get("http://localhost:4000/api/izvajalci/" + this.izvajalci[i].id);
                    this.izvajalci[i].ime = data.ime;
                    this.izvajalci[i].logo_uri = data.logo_uri
                } catch (error) {
                    this.izvajalci[i].ime = "Ne najdem izvajalca";
                }
            }
		},
        async getNarocniki() {
            // Dodajanje podrobnosti naročnikov
            for (let i = 0; i < this.narocniki.length; i++) {
                try {
                    const { data } =  await axios.get("http://localhost:4000/api/narocniki/" + this.narocniki[i].id);
                    this.narocniki[i].ime = data.ime;
                    this.narocniki[i].logo_uri = data.logo_uri
                } catch (error) {
                    this.narocniki[i].ime = "Ne najdem naročnika";
                }
            }
		},
        async getVprasanja() {
            try {
                const { data } = await axios.get("http://localhost:4000/api/vprasanja/anketa/" + this.id);
                this.vprasanja = data;
            } catch (error) {
                console.log(error);
                this.vprasanja = "Nekaj je šlo narobe pri pridobivanju vprašanj";
            }
            
        },
        async getStranka(stranka_id) {
            try {
                const { data } = await axios.get("http://localhost:4000/api/stranke/" + stranka_id);
                return data;
            } catch (error) {
                console.log(error);
                return "Ne najdem specificiarne stranke";
            }
        },
        async getGlasovanjeIme(glasovanje_id) {
            try {
                const { data } = await axios.get("http://localhost:4000/api/glasovanja/" + glasovanje_id);
                return data.ime;
            } catch (error) {
                console.log(error);
                return "Ne najdem specificiarne stranke";
            }
        },
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
.infobox {
    display: flex;
    flex-wrap: wrap;
}

.infobox > * {
    flex-grow: 1;
}

.charts {
    display: flex;
    justify-content: center;
}

/* To ne skrije gumba v zunanjem mehurčku ko .bubble-inner:hover */
.side-button {
    float: right;
    visibility: hidden;
}

.bubble:hover .side-button {
    visibility: visible;
}

.bubble:hover .bubble .side-button {
    visibility: hidden;
}

.bubble .bubble:hover .side-button {
    visibility: visible;
}
</style>