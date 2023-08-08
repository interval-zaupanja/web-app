<template>
    <button @click="copyURL()">
        <img src="https://icon-library.com/images/copy-link-icon/copy-link-icon-3.jpg"/>
    </button>
</template>

<script>
export default {
    name: 'CopyLink',
    props: [ "path"],
    methods: {
        copyURL() {
            const url = 'http://localhost:8080' + this.path;
            navigator.clipboard.writeText(url);
        }
    }
}
</script>

<style scoped>
img, button {
    height: 15px;
    float: right;
}

button {
    padding: 5px;
    border: 2px solid black;
    border-radius: 5px;
}
</style>
