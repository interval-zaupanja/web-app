<template>
    <div v-if="!loaded">
        <Nalaganje/>
    </div>
    <div v-if="loaded && !not_found">
        <Breadcrumbs previous="Ankete" previousLink="/ankete" current="Podrobnosti ankete"/>
        <div>
            <!-- <p>Identifikator ankete: {{ this.id }}</p> -->
            <p v-if="this.izvajalci.length > 0">
                <span v-if="this.izvajalci.length == 1">Izvajalec: </span>
                <span v-else-if="this.izvajalci.length == 2">Izvajalca: </span>
                <span v-else>Izvajalci: </span>

                <span v-for="(izvajalec, indeks) in this.izvajalci" :key="izvajalec.id">
                    <router-link :to="'/izvajalci/' + izvajalec.id">
                        {{ izvajalec.ime}}<span v-if="izvajalec.logo_uri != null">&nbsp;<img v-if="izvajalec.logo_uri != null" :src="izvajalec.logo_uri" style="max-height: 12px"/></span>
                    </router-link>
                    <span v-if="indeks + 1 < this.izvajalci.length">, </span>
                </span>
            </p>
            <p v-if="this.narocniki.length > 0">
                <span v-if="this.narocniki.length == 1">Naročnik: </span>
                <span v-else-if="this.narocniki.length == 2">Naročnika: </span>
                <span v-else>Naročniki: </span>

                <span v-for="(narocnik, indeks) in this.narocniki" :key="narocnik.id">
                    <router-link :to="'/narocniki/' + narocnik.id">
                        {{ narocnik.ime}}<span v-if="narocnik.logo_uri != null">&nbsp;<img v-if="narocnik.logo_uri != null" :src="narocnik.logo_uri" style="max-height: 12px"/></span>
                    </router-link>
                    <span v-if="indeks + 1 < this.narocniki.length">, </span>
                </span>
            </p>
            <p>Velikost vzorca: {{ this.velikost_vzorca }}</p>
            <p>Metoda: {{ this.metoda }}</p>
            <p>Začetek anketiranja: {{ new Date(this.zacetek).toLocaleDateString() }}</p>
            <p>Konec anketiranja: {{ new Date(this.konec).toLocaleDateString() }}</p>
            <p v-if="this.opis">Opis: {{ this.opis }}</p>
            <p v-if="this.opombe">Opombe: {{ this.opombe }}</p>
            <div>
                <h1>Vprašanja</h1>
                <div v-for="vprasanje in vprasanja" :key="vprasanje._id" class="vprasanje">
                    <span class="anchor-vprasanje" :id="vprasanje._id"></span>
                    <div>
                        <div>
                            <CopyLink :path="'/ankete/' + this.id + '#' + vprasanje._id" style="float: right"/>
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
                                    (</span>{{ vprasanje.glasovalno_tip.raven_oblasti}}
                                    - {{ vprasanje.glasovalno_tip.tip}}
                                    <span v-if="vprasanje.glasovalno_tip.tip === 'volitve'">
                                        - {{ this.vrniGlasovalnoTip(vprasanje.glasovalno_tip.volitve_tip)}}
                                    </span>
                                    <span v-if="vprasanje.glasovalno_tip.tip === 'referendum'">
                                        - {{ vprasanje.glasovalno_tip.referendum_tip}}<span v-if="vprasanje.glasovanje_id">)</span>
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
                                    v-if="vprasanje.tip === 'glasovalno' && vprasanje.glasovalno_tip.volitve_tip === 'DZ-S'"
                                    :podatki="this.predelajOdgovore(vprasanje, 'st_mandatov_izvajalec')"
                                    style="display: inline-block"
                                />
                            </div>
                        </div>
                        <div>
                            <h3>Odgovori</h3>
                            <div v-for="odgovor in vprasanje.odgovori" :key="odgovor._id" class="odgovor">
                                <span class="anchor-odgovor" :id="odgovor._id"></span>
                                <div>
                                    <div style="float: right">
                                        <div>
                                            <CopyLink :path="'/ankete/' + this.id + '#' + odgovor._id" style="float: right"/>
                                        </div>
                                        <div v-if="odgovor.odgovor_stranka_logo_uri != null" style="float: right">
                                            <a :href="'/stranke/' + odgovor.odgovor_stranka_id">
                                                <img :src="odgovor.odgovor_stranka_logo_uri" style="max-height: 40px; max-width: 160px; margin-top: 10px"/>
                                            </a>
                                        </div>
                                    </div>
                                    <div>
                                        <span>
                                            <span v-if="odgovor.odgovor_stranka_id">
                                                <p>
                                                    Odgovor:
                                                    <a :href="'/stranke/' + odgovor.odgovor_stranka_id">
                                                        {{ odgovor.odgovor_stranka_ime}}
                                                        <span v-if="odgovor.odgovor_stranka_ime_kratica != null"> ({{ odgovor.odgovor_stranka_ime_kratica}})</span>
                                                    </a>
                                                </p>
                                            </span>
                                            <span v-if="odgovor.odgovor">
                                                Odgovor: {{ odgovor.odgovor }}
                                            </span>
                                        </span>
                                        <p>Tip odgovora: {{ this.vrniOdgovor(odgovor.odgovor_tip, true, 0)}}</p>
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
import Breadcrumbs from '@/components/BreadcrumbsBS.vue';
import PieChart from '@/components/charts/PieChart.vue';

export default {
    components: {
        Nalaganje,
        NeObstaja,
        CopyLink,
        Breadcrumbs,
        PieChart
    },
    props: ['id'],
    data() {
        return {
            izvajalci: [],
            narocniki: [],
            velikost_vzorca: null,
            metoda: null,
            zacetek: null,
            konec: null,
            opis: null,
            opombe: null,
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
                        if (odgovori[j].odgovor_stranka_id) {
                            const podatki = await this.getStranka(odgovori[j].odgovor_stranka_id)
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
                this.velikost_vzorca = data.velikost_vzorca;
                this.metoda = data.metoda;
                this.zacetek = data.zacetek;
                this.konec = data.konec;
                this.opis = data.opis;
                this.opombe = data.opombe;
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
                if (vprasanje.odgovori[i].odgovor_tip === 'BG-V') {
                    if (vprasanje.tip === 'glasovalno') {
                        if (vprasanje.glasovalno_tip.tip === 'volitve') {
                            podatki.labels.push(vprasanje.odgovori[i].odgovor_stranka_ime_kratica)
                            podatki.backgroundColor.push(vprasanje.odgovori[i].odgovor_stranka_barva)
                        } else if (vprasanje.glasovalno_tip.tip === 'referendum') {
                            podatki.labels.push(vprasanje.odgovori[i].odgovor ?? this.vrniOdgovor(vprasanje.odgovori[i].odgovor_tip, false, 1))
                            var barva;
                            if (vprasanje.odgovori[i].odgovor === 'ZA') {
                                barva = this.barve.pozitivno
                            } else if (vprasanje.odgovori[i].odgovor === 'PROTI') {
                                barva = this.barve.negativno
                            }
                            podatki.backgroundColor.push(barva)
                        }
                    } else if (vprasanje.tip === 'zaupanje') {
                        podatki.labels.push(vprasanje.odgovori[i].odgovor)
                        if (vprasanje.odgovori[i].odgovor === 'Zaupam') {
                            podatki.backgroundColor.push(this.barve.pozitivno)
                        } else if (vprasanje.odgovori[i].odgovor === 'Ne zaupam') {
                            podatki.backgroundColor.push(this.barve.negativno)
                        }
                    }
                } else if (vprasanje.odgovori[i].odgovor_tip === 'BG-NV' && podatek.indexOf('st_mandatov') === -1) {
                    podatki.labels.push("Ne vem");
                    podatki.backgroundColor.push('#7e848c')
                } else if (vprasanje.odgovori[i].odgovor_tip === 'NBG' && podatek.indexOf('st_mandatov') === -1) {
                    podatki.labels.push("Ne bom glasoval");
                    podatki.backgroundColor.push('#acaeb0')
                } else if (vprasanje.odgovori[i].odgovor_tip === 'NŽO' && podatek.indexOf('st_mandatov') === -1) {
                    podatki.labels.push("Ne želim odgovoriti");
                    podatki.backgroundColor.push('#dcdfe3')
                }

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
.vprasanje { /* podobno kot pri komponenti ZadnjeAnkete*/
    padding: 15px;
	margin: 15px;
    background-image: linear-gradient(to right, #f6caca, #fcabab);
	border-radius: 15px;
}

.odgovor {
    padding: 15px;
	margin: 10px;
	background-image: linear-gradient(to right,  rgba(148, 117, 108, 0.29), rgba(255, 210, 144, 0.29));
	border-radius: 15px;
}

.anchor-vprasanje {
    /* glej https://stackoverflow.com/questions/13036142/anchor-links-to-start-below-the-header-which-is-fixed-at-the-top */
    display: block;
    height: 100px; /* header height and margin and padding of container */
    margin-top: -100px; /* negative header height and margin and padding of container */
    visibility: hidden;
}

.anchor-odgovor {
    /* glej https://stackoverflow.com/questions/13036142/anchor-links-to-start-below-the-header-which-is-fixed-at-the-top */
    display: block;
    height: 95px; /* header height and margin and padding of container */
    margin-top: -95px; /* negative header height and margin and padding of container */
    visibility: hidden;
}

.charts {
    display: flex;
    justify-content: center;
}
</style>