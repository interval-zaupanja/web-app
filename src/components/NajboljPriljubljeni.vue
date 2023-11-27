<template>
    <div
        class="bubble bubble-outer"
        :style="'background-color: ' + this.barve.spekter_1"
        style="color: white; font-family: graphik; font-weight: 900; position: relative; padding-bottom: 0; overflow: hidden; cursor: pointer;"
    >
        <div v-if="this.loaded">
            <router-link to="/priljubljenost" style="font-size: 30px; color: white;">
                <span class="link-text">Na vrhu lestvice priljubljenosti</span><img height="20" style="position: relative; bottom: 3px" src="@/assets/icons/arrow-right.png" alt="">
            </router-link>
            <div @click="$router.push('/osebe/' + this.id)">
                <div>
                    <img
                        :src="this.vrniLogoUri(this.slika_uri)"
                        style="max-width: 70%; z-index: 4; position: relative; top: 40px; left: -50px"
                        class="slika"
                        draggable="false"
                    >
                    <div v-if="this.slika_avtor && this.slika_vir" style="color: rgb(181, 181, 181); font-weight: normal; text-align: center; max-width: 70%; z-index: 5; padding-bottom: 15px;">
                        <span v-if="this.slika_avtor">{{ this.slika_avtor }}</span> <a v-if="this.slika_vir" :href="this.slika_vir">Vir</a>
                    </div>
                </div>
                <div style="position: absolute; right: 0; top: 120px; width: 50%; text-align: right; font-size: 60px; margin: 0 20px 20px 20px;; z-index: 3">
                    <div><i>{{ this.ime.toUpperCase() }}</i></div>
                    <div><i>{{ this.ime_srednje.toUpperCase() }}</i></div>
                    <div><i>{{ this.priimek.toUpperCase() }}</i></div>
                </div>
                <div style="position: absolute; right: 40px; bottom: 0; width: 50%; text-align: right; font-size: 130px; margin: 20px; z-index: 6">
                    <i>{{ this.ocena.toLocaleString('sl-SI') }}</i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'NajboljPriljubljeni',
    data() {
        return {
            id: null,
            ime: '',
            ime_srednje: '', 
            priimek: '',
            slika_uri: '',
            slika_avtor: '',
            slika_vir: '',
            ocena: null,
            loaded: false
        }
    },
    async mounted() {
        await this.getData()
        this.loaded = true
    },
    methods: {
        async getData() {
            const { data } = await axios.get(this.apiServer + '/api/vprasanja?tip=priljubljenost&limit=1')
            const vprasanje = data[0]

            // izberemo najbolj priljubljenega politika glede na zadnjo izvedeno anketo s tem vprašanjem
            let iOdgovorMax = 0
            let maxOcena = 0
            for (let i = 0; i < vprasanje.odgovori.length; i++) {
                const odgovor = vprasanje.odgovori[i]
                if (odgovor.ocena > maxOcena) {
                    maxOcena = odgovor.ocena
                    iOdgovorMax = i
                }
            }
            this.ocena = vprasanje.odgovori[iOdgovorMax].ocena
            this.id = vprasanje.odgovori[iOdgovorMax].oseba_id
            await this.getOseba(vprasanje.odgovori[iOdgovorMax].oseba_id)
        },
        async getOseba(oseba_id) {
            const { data } = await axios.get(this.apiServer + '/api/osebe/' + oseba_id)
            this.ime = data.ime
            this.ime_srednje = data.ime_srednje
            this.priimek = data.priimek
            this.slika_uri = data.slika_uri
            this.slika_avtor = data.slika_avtor
            this.slika_vir = data.slika_vir
        }

    }
}
</script>

<style scoped>
.slika {
    -webkit-mask-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
    mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,1) 60%, rgba(0,0,0,0));
}

/* Ni mi uspelo podčrtati povezavo on hover */
.link-text {
    text-decoration: none;
}
.link-text:hover {
    text-decoration: underline;
}

.link-text:visited {
    text-decoration: underline;
}
</style>