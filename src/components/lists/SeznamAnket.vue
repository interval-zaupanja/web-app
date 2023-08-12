<template>
    <table cellspacing="0" cellpadding="0" class="table table-hover">
        <thead>
            <tr>
                <th scope="col">Začetek anketiranja</th>
                <th scope="col">Konec anketiranja</th>
                <th scope="col">Anketar</th>
                <th scope="col">Naročnik</th>
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
                        {{ anketa.anketar_ime }}
                    </th>
                    <th>
                        {{ anketa.narocnik_ime }}
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
			const { data } = await axios.get("http://localhost:4000/api/ankete", {
                params: urlParametri
            });
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