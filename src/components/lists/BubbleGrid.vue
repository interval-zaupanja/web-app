<template>
    <div class="container">
        <div v-for="item in this.items" :key="item._id" class="bubble-outer grid-bubble">
            <TextImageBubble :text="this.text(item.ime, item.ime_kratica)" :image="this.vrniLogoUri(item.logo_uri)" @click="$router.push(this.path + item._id)"/>
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
    },
    methods: {
        text(ime, ime_kratica) {
            if (ime_kratica) {
                return ime + " (" + ime_kratica + ")"
            } else {
                return ime
            }
        }
    }
}
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.grid-bubble {
    display: inline-block;
    height: 150px;
    width: 250px;
    vertical-align: top; /* popravek, da se vedno držijo vrha in (verjetno zaradi table znotraj TextImageBubble) ne splavajo stran od vrha */
}
</style>
