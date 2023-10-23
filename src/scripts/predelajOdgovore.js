export const predelajOdgovore = function(vprasanje, podatek) {
    const podatki = {
        labels: [],
        backgroundColor: [],
        data: []
    }
    for (let i = 0; i < vprasanje.odgovori.length; i++) {
        if (podatek === 'procent_izvajalec' || (podatek === 'st_mandatov_izvajalec' && vprasanje.odgovori[i].st_mandatov_izvajalec)) {
            // LABELS
            if (vprasanje.odgovori[i].tip === 'O' && vprasanje.odgovori[i].udelezba_tip === 'NBG') {
                podatki.labels.push(this.vrniOdgovor('NBG', false, 1))
            } else {
                podatki.labels.push(
                    vprasanje.odgovori[i].odgovor_stranka_ime_kratica ??
                    vprasanje.odgovori[i].odgovor_stranka_ime ??
                    this.capitalization(vprasanje.odgovori[i].odgovor, 1) ??
                    this.vrniOdgovor(vprasanje.odgovori[i].odgovor_std ?? vprasanje.odgovori[i].dolocnost_tip ?? vprasanje.odgovori[i].tip, false, 1) ?? // ali ima primat odgovor ali tip lahko, da bo treba pri nekaterih odgovorih potrebno spremeniti
                    vprasanje.odgovori[i].odgovor
                )
            }

            // COLORS
            if (vprasanje.odgovori[i].tip === 'O' && vprasanje.odgovori[i].udelezba_tip === 'NBG') {
                podatki.backgroundColor.push(this.vrniStdBarvo('NBG'))
            } else {
                podatki.backgroundColor.push(
                    vprasanje.odgovori[i].barva ??
                    vprasanje.odgovori[i].odgovor_stranka_barva ??
                    this.vrniStdBarvo(
                        vprasanje.odgovori[i].odgovor_std ??
                        vprasanje.odgovori[i].dolocnost_tip ??
                        vprasanje.odgovori[i].tip
                    )
                )
            }

            // DATA
            if (podatek === 'procent_izvajalec') {
                podatki.data.push(vprasanje.odgovori[i].procent_izvajalec)
            } else if (podatek === 'st_mandatov_izvajalec') {
                podatki.data.push(vprasanje.odgovori[i].st_mandatov_izvajalec)
            }
        }
    }
    if (podatki.labels.length == 0) {
        return null // potrebno, da ne prikažemo graf brez podatkov
    } else {
        return podatki
    }
}