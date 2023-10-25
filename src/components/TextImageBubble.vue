Dejansko imamo dva različna tipa mehurčka, saj se stilistična pravila spreminjajo glede na to, ali mehurček vsebuje sliko:
  - če je ne vsebuje, se text pozicionira na sredino mehurčka
  - če jo vsebuje, text zasede toliko prostora na vrhu, da se v celoti izpiše, preostali prostor pa zasede slika: posledično je text vedno na vrhu in le centriran, ni pa na sredini mehurčka

<template>
    <div class="bubble yellow-gray" v-if="this.image" :style="this.stick_to_bottom ? 'padding-bottom: 0px' : ''">
        <div v-if="this.text">
            <b>{{ this.text }}</b>
        </div>
        <div v-if="this.image" class="preostali-prostor vsebnik-slike" :style="this.stick_to_bottom ? 'padding-bottom: 0px; justify-content: end' : ''">
            <img :src="this.image"/> 
        </div>
    </div>
    <div v-else class="bubble yellow-gray" style="justify-content: center;">
        <b>{{ this.text }}</b>
    </div>
</template>

<script>
export default {
    name: 'TextImageBubble',
    props: ['text', 'image', "stick_to_bottom"],
    mounted() {
console.log(this.stick_to_bottom)

    }
}
</script>

<style scoped>
/* bubble-outer mora biti nastavljen na najvišji ravni (izven komponente), sicer inherit povzroča overflow iz div */

* {
    text-align: center; /* horizontalno centrira tudi sliko, če se nahaja v bločnem vsebniku (div) */
    font-size: 20px;
}

.bubble { /* tudi globalen razred */
    height: inherit;
    width: inherit;

    /* to bi lahko bilo tudi v div pod div s tem razredom, vendar ni potrebno */
    display: flex;
    flex-direction: column;
}

.preostali-prostor {
    flex-grow: 1; /* poskrbi, da se ta div višinsko razširi na ves prostor, ki mu preostane */
    min-height: 0; /* prepreči overflow tega div čez prostor starša */

    padding: 15px; /* dodaten prostor, da je slika bolj odmaknjena od robov */
}

.vsebnik-slike { /* ta razred bi bil lahko tudi v ločenem div, vendar deluje tudi skupaj z razredom preostali-prostor */
    height: 100%;
    width: 100%;
    
    display: flex;
    flex-direction: column;
    justify-content: center;
}

img {
    object-fit: contain; /* preprečuje, raztegovanje slike */
    min-height: 0; /* preprečuje overflow čez starševski div */
}
</style>