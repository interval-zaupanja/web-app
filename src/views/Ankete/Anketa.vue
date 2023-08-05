<template>
    <h2>
        <router-link to="/ankete">Ankete</router-link>
        ⏵
        Podrobnosti ankete</h2>
    <div :v-if="loaded">
        <p>Identifikator ankete: {{ this.id }}</p>
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
        <!-- <p :v-if="this.opis">Opis: {{ this.opis }}</p>
        <p :v-if="this.opombe">Opombe: {{ this.opombe }}</p> -->
        <div>
            <h1>Vprašanja</h1>
            <div v-for="vprasanje in vprasanja" :key="vprasanje._id" class="vprasanje">
                <div>
                    <div>
                        <p>Vprašanje: {{vprasanje.vprasanje}}</p>
                        <p>Tip vprašanja: {{vprasanje.tip}}</p>
                        <p :v-if="vprasanje.glasovalno_tip"> Tip glasovalnega vprašanja: {{ this.glasovalnoTip(vprasanje.glasovalno_tip)}}</p>
                        <p :v-if="vprasanje.opis">Opis: {{vprasanje.opis}}</p>
                        <p :v-if="vprasanje.opombe">Opombe: {{vprasanje.opombe}}</p>
                    </div>
                    <div>
                        <h2>Odgovori:</h2>
                        <div v-for="odgovor in vprasanje.odgovori" :key="odgovor._id" class="odgovor">
                            <p>Tip odgovora: {{ this.odgovorTip(odgovor.odgovor_tip)}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
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
            loaded: false
        }
    },
    async mounted() {
        await this.getData();
        await this.getAnketarIme();
        await this.getNarocnikIme();
        await this.getVprasanja();
        this.loaded = true;
    },
    methods: {
        async getData() {
            const { data } = await axios.get("http://localhost:4000/api/ankete/" + this.id);
            this.anketar_id = data.anketar_id;
            this.narocnik_id = data.narocnik_id;
            this.velikost_vzorca = data.velikost_vzorca;
            this.metoda = data.metoda;
            this.zacetek = data.zacetek;
            this.konec = data.konec;
            this.opis = data.opis;
            this.opombe = data.opombe;
        },
        async getAnketarIme() {
			const { data } = await axios.get("http://localhost:4000/api/anketarji/" + this.anketar_id);
			this.anketar_ime = data.ime;
		},
		async getNarocnikIme() {
			const { data } = await axios.get("http://localhost:4000/api/narocniki/" + this.narocnik_id);
			this.narocnik_ime = data.ime;
		},
        async getVprasanja() {
            const { data } = await axios.get("http://localhost:4000/api/vprasanja/anketa/" + this.id);
            this.vprasanja = data;
            console.log(data);
        },
        glasovalnoTip(glasovalno_tip) {
            if (glasovalno_tip === "DZ") {
                return "Volitve v Državni zbor";
            }
        },
        odgovorTip(odgovor_tip) {
            if (odgovor_tip === "BG-V") {
                return "Bom glasoval - vem, kako bom glasoval";
            } else if (odgovor_tip === "BG-NV") {
                return "Bom glasoval - ne vem, kako bom glasoval";
            } else if (odgovor_tip === "NBG") {
                return "Ne bom glasoval";
            }
        }
    }
}
</script>

<style scoped>
.vprasanje { /* podobno kot pri komponenti ZadnjeAnkete*/
    padding: 10px;
	margin: 10px;
    background-image: linear-gradient(to right, #f6caca, #fcabab);
	border-radius: 15px;
	border: 2px solid rgba(255, 255, 255, 0.55);
}

.odgovor {
    padding: 10px;
	margin: 10px;
	background-image: linear-gradient(to right,  rgba(148, 117, 108, 0.29), rgba(255, 210, 144, 0.29));
	border-radius: 15px;
	border: 2px solid rgba(255, 255, 255, 0.55);
}
</style>