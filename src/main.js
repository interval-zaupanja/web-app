import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // ni potrebno specificirati index.js, ker to že avtomatsko povzame iz mape

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"

let app = createApp(App)

// STANDARDI

app.config.globalProperties.barve = {
    pozitivno: "#18C10A",
    nevtralno: "#FAA613", // razlikujem od BG-NV, ki se do vprašanja sploh ne opredeli, nevtralno pa lahko odraža npr. delno strinjanje, delno nestrinjanje
    negativno: "#E71F1F",
    BG_NV: "#7E848C",
    NBG: "#ACAEB0",
    NZO: "#DCDFE3",
    prag: "#8B8C8F"
}

app.config.globalProperties.vrniStdBarvo = function (kljuc) {
    if (kljuc === 'za') {
        return this.barve.pozitivno
    } else if (kljuc === 'proti') {
        return this.barve.negativno
    } else if (kljuc === 'zaupam') {
        return this.barve.pozitivno
    } else if (kljuc === 'ne zaupam') {
        return this.barve.negativno
    } else if (kljuc === 'BG-NV') {
        return this.barve.BG_NV
    } else if (kljuc === 'NBG') {
    return this.barve.NBG
    } else if (kljuc === 'NŽO') {
        return this.barve.NZO
    } else {
        return false
    }
}

app.config.globalProperties.vrniGlasovalnoTip = function (glasovalno_tip) { // uporablja tudi za bolj precizne tipe (npr. volitve_tip)
    if (glasovalno_tip === "DZ-S") {
        return "Državni zbor (splošno - 88 poslancev)";
    }
}

app.config.globalProperties.vrniOdgovor = function (std_ime, long, capitalization) { // velja tako za odgovore kot tipe odgovorov
    var odgovor;
    switch (std_ime) {
        case 'BG-V':
            if (long) {
                odgovor = "bom glasoval - vem, kako bom glasoval" // nima praktične aplikacije
            } else {
                odgovor = "vem"
            }
            break;
        case 'BG-NV':
            if (long) {
                odgovor = "bom glasoval - ne vem, kako bom glasoval"
            } else {
                odgovor = "ne vem"
            }
            break;
        case 'NBG':
            odgovor = "ne bom glasoval"
            break;
        case 'NŽO':
            if (long) {
                odgovor = "ne želim odgovoriti"
            } else {
                odgovor = "ne povem" // lahko je confusing, ker se na chartih pojavi drugačen odgovor kot med listanimi odgovori
            }
            break;
        case 'za':
            odgovor = 'za'
            break;
        case 'proti':
            odgovor = 'proti'
            break;
        case 'zaupam':
            odgovor = 'zaupam'
            break;
        case 'ne zaupam':
            odgovor = 'ne zaupam'
            break;
        default:
            return null // odgovor ni standardiziran
    }

    if (capitalization == 0) { // all letters are lowercase
        return odgovor
    } else if (capitalization == 1) { // starts with an uppercase letter
        return odgovor.charAt(0).toUpperCase() +  odgovor.substring(1)
    } else if (capitalization == 2) { // all letters are uppercase
        return odgovor.toUpperCase()
    }
    return odgovor;
}

app.use(router).mount('#app')