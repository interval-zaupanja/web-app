<template>
    <div class="container">
        <div v-for="item in this.items" :key="item._id" class="bubble-outer grid-bubble">
            <TextImageBubble :text="item.ime" :image="this.vrniLogoUri(item.logo_uri)" @click="$router.push(this.path + item._id)"/>
        </div>
    </div>
</template>

<script>
import TextImageBubble from '../../components/TextImageBubble.vue'

export default {
    name: 'BubbleGrid',
    props: ['items', 'path'],
    components: {
        TextImageBubble
    }
}
</script>

<style scoped>
.container {
    display: flex;
    /* justify-content: center; */
    /* justify-content: space-between; */
    /* justify-content: space-around; (manj prostora pri straneh) */
    /* justify-content: space-evenly; */
    flex-wrap: wrap;
    /* align-content se navezuje na wrap */
    /* align-content: space-evenly; */
}

.grid-bubble {
    /* display: inline-block; dejansko ni potrebno */
    height: 150px;
    width: 250px;
    vertical-align: top; /* popravek, da se vedno držijo vrha in (verjetno zaradi table znotraj TextImageBubble) ne splavajo stran od vrha */
}
</style>
