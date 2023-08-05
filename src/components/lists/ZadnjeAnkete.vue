<template>
	<div class="zadnje-ankete sidebar">
		<h1>Zadnje ankete</h1>
		<div class="zadnja-anketa" v-for="anketa in ankete" :key="anketa._id">
			<router-link :to="'ankete/' + anketa._id" style="display: block">
				Izvedena od {{ new Date(anketa.zacetek).toLocaleDateString() }} do {{ new Date(anketa.konec).toLocaleDateString() }}
				<br>
				Anketar: {{ anketa.anketar_ime }}
				<br>
				Naročnik: {{ anketa.narocnik_ime }}
				<br>
				Metoda: {{ anketa.metoda }}
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
			const { data } = await axios.get("http://localhost:4000/api/ankete");
			for (let i = 0; i < data.length; i++) { // s forEach ne deluje, ker ni async funkcija
				const {
					zacetek,
					konec,
					metoda,
					anketar_id,
					narocnik_id,
					_id
				} = data[i];
				this.ankete.push({_id, zacetek, konec, metoda, anketar_ime: await this.imeAnketarja(anketar_id), narocnik_ime: await this.imeNarocnika(narocnik_id)});
			}
		},
		async imeAnketarja(anketar_id) {
			const { data } = await axios.get("http://localhost:4000/api/anketarji/" + anketar_id);
			return data.ime;
		},
		async imeNarocnika(narocnik_id) {
			const { data } = await axios.get("http://localhost:4000/api/narocniki/" + narocnik_id);
			return data.ime;
		}
	}
}
</script>

<style scoped>
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

.zadnja-anketa a {
	color: inherit; /* blue colors for links too */
	text-decoration: inherit; /* no underline */
}
</style>