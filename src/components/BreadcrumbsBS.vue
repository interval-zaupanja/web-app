<template>
    <nav aria-label="breadcrumb" style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <span class="breadcrumb-item-button active" @click="$router.push('/')">
                    <span class="icon">
                        <span class="material-symbols-outlined">
                            home
                        </span>
                    </span>
                </span>
            </li>
            <li class="breadcrumb-item">
                <span class="breadcrumb-item-button active" @click="$router.push(this.previousLink)">
                    {{this.previous}}
                </span>
            </li>
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

<style>
.breadcrumb {
    background-color: rgb(233, 233, 233) !important; 
    border-radius: 10px !important;
    padding: 7px !important;
}

.breadcrumb-item {
    overflow: auto;
    padding: 7px 0px;
}

.breadcrumb-item-button {
    padding: 7px;
    margin-top: 3px;
}

.breadcrumb-item-button:hover {
    background-color: #bd1e19;
    border-radius: 10px;
    color: white;
    cursor: pointer;
}

.breadcrumb-item-button.active {
    color: #bd1e19
}
.breadcrumb-item-button.active:hover {
    color: white
}

.material-symbols-outlined {
  display: inline-block;
  vertical-align: top; /* Optional: Align it vertically */
}
</style>