<template>
	<div class="zadnje-ankete sidebar">
		<h1>Zadnje ankete</h1>
		<div class="zadnja-anketa" v-for="anketa in ankete" :key="anketa._id">
			<a :href="getLinkUrl(anketa._id)" style="display: block"> <!-- iffy implementacija !-->
				Izvedena od {{ new Date(anketa.zacetek).toLocaleDateString() }} do {{ new Date(anketa.konec).toLocaleDateString() }}
				<br>
				Anketar: {{ anketa.anketar_ime }}
				<br>
				Naročnik: {{ anketa.narocnik_id }}
				<br>
				Metoda: {{ anketa.metoda }}
				<br>
			</a>
		</div>
	</div>
</template>

<script>
import axios from "axios"; // pri SPA to ni bilo potrebno ???; poleg tega je že CDN v index.html

export default {
	name: "ZadnjeAnkete",
	// el: '#zadnje-ankete',
	data() {
		return {
			ankete: []
		}
	},
	async mounted() {
		await this.getData();
		await this.imenaAnketarjev();
		// Vue.set(this.ankete); // osveži pogled, kar za sam getData() očitno ni potrebno; v komponentni shemi to sploh ni potrebno
	},
	methods: {
		async getData() {
			await axios
				.get("http://localhost:4000/api/ankete")
				.then(response => this.ankete = response.data)
				.catch(error => {
					console.error(error)
				});
		},
		async imenaAnketarjev() { // imena anketarjev se dodajo šele naknadno; lahko bi jih sicer dodal tudi med samim klicem podatkov!!!
			for (let i = 0; i < this.ankete.length; i++) {
				await axios
					.get("http://localhost:4000/api/anketarji/" + this.ankete[i].anketar_id)
					.then(response => {
						this.ankete[i].anketar_ime = response.data.ime;
					})
					.catch(error => console.error(error));
			}
		},
		getLinkUrl(id) {
			return 'ankete/' + id;
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