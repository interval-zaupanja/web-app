<template>
    <h1 class="odmik">Ankete</h1>
    <p class="odmik">Ankete so razporejene od zadnje izvedene proti prvi, glede na sredino med začetkom in koncem izvajanja ankete</p>
    <br>
    <div :class="this.ozek_zaslon ? 'odmik3' : 'odmik'">
        <SeznamAnket/>
    </div>
</template>

<script>
import SeznamAnket from '@/components/lists/SeznamAnket.vue'

export default {
	name: "ZadnjeAnkete",
	components: {
        SeznamAnket
    },
    data() {
        return {
            ozek_zaslon: false
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
                this.ozek_zaslon = true
            } else {
                this.ozek_zaslon = false
            }
        }
    }
}
</script>  