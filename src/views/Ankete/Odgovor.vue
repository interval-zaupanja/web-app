<template>
    <span class="anchor-inner" :id="odgovor._id"></span>
    <div class="bubble bubble-list yellow-gray">
        <div :style="odgovor.odgovor_stranka_logo_uri != null ? 'height: 40px': ''">
            <!-- Procenti -->
            <div style="width: 40px; display: inline-block; text-align: right; vertical-align: top; height: 100%; margin-right: 15px">
                <div style="height: 100%; display: flex; flex-direction: column; justify-content: center;">
                    <div>
                        {{ odgovor.procent_izvajalec }}%
                        <span v-if="(odgovor.procent_zgornja_meja_izvajalec - odgovor.procent_spodnja_meja_izvajalec) > 0">
                            ± {{ (odgovor.procent_zgornja_meja_izvajalec - odgovor.procent_spodnja_meja_izvajalec) / 2 }}%
                            ({{ odgovor.procent_spodnja_meja_izvajalec }}% - {{ odgovor.procent_zgornja_meja_izvajalec }}%)
                        </span>
                    </div>
                </div>
            </div>

            <!-- Slika (logo stranke ali slika kandidata) -->
            <div v-if="odgovor.odgovor_stranka_logo_uri != null" style="display: inline-block; vertical-align: baseline; margin-right: 10px;">
                <img
                    :src="odgovor.odgovor_stranka_logo_uri" @click="$router.push('/stranke/' + odgovor.stranka_id)"
                    style="max-height: 40px; max-width: 160px; float: right; cursor: pointer;"
                    draggable="false"
                />
            </div>

            <!-- Odgovori -->
            <div style="display: inline-block; height: 100%; vertical-align: top;">
                <div style="height: 100%; display: flex; flex-direction: column; justify-content: center;">
                    <div>
                        <router-link v-if="odgovor.stranka_id" :to="'/stranke/' + odgovor.stranka_id">
                            {{ odgovor.odgovor_stranka_ime }}
                            <span v-if="odgovor.odgovor_stranka_ime_kratica != null"> ({{ odgovor.odgovor_stranka_ime_kratica}})</span>
                        </router-link>
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
                    </div>
                </div>
            </div>
           
            <div  v-if="!this.isTouchDevice()" style="display: inline-block; float: right;">
                <Report
                    :showOnHover="!this.isTouchDevice()"
                    tip="odgovor"
                    :id="odgovor._id"
                    :pot="'ankete/' + this.anketa_id + '#' + odgovor._id"
                />
                <CopyLink
                    :class="{'side-button': !this.isTouchDevice()}"
                    :path="'ankete/' + this.anketa_id + '#' + odgovor._id"
                    style="margin-left: 5px"
                />
            </div>
        </div>
        <div>
            <div v-if="odgovor.opis">Opis: {{ odgovor.opis}}</div>
            <div v-if="odgovor.opombe">Opombe: {{ odgovor.opombe}}</div>
        </div>
    </div>
</template>

<script>
import Report from '@/components/Report.vue'
import CopyLink from '../../components/CopyLink.vue'

export default {
    name: 'Odgovor',
    props: ['odgovor', 'anketa_id'],
    components: {
        Report,
        CopyLink
    },
}
</script>