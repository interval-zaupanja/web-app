<template>
    <div v-if="this.data.datasets.length > 0" style="height: 100%; min-height: 400px; max-width: 100%">
        <Scatter
            v-if="loaded"
            :options="options"
            :plugins="plugins"
            :data="data"
            style="max-height: 400px"
        />
        <div v-if="!loaded">
            <Nalaganje size="medium"/>
        </div>
        <div v-if="loaded" style="display: flex; justify-content: center; align-items: center; margin: 15px">
            <div class="bubble bubble-inner yellow-gray">
                <div>
                    <div style="display: inline-block; margin-right: 20px">
                        Vključi v graf in preračunaj:
                    </div>
                    <div style="display: inline-block">
                        <div class="form-check form-switch form-check-inline">
                            <input class="form-check-input" type="checkbox" id="prikaziNV" v-model="this.prikazi.NV"
                            @change="this.render()">
                            <label class="form-check-label" for="prikaziNV">Ne vem</label>
                        </div>
                        <div class="form-check form-switch form-check-inline">
                            <input class="form-check-input" type="checkbox" id="prikaziNSO" v-model="this.prikazi.NSO"
                            @change="this.render()">
                            <label class="form-check-label" for="prikaziNSO">Ne povem</label>
                        </div>
                        <div class="form-check form-switch form-check-inline">
                            <input class="form-check-input" type="checkbox" id="prikaziNBG" v-model="this.prikazi.NBG"
                            @change="this.render()">
                            <label class="form-check-label" for="prikaziNBG">Ne bom glasoval</label>
                        </div>
                    </div>
                </div>
                <div class="caption" style="text-align: center">
                    Če želite nekatere odgovore le skriti (odgovori se ne preračunajo), jih kliknite v legendi
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import 'chartjs-adapter-date-fns'; // moment alternative (TEMPORARY!!!)

import Nalaganje from '@/components/Nalaganje.vue'

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
  Filler // potrebno, da deluje (in ne skrije linije) tension (glej https://stackoverflow.com/questions/74656851/unable-to-use-line-tension-for-scatter-chart-with-showline-enabled)
} from "chart.js";
import { Scatter } from "vue-chartjs";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,  
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

export default {
    name: 'Referendum',
    components: {
        Scatter,
        Nalaganje
    },
    props: ['glasovanje_id', 'pg_zacetek', 'pg_konec', 'gg', 'izid'],
    data() {
        return {
            type: 'scatter',
            fullData: { // vsi podatki pridobljeni s strežnika
                datasets: []
            },
            data: { // podatki, ki se dejansko uporabijo v grafu
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { // pokaže se skupni tooltip za vse y vrednosti pri določenem x (začasna rešitev)
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        position: 'bottom',
                        offset: true,
                        gridLines: {
                            offsetGridLines: false,
                            display: true,
                        }
                    },
                    y: {
                        ticks: {
                            callback: function (value) {
                                return value + "%"
                            }
                        },
                        offset: true,
                        gridLines: {
                            offsetGridLines: false,
                            display: true,
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        filter: function (tooltipItem) {
                            if (tooltipItem.dataset.label.endsWith('_scatter')) {
                                return false
                            } else {
                                return true
                            }
                        }
                    },
                    legend: {
                        onClick: function (e, legendItem, legend) {
                            const index = legendItem.datasetIndex;
                            // Delovanje funkcije se zanaša na dejstvo, da imamo dve zrcalni verziji (ena za linijo, ena za točke) elementov v datasets:
                            // zrcalni kopiji sta si narazen za tolikor kot je elementov v legendi
                            const legendaDolzina = legend.chart.legend.legendItems.length
                            const ci = legend.chart;
                            if (ci.isDatasetVisible(index)) {
                                ci.hide(index)
                                ci.hide(index - legendaDolzina)
                                legendItem.hidden = true;
                            } else {
                                ci.show(index)
                                ci.show(index - legendaDolzina)
                                legendItem.hidden = false;
                            }
                        }, 
                        labels: {
                            filter: function(item) {
                                return !item.text.endsWith('_scatter')
                            }
                        },
                        
                    },
                    autocolors: false,
                    annotation: {
                        annotations: {
                            pg_zacetek: {
                                type: "line",
                                xMin: moment(this.pg_zacetek, "YYYY-MM-DD").format("YYYY-MM-DD"),
                                xMax: moment(this.pg_zacetek, "YYYY-MM-DD").format("YYYY-MM-DD"),
                                borderDash: [6, 6],
                                borderDashOffset: 0,
                                borderColor: "grey",
                                borderWidth: 2,
                                label: {
                                    display: true,
                                    content: "Začetek predčasnega glasovanja",
                                    color: "grey",
                                    backgroundColor: "rgba(0, 0, 0, 0)",
                                    position: "right",
                                    rotation: 90,
                                    xAdjust: 10
                                }
                            },
                            pg_konec: {
                                type: "line",
                                xMin: moment(this.pg_konec, "YYYY-MM-DD").format("YYYY-MM-DD"),
                                xMax: moment(this.pg_konec, "YYYY-MM-DD").format("YYYY-MM-DD"),
                                borderDash: [6, 6],
                                borderDashOffset: 0,
                                borderColor: "grey",
                                borderWidth: 2,
                                label: {
                                    display: true,
                                    content: "Konec predčasnega glasovanja",
                                    color: "grey",
                                    backgroundColor: "rgba(0, 0, 0, 0)",
                                    position: "right",
                                    rotation: 90,
                                    xAdjust: 10
                                }
                            },
                            gg: {
                                type: "line",
                                xMin: moment(this.gg, "YYYY-MM-DD").format("YYYY-MM-DD"),
                                xMax: this.gg,
                                borderDash: [6, 6],
                                borderDashOffset: 0,
                                borderColor: "grey",
                                borderWidth: 2,
                                label: {
                                    display: true,
                                    content: "Izid in glavno glasovanje",
                                    color: "grey",
                                    backgroundColor: "rgba(0, 0, 0, 0)",
                                    position: "right",
                                    rotation: 90,
                                    xAdjust: 10
                                }
                            },
                        },
                    },
                },
                customLine: {
                    width: 5,
                    color: 'pink'
                }
            },
            plugins: [
                {
                    id: 'customLine',
                    afterDatasetsDraw: (chart, ctx, opts) => {
                        const width = opts.width || 1;
                        const color = opts.color || 'black'

                        if (!chart.active || chart.active.length === 0) {
                            return;
                        }

                        const {
                            chartArea: {
                            top,
                            bottom
                            }
                        } = chart;
                        const xValue = chart.active[0]._model.x

                        ctx.lineWidth = width;
                        ctx.strokeStyle = color;

                        ctx.beginPath();
                        ctx.moveTo(xValue, top);
                        ctx.lineTo(xValue, bottom);
                        ctx.stroke();
                    }
                }
            ],
            loaded: false,
            not_found: false,
            prikazi: {
                NV: true,
                NSO: false,
                NBG: false
            }
        }
    },
    async mounted() {
        // Pridobivanje podatkov
        const status = await this.getData();
        if (status) {
            this.not_found = true;
        } else {
            this.render()
        }
        this.loaded = true;
    },
    methods: {
        async getData() {
            try {
                const { data } = await axios.get(this.apiServer + "/api/vprasanja/glasovanje/" + this.glasovanje_id)
                for (let i = 0; i < data.length; i++) { // vprašanja
                    if (data[i].glasovalno_tip.kvalitativna_meritev === 'izid' || data[i].glasovalno_tip.kvalitativna_meritev === 'izid-izrojena-udelezba') {
                        const { anketa_id, odgovori, _id } = data[i];
                        for (let j = 0; j < odgovori.length; j++) { // odgovori
                            let label_current = this.vrniOdgovor(odgovori[j].odgovor_std ?? odgovori[j].tip, false, 1) ?? odgovori[j].odgovor
                            let color_current = this.vrniStdBarvo(odgovori[j].odgovor_std ?? odgovori[j].tip)
                            if (odgovori[j].tip === 'O' && odgovori[j].udelezba_tip === 'NBG') {
                                label_current = this.vrniOdgovor('NBG', false, 1)
                                color_current = this.vrniStdBarvo('NBG')
                            }

                            if (undefined === this.fullData.datasets.find((element) => element.label === label_current)) {
                                this.fullData.datasets.push({
                                    label: label_current,
                                    data: [{
                                        x: await this.getDate(anketa_id),
                                        y: odgovori[j].procent_izvajalec,
                                        vprasanje_id: _id
                                    }],
                                    backgroundColor: color_current,
                                    borderColor: color_current,
                                    borderWidth: 2,
                                    pointRadius: 3,
                                })
                            } else {
                                const obstojeciVnos = this.fullData.datasets.find((element) => element.label === label_current)
                                obstojeciVnos.data.push({
                                    x: await this.getDate(anketa_id),
                                    y: odgovori[j].procent_izvajalec,
                                    vprasanje_id: _id
                                })
                            }
                        }
                    }
                }

                // dodan izid volitev
                for (let i = 0; i < this.izid.length; i++) {
                    // lahko bi za OPNVG naredil tudi tako kot pri anketah, vendar sem vsaj začasno poenostavil in dal v odgovor_std
                    let label_current = this.vrniOdgovor(this.izid[i].odgovor_std, false, 1)
                    let color_current = this.vrniStdBarvo(this.izid[i].odgovor_std)

                    if (undefined === this.fullData.datasets.find((element) => element.label === label_current)) {
                        this.fullData.datasets.push({
                            label: label_current,
                            data: [{
                                x: moment(this.gg, "YYYY-MM-DD").format("YYYY-MM-DD"),
                                y: this.izid[i].procent_glasovnic,
                            }],
                            backgroundColor: color_current,
                            borderColor: color_current,
                            borderWidth: 2,
                            pointRadius: 3,
                        })
                    } else {
                        const obstojeciVnos = this.fullData.datasets.find((element) => element.label === label_current)
                        obstojeciVnos.data.push({
                            x: moment(this.gg, "YYYY-MM-DD").format("YYYY-MM-DD"),
                            y: this.izid[i].procent_glasovnic,
                        })
                    }
                }
            } catch (error) {
                console.log(error)
                return false;
            }
        },
        async getDate(anketa_id) {
            const { data } = await axios.get(this.apiServer + "/api/ankete/" + anketa_id);
            return moment(data.sredina, "YYYY-MM-DD").format("YYYY-MM-DD"); // sicer ni vpisan celoten data.konec format, vendar vseeno deluje
        },
        render() {
            var newData = JSON.parse(JSON.stringify(this.fullData))

            // Izločanje elementov iz polja
            for (var i = newData.datasets.length - 1; i >= 0; i--) { // loop od nazaj, da se med odstranjevanjem ne pokvari indeks
                if (
                    !this.prikazi.NV && newData.datasets[i].label === 'Ne vem' ||
                    !this.prikazi.NSO && newData.datasets[i].label === 'Ne povem' ||
                    !this.prikazi.NBG && newData.datasets[i].label === 'Ne bom glasoval'
                ) {
                    newData.datasets.splice(i, 1)
                }
            }

            newData.datasets = this.preracunaj(newData.datasets)
            this.data = newData
            this.obdelajPodatkePovprecje()
        },
        preracunaj(podatki) {
            // Poiščemo vse podatke za določen x (za določen x in oznako imamo lahko več vrednosti!!!)
            var obdelanaVprasanja = []
            // Izbiramo vprašanja, ki jih obdelujemo
            for (let i = 0; i < podatki.length; i++) {
                for (let j = 0; j < podatki[i].data.length; j++) {
                    var izbranoVprasanje = podatki[i].data[j].vprasanje_id
                    if (!obdelanaVprasanja.includes(izbranoVprasanje)) {
                        // Seštejemo vse y vrednosti, ki pripadajo tem vprašanju
                        var sestevek = 0;
                        for (let i2 = 0; i2 < podatki.length; i2++) {
                            for (let j2 = 0; j2 < podatki[i2].data.length; j2++) {
                                if (podatki[i2].data[j2].vprasanje_id === izbranoVprasanje) {
                                    sestevek += podatki[i2].data[j2].y
                                    break;
                                }
                            }
                        }

                        // Sedaj y vrednosti spremenimo tako, da bo seštevek 100
                        for (let i2 = 0; i2 < podatki.length; i2++) {
                            for (let j2 = 0; j2 < podatki[i2].data.length; j2++) {
                                if (podatki[i2].data[j2].vprasanje_id === izbranoVprasanje) {
                                    podatki[i2].data[j2].y = (podatki[i2].data[j2].y / sestevek) * 100
                                    break;
                                }
                            }
                        }

                        obdelanaVprasanja.push(izbranoVprasanje)
                    }
                }
            }
            return podatki
        },
        obdelajPodatkePovprecje() {
            let stOznak = this.data.datasets.length;
            for (let i = 0; i < stOznak; i++) {
                let oznaka = this.data.datasets[i]
                var povprecje = []

                let stX = 0;
                let sestevek = 0;
                for (let j = 0; j < oznaka.data.length; j++) {
                    sestevek += oznaka.data[j].y
                    stX++
                    if (j + 1 == oznaka.data.length || oznaka.data[j].x != oznaka.data[j+1].x) { // cikliranje čez točke z istim x
                        var y_povprecno = sestevek / stX
                        povprecje.push({x: oznaka.data[j].x, y: y_povprecno})

                        stX = 0
                        sestevek = 0
                    }
                }
                this.data.datasets.push({
                    label: oznaka.label,
                    data: povprecje,
                    backgroundColor: oznaka.backgroundColor,
                    hoverBackgroundColor: 'white',
                    borderColor: oznaka.borderColor,
                    pointRadius: 0,
                    pointHitRadius: 5,
                    pointHoverRadius: 4,
                    borderWidth: 4,
                    pointHoverBorderWidth: 3,
                    showLine: true,
                    tension: 0.4 // to iz neznanega razloga vse poruši
                })

                oznaka.backgroundColor += "80"
                oznaka.borderColor += "80"
                oznaka.label += "_scatter"
            }
        }
    }
}
</script>