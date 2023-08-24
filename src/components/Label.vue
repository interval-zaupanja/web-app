<template>
    <span v-if="tip === 'narocnik'" class="narocnik">NAROČNIK ANKETE</span>
    <span v-if="tip === 'izvajalec'" class="izvajalec">IZVAJALEC ANKETE</span>
</template>

<script>
export default {
    name: 'Label',
    props: ['tip']
}
</script>

<style scoped>
span {
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