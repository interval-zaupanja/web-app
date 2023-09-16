<template>
    <div>
        <table cellspacing="0" cellpadding="0" class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Začetek anketiranja</th>
                    <th scope="col">Konec anketiranja</th>
                    <th scope="col">Izvajalci</th>
                    <th scope="col">Naročniki</th>
                    <th scope="col">Metode anketiranja</th>
                </tr>
            </thead>
            <tbody>
                <tr class="anketa" v-for="anketa in ankete" :key="anketa._id" @click="$router.push('/ankete/' + anketa._id)">
                    <th>
                        <span v-if="anketa.zacetek">{{ new Date(anketa.zacetek).toLocaleDateString('en-GB') }}</span>
                        <span v-else>Ni podatkov</span>
                    </th>
                    <th>
                        <span v-if="anketa.konec">{{ new Date(anketa.konec).toLocaleDateString('en-GB') }}</span>
                        <span v-else>Ni podatkov</span>
                    </th>
                    <th>
                        <span v-if="anketa.izvajalci_ime">{{ anketa.izvajalci_ime.join(', ') }}</span>
                        <span v-else>Ni podatkov</span>
                    </th>
                    <th>
                        <span v-if="anketa.narocniki_ime">{{ anketa.narocniki_ime.join(', ') }}</span>
                        <span v-else>Ni podatkov</span>
                    </th>
                    <th>
                        <span v-if="anketa.metode">{{ anketa.metode.join(', ') }}</span>
                        <span v-else>Ni podatkov</span>
                    </th>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-if="!loaded" style="display: flex; justify-content: center; align-items: center">
       <Nalaganje size="medium-small"/>
    </div>
</template>

<script>
import axios from "axios";

import Nalaganje from '@/components/Nalaganje.vue'

export default {
	name: "SeznamAnket",
    props: ["parametri"],
    components: {
        Nalaganje
    },
	data() {
		return {
			ankete: [],
            loaded: false
		}
	},
	async mounted() {
		await this.getData();
        this.loaded = true;
	},
	methods: {
		async getData() {
            var urlParametri = {}
            if (this.parametri) {
                urlParametri = this.parametri
            }
			const { data } = await axios.get(this.apiServer + "/api/ankete", {params: urlParametri});
			for (let i = 0; i < data.length; i++) { // s forEach ne deluje, ker ni async funkcija
				const {
                    _id,
					zacetek,
					konec,
					metode,
					izvajalci_id,
                    narocniki_id
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
                const { data } = await axios.get(this.apiServer + "/api/narocniki/" + narocniki_id[i]);
                narocniki_ime.push(data.ime)
            }
            return narocniki_ime
		}
	}
}
</script>