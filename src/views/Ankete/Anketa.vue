<template>
    <div v-if="!loaded" class="odmik">
        <Nalaganje/>
    </div>
    <div v-if="loaded && !not_found">
        <Breadcrumbs
            previous="Ankete" previousLink="/ankete" current="Podrobnosti ankete"
            :class="this.edgeToEdge ? 'odmik2' : 'odmik'"
        />
        <div>
            <div id="anketa-split-view" :class="this.edgeToEdge ? '' : 'odmik split-view'">
                <div id="info-main" style="display: inline-block" :class="this.edgeToEdge ? 'odmik2' : ''">
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
                            <router-link :to="'/zalozniki/' + narocnik.id">
                                {{ narocnik.ime}}
                            </router-link>
                            <span v-if="narocnik.logo_uri != null">&nbsp;<img v-if="narocnik.logo_uri != null" :src="narocnik.logo_uri" @click="$router.push('/zalozniki/' + narocnik.id)" style="height: 16px"/></span>
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
                <div id="vzorecContainer" v-if="this.vzorec" style="flex-grow: 1">
                    <Vzorec
                        style="margin: 0px 15px 15px 15px"
                        :style="!this.vzorecWrapped ? 'float: right; max-width: 500px' : (!this.edgeToEdge ? 'max-width: 100%' : 'max-width: 100%; margin: 0 0 15px 0')"
                        :data="this.vzorec"
                        :edgeToEdge="this.edgeToEdge"
                    />
                </div>
            </div>
            <div :class="this.edgeToEdge ? 'odmik2' : 'odmik'">
                <p v-if="this.opis">Opis: {{ this.opis }}</p>
                <p v-if="this.opombe">Opombe: {{ this.opombe }}</p>
            </div>
        </div>

        <Viri v-if="this.viri" :data="this.viri" :izvajalci="this.izvajalci" :narocniki="this.narocniki" :edgeToEdge="this.edgeToEdge"/>
        <div v-if="this.vprasanja">
            <h2 :class="this.edgeToEdge ? 'odmik2' : 'odmik'">Vprašanja</h2>
            <div v-for="vprasanje in this.vprasanja" :key="vprasanje._id">
                <Vprasanje :data="vprasanje" :id="this.id" :edgeToEdge="this.edgeToEdge"/>
            </div>
        </div>
    </div>
    <div v-if="not_found && loaded" class="odmik">
        <NeObstaja ime="Anketa"/>
    </div>
</template>

<script>
import axios from 'axios'
import { Tooltip } from 'bootstrap'


import Nalaganje from '../../components/Nalaganje.vue'
import NeObstaja from '../../components/NeObstaja.vue'
import Breadcrumbs from '@/components/BreadcrumbsBS.vue'
import Vzorec from '@/components/Vzorec.vue'

import Viri from '@/views/Ankete/Viri.vue'
import Vprasanje from '@/views/Ankete/Vprasanje.vue'

export default {
    components: {
        Nalaganje,
        NeObstaja,
        Breadcrumbs,
        Vzorec,
        Viri,
        Vprasanje
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
            hash: this.$route.hash,
            edgeToEdge: false,
            vzorecWrapped: false
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
                            odgovori[j].odgovor_stranka_indeks_LD = podatki.indeks_LD;
                        }
                    }
                }
            }
        } else {
            this.not_found = true;
        }
        this.loaded = true;

        // Navigacija do fragmenta
        setTimeout(function (hash) {
            if (hash) {
                const el_id = hash.replace('#', '')
                var el
                try {
                    el = document.getElementById(el_id)
                    // console.log("Pravilno prebrano: ", el)
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
    created() {
		window.addEventListener('resize', this.checkScreen) // brez () pri funkciji
        window.addEventListener('resize', this.vzorecWrap) // brez () pri funkciji

        // požene tudi, ko se ustvari aplikacija, ne le ko event listener zazna spremembo velikosti zaslona
		this.checkScreen()
	},
    unmounted() { // odstranimo event listenerje, da ne povzročajo problemov na drugih straneh
        window.removeEventListener('resize', this.checkScreen)
        window.removeEventListener('resize', this.vzorecWrap)
    },
	methods: {
		checkScreen() {
			var windowWidth = window.innerWidth
			if (windowWidth <= 600) {
				this.edgeToEdge = true
			} else {
				this.edgeToEdge = false
			}
		},
        vzorecWrap() {
            let splitViewContainer = document.getElementById('anketa-split-view')
            let infoMain = document.getElementById('info-main')
            let vzorecContainer = document.getElementById('vzorecContainer')
            let vzorecInfobox = document.getElementById('vzorec-infobox')
            
            if (
                this.vzorecWrapped &&
                vzorecInfobox.offsetWidth > 470 &&
                splitViewContainer.offsetWidth - infoMain.offsetWidth > 530
            ) {
                this.vzorecWrapped = false // prisili Vzorec, da gre nazaj na desno stran v primeru, da ima v sebi veliko besedila in ima poleg infoMain dovolj prostora
            } else if (vzorecContainer.offsetTop > infoMain.offsetTop) {
                this.vzorecWrapped = true
            } else {
                this.vzorecWrapped = false
            }
        },
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
                    const { data } =  await axios.get(this.apiServer + "/api/zalozniki/" + this.narocniki[i].id);
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
.split-view {
    display: flex;
    flex-wrap: wrap;
}
</style>