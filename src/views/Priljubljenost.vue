<template>
    <div v-if="loaded">
        <BarChart :data="this.data"/>
    </div>
</template>

<script>
import BarChart from '@/components/charts/BarChart.vue'

export default {
    name: 'Priljubljenost',
    components: {
        BarChart
    },
    data() {
        return {
            vprasanja: [],
            data: {
                labels: [],
                labelIDs: [],
                datasets: []
            },
            loaded: false
        }
    },
    async mounted() {
        await this.getData()
        const { labels, datasets } = this.predelajPodatke(this.vprasanja)
        this.data.labelIDs = labels
        this.data.labels = await this.getImenaOseb(labels)
        this.data.datasets = datasets
        console.log(this.data)
        this.loaded = true
    },
    methods: {
        async getData() {
            const { data } = await axios.get(this.apiServer + '/api/vprasanja?tip=priljubljenost')
            this.vprasanja = data
        },
        predelajPodatke(vprasanja) {
            var podatki = {
                labels: [],
                datasets: []
            }

            for (let i = 0; i < vprasanja.length; i++) {
                const vprasanje = vprasanja[i]

                var dataset = {
                    label: vprasanje.anketa_sredina,
                    borderColor: this.getBarva(i),
                    backgroundColor: this.getBarva(i),
                    barPercentage: 0.7,
                    categoryPercentage: 1,
                    data: []
                }

                for (let j = 0; j < vprasanje.odgovori.length; j++) {
                    const odgovor = vprasanje.odgovori[j]
                    var zeObstaja = false
                    podatki.labels.forEach((element) => {
                        if (element === odgovor.oseba_id) {
                            zeObstaja = true
                        }
                    })

                    if (!zeObstaja) {
                        podatki.labels.push(odgovor.oseba_id)
                    }

                    dataset.data.push(odgovor.ocena)
                }
                podatki.datasets.push(dataset)
            }
            return podatki
        },
        async getImenaOseb(osebe_ids) {
            var imenaOseb = []
            for (let i = 0; i < osebe_ids.length; i++) {
                const { data } = await axios.get(this.apiServer + '/api/osebe/' + osebe_ids[i])
                var full_name = data.ime
                if (data.ime_srednje) {
                    full_name += ' ' + data.ime_srednje.charAt(0) + '.'
                }
                full_name += ' ' + data.priimek
                imenaOseb.push(full_name)
            }

            return imenaOseb
        },
        getBarva(i) {
            switch (i) {
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