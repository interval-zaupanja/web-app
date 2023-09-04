<template>
    <div>
        <h3>Odgovori</h3>
        <div v-for="odgovor in this.odgovori" :key="odgovor._id" class="bubble bubble-list yellow-gray">
            <span class="anchor-inner" :id="odgovor._id"></span>
            <div>
                <div style="float: right">
                    <div>
                        <CopyLink :path="'/ankete/' + this.id + '#' + odgovor._id" class="side-button"/>
                    </div>
                    <div v-if="odgovor.odgovor_stranka_logo_uri != null" style="float: right">
                        <a :href="'/stranke/' + odgovor.stranka_id">
                            <img :src="odgovor.odgovor_stranka_logo_uri" style="max-height: 40px; max-width: 160px; margin-top: 10px"/>
                        </a>
                    </div>
                </div>
                <div>
                    <span>
                        <span v-if="odgovor.stranka_id">
                            <p>
                                Odgovor:
                                <a :href="'/stranke/' + odgovor.stranka_id">
                                    {{ odgovor.odgovor_stranka_ime }}
                                    <span v-if="odgovor.odgovor_stranka_ime_kratica != null"> ({{ odgovor.odgovor_stranka_ime_kratica}})</span>
                                </a>
                            </p>
                        </span>
                        <span v-if="odgovor.odgovor || odgovor.odgovor_std">
                            Odgovor: {{ this.vrniOdgovor(odgovor.odgovor ?? odgovor.odgovor_std, true, 1) }}
                        </span>
                    </span>
                    <p>Tip odgovora: {{ this.vrniOdgovor(odgovor.tip, true, 0)}}</p>
                    <p>
                        {{ odgovor.procent_izvajalec }}%
                        <span v-if="(odgovor.procent_zgornja_meja_izvajalec - odgovor.procent_spodnja_meja_izvajalec) > 0">
                            ± {{ (odgovor.procent_zgornja_meja_izvajalec - odgovor.procent_spodnja_meja_izvajalec) / 2 }}%
                            ({{ odgovor.procent_spodnja_meja_izvajalec }}% - {{ odgovor.procent_zgornja_meja_izvajalec }}%)
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CopyLink from '../../components/CopyLink.vue'

export default {
    name: 'Odgovori',
    props: ['odgovori', 'id'],
    components: {
        CopyLink
    }
}
</script>