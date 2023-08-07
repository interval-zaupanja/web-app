<template>
    <a :href="'http://localhost:8080' + path">
        <img src="https://icon-library.com/images/copy-link-icon/copy-link-icon-3.jpg"/>
    </a>
</template>

<script>
export default {
    name: 'CopyLink',
    props: [ "path"]
}
</script>

<style scoped>
img, a {
    height: 15px;
    float: right;
}

a {
    padding: 5px;
    border: 2px solid black;
    border-radius: 5px;
}
</style>
