<template>
    <div>
        <table cellspacing="0" cellpadding="0" class="table table-hover">
            <thead>
                <tr>
                    <th scope="col" v-if="this.siroka_tabela">Začetek anketiranja</th>
                    <th scope="col" v-if="this.siroka_tabela">Konec anketiranja</th>
                    <th scope="col" v-if="!this.siroka_tabela">Obdobje anketiranja</th>
                    <th scope="col">Izvajalci</th>
                    <th scope="col">Naročniki</th>
                    <th scope="col" v-if="this.siroka_tabela">Metode anketiranja</th>
                    <th scope="col" v-if="!this.ozka_tabela"><span v-if="this.siroka_tabela">Velikost vzorca</span><span v-else>N</span></th>
                </tr>
            </thead>
            <tbody style="cursor: pointer;">
                <tr class="anketa" v-for="anketa in ankete" :key="anketa._id" @click="$router.push('/ankete/' + anketa._id)">
                    <th v-if="this.siroka_tabela">
                        <span v-if="anketa.zacetek">{{ new Date(anketa.zacetek).toLocaleDateString('en-GB') }}</span>
                        <span v-else>Ni podatkov</span>
                    </th>
                    <th v-if="this.siroka_tabela">
                        <span v-if="anketa.konec">{{ new Date(anketa.konec).toLocaleDateString('en-GB') }}</span>
                        <span v-else>Ni podatkov</span>
                    </th>
                    <th v-if="!this.siroka_tabela">
                        <span v-if="anketa.zacetek || anekta.konec">
                            <span v-if="anketa.zacetek">{{ new Date(anketa.zacetek).toLocaleDateString('en-GB') }}</span> - <span v-if="anketa.konec">{{ new Date(anketa.konec).toLocaleDateString('en-GB') }}</span>
                        </span>
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
                    <th v-if="this.siroka_tabela">
                        <span v-if="anketa.metode">{{ anketa.metode.join(', ') }}</span>
                        <span v-else>Ni podatkov</span>
                    </th>
                    <th v-if="!this.ozka_tabela">
                        <span v-if="anketa.vzorec[0].st_sodelujocih">{{ anketa.vzorec[0].st_sodelujocih }}</span>
                        <span v-else>N/A</span>
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
            loaded: false,
            siroka_tabela: true,
            ozka_tabela: false
		}
	},
	async mounted() {
		await this.getData();
        this.loaded = true;
	},
    created() {
        window.addEventListener('resize', this.checkScreen) // brez () pri funkciji
        this.checkScreen() // požene tudi, ko se ustvari aplikacija, ne le ko event listener zazna spremembo velikosti zaslona
    },
	methods: {
        checkScreen() {
            var windowWidth = window.innerWidth
            if (windowWidth >= 600) {
                this.siroka_tabela = true
            } else {
                this.siroka_tabela = false
            }

            if (windowWidth <= 450) {
                this.ozka_tabela = true
            } else {
                this.ozka_tabela = false
            }
        },
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
                    narocniki_id,
                    vzorec
                } = data[i];
				this.ankete.push({_id, zacetek, konec, metode, izvajalci_ime: await this.getIzvajalciIme(izvajalci_id), narocniki_ime: await this.getNarocnikiIme(narocniki_id), vzorec});
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

<style>
table { /* prepreči overflow tabele in pogleda na ožjih napravah */
    table-layout: fixed;
    word-wrap: break-word;
}

.table-hover thead tr td, .table-hover thead tr th {
  background-color: #ae1813;
  color: white
}

.table-hover thead tr td:first-child, .table-hover thead tr th:first-child {
  border-radius: 10px 0 0 10px;
}

.table-hover thead tr td:last-child, .table-hover thead tr th:last-child {
  border-radius: 0 10px 10px 0;
}

.table-hover tbody tr:hover td, .table-hover tbody tr:hover th {
  background-color: #ffa5a5;
}

.table-hover tbody tr:hover td:first-child, .table-hover tbody tr:hover th:first-child {
  border-radius: 10px 0 0 10px;
}

.table-hover tbody tr:hover td:last-child, .table-hover tbody tr:hover th:last-child {
  border-radius: 0 10px 10px 0;
}
</style>