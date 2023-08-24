<template>
    <div class="bubble yellow-gray">
        <div class="cell-container">
            <b>{{this.text}}</b>
        </div>
        <div class="cell-container img-cell-container">
            <div class="img-container">
                <img :src="this.image"/>
            </div>
        </div>
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
    text-align: center;
    font-size: 20px;
}

.bubble { /* tudi globalen razred */
    height: inherit;
    width: inherit;
    display: table; /* !!! */
}

.cell-container {
    display: table-row;
    height: 0;
}

.img-cell-container {
    height: auto;
}

.img-container {
    height: auto;
    width: 160px;
    /* display: flex;
    justify-content: center;
    align-items: center; */
}

img {
    max-height: 80px;
    max-width: 160px;
    margin-left: auto;
    margin-right: auto;
}
</style>