<template>
    <div class="pink-red content-container" :class="this.edgeToEdge ? '' : 'bubble bubble-outer'">
        <h4 v-if="this.data.length == 1">Vzorec</h4>
        <h4 v-else-if="this.data.length == 2">Vzorca</h4>
        <h4 v-else>Vzorci</h4>
        <div v-for="vzorec in this.data" :key="vzorec._id" :class="this.data.length > 1 ? 'bubble bubble-list yellow-gray' : ''">
            <span v-if="vzorec.metode">
                <span v-if="vzorec.metode.length == 1">Metoda: </span>
                <span v-else-if="vzorec.metode.length == 2">Metodi: </span>
                <span v-else>Metode: </span>
                {{ vzorec.metode.join(', ') }}
                <br/>
            </span>
            <span v-if="vzorec.st_izbranih">Število izbranih: {{vzorec.st_izbranih}}<br/></span>
            <span v-if="vzorec.st_izbranih && vzorec.st_nedosegljivih">Izmed izbranih, število nedosegljivih: {{vzorec.st_nedosegljivih}}<br/></span>
            <span v-if="vzorec.st_noce_sodelovati">Izmed dosegljivih, število, ki jih ni hotelo sodelovati: {{vzorec.st_noce_sodelovati}}<br/></span>
            <span v-if="vzorec.st_ni_ustrezalo_vzorcnim_dolocilom">Izmed sodelujočih, število, ki jih ni ustrezalo vzorčnim določilom: {{vzorec.st_ni_ustrezalo_vzorcnim_dolocilom}}<br/></span>
            <span v-if="vzorec.st_sodelujocih &&
                (vzorec.st_izbranih || vzorec.st_nedosegljivih || vzorec.st_noce_sodelovati || vzorec.st_ni_ustrezalo_vzorcnim_dolocilom)">
                Število sodelujočih (velikost končnega vzorca oz. N): {{vzorec.st_sodelujocih}}
                <br/>
            </span>
            <span v-else-if="vzorec.st_sodelujocih">Velikost: {{vzorec.st_sodelujocih}}<br/></span>
            <span v-if="vzorec.starost">{{this.starost(vzorec.starost)}}</span> <span v-if="vzorec.tip">{{vzorec.tip}}</span> <span v-if="vzorec.jurisdikcija">{{this.jurisdikcija(vzorec.jurisdikcija)}}<br/></span>
            <span v-if="vzorec.reprezentativno">Reprezentativno po {{this.olepsaj(vzorec.reprezentativno)}}<br/></span>
            <span v-if="vzorec.utezeno">Uteženo po {{this.olepsaj(vzorec.utezeno)}}<br/></span>
            <!-- MANJKA PODPORA ZA PODVZORCE -->
            <span v-if="vzorec.opis">Opis: {{ vzorec.opis }}</span>
            <span v-if="vzorec.opombe">Opombe: {{ vzorec.opombe }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Vzorec',
    props: ['data', 'edgeToEdge'],
    mounted() {
        this.$parent.vzorecWrap()
    },
    methods: {
        starost(razpon) {
            var odgovor;
            switch (razpon) {
                case '18+':
                    odgovor = 'polnoletni'
            }

            return odgovor.at(0).toUpperCase() + odgovor.substring(1)
        },
        jurisdikcija(jurisdikcija) {
            switch (jurisdikcija) {
                case 'Slovenija':
                    return 'Slovenije'
            }
        },
        olepsaj(tabela) {
            for (let i = 0; i < tabela.length; i++) {
                switch (tabela[i]) {
                    case 'spol':
                        tabela[i] = 'spolu'
                        break;
                    case 'starost':
                        tabela[i] = 'starosti'
                        break;
                    case 'regija':
                        tabela[i] = 'regiji'
                        break;
                    case 'izobrazba':
                        tabela[i] = 'izobrazbi'
                        break;
                }
            }
            return tabela.slice(0, -1).join(', ') + " in " + tabela.slice(-1) 
        }
    }
}
</script>

<style scoped>
h4 {
    text-align: center;
}
</style>