<template>
    <div v-if="this.loaded">
        <h3>Odgovori</h3>
        <div v-for="odgovor in this.odgovori" :key="odgovor._id" class="bubble bubble-list yellow-gray">
            <span class="anchor-inner" :id="odgovor._id"></span>
            <div>
                <span style="float: right">
                    <div v-if="odgovor.odgovor_stranka_logo_uri != null">
                        <img :src="odgovor.odgovor_stranka_logo_uri" @click="$router.push('/stranke/' + odgovor.stranka_id)" style="max-height: 40px; max-width: 160px; float: right"/>
                    </div>
                    <div style="float: right; display: block; margin-top: 10px;">
                        <Report tip="odgovor" :id="odgovor._id" :pot="'ankete/' + this.id + '#' + odgovor._id"/>
                        <CopyLink :path="'ankete/' + this.id + '#' + odgovor._id" class="side-button"/>
                    </div>
                </span>
                <div>
                    <div class="odgovor">
                        Odgovor:
                        <span v-if="odgovor.stranka_id">
                            <router-link :to="'/stranke/' + odgovor.stranka_id">
                                {{ odgovor.odgovor_stranka_ime }}
                                <span v-if="odgovor.odgovor_stranka_ime_kratica != null"> ({{ odgovor.odgovor_stranka_ime_kratica}})</span>
                            </router-link>
                        </span>
                        <span v-else>
                            {{
                                this.capitalization(odgovor.odgovor, 0) ??
                                this.vrniOdgovor(
                                    odgovor.odgovor_std ??
                                    odgovor.opredeljen_tip ??
                                    odgovor.tip,
                                    false, 0
                                ) ??
                                this.capitalization(odgovor.odgovor, 0)
                            }}
                        </span>
                    </div>
                    <div class="procenti">
                        {{ odgovor.procent_izvajalec }}%
                        <span v-if="(odgovor.procent_zgornja_meja_izvajalec - odgovor.procent_spodnja_meja_izvajalec) > 0">
                            ± {{ (odgovor.procent_zgornja_meja_izvajalec - odgovor.procent_spodnja_meja_izvajalec) / 2 }}%
                            ({{ odgovor.procent_spodnja_meja_izvajalec }}% - {{ odgovor.procent_zgornja_meja_izvajalec }}%)
                        </span>
                    </div>
                    <div v-if="odgovor.opis">Opis: {{ odgovor.opis}}</div>
                    <div v-if="odgovor.opombe">Opombe: {{ odgovor.opombe}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Report from '@/components/Report.vue'
import CopyLink from '../../components/CopyLink.vue'

export default {
    name: 'Odgovori',
    props: ['odgovori', 'id', 'loaded'],
    components: {
        Report,
        CopyLink
    }
}
</script>