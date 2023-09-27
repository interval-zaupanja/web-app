import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // ni potrebno specificirati index.js, ker to že avtomatsko povzame iz mape

import '@/assets/styles/global.css'

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"


let app = createApp(App)

if (process.env.NODE_ENV === "production") {
    app.config.globalProperties.apiServer = "https://interval-zaupanja.onrender.com"
} else {
    app.config.globalProperties.apiServer = "http://localhost:4000"
}

// STANDARDI

app.config.globalProperties.razlage = {
    zakonodajno_zavrnitveni_referendum: "Ker gre za zavrnitveni zakonodajni referendum, ni dovolj le, da (i) proti uveljavitvi zakona glasuje več volilcev (ki so veljavno glasovali) kot jih je glasovalo za uveljavitev zakona, temeveč mora (ii) proti glasovati tudi vsaj petina vseh volilnih upravičencev."
}

app.config.globalProperties.barve = {
    pozitivno: "#18C10A",
    nevtralno: "#FAA613", // razlikujem od BG-NV, ki se do vprašanja sploh ne opredeli, nevtralno pa lahko odraža npr. delno strinjanje, delno nestrinjanje
    negativno: "#E71F1F",
    NO: "#7E848C",
    NSO: "#DCDFE3",
    NBG: "#ACAEB0",
    ZG: "#593F62",
    prag: "#8B8C8F",
    spekter_1: "#105074",
    spekter_2: "#147BB8",
    spekter_0: "#1E9AD6",
    spekter_minus1: "#74CFEA",
    spekter_minus2: "#38C2EC"
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
    } else if (kljuc === 'NSO') {
        return this.barve.NSO
    } else if (kljuc === 'NBG') {
        return this.barve.NBG
    } else if (kljuc === 'ZG') {
        return this.barve.ZG
    } else if (kljuc == 1) {
        return this.barve.spekter_1
    } else if (kljuc == 2) {
        return this.barve.spekter_2
    }else if (kljuc == 0) {
        return this.barve.spekter_0
    }else if (kljuc == -1) {
        return this.barve.spekter_minus1
    }else if (kljuc == -2) {
        return this.barve.spekter_minus2
    } else {
        return false
    }
}

app.config.globalProperties.vrniGlasovanjeTip = function (glasovanje_tip) { // uporablja tudi za bolj precizne tipe (npr. volitve_tip)
    switch (glasovanje_tip) {
        case 'DZ-S':
            return "Državni zbor - nemanjšinski poslanci"
        case 'EP-SI':
            return "Evropski parlament - poslanci iz RS"
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

    return this.capitalization(odgovor, capitalization)
}

app.config.globalProperties.capitalization = function (lowercase_input, option) {
    if (!lowercase_input) {
        return null
    }

    if (option == 0) { // all letters are lowercase (does nothing)
        return lowercase_input
    } else if (option == 1) { // starts with an uppercase letter
        if (lowercase_input.charAt(0) === '[') { // v primerih, kjer je [ prvi znak
            return lowercase_input.charAt(0) + lowercase_input.charAt(1).toUpperCase() +  lowercase_input.substring(2)
        } else {
            return lowercase_input.charAt(0).toUpperCase() +  lowercase_input.substring(1)
        }
    } else if (option == 2) { // all letters are uppercase
        return lowercase_input.toUpperCase()
    }
}

app.config.globalProperties.pojasnilaMetod = {
    CATI: "Computer-assisted telephone interviewing (CATI) oz. računalniško podprto telefonsko anketiranje je metoda anketiranja s pomočjo telefonskih klicev in specializirane programske opreme, anketarju poda vprašanja, ki naj jih zastavi anketirancu",
    CAWI: "Computer-assisted web interviewing (CAWI) oz. računalniško podprto spletno anketiranje je metoda anketiranja, kjer anketiranci odgovarjajo na vprašanja preko posebeno zasnovanega spletnega vmesnika"
}

app.config.globalProperties.vrniPojasniloMetode = function (metoda) {
    switch (metoda) {
        case 'CATI':
            return this.pojasnilaMetod.CATI
        case 'CAWI':
            return this.pojasnilaMetod.CAWI
    }
}

app.config.globalProperties.vrniLogoUri = function (uri) {
    if (uri == undefined) {
        return undefined
    } else if (uri.charAt(0) != 'h' || uri.charAt(0) === '/') { // gre za interno povezavo (ker se ne začne s http oz. https); če se začne z '/' to pomeni, da je bila interna predpona v nekem prejšnjem koraku že dodana
        return process.env.BASE_URL + 'assets/3rd-party-logos/' + uri // v tem primeru je URI le ime datoteke
    } else {
        return uri
    }
}

app.use(router).mount('#app')