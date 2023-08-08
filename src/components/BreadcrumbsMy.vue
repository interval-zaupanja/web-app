<template>
    <h2>
        <router-link :to="this.previousLink">{{this.previous}}</router-link>
        ⏵
        {{this.current}}
    </h2>
</template>

<script>
export default {
    name: 'Breadcrumbs',
    props: ['previous', 'previousLink', 'current']
}
</script>