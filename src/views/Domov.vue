<template>
    <div :style="this.sidebar ? 'display: flex; flex-wrap: nowrap' : ''" class="odmik">
         <div style="max-width: 400px" :style="this.sidebar ? 'flex-grow: 1' : ''">
            <h3 style="text-align: center">Volitve v Državni zbor</h3>
            <DZ/>
        </div>
        <div :style="this.sidebar ? 'min-width: 400px; max-width: 400px' : ''">
            <ZadnjeAnkete :orientation="sidebar ? 'vertical' : 'horizontal'"/>
        </div>
    </div>
</template>

<script>
import ZadnjeAnkete from '../components/lists/ZadnjeAnkete.vue'
import DZ from '../components/charts/DZ.vue'

export default {
    name: 'Content',
    components: {
		ZadnjeAnkete,
        DZ
    },
    data() {
        return {
            sidebar: false,
        }
    },
    created() {
        window.addEventListener('resize', this.checkScreen) // brez () pri funkciji
        this.checkScreen() // požene tudi, ko se ustvari aplikacija, ne le ko event listener zazna spremembo velikosti zaslona
    },
    methods: {
        checkScreen() {
            this.windowWidth = window.innerWidth
            if (this.windowWidth <= 900) {
                this.sidebar = false
            } else {
                this.sidebar = true
            }
        }
    }
}
</script>

<style scoped>
</style>