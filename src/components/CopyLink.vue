<template>
    <button type="button" @click="copyURL()" id="tt"
        data-bs-toggle="tooltip" data-bs-placement="top"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Kopiraj povezavo"
    >
        <img src="https://icon-library.com/images/copy-link-icon/copy-link-icon-3.jpg"/>
    </button>
</template>

<script>
import { Tooltip } from 'bootstrap' // ???

export default {
    name: 'CopyLink',
    props: [ "path"],
    methods: {
        copyURL() {
            const url = 'http://localhost:8080' + this.path;
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
img, button {
    float: right;
}

img {
    height: 15px;
}

button {
    padding: 5px;

    background-color: transparent;

    border: 2px solid black;
    border-radius: 5px;
}
</style>