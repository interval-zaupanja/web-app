<template>
    <table cellspacing="0" cellpadding="0">
        <tr>
            <th>Začetek anketiranja</th>
            <th>Konec anketiranja</th>
            <th>Anketar</th>
            <th>Naročnik</th>
            <th>Metoda anketiranja</th>
        </tr>
        <tr class="anketa" v-for="anketa in ankete" :key="anketa._id">
                <th>
                    <router-link :to="'/ankete/' + anketa._id">
                        {{ new Date(anketa.zacetek).toLocaleDateString() }}
                    </router-link>
                </th>
                <th>
                    <router-link :to="'/ankete/' + anketa._id">
                        {{ new Date(anketa.konec).toLocaleDateString() }}
                    </router-link>
                </th>
                <th>
                    <router-link :to="'/ankete/' + anketa._id">
                        {{ anketa.anketar_ime }}
                    </router-link>
                </th>
                <th>
                    <router-link :to="'/ankete/' + anketa._id">
                        {{ anketa.narocnik_ime }}
                    </router-link>
                </th>
                <th>
                    <router-link :to="'/ankete/' + anketa._id">
                        {{ anketa.metoda }}
                    </router-link>
                </th>
        </tr>
    </table>
</template>

<script>
import axios from "axios";

export default {
	name: "SeznamAnkets",
	data() {
		return {
			ankete: []
		}
	},
	async mounted() {
		await this.getData();
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
				this.ankete.push({_id, zacetek, konec, metoda, anketar_ime: await this.getAnketarIme(anketar_id), narocnik_ime: await this.getNarocnikIme(narocnik_id)});
			}
		},
		async getAnketarIme(anketar_id) {
			const { data } = await axios.get("http://localhost:4000/api/anketarji/" + anketar_id);
			return data.ime;
		},
		async getNarocnikIme(narocnik_id) {
			const { data } = await axios.get("http://localhost:4000/api/narocniki/" + narocnik_id);
			return data.ime;
		},
		getUrl(id) {
			return 'ankete/' + id;
		}
	}
}
</script>

<style scoped>
.anketa {
	padding: 10px;
	margin: 10px;
	background-image: linear-gradient(to right,  rgba(148, 117, 108, 0.29), rgba(255, 210, 144, 0.29));
	border-radius: 15px;
	border: 2px solid rgba(255, 255, 255, 0.55);
}

tr .anketa:hover {
	border: 2px solid #ae1813;
}

.anketa a {
	color: inherit; /* blue colors for links too */
	text-decoration: inherit; /* no underline */
}

tr {
    border: none;
}

th {
    padding: 0px;
}
table {
    width: 100%;
    border: 0px;
}
</style>