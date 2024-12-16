<template>
    <div>
        <div :class="this.edge_to_edge ? 'yellow-gray edge-to-edge' : ''">
            <h3 style="text-align: center" class="odmik">Katero stranko bi volivci volili?</h3>
            <div :class="{ 'odmik' : !this.edge_to_edge, 'odmik2': this.screenWidth < 800 && !this.edge_to_edge }">
                <DZ :bubble="!this.edge_to_edge"/>
            </div>
        </div>
        <div style="margin: 15px 0">
            <ZadnjeAnkete/>
        </div>
        <div class="odmik" >
            <div :class="this.sideElements ? 'side-elements' : 'list-elements'" style="max-width: 1000px; margin-left: auto; margin-right: auto;">
                <div id="najboljPriljubljeniContainer"> <!-- dodatni divi zato, da se širina lahko razdeli le z width: 50% -->
                    <NajboljPriljubljeni
                        :topTextFontSize="this.topTextFontSize"
                        :NPratingFontSize="this.NPratingFontSize"
                        :NPnameFontSize="this.NPnameFontSize"
                    />
                </div>
                <div id="aktualnoGlasovanjeContainer">
                    <AktualnoGlasovanje
                        :topTextFontSize="this.topTextFontSize"
                        :NGmainTextFontSize="this.NGmainTextFontSize"
                        :NGDateFontSize="this.NGDateFontSize"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ZadnjeAnkete from '../components/lists/ZadnjeAnkete.vue'
import DZ from '../components/charts/DZ.vue'
import NajboljPriljubljeni from '@/components/NajboljPriljubljeni.vue'
import AktualnoGlasovanje from '@/components/AktualnoGlasovanje.vue'

export default {
    name: 'Domov',
    components: {
		ZadnjeAnkete,
        DZ,
        NajboljPriljubljeni,
        AktualnoGlasovanje
    },
    data() {
        return {
            edge_to_edge: false,
            screenWidth: 0,
            sideElements: true,
            topTextFontSize: 25,
            NPratingFontSize: 100,
            NPnameFontSize: 55,
            NGmainTextFontSize: 45,
            NGDateFontSize: 35
        }
    },
    created() {
        window.addEventListener('resize', this.checkScreen) // brez () pri funkciji
        this.checkScreen() // požene tudi, ko se ustvari aplikacija, ne le ko event listener zazna spremembo velikosti zaslona
    },
    methods: {
        checkScreen() {
            var windowWidth = window.innerWidth
            this.screenWidth = windowWidth

            if (windowWidth <= 600) {
                this.edge_to_edge = true
            } else {
                this.edge_to_edge = false
            }

            if (windowWidth < 1000) {
                this.sideElements = false
            } else {
                this.sideElements = true
            }

            if (windowWidth > 1250) {
                this.topTextFontSize = 25
                this.NPratingFontSize = 100
                this.NPnameFontSize = 55
                this.NGmainTextFontSize = 45
                this.NGDateFontSize = 35
            } else if (windowWidth > 1150) {
                this.topTextFontSize = 23
                this.NPratingFontSize = 80
                this.NPnameFontSize = 50
                this.NGmainTextFontSize = 40
                this.NGDateFontSize = 32
            } else if (windowWidth > 1050) {
                this.topTextFontSize = 23
                this.NPratingFontSize = 60
                this.NPnameFontSize = 45
                this.NGmainTextFontSize = 35
                this.NGDateFontSize = 30
            } else if (windowWidth > 1000) {
                this.topTextFontSize = 20
                this.NPratingFontSize = 55
                this.NPnameFontSize = 45
                this.NGmainTextFontSize = 25
                this.NGDateFontSize = 25
            } else if (windowWidth > 900) {
                this.topTextFontSize = 30
                this.NPratingFontSize = 130
                this.NPnameFontSize = 85
                this.NGmainTextFontSize = 40
                this.NGDateFontSize = 35
            } else if (windowWidth > 800) {
                this.topTextFontSize = 25
                this.NPratingFontSize = 120
                this.NPnameFontSize = 75
                this.NGmainTextFontSize = 40
                this.NGDateFontSize = 35
            } else if (windowWidth > 700) {
                this.topTextFontSize = 25
                this.NPratingFontSize = 110
                this.NPnameFontSize = 65
                this.NGmainTextFontSize = 40
                this.NGDateFontSize = 35
            } else if (windowWidth > 600) {
                this.topTextFontSize = 25
                this.NPratingFontSize = 90
                this.NPnameFontSize = 55
                this.NGmainTextFontSize = 35
                this.NGDateFontSize = 30
            } else if (windowWidth > 500) {
                this.topTextFontSize = 20
                this.NPratingFontSize = 70
                this.NPnameFontSize = 45
                this.NGmainTextFontSize = 30
                this.NGDateFontSize = 25
            } else if (windowWidth > 400) {
                this.topTextFontSize = 15
                this.NPratingFontSize = 60
                this.NPnameFontSize = 35
                this.NGmainTextFontSize = 25
                this.NGDateFontSize = 20
            } else if (windowWidth > 300) {
                this.topTextFontSize = 11
                this.NPratingFontSize = 40
                this.NPnameFontSize = 20
                this.NGmainTextFontSize = 25
                this.NGDateFontSize = 20
            }
        },
    }
}
</script>

<style scoped>
.edge-to-edge {
    padding: 15px 0;
}

#aktualnoGlasovanjeContainer, #najboljPriljubljeniContainer {
    padding: 15px;
}

.side-elements {
    display: flex;
    flex-wrap: nowrap;
}

.side-elements #aktualnoGlasovanjeContainer, .side-elements #najboljPriljubljeniContainer {
    width: 50%;
    aspect-ratio: 1 / 1;
}

.side-elements > div > div {
    height: 100%
}

.list-elements #aktualnoGlasovanjeContainer {
    height: 400px;
}
</style>