<template>
    <h1 class="odmik">Ankete</h1>
    <p class="odmik">Ankete so razporejene od zadnje izvedene proti prvi, glede na sredino med začetkom in koncem izvajanja ankete</p>
    <div class="odmik">
        <SeznamAnket/>
    </div>
</template>

<script>
import SeznamAnket from '@/components/lists/SeznamAnket.vue'

export default {
	name: "ZadnjeAnkete",
	components: {
        SeznamAnket
    }
}
</script>  