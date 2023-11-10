<template>
	<div class="sidebar bubble bubble-outer pink-red">
		<h3>Zadnje ankete</h3>
		<div class="bubble bubble-list bubble-border yellow-gray" v-for="anketa in ankete" :key="anketa._id" @click="$router.push('/ankete/' + anketa._id)">
			Izvedena od {{ new Date(anketa.zacetek).toLocaleDateString('en-GB') }} do {{ new Date(anketa.konec).toLocaleDateString('en-GB') }}
			<br>
			<span v-if="anketa.izvajalci_ime && anketa.izvajalci_ime.length > 0">
				<span v-if="anketa.izvajalci_ime.length == 1">Izvajalec: </span>
				<span v-else-if="anketa.izvajalci_ime.length == 2">Izvajalca: </span>
				<span v-else>Izvajalci: </span>
				{{ anketa.izvajalci_ime.join(', ') }}
				<br>
			</span>
			<span v-if="anketa.narocniki_ime && anketa.narocniki_ime.length > 0">
				<span v-if="anketa.narocniki_ime.length == 1">Naročnik: </span>
				<span v-else-if="anketa.narocniki_ime.length == 2">Naročnika: </span>
				<span v-else>Naročniki: </span>
				{{ anketa.narocniki_ime.join(', ') }}
				<br>
			</span>
			<span v-if="anketa.metode && anketa.metode.length > 0">
				<span v-if="anketa.metode.length == 1">Metoda: </span>
				<span v-else-if="anketa.metode.length == 2">Metodi: </span>
				<span v-else>Metode: </span>
				{{ anketa.metode.join(', ') }}
			</span>
		</div>
	</div>
</template>

<script>
import axios from "axios";

export default {
	name: "ZadnjeAnkete",
	data() {
		return {
			ankete: [],
		}
	},
	async mounted() {
		this.getData()
	},
	methods: {
		async getData() {
			const { data } = await axios.get(this.apiServer + "/api/ankete?limit=3");
			for (let i = 0; i < data.length; i++) { // s forEach ne deluje, ker ni async funkcija
				const {
					zacetek,
					konec,
					metode,
					izvajalci_id,
					narocniki_id,
					_id
				} = data[i];
				this.ankete.push({_id, zacetek, konec, metode, izvajalci_ime: await this.getIzvajalciIme(izvajalci_id), narocniki_ime: await this.getNarocnikiIme(narocniki_id)});
			}
		},
		async getIzvajalciIme(izvajalci_id) {
            var izvajalci_ime = []
            for (let i = 0; i < izvajalci_id.length; i++) {
                const { data } = await axios.get(this.apiServer + "/api/izvajalci/" + izvajalci_id[i]);
                izvajalci_ime.push(data.ime)
            }
            return izvajalci_ime
		},
		async getNarocnikiIme(narocniki_id) {
			var narocniki_ime = []
            for (let i = 0; i < narocniki_id.length; i++) {
                const { data } = await axios.get(this.apiServer + "/api/zalozniki/" + narocniki_id[i]);
                narocniki_ime.push(data.ime)
            }
            return narocniki_ime
		}
	}
}
</script>

<style scoped>
h3 {
	text-align: center;
}

.sidebar {
    /* display: inline-block; (to se zaradi float ignorira; drugače tudi s tem ne dela dobro) */
    /* float: right; */
    min-width: 350px;
    max-width: 400px;
}
</style>