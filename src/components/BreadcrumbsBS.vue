<template>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Domov</a></li>
            <li class="breadcrumb-item"><a :href="this.previousLink">{{this.previous}}</a></li>
            <li class="breadcrumb-item active" aria-current="page" v-if="current">{{this.current}}</li>
        </ol>
    </nav>
</template>

<script>
export default {
    name: 'Breadcrumbs',
    props: ['previous', 'previousLink', 'current']
}
</script>
