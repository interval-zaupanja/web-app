<template>
    <span class="anchor-inner" :id="odgovor._id"></span>
    <div>
        <div style="display: inline-block; margin-right: 10px">
            <ExpandCollapse
                :razsiri="this.razsiri"
                @click="this.razsiri = !this.razsiri"
                style="display: block; margin-bottom: 10px;"
            />
            <CopyLink
                v-if="this.razsiri"
                :path="'ankete/' + this.anketa_id + '#' + odgovor._id"
                style="display: block; margin-bottom: 10px;"
            />
            <Report
                v-if="this.razsiri"
                tip="odgovor"
                :id="odgovor._id"
                :pot="'ankete/' + this.anketa_id + '#' + odgovor._id"
                style="display: block"
            />
        </div>
        <div class="odgovor" style="display: inline-block; vertical-align: top;">
            <div>
                <div class="procenti" style="display: inline-block;">
                    {{ odgovor.procent_izvajalec }}%
                    <span v-if="(odgovor.procent_zgornja_meja_izvajalec - odgovor.procent_spodnja_meja_izvajalec) > 0">
                        ± {{ (odgovor.procent_zgornja_meja_izvajalec - odgovor.procent_spodnja_meja_izvajalec) / 2 }}%
                        ({{ odgovor.procent_spodnja_meja_izvajalec }}% - {{ odgovor.procent_zgornja_meja_izvajalec }}%)
                    </span>
                </div>
                <span v-if="odgovor.stranka_id">
                    <router-link :to="'/stranke/' + odgovor.stranka_id">
                        {{ odgovor.odgovor_stranka_ime }}
                        <span v-if="odgovor.odgovor_stranka_ime_kratica != null"> ({{ odgovor.odgovor_stranka_ime_kratica}})</span>
                    </router-link>
                </span>
                <span v-else>
                    {{
                        this.capitalization(odgovor.odgovor, 1) ??
                        this.vrniOdgovor(
                            odgovor.odgovor_std ??
                            odgovor.opredeljen_tip ??
                            odgovor.tip,
                            false, 1
                        ) ??
                        this.capitalization(odgovor.odgovor, 1)
                    }}
                </span>
                <span
                    v-if="
                        (odgovor.opis || odgovor.opombe)
                        && this.razsiri == false"
                    style="text-align: center; margin-left: 15px"
                >
                    ...
                </span>
            </div>
            <div v-if="this.razsiri">
                <div v-if="odgovor.opis">Opis: {{ odgovor.opis}}</div>
                <div v-if="odgovor.opombe">Opombe: {{ odgovor.opombe}}</div>
            </div>
        </div>
        <div v-if="odgovor.odgovor_stranka_logo_uri != null" style="display: inline-block; float: right; vertical-align: top">
            <img :src="odgovor.odgovor_stranka_logo_uri" @click="$router.push('/stranke/' + odgovor.stranka_id)" style="max-height: 40px; max-width: 160px; float: right"/>
        </div>
    </div>
</template>

<script>
import Report from '@/components/Report.vue'
import CopyLink from '../../components/CopyLink.vue'
import ExpandCollapse from '@/components/ExpandCollapse.vue'

export default {
    name: 'Odgovor',
    props: ['odgovor', 'anketa_id', 'razsiriOdgovor'],
    components: {
        Report,
        CopyLink,
        ExpandCollapse
    },
    data() {
        return {
            razsiri: this.razsiriOdgovor
        }
    }
}
</script>

<style>
.procenti {
    width: 60px;
}
</style>