<template>
    <div
        v-if="this.loaded"
        class="bubble"
        :style="'background-color: ' + this.barve.spekter_1"
        style="color: white; font-family: graphik; font-weight: 900; position: relative; padding: 0; overflow: hidden; cursor: pointer; display: flex; flex-direction: column;"
    >
        <div style="padding: 15px;">
            <router-link to="/priljubljenost" :style="'font-size:' + this.topTextFontSize + 'px; color: white;'">
                <span class="link-text">Na vrhu lestvice priljubljenosti</span><img height="20" style="position: relative; bottom: 3px" src="@/assets/icons/arrow-right.png" alt="">
            </router-link>
        </div>
        <div @click="$router.push('/osebe/' + this.id)" style="flex-grow: 1;">
            <div style="position: relative; height: 100%; width: 100%;">
                <!-- nujno position: relative, da se lahko otroci absolutno pozicionirajo znotraj tega vsebnika -->
                <img
                    :src="this.vrniLogoUri(this.slika_uri)"
                    style="height: 100%; max-width: 80%; bottom: 0; left: -50px; z-index: 4;"
                    :style="this.$parent.sideElements ? 'position: absolute': 'position: relative'"
                    class="slika"
                    draggable="false"
                >
                
                <div style="height: inherit; width: 100%"></div>
                <div :style="'position: absolute; top: 0; right: 0; text-align: right; font-size:' + this.NPnameFontSize + 'px; margin: 0 20px 20px 0; z-index: 3'">
                    <div><i>{{ this.ime.toUpperCase() }}</i></div>
                    <div><i>{{ this.ime_srednje.toUpperCase() }}</i></div>
                    <div><i>{{ this.priimek.toUpperCase() }}</i></div>
                </div>
                <div :style="'position: absolute; right: 0; bottom: 15px; max-width: 50%; margin: 0 30px 20px; text-align: right; line-height: ' + this.NPratingFontSize + 'px; font-size: ' + this.NPratingFontSize + 'px; z-index: 6'">
                    <i>{{ this.ocena.toLocaleString('sl-SI') }}</i>
                </div>
                </div>
            </div>
            <div
                v-if="this.slika_avtor && this.slika_vir"
                style="color: rgb(181, 181, 181); font-weight: normal; text-align: center; width: 70%; z-index: 5; position: absolute; bottom: 15px; left: 0;"
            >
                <span v-if="this.slika_avtor">{{ this.slika_avtor }}</span> <a v-if="this.slika_vir" :href="this.slika_vir">Vir</a>
            </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'NajboljPriljubljeni',
    props: ['topTextFontSize', 'NPnameFontSize', 'NPratingFontSize'],
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