<template>
    <div>
        <div :class="this.edge_to_edge ? 'yellow-gray edge-to-edge' : ''">
            <h3 style="text-align: center" class="odmik" >Katero stranko bi volili?</h3>
            <DZ style="max-width: 800px; margin-left: auto; margin-right: auto;" :bubble="this.edge_to_edge"/>
        </div>
        <div style="margin: 15px 0">
            <ZadnjeAnkete/>
        </div>
        <div class="odmik">
            <NajboljPriljubljeni/>
            <NaslednjeGlasovanje/>
        </div>
    </div>
</template>

<script>
import ZadnjeAnkete from '../components/lists/ZadnjeAnkete.vue'
import DZ from '../components/charts/DZ.vue'
import NajboljPriljubljeni from '@/components/NajboljPriljubljeni.vue'
import NaslednjeGlasovanje from '@/components/NaslednjeGlasovanje.vue'

export default {
    name: 'Domov',
    components: {
		ZadnjeAnkete,
        DZ,
        NajboljPriljubljeni,
        NaslednjeGlasovanje
    },
    data() {
        return {
            edge_to_edge: false
        }
    },
    created() {
        window.addEventListener('resize', this.checkScreen) // brez () pri funkciji
        this.checkScreen() // požene tudi, ko se ustvari aplikacija, ne le ko event listener zazna spremembo velikosti zaslona
    },
    methods: {
        checkScreen() {
            var windowWidth = window.innerWidth
            if (windowWidth <= 600) {
                this.edge_to_edge = true
            } else {
                this.edge_to_edge = false
            }
        }
    }
}
</script>

<style scoped>
.edge-to-edge {
    padding: 15px 0;
}
</style>