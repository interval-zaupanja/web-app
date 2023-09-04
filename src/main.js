import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // ni potrebno specificirati index.js, ker to že avtomatsko povzame iz mape

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"

let app = createApp(App)

// STANDARDI

app.config.globalProperties.razlage = {
    zakonodajno_zavrnitveni_referendum: "Ker gre za zavrnitveni zakonodajni referendum, ni dovolj le, da (i) proti uveljavitvi zakona glasuje več volilcev (ki so veljavno glasovali) kot jih je glasovalo za uveljavitev zakona, temeveč mora (ii) proti glasovati tudi vsaj petina vseh volilnih upravičencev."
}

app.config.globalProperties.barve = {
    pozitivno: "#18C10A",
    nevtralno: "#FAA613", // razlikujem od BG-NV, ki se do vprašanja sploh ne opredeli, nevtralno pa lahko odraža npr. delno strinjanje, delno nestrinjanje
    negativno: "#E71F1F",
    NO: "#7E848C",
    NBG: "#ACAEB0",
    NSO: "#DCDFE3",
    prag: "#8B8C8F"
}

app.config.globalProperties.vrniStdBarvo = function (kljuc) { // na voljo le za standardizirane odgovore (torej ne za 'odgovor')
    if (kljuc === 'za') {
        return this.barve.pozitivno
    } else if (kljuc === 'proti') {
        return this.barve.negativno
    } else if (kljuc === 'zaupam') {
        return this.barve.pozitivno
    } else if (kljuc === 'ne zaupam') {
        return this.barve.negativno
    } else if (kljuc === 'NO') {
        return this.barve.NO
    } else if (kljuc === 'NBG') {
    return this.barve.NBG
    } else if (kljuc === 'NSO') {
        return this.barve.NSO
    } else {
        return false
    }
}

app.config.globalProperties.vrniGlasovanjeTip = function (glasovanje_tip) { // uporablja tudi za bolj precizne tipe (npr. volitve_tip)
    if (glasovanje_tip === "DZ-S") {
        return "Državni zbor (splošno - 88 poslancev)";
    }
}

app.config.globalProperties.vrniOdgovor = function (std_ime, long, capitalization) { // velja tako za odgovore kot tipe odgovorov
    var odgovor;
    switch (std_ime) {
        case 'O':
            if (long) {
                odgovor = "opredeljen"
            } else {
                odgovor = "vem"
            }
            break;
        case 'NO':
            if (long) {
                odgovor = "neopredeljen"
            } else {
                odgovor = "ne vem"
            }
            break;
        case 'NSO':
            if (long) {
                odgovor = "nočem se opredeliti"
            } else {
                odgovor = "ne povem" // lahko je confusing, ker se na chartih pojavi drugačen odgovor kot med listanimi odgovori
            }
            break;
        case 'BG':
            odgovor = "bom glasoval" // nima praktične aplikacije
            break;
        case 'NBG':
            odgovor = "ne bom glasoval"
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
}

app.config.globalProperties.capitalization = function (lowercase_input, option) {
    if (!lowercase_input) {
        return null
    }

    if (option == 0) { // all letters are lowercase (does nothing)
        return lowercase_input
    } else if (option == 1) { // starts with an uppercase letter
        return lowercase_input.charAt(0).toUpperCase() +  lowercase_input.substring(1)
    } else if (option == 2) { // all letters are uppercase
        return lowercase_input.toUpperCase()
    }
}

app.use(router).mount('#app')