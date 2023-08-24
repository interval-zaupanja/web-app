<template>
	<div class="zadnje-ankete sidebar">
		<h3>Zadnje ankete</h3>
		<div class="zadnja-anketa" v-for="anketa in ankete" :key="anketa._id">
			<router-link :to="'ankete/' + anketa._id" style="display: block">
				Izvedena od {{ new Date(anketa.zacetek).toLocaleDateString('en-GB') }} do {{ new Date(anketa.konec).toLocaleDateString('en-GB') }}
				<br>
				<span v-if="anketa.izvajalci_ime.length > 0">
					<span v-if="anketa.izvajalci_ime.length == 1">Izvajalec: </span>
					<span v-else-if="anketa.izvajalci_ime.length == 2">Izvajalca: </span>
					<span v-else>Izvajalci: </span>
					{{ anketa.izvajalci_ime.join(', ') }}
				</span>
				<br>
				<span v-if="anketa.narocniki_ime.length > 0">
					<span v-if="anketa.narocniki_ime.length == 1">Naročnik: </span>
					<span v-else-if="anketa.narocniki_ime.length == 2">Naročnika: </span>
					<span v-else>Naročniki: </span>
					{{ anketa.narocniki_ime.join(', ') }}
				</span>
				<br>
				<span v-if="anketa.metode.length > 0">
					<span v-if="anketa.metode.length == 1">Metoda: </span>
					<span v-else-if="anketa.metode.length == 2">Metodi: </span>
					<span v-else>Metode: </span>
					{{ anketa.metode.join(', ') }}
				</span>
				<br>
			</router-link>
		</div>
	</div>
</template>

<script>
import axios from "axios";

export default {
	name: "ZadnjeAnkete",
	data() {
		return {
			ankete: []
		}
	},
	async mounted() {
		this.getData();
	},
	methods: {
		async getData() {
			const { data } = await axios.get("http://localhost:4000/api/ankete?limit=3");
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
                const { data } = await axios.get("http://localhost:4000/api/izvajalci/" + izvajalci_id[i]);
                izvajalci_ime.push(data.ime)
            }
            return izvajalci_ime
		},
		async getNarocnikiIme(narocniki_id) {
			var narocniki_ime = []
            for (let i = 0; i < narocniki_id.length; i++) {
                const { data } = await axios.get("http://localhost:4000/api/narocniki/" + narocniki_id[i]);
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

.zadnja-anketa {
	padding: 10px;
	margin: 10px;
	background-image: linear-gradient(to right,  rgba(148, 117, 108, 0.29), rgba(255, 210, 144, 0.29));
	border-radius: 15px;
	border: 2px solid rgba(255, 255, 255, 0.55);
}

.zadnja-anketa:hover {
	border: 2px solid #ae1813;
}

/* Removing link styles */
a:link {
    color: inherit;
    text-decoration: inherit;
}

a:visited {
    color: inherit;
    text-decoration: inherit;
}

a:hover {
    color: inherit;
    text-decoration: inherit;
}

a:active {
    color: inherit;
    text-decoration: inherit;
}
</style>