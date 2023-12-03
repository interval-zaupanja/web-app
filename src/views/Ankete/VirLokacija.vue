<template>
    <div class="bubble bubble-list yellow-gray">
        <span class="anchor-inner" :id="'vir-' + this.virIndex + '_lokacija-' + this.lokacijaIndex"></span>
        <div>
            <div
                :id="'vir-' + this.virIndex + '_lokacija-' + this.lokacijaIndex + '_container'"
                style="display: flex; flex-wrap: wrap;"
            >
                <!-- <CopyLink :path="'ankete/' + this.id + '#' + this.data._id" class="side-button"/> -->
                <div
                    :id="'vir-' + this.virIndex + '_lokacija-' + this.lokacijaIndex + '_info-main'"
                    style="display: inline-block; margin-right: 10px;"
                    :style="this.externalLinkWrapped ? ' margin-bottom: 10px' : ''"
                >
                    <p style="margin: 0px">Tip: {{this.data.tip}}</p>
                    <p v-if="this.data.datum_in_cas_objave" style="margin: 0px">Objavljeno
                        {{new Date(this.data.datum_in_cas_objave).toLocaleDateString('en-GB')}}
                        ob
                        {{new Date(this.data.datum_in_cas_objave).toLocaleTimeString('en-GB', { timeStyle: 'short' })}}
                    </p>
                </div>
                <div
                    :id="'vir-' + this.virIndex + '_lokacija-' + this.lokacijaIndex + '_external-link'"
                    v-if="this.data.uri"
                    style="display: inline-block; flex-grow: 1;"
                >
                    <div
                        style="float: right;"
                        :style="this.externalLinkWrapped ? 'width: 100%;' : ''"
                    >
                        <ExternalLink
                            :link="this.data.uri"
                            label="Odpri spletno stran"
                        />
                    </div>
                </div>
            </div>
            <div v-if="this.data.opis || this.data.opombe" :style="this.externalLinkWrapped && this.data.uri ? 'width: 100%; margin-top: 10px' : ''">
                <p v-if="this.data.opis">Opis: {{this.data.opis}}</p>
                <p v-if="this.data.opombe">Opombe: {{this.data.opombe}}</p>
            </div>
        </div>
        
    </div>
</template>

<script>
import ExternalLink from '@/components/ExternalLink.vue'

export default {
    name: 'VirLokacija',
    props: ['data', 'virIndex', 'lokacijaIndex'],
    components: {
        ExternalLink
    },
    data() {
        return {
            externalLinkWrapped: false
        }
    },
    created() {
        window.addEventListener('resize', this.externalLinkWrap)
    },
    mounted() {
        this.externalLinkWrap()
    },
    unmounted() {
        window.removeEventListener('resize', this.externalLinkWrap)
    },
    methods: {
        externalLinkWrap() {
            if (this.data.uri) {
                let infoMain = document.getElementById('vir-' + this.virIndex + '_lokacija-' + this.lokacijaIndex + '_info-main')
                let externalLink = document.getElementById('vir-' + this.virIndex + '_lokacija-' + this.lokacijaIndex + '_external-link')

                if (externalLink.offsetTop > infoMain.offsetTop) {
                    this.externalLinkWrapped = true
                } else {
                    this.externalLinkWrapped = false
                }
            }
        },
    }
}
</script>

<style scoped>
p {
    margin: 0px
}

.btn, .btn:hover, .btn:active, .btn:visited, .btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:visited {
    background-color: #ae1813 !important;
    border-color: #ae1813 !important;
    color: white;
}
</style>