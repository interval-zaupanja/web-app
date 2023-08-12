<template>
    <table cellspacing="0" cellpadding="0" class="table table-hover">
        <thead>
            <tr>
                <th scope="col">Začetek anketiranja</th>
                <th scope="col">Konec anketiranja</th>
                <th scope="col">Anketarji</th>
                <th scope="col">Naročniki</th>
                <th scope="col">Metoda anketiranja</th>
            </tr>
        </thead>
        <tbody>
            <tr class="anketa" v-for="anketa in ankete" :key="anketa._id" @click="$router.push('/ankete/' + anketa._id)">
                    <th>
                        {{ new Date(anketa.zacetek).toLocaleDateString() }}
                    </th>
                    <th>
                        {{ new Date(anketa.konec).toLocaleDateString() }}
                    </th>
                    <th>
                        {{ anketa.anketarji_ime.join(', ') }}
                    </th>
                    <th>
                        {{ anketa.narocniki_ime.join(', ') }}
                    </th>
                    <th>
                        {{ anketa.metoda }}
                    </th>
            </tr>
        </tbody>
    </table>
</template>

<script>
import axios from "axios";

export default {
	name: "SeznamAnket",
    props: ["parametri"],
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
            var urlParametri = {}
            if (this.parametri) {
                urlParametri = this.parametri
            }
			const { data } = await axios.get("http://localhost:4000/api/ankete", {params: urlParametri});
			for (let i = 0; i < data.length; i++) { // s forEach ne deluje, ker ni async funkcija
				const {
                    _id,
					zacetek,
					konec,
					metoda,
					anketarji_id,
                    narocniki_id
                } = data[i];
				this.ankete.push({_id, zacetek, konec, metoda, anketarji_ime: await this.getAnketarjiIme(anketarji_id), narocniki_ime: await this.getNarocnikiIme(narocniki_id)});
			}
		},
		async getAnketarjiIme(anketarji_id) {
            var anketarji_ime = []
            for (let i = 0; i < anketarji_id.length; i++) {
                const { data } = await axios.get("http://localhost:4000/api/anketarji/" + anketarji_id[i]);
                anketarji_ime.push(data.ime)
            }
            return anketarji_ime
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