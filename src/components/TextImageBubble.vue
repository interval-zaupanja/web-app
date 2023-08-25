Dejansko imamo dva različna tipa mehurčka, saj se stilistična pravila spreminjajo glede na to, ali mehurček vsebuje sliko:
  - če je ne vsebuje, se text pozicionira na sredino mehurčka
  - če jo vsebuje, text zasede toliko prostora na vrhu, da se v celoti izpiše, preostali prostor pa zasede slika: posledično je text vedno na vrhu in le centriran, ni pa na sredini mehurčka

!!! THE IMAGES IN THE FIRST BUBBLE TYPE APPEAR ON TOP, LIKELY BECAUSE OF THE TABLE

<template>
    <div v-if="this.image && this.text" class="bubble yellow-gray">
        <div class="cell-container">
            <b>{{this.text}}</b>
        </div>
        <div v-if="this.image" class="img-cell-container">
            <img :src="this.image"/>
        </div>
    </div>
    <div v-else-if="this.text" class="bubble yellow-gray vertical-center">
        <b>{{this.text}}</b>
    </div>
    <div v-else class="bubble yellow-gray vertical-center">
        <img :src="this.image"/>
    </div>
</template>

<script>
export default {
    name: 'TextImageBubble',
    props: ['text', 'image']
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
    display: table; /* https://jsfiddle.net/Victornpb/S8g4E/783/ */
}

.vertical-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.cell-container {
    display: table-row;
    height: 0;
}

.img-cell-container {
    display: table-row;
    height: auto;
    position: relative;
}

.img-cell-container img { /* rešitev za centriranje znotraj div, ki ima dinamično generirano (auto) višino */
    position: absolute;
    z-index: 1;
    left: 0px;
}

img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* sliko bi lahko centrirali tudi z margin: auto, vendar ta deluje le na bločnih elementih, zato bi morali img pretvoriti v block */ 

/* slika v Safariju je čisto mimo */
/* Firefox slik sploh ne prikaže */
</style>