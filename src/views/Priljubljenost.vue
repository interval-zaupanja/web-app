<template>
    <div v-if="this.orientacija === 'horizontalno' && loaded">
        <BarChartHorizontal :data="this.data"/>
    </div>
    <div v-else class="odmik">
        <div v-if="loaded">
            <BarChart :data="this.data"/>
        </div>
    </div>
</template>

<script>
import BarChart from '@/components/charts/BarChartVertical.vue'
import BarChartHorizontal from '@/components/charts/BarChartHorizontal.vue'

import axios from 'axios'

export default {
    name: 'Priljubljenost',
    props: ['podatki', 'orientacija'],
    components: {
        BarChart,
        BarChartHorizontal
    },
    data() {
        return {
            vprasanja: [],
            data: {
                labels: [],
                labelIDs: [], // potrebno za povezavo do osebe
                datasets: []
            },
            loaded: false
        }
    },
    async mounted() {
        await this.getData()
        const { osebe_ids, datasets } = this.predelajPodatke(this.vprasanja)
        this.data.labelIDs = osebe_ids
        const { imenaOseb, imageURIs } = await this.getOsebe(osebe_ids)
        this.data.labels = imenaOseb
        this.data.datasets = datasets
        this.data.datasets[0].images = imageURIs
        this.loaded = true
    },
    methods: {
        async getData() {
            if (this.podatki) {
                this.vprasanja[0] = this.podatki
            } else {
                const { data } = await axios.get(this.apiServer + '/api/vprasanja?tip=priljubljenost&order=asc')
                this.vprasanja = data
            }
        },
        predelajPodatke(vprasanja) {
            var podatki = {
                osebe_ids: [],
                datasets: []
            }

            for (let i = 0; i < vprasanja.length; i++) {
                const vprasanje = vprasanja[i]

                var dataset = {
                    label: new Date(vprasanje.anketa_sredina).toLocaleDateString('en-GB'),
                    borderColor: this.getBarva(i, vprasanja.length),
                    backgroundColor: this.getBarva(i, vprasanja.length),
                    images: [],
                    barPercentage: 0.7,
                    categoryPercentage: 1,
                    data: []
                }

                for (let j = 0; j < vprasanje.odgovori.length; j++) {
                    const odgovor = vprasanje.odgovori[j]
                    var zeObstaja = false
                    podatki.osebe_ids.forEach((element) => {
                        if (element === odgovor.oseba_id) {
                            zeObstaja = true
                        }
                    })

                    if (!zeObstaja) {
                        podatki.osebe_ids.push(odgovor.oseba_id)
                    }

                    dataset.data.push(odgovor.ocena)
                }
                podatki.datasets.push(dataset)
            }
            return podatki
        },
        async getOsebe(osebe_ids) {
            var imenaOseb = []
            var imageURIs = []
            for (let i = 0; i < osebe_ids.length; i++) {
                const { data } = await axios.get(this.apiServer + '/api/osebe/' + osebe_ids[i])
                var full_name = data.ime
                if (data.ime_srednje) {
                    full_name += ' ' + data.ime_srednje.charAt(0) + '.'
                }
                full_name += ' ' + data.priimek
                imenaOseb.push(full_name)
                if (data.slika_uri) {
                    imageURIs.push(this.vrniLogoUri(data.slika_uri))
                }
            }

            return { imenaOseb, imageURIs }
        },
        getBarva(i, stVprasanj) {
            switch (stVprasanj - i - 1) {
                case 0:
                    return this.barve.spekter_1
                case 1:
                    return this.barve.spekter_2
                case 2:
                    return this.barve.spekter_0
                case 3:
                    return this.barve.spekter_minus1
                case 4:
                    return this.barve.spekter_minus2
            }
        }
    }
}
</script>