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
                    <p v-if="this.narocniki">
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
                    <p v-if="this.metode">
                        <span v-if="this.metode.length == 1">Metoda anketiranja: </span>
                        <span v-else-if="this.metode.length == 2">Metodi anketiranja: </span>
                        <span v-else>Metode anketiranja: </span>
                        
                        <span v-for="(metoda, indeks) in this.metode" :key="metoda.id">
                            {{ metoda }}
                            <span
                                data-bs-toggle="tooltip" data-bs-placement="right"
                                data-bs-custom-class="custom-tooltip"
                                :data-bs-title="this.vrniPojasniloMetode(metoda)"
                            >
                                <span class="material-symbols-outlined">
                                    help
                                </span>
                            </span>
                            <span v-if="indeks + 1 < this.metode.length">, </span>
                        </span>
                    </p>
                    <p>Začetek anketiranja: {{ new Date(this.zacetek).toLocaleDateString('en-GB') }}</p>
                    <p>Konec anketiranja: {{ new Date(this.konec).toLocaleDateString('en-GB') }}</p>
                </div>
                <div>
                    <Vzorec v-if="this.vzorec" style="margin: 0px 15px 15px 15px" :data="this.vzorec"/>
                </div>
            </div>
            <div>
                <p v-if="this.opis">Opis: {{ this.opis }}</p>
                <p v-if="this.opombe">Opombe: {{ this.opombe }}</p>
            </div>
            
            <Viri v-if="this.viri" :data="this.viri" :izvajalci="this.izvajalci" :narocniki="this.narocniki"/>
            <Vprasanja v-if="this.vprasanja" :data="this.vprasanja" :id="this.id"/>
                
        </div>
    </div>
    <div v-if="not_found && loaded">
        <NeObstaja ime="Anketa"/>
    </div>
</template>

<script>
import axios from 'axios';
import { Tooltip } from 'bootstrap'


import Nalaganje from '../../components/Nalaganje.vue'
import NeObstaja from '../../components/NeObstaja.vue'
import Breadcrumbs from '@/components/BreadcrumbsBS.vue'
import Vzorec from '@/components/Vzorec.vue'

import Viri from '@/views/Ankete/Viri.vue'
import Vprasanja from '@/views/Ankete/Vprasanja.vue'

export default {
    components: {
        Nalaganje,
        NeObstaja,
        Breadcrumbs,
        Vzorec,
        Viri,
        Vprasanja
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
    async mounted() { // vse preko API klica pridobljene podatke dobimo v tem pogledu, zato, da se Nalaganje prikaže le enkrat
        const status = await this.getData();
        if (status) {
            await this.getIzvajalci();
            await this.getNarocniki();
            await this.getVprasanja();

            // Dodajanje podrobnosti strank
            for (let i = 0; i < this.vprasanja.length; i++) {
                if (this.vprasanja[i].tip === 'glasovalno') {
                    const odgovori = this.vprasanja[i].odgovori;
                    for (let j = 0; j < odgovori.length; j++) {
                        if (odgovori[j].stranka_id) {
                            const podatki = await this.getStranka(odgovori[j].stranka_id)
                            odgovori[j].odgovor_stranka_ime = podatki.ime;
                            odgovori[j].odgovor_stranka_ime_kratica = podatki.ime_kratica;
                            odgovori[j].odgovor_stranka_logo_uri = this.vrniLogoUri(podatki.logo_uri);
                            odgovori[j].odgovor_stranka_barva = podatki.barva;
                        }
                    }
                }
            }
        } else {
            this.not_found = true;
        }
        this.loaded = true;

        // Navigacija do fragmenta

        // IMPLEMENTACIJA 1: ne deluje za odgovore
        setTimeout(function (hash) {
            if (hash) {
                const el_id = hash.replace('#', '')
                var el
                try {
                    el = document.getElementById(el_id)
                    console.log("Pravilno prebrano: ", el)
                } catch (e) {
                    console.error("Napaka: ", e)
                }
                el.scrollIntoView({ behavior: 'smooth' })
            }
        }, 500, this.hash);

        new Tooltip(document.body, {
            selector: "[data-bs-toggle='tooltip']",
        })
    },
    methods: {
        async getData() {
            try {
                const { data } = await axios.get(this.apiServer + "/api/ankete/" + this.id);
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
                    const { data } =  await axios.get(this.apiServer + "/api/izvajalci/" + this.izvajalci[i].id);
                    this.izvajalci[i].ime = data.ime;
                    this.izvajalci[i].logo_uri = this.vrniLogoUri(data.logo_uri)
                } catch (error) {
                    this.izvajalci[i].ime = "Ne najdem izvajalca";
                }
            }
		},
        async getNarocniki() {
            // Dodajanje podrobnosti naročnikov
            for (let i = 0; i < this.narocniki.length; i++) {
                try {
                    const { data } =  await axios.get(this.apiServer + "/api/narocniki/" + this.narocniki[i].id);
                    this.narocniki[i].ime = data.ime;
                    this.narocniki[i].logo_uri = this.vrniLogoUri(data.logo_uri)
                } catch (error) {
                    this.narocniki[i].ime = "Ne najdem naročnika";
                }
            }
		},
        async getVprasanja() {
            try {
                const { data } = await axios.get(this.apiServer + "/api/vprasanja/anketa/" + this.id);
                this.vprasanja = data;
            } catch (error) {
                console.log(error);
                this.vprasanja = "Nekaj je šlo narobe pri pridobivanju vprašanj";
            }
            
        },
        async getStranka(stranka_id) {
            try {
                const { data } = await axios.get(this.apiServer + "/api/stranke/" + stranka_id);
                return data;
            } catch (error) {
                console.log(error);
                return "Ne najdem specificiarne stranke";
            }
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
</style>