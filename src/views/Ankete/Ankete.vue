<template>
    <h1>Ankete</h1>
    <p>Ankete so razporejene od zadnje izvedene naprej.</p>
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