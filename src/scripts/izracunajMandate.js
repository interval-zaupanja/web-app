import { Dhondt } from 'dhondt-calculator';

export const izracunajMandate = function (vprasanje, podatek) {
    var glasovi = []
    var ids = []
    var stNeveljavnihGlasov = 0;

    const odgovori = vprasanje.odgovori
    for (let i = 0; i < odgovori.length; i++) {
        if (odgovori[i].stranka_id != null) {
            ids.push(odgovori[i].stranka_id)

            if (podatek === 'procent_izvajalec') {
                glasovi.push(odgovori[i].procent_izvajalec * 100) // iz procentov proporcionalno pretvorimo na celo število glasov
            }
        } else if (odgovori[i].opredeljen_tip === 'OPNVG') { // ni jasno, če je potrebno vključiti tudi druge tipe !!!
            if (podatek === 'procent_izvajalec') {
                stNeveljavnihGlasov = odgovori[i].procent_izvajalec * 100
            }
        }
    }

    const rezultat = izracun(glasovi, ids, 88, stNeveljavnihGlasov, 4)
    return predelajRezultat(vprasanje, rezultat)
}

const izracun = function (glasovi, ids, stMandatov, stNeveljavnihGlasov, prag) {
    /** This is the class require. */

    /** Some test params. */
    const votes = glasovi;
    const names = ids;
    const options = {
        mandates: stMandatov,
        blankVotes: stNeveljavnihGlasov,
        percentage: prag
    };

    /** This is the instance */
    const dhondt = new Dhondt(votes, names, options);

    return dhondt.compute();
}

const predelajRezultat = function (vprasanje, rezultat) {
    const { parties } = rezultat
    
    const podatki = {
        labels: [],
        backgroundColor: [],
        data: []
    }

    const indeksi_LD = []
    for (let i = 0; i < Object.keys(parties).length; i++) {
        const stranka_id = Object.keys(parties)[i]
        const stranka = poisciStranko(vprasanje.odgovori, stranka_id)
        indeksi_LD.push(stranka.indeks_LD)

        // LABELS
        podatki.labels.push(stranka.ime_kratica ?? stranka.ime)
        
        // COLORS
        podatki.backgroundColor.push(stranka.barva)

        // DATA
        podatki.data.push(parties[stranka_id])
    }

    const razporejeno = razpored(podatki.data, podatki.labels, podatki.backgroundColor, indeksi_LD)
    podatki.data = razporejeno.stMandatov
    podatki.labels = razporejeno.imena
    podatki.backgroundColor = razporejeno.barve

    return podatki
}

const razpored = function (stMandatovUnordered, imenaUnordered, barveUnordered, indeksi_LD) {
    var tabela = Array(indeksi_LD)
    for (let i = 0; i < indeksi_LD.length; i++) {
        tabela[i] = {
            ime: imenaUnordered[i],
            barva: barveUnordered[i],
            stMandatov: stMandatovUnordered[i],
            indeks_LD: indeksi_LD[i]
        }
    }

    tabela.sort( function(a, b) {
        if (a.indeks_LD > b.indeks_LD) return 1
        if (a.indeks_LD < b.indeks_LD) return -1
    })

    var imena = Array(imenaUnordered.length)
    var barve = Array(imenaUnordered.length)
    var stMandatov = Array(barveUnordered.length)
    for (let j = 0; j < tabela.length; j++) {
        imena[j] = tabela[j].ime
        barve[j] = tabela[j].barva
        stMandatov[j] = tabela[j].stMandatov
    }

    return { stMandatov, imena , barve}
}

const poisciStranko = function (odgovori, stranka_id) {
    for (let i = 0; i < odgovori.length; i++) {
        if (odgovori[i].stranka_id == stranka_id) {
            var stranka = {
                ime: odgovori[i].odgovor_stranka_ime
            }

            if (odgovori[i].odgovor_stranka_ime_kratica) {
                stranka.ime_kratica = odgovori[i].odgovor_stranka_ime_kratica
            }
            if (odgovori[i].odgovor_stranka_barva) {
                stranka.barva = odgovori[i].odgovor_stranka_barva
            }
            if (odgovori[i].odgovor_stranka_indeks_LD) {
                stranka.indeks_LD = odgovori[i].odgovor_stranka_indeks_LD
            }

            return stranka
        }
    }
}