<template>
    <button type="button" @click="copyURL()"
        data-bs-toggle="tooltip" data-bs-placement="top"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Kopiraj povezavo"
    >
        <img src="https://icon-library.com/images/copy-link-icon/copy-link-icon-3.jpg"/>
    </button>
</template>

<script>
import { Tooltip } from 'bootstrap'

export default {
    name: 'CopyLink',
    props: [ "path"],
    methods: {
        copyURL() {
            const url = window.location.origin + process.env.BASE_URL + this.path;
            navigator.clipboard.writeText(url);
        }
    },
    mounted() {
        new Tooltip(document.body, {
            selector: "[data-bs-toggle='tooltip']",
        })
    }
}
</script>

<style scoped>
img {
    height: 15px;
    float: right; /* to sicer popravi poravnavo, vendar ne vem točno zakaj */
}

button {
    height: 30px;
    width: 30px;
    padding: 5px;

    background-color: transparent;

    border: 2px solid black;
    border-radius: 5px;
}
</style>