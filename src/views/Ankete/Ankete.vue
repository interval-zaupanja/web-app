<template>
    <h1>Ankete</h1>
    <p>Ankete so razporejene od zadnje izvedene proti prvi, glede na sredino med začetkom in koncem izvajanja ankete</p>
    <SeznamAnket/>
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