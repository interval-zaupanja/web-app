<template>
    <div v-if="!loaded">
        <Nalaganje/>
    </div>
    <div v-if="loaded && !not_found">
        <Breadcrumbs previous="Ankete" previousLink="/ankete" current="Podrobnosti ankete"/>
        <div>
            <!-- <p>Identifikator ankete: {{ this.id }}</p> -->
            <p>
                Anketar: <router-link :to="'/anketar/' + this.anketar_id">{{ this.anketar_ime}}</router-link>
            </p>
            <p>
                Naročnik: <router-link :to="'/narocnik/' + this.narocnik_id">{{ this.narocnik_ime}}</router-link>
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
                            <CopyLink :path="'/ankete/' + this.id + '#' + vprasanje._id"/>
                            <p v-if="vprasanje.vprasanje">Vprašanje: {{vprasanje.vprasanje}}</p>
                            <p>
                                Tip vprašanja: {{vprasanje.tip}}
                                <span v-if="vprasanje.tip === 'glasovalno'">
                                    - {{ this.glasovalnoTip(vprasanje.glasovalno_tip)}}
                                </span>
                                <span v-if="vprasanje.tip === 'zaupanje'">
                                    - {{ vprasanje.zaupanje_tip}}
                                </span>
                            </p>
                            <p v-if="vprasanje.opis">Opis: {{vprasanje.opis}}</p>
                            <p v-if="vprasanje.opombe">Opombe: {{vprasanje.opombe}}</p>
                        </div>
                        <div>
                            <h2>Odgovori</h2>
                            <div v-for="odgovor in vprasanje.odgovori" :key="odgovor._id" class="odgovor">
                                <span class="anchor-odgovor" :id="odgovor._id"></span>
                                <div>
                                    <CopyLink :path="'/ankete/' + this.id + '#' + odgovor._id"/>
                                    <p>Tip odgovora: {{ this.odgovorTip(odgovor.odgovor_tip)}}</p>
                                    <span>
                                        <span v-if="odgovor.odgovor_stranka_id">
                                            <span v-if="odgovor.odgovor_stranka_logo_uri != null" style="float: right">
                                                <a :href="'/stranke/' + odgovor.odgovor_stranka_id">
                                                    <img :src="odgovor.odgovor_stranka_logo_uri" style="max-height: 40px; max-width: 160px"/>
                                                </a>
                                            </span>
                                            <p>
                                                Stranka:
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
                                    <p>
                                        {{ odgovor.procent_anketar }}%
                                        <span v-if="(odgovor.procent_zgornja_meja_anketar - odgovor.procent_spodnja_meja_anketar) > 0">
                                            ± {{ (odgovor.procent_zgornja_meja_anketar - odgovor.procent_spodnja_meja_anketar) / 2 }}%
                                            ({{ odgovor.procent_spodnja_meja_anketar }}% - {{ odgovor.procent_zgornja_meja_anketar }}%)
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

export default {
    components: {
        Nalaganje,
        NeObstaja,
        CopyLink,
        Breadcrumbs
    },
    props: ['id'],
    data() {
        return {
            anketar_id: null,
            anketar_ime: null,
            narocnik_id: null,
            narocnik_ime: null,
            velikost_vzorca: null,
            metoda: null,
            zacetek: null,
            konec: null,
            opis: null,
            opombe: null,
            vprasanja: [],
            loaded: false,
            not_found: false,
            hash: this.$route.hash
        }
    },
    async mounted() {
        const status = await this.getData();
        if (status) {
            await this.getAnketarIme();
            await this.getNarocnikIme();
            await this.getVprasanja();

            // Dodajanje imen strank
            for (let i = 0; i < this.vprasanja.length; i++) {
                if (this.vprasanja[i].tip === 'glasovalno') {
                    const odgovori = this.vprasanja[i].odgovori;
                    for (let j = 0; j < odgovori.length; j++) {
                        if (odgovori[j].odgovor_stranka_id) {
                            odgovori[j].odgovor_stranka_ime = await this.getStrankaIme(odgovori[j].odgovor_stranka_id);
                            odgovori[j].odgovor_stranka_ime_kratica = await this.getStrankaImeKratica(odgovori[j].odgovor_stranka_id);
                            odgovori[j].odgovor_stranka_logo_uri = await this.getStrankaLogoURI(odgovori[j].odgovor_stranka_id);
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
                this.anketar_id = data.anketar_id;
                this.narocnik_id = data.narocnik_id;
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
        async getAnketarIme() {
            try {
                const { data } = await axios.get("http://localhost:4000/api/anketarji/" + this.anketar_id);
                this.anketar_ime = data.ime;
            } catch (error) {
                console.log(error);
                this.narocnik_ime = "Ne najdem specificiranega anketarja"
            }
		},
		async getNarocnikIme() {
            try {
                const { data } = await axios.get("http://localhost:4000/api/narocniki/" + this.narocnik_id);
                this.narocnik_ime = data.ime;
            } catch (error) {
                console.log(error);
                this.narocnik_ime = "Ne najdem specificiranega naročnika";
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
        glasovalnoTip(glasovalno_tip) {
            if (glasovalno_tip === "DZ") {
                return "volitve v Državni zbor";
            }
        },
        odgovorTip(odgovor_tip) {
            if (odgovor_tip === "BG-V") {
                return "bom glasoval - vem, kako bom glasoval";
            } else if (odgovor_tip === "BG-NV") {
                return "bom glasoval - ne vem, kako bom glasoval";
            } else if (odgovor_tip === "NBG") {
                return "ne bom glasoval";
            } else if (odgovor_tip === "NŽO") {
                return "ne želim odgovoriti";
            }
        },
        async getStrankaIme(stranka_id) {
            try {
                const { data } = await axios.get("http://localhost:4000/api/stranke/" + stranka_id);
                return data.ime;
            } catch (error) {
                console.log(error);
                return "Ne najdem specificiarne stranke";
            }
        },
        async getStrankaImeKratica(stranka_id) {
            try {
                const { data } = await axios.get("http://localhost:4000/api/stranke/" + stranka_id);
                return data.ime_kratica;
            } catch (error) {
                console.log(error);
                return null;
            }
        },
        async getStrankaLogoURI(stranka_id) {
            try {
                const { data } = await axios.get("http://localhost:4000/api/stranke/" + stranka_id);
                return data.logo_uri;
            } catch (error) {
                console.log(error);
                return null;
            }
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
</style>