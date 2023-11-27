<template>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <router-link to="/">
                    Domov
                </router-link>
            </li>
            <li class="breadcrumb-item"><router-link :to="this.previousLink">{{this.previous}}</router-link></li>
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