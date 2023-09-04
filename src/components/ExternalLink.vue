<template>
    <a :href="this.link" target="_blank" class="btn btn-primary" rel="noopener">
        {{ this.label }}
        <span class="material-symbols-outlined">open_in_new</span>
    </a>
</template>

<script>
export default {
    name: 'ExternalLink',
    props: ['link', 'label', 'color']
}
</script>


<style scoped>
a {
    float: right;
    width: 100%;
}
</style>