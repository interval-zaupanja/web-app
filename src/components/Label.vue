<template>
    <div v-if="tip === 'narocnik'" class="narocnik">NAROČNIK ANKETE</div>
    <div v-if="tip === 'izvajalec'" class="izvajalec">IZVAJALEC ANKETE</div>
</template>

<script>
export default {
    name: 'Label',
    props: ['tip']
}
</script>

<style scoped>
div {
    display: inline-block;

    font-size: 12px;
    padding: 5px 10px;
    margin: 0px 10px;
    border-radius: 10px;
}
.narocnik {
    background-color: crimson;
    color: white;
}

.izvajalec {
    background-color:rgb(227, 125, 0);
    color: white;
}
</style>