Tooltips začasno ugasnjeni, ker se ne skrivajo pravilno, zato je začasno odstranjeno (za vsak gumb posebej):
data-bs-title="Razširi"
:ref="this.id + '_2'"
@click="bootstrap.Tooltip(this.$refs[this.id + '_2']).hide()"

<template>
    <div style="display: inline-block;">
        <button
            v-if="this.razsiri == true"
            type="button"
            data-bs-toggle="tooltip1"
            data-bs-placement="top"
            data-bs-custom-class="custom-tooltip"
        >
            <img src="https://img.icons8.com/ios-filled/100/collapse-arrow.png" alt="collapse-arrow"/>
        </button>
        <button
            v-if="this.razsiri == false"
            type="button"
            data-bs-toggle="tooltip2"
            data-bs-placement="top"
            data-bs-custom-class="custom-tooltip"
        >
            <img src="https://img.icons8.com/ios-filled/50/expand-arrow--v1.png" alt="expand-arrow--v1"/>
        </button>
    </div>
</template>

<script>
import { Tooltip } from 'bootstrap'

export default {
    name: 'ExpandCollapse',
    props: ['razsiri'],
    mounted() {
        this.tooltip1 = new Tooltip(document.body, {
            selector: "[data-bs-toggle='tooltip1']"
        })

        this.tooltip2 = new Tooltip(document.body, {
            selector: "[data-bs-toggle='tooltip2']"
        })
    },
    data() {
        return {
            tooltip1: null,
            tooltip2: null
        }
    }
}
</script>

<style scoped>
img {
    height: 15px;
    float: right; /* ne vem, zakaj to popravi */
}

button {
    height: 30px;
    width: 30px;
    padding: 5px;

    background-color: transparent;

    border: 2px solid black;
    border-radius: 5px; 
}
</style>