const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// MANJKA SHEMA
const tipi_glasovanja_shema = new mongoose.Schema({
    raven_oblasti: {type: String, required: [true, "Raven oblasti, za katero bo potekalo glasovanje je zahtevano polje"] },
    tip: { type: String, required: [true, "Tip glasovanja je zahtevano polje"] }, // volitve, referendum [delno redundantno]
    volitve_tip: { type: String, required: [this.tip === 'volitve', "Tip volitev je obvesno polje, če je tip glasovanja volitve"] }, // DZ-S (DZ splošno), DZ-MNS, DZ-INS
    referendum_tip: { type: String, required: false } // je to sploh smiselno, ker se ne deferencirajo pomembno?
});

/**
 * @openapi
 * components:
 *  schemas:
 *   Glasovanje:
 *    type: object
 *    description:
 *    properties:
 *     _id:
 *      type: ObjectId
 *      description: <b>enolični identifikator</b> glasovanja
 *      example: 635a62f5dc5d7968e68464be
 *     ime:
 *      type: string
 *      description: ime glasovanja
 *     tip:
 *      type: string
 *      description: tip glasovanja
 *     zacetek:
 *      type: date
 *      description: datum začetka glasovanja
 *     konec:
 *      type: date
 *      description: datum konca glasovanja
 *     opis:
 *      type: string
 *      description: opis glasovanja
 *     opombe:
 *      type: string
 *      description: opombe glasovanja
 *    required:
 *     - _id
 *     - ime
 */

// MANJKA SHEMA
const izid_shema = new mongoose.Schema({
    doloceno_tip: { type: String, required: false},
    odgovor_std: { type: String, required: false },
    odgovor: { type: String, required: false },
    stranka_id: {
        type: ObjectId,
        required:
            [
                this.doloceno_tip === 'stranka',
                "Potrebno je navesti identifikator stranke"
            ]
    },
    procent_glasovnic: { type: Number, required: false },
    st_glasovnic: { type: Number, required: false },
    barva: { type: String, required: false },
    opis: { type: String, required: false },
    opombe: { type: String, required: false }
})

const glasovanja_shema = new mongoose.Schema({
    tip: { type: tipi_glasovanja_shema, required: [true, "Tip glasovanja je zahtevano polje"] },
    ime: { type: String, required: [true, "Ime je zahtevano polje"] },
    wikipedia_uri: { type: String, required: false },
    pg_zacetek: { type: Date, required: false }, // začetek predčasnega glasovanja
    pg_konec: { type: Date, required: false }, // konec predčasnega glasovanja
    gg: { ype: Date, required: false}, // datum glavnega glasovanja, praktično vedno tudi konec glasovanja
    opis: { type: String, required: false }, // ni v API dokumentaciji
    opombe: { type: String, required: false }, // ni v API dokumentaciji
    st_volilnih_upravicencev: { type: Number, required: false },
    udelezba_st_volilnih_upravicencev: { type: Number, required: false },
    udelezba_delez_volilnih_upravicencev: { type: Number, required: false },
    izid: { type: [izid_shema], required: false }
});

// MANJKA SHEMA: tudi ostalo dokumentacijo je potrebno posodbiti
const lokacija_shema = new mongoose.Schema({
    tip: { type: String, required: [true, "Potrebno je specificirati tip lokacije vira"] },
    uri: { type: String, required: [this.tip === 'splet', "Ker je vir lociran na spletu, je potrebno navesti tudi povezavo do spletne strani"] },
    tv_kanal: { type: String, required: 
        [this.tip === 'tv', "Ker gre za televizijski vir, je potrebno navesti tudi na katerem kanalu je bila anketa objavljena"] 
    },
    strani: { type: [Number], default: undefined, required:
        [
            this.tip === 'revija' || this.tip === 'casopis',
            "Ker gre za revijski oz. časopisni vir, je potrebno navesti tudi na kateri strani je bila anketa objavljena"
        ]
    },
    datum_in_cas_objave: { type: Date, required: false }, // pri nekaterih objavah (npr. pri objavah izvajalcev) ni specifiran
    opis: { type: String, required: false },
    opombe: { type: String, required: false }
});

// MANJKA SHEMA: tudi ostalo dokumentacijo je potrebno posodbiti
const vir_shema = new mongoose.Schema({
    objavitelj_tip: { type: String, required: [true, "Potrebno je specificirati, če je založnik ali izvajalec"] }, // objavitelj: lahko naročnik ali založnik
    objavitelj_id: { type: ObjectId, required: [true, "Enolični identifikator založnika je zahtevano polje"] },
    lokacije: { type: [lokacija_shema], default: undefined, required: false },
    opis: { type: String, required: false },
    opombe: { type: String, required: false }
});

// MANJKA SHEMA: tudi ostalo dokumentacijo je potrebno posodbiti
var vzorec_shema = null;
vzorec_shema = new mongoose.Schema({
    metode: { type: String, required: false }, // navede se le, če se razlikuje od metod navedenih za navadne ankete
    
    st_izbranih: { type: String, required: false }, // izmed njih...
        st_nedosegljivih: { type: Number, required: false }, // izmed njih...
        // st_dosegljivih
            st_noce_sodelovati: { type: Number, required: false }, // razlikuje od NŽO
            // st_hoce_sodelovati
                st_ni_ustrezalo_vzorcnim_dolocilom: { type: Number, required: false },
                st_sodelujocih: { type: Number, required: false }, // dejanska velikost vzorca (N)

    reprezentativno: { type: [String], default: undefined, required: false },
    utezeno: { type: [String], default: undefined, required: false }, // prazna tabela: vzorec ni utežen, polja ni: ne vemo nič glede uteženosti

    starost: { type: String, required: false },
    tip: { type: String, required: false }, // prebivalci ali državljani
    jurisdikcija: { type: String, required: false }, // Slovenija, izven Slovenije, posamezne pokrajine, mesta, itd.
    podvzorci: { type: [vzorec_shema], default: undefined, required: false }
});

/**
 * @openapi
 * components:
 *  schemas:
 *   Anketa:
 *    type: object
 *    description:
 *    properties:
 *     _id:
 *      type: ObjectId
 *      description: <b>enolični identifikator</b> ankete
 *      example: 873c017fc587d5ade7830b7a
 *     izvajalci_id:
 *      type: [ObjectId]
 *      description: enolični identifikatorji izvajalcev
 *     narocniki_id:
 *      type: [ObjectId]
 *      description: enolični identifikatorji naročnikov
 *     vzorec:
 *      type: [vzorec_shema]
 *      description: vzorec ankete
 *     metode:
 *      type: [string]
 *      description: metoda anketiranja
 *     zacetek:
 *      type: date
 *      description: datum začetka anketiranja
 *     sredina:
 *      type: date
 *      description: datum na sredini med začetkom in koncem anketiranja (povprečje)
 *     konec:
 *      type: date
 *      description: datum konca anketiranja
 *     opis:
 *      type: string
 *      description: opis izvajalca
 *     opombe:
 *      type: string
 *      description: opombe izvajalca
 *    required:
 *     - _id
 */
const ankete_shema = new mongoose.Schema({
    izvajalci_id: { type: [ObjectId], default: undefined, required: false },
    narocniki_id: { type: [ObjectId], default: undefined, required: false },
    vzorec: { type: [vzorec_shema], default: undefined, required: false },
    metode: { type: [String], default: undefined, required: false },
    zacetek: { type: Date, required: false },
    sredina: { type: Date, required: false },
    konec: { type: Date, required: false },
    opis: { type: String, required: false },
    opombe: { type: String, required: false },
    viri: { type: [vir_shema], type: false }
});

/**
 * @openapi
 * components:
 *  schemas:
 *   Vprasanje:
 *    type: object
 *    description:
 *    properties:
 *     _id:
 *      type: ObjectId
 *      description: <b>enolični identifikator</b> vprašanja (podatkovna baza ga določi sama ob vsakem uvozu podatkov)
 *      example: 635a62f5dc5d7968e68464be
 *     anketa_id:
 *      type: ObjectId
 *      description: enolični identifikator ankete, kateri pripada vprašanje
 *     vprasanje:
 *      type: string
 *      description: vprašanje, ki je bilo postavljeno anketirancem
 *     tip:
 *      type: string
 *      description: tip vprašanja
 *     glasovalno_tip:
 *      type: string
 *      description: če je vprašanje glasovalnega tipa, ta glasovalni tip dodatno specificira, za kakšno vprašanje gre
 *     zaupanje_tip:
 *      type: string
 *      description: če je vprašanje glede zaupanja, ta tip zaupanja dodatno specificira, za kakšno vprašanje gre
 *     opis:
 *      type: string
 *      description: opis vprašanja
 *     opombe:
 *      type: string
 *      description: opombe vprašanja
 *     odgovori:
 *      type: odgovori_shema
 *      description: odgovori na vprašanja
 *    required:
 *     - _id
 *     - anketa_id
 *     - tip
 */

// MANJKAJOČA SHEMA!!!!!
const odgovori_shema = new mongoose.Schema({ // tudi ti odgovori imajo svoje _id
    tip: { type: String, required: [true, "Tip odgovora je zahtevano polje"] },
    udelezba_tip: { type: String, required: false }, // tukaj bi sicer lahko napisal bolj kompleksen pogoj, ki referencira vrednost kvalitativna_meritev
    opredeljen_tip: { type: String, required: [this.tip === 'O', "Potrebno je navesti tip določnosti (doloceno, drugo, nobene, OPNVG (oddal bi prazno ali neveljavno glasovnico))"] },
    doloceno_tip: { type: String, required: [this.opredeljen_tip === 'doloceno', "Potrebno je navesti tip dolocenega odgovora"] },
    odgovor_std: { type: String, required: false }, // upoštevno le pri določenih vprašanjih 
    odgovor: { type: String, required: false }, // upoštevno le pri določenih vprašanjih
    stranka_id: {
        type: ObjectId,
        required:
            [
                this.doloceno_tip === 'stranka',
                "Potrebno je navesti identifikator stranke"
            ]
    },
    oseba_id: {
        type: ObjectId,
        required:
            [
                this.doloceno_tip === 'oseba',
                "Potrebno je navesti identifikator osebe"
            ]
    },

    procent_izvajalec: { type: Number, required: false },
    procent_iz_calculated: { type: Number, required: false },
    procent_spodnja_meja_izvajalec: { type: Number, required: false },
    procent_spodnja_meja_iz_calculated: { type: Number, required: false },
    procent_zgornja_meja_izvajalec: { type: Number, required: false },
    procent_zgornja_meja_iz_calculated: { type: Number, required: false },

    st_mandatov_izvajalec: { type: Number, required: false },
    st_mandatov_iz_calculated: { type: Number, required: false },
    st_mandatov_spodnja_meja_izvajalec: { type: Number, required: false },
    st_mandatov_spodnja_meja_iz_calculated: { type: Number, required: false },
    st_mandatov_zgornja_meja_izvajalec: { type: Number, required: false },
    st_mandatov_zgornja_meja_iz_calculated: { type: Number, required: false },

    st_anketirancev_izvajalec: { type: Number, required: false },
    st_anketirancev_iz_calculated: { type: Number, required: false },

    ocena: { type: Number, required: false},

    barva: { type: String, required: false },
    opis: { type: String, required: false },
    opombe: { type: String, required: false },
});

const glasovalno_tip_shema = new mongoose.Schema({
    casovna_komponenta: { type: String, required: [true, "Potrebno je specificirati časovno komponento vprašanja (napoved ali izmeritev)"] },
    izmeritev_tip: { type: String, required: false },
    kvalitativna_meritev: { type: String, required: [true, "Potrebno je navesti kvalitativno meritev vprašanja (kaj merimo)"] }
});

const vprasanja_shema = new mongoose.Schema({
    anketa_id: { type: ObjectId, required: [true, "Enolični identifikator ankete je zahtevano polje"] }, // had to be changed to String from ObjectId because I could otherwise not get /api/vprasanja/anketa/:id to work because Mongoose appeared to sense some conflicts; https://stackoverflow.com/questions/7878557/cant-find-documents-searching-by-objectid-using-mongoose didn't work
    vprasanje: { type: String, required: false },
    tip: { type: String, required: false }, // splosno, zaupanje, podpora, glasovalno
    glasovalno_tip: { glasovalno_tip_shema, required: [this.tip === 'glasovalno', "Če je vprašanje glasovalnega tipa, potem je potrebno specificirati, točen tip glasovalnega vprašanja"]},
    glasovanje_dolocnost: { type: String, required: [this.tip === 'glasovalno', "Potrebno je specificrati določnost glasovanja, po katerem vprašanje sprašuje"] },
    glasovanja_id: { type: [ObjectId], required: false },
    glasovanje_tip: { type: tipi_glasovanja_shema, required: [this.glasovanja_id == null , "Če se vprašanje nanaša na glasovanje in ni podan identifikator glasovanja, potem je tip glasovanja zahtevano polje"] }, // POTREBNO POPRAVITI
    predpostavljena_udelezba_procent: { type: Number, required: false },
    opis: { type: String, required: false },
    opombe: { type: String, required: false },
    odgovori: { type: [odgovori_shema], default: undefined, required: [true, "Vprašanje mora vsebovati odgovore!"] }
});

/**
 * @openapi
 * components:
 *  schemas:
 *   Izvajalec:
 *    type: object
 *    description:
 *    properties:
 *     _id:
 *      type: ObjectId
 *      description: <b>enolični identifikator</b> izvajalca
 *      example: 45a25e54cc55e42a456bdb32
 *     ime:
 *      type: string
 *      description: ime izvajalca
 *     ime_polno:
 *      type: string
 *      description: polno ime izvajalca
 *     barva:
 *      type: string
 *      description: barva določena izvajalcu
 *     logo_uri:
 *      type: string
 *      description: povezava do logota izvajalca
 *     wikipedia_uri:
 *      type: string
 *      description: povezava do Wikipedia strani izvajalca
 *     opis:
 *      type: string
 *      description: opis izvajalca
 *     opombe:
 *      type: string
 *      description: opombe izvajalca
 *    required:
 *     - _id
 *     - ime
 */
const izvajalci_shema = new mongoose.Schema({
    ime: { type: String, required: [true, "Ime je zahtevano polje"] },
    ime_polno: {type: String, required: false },
    barva: { type: String, required: false },
    logo_uri: { type: String, required: false },
    wikipedia_uri: { type: String, required: false },
    opis: { type: String, required: false },
    opombe: { type: String, required: false }
});

/**
 * @openapi
 * components:
 *  schemas:
 *   Narocnik:
 *    type: object
 *    description:
 *    properties:
 *     _id:
 *      type: ObjectId
 *      description: <b>enolični identifikator</b> založnika
 *      example: 5f8024542bc87c975ffc1a70
 *     ime:
 *      type: string
 *      description: ime založnika
 *     ime_polno:
 *      type: string
 *      description: polno ime založnika
 *     tip:
 *      type: string
 *      description: tip založnika
 *     barva:
 *      type: string
 *      description: barva določena naročniku
 *     logo_uri:
 *      type: string
 *      description: povezava do logota založnika
 *     wikipedia_uri:
 *      type: string
 *      description: povezava do Wikipedia strani založnika
 *     opis:
 *      type: string
 *      description: opis založnika
 *     opombe:
 *      type: string
 *      description: opombe založnika
 *    required:
 *     - _id
 *     - ime
 */
const zalozniki_shema = new mongoose.Schema({
    ime: { type: String, required: [true, "Ime je zahtevano polje"] },
    ime_polno: {type: String, required: false },
    tip: { type: String, required: [true, "Potrebno je navesti tudi tip založnika"] },
    barva: { type: String, required: false },
    logo_uri: { type: String, required: false },
    wikipedia_uri: { type: String, required: false },
    opis: { type: String, required: false },
    opombe: { type: String, required: false }
});

/**
 * @openapi
 * components:
 *  schemas:
 *   Stranka:
 *    type: object
 *    description:
 *    properties:
 *     _id:
 *      type: ObjectId
 *      description: <b>enolični identifikator</b> stranke
 *      example: c32ae76a892c5c270a7acb1f
 *     ime:
 *      type: string
 *      description: ime stranke
 *      example: Slovenska demokratska stranka
 *     ime_kratica:
 *      type: string
 *      description: kratica imena stranke
 *     indeks_LD:
 *      type: number
 *      description: indeks stranke za razpored od leve proti desni
 *     barva:
 *      type: string
 *      description: barva določena stranki
 *     logo_uri:
 *      type: string
 *      description: povezava do logota stranke
 *     wikipedia_uri:
 *      type: string
 *      description: povezava do Wikipedia strani stranke
 *     opis:
 *      type: string
 *      description: opis stranke
 *     opombe:
 *      type: string
 *      description: opombe stranke
 *    required:
 *     - _id
 *     - ime
 */
const stranke_shema = new mongoose.Schema({
    ime: { type: String, required: [true, "Ime je zahtevano polje"] },
    ime_kratica: { type: String, required: false },
    indeks_LD: { type: Number, required: false },
    barva: { type: String, required: false },
    logo_uri: { type: String, required: false },
    wikipedia_uri: { type: String, required: false },
    opis: { type: String, required: false },
    opombe: { type: String, required: false }
});

/**
 * @openapi
 * components:
 *  schemas:
 *   Oseba:
 *    type: object
 *    description:
 *    properties:
 *     _id:
 *      type: ObjectId
 *      description: <b>enolični identifikator</b> osebe
 *      example: 635a62f5dc5d7968e68464be
 *     ime:
 *      type: string
 *      description: ime osebe
 *     ime_srednje:
 *      type: string
 *      description: srednje ime osebe
 *     priimek:
 *      type: string
 *      description: priimek osebe
 *     stranka_id:
 *      type: ObjectId
 *      description: enolični identifikator stranke osebe
 *     slika_uri:
 *      type: string
 *      description: povezava do slike osebe
 *     slika_vir:
 *      type: string
 *      description: podatki o viru slike
 *     slika_avtor:
 *      type: string
 *      description: podatki o avtorju slike
 *     wikipedia_uri:
 *      type: string
 *      description: povezava do Wikipedia strani osebe
 *     opis:
 *      type: string
 *      description: opis osebe
 *     opombe:
 *      type: string
 *      description: opombe osebe
 *    required:
 *     - _id
 *     - ime
 *     - priimek
 */
const osebe_shema = new mongoose.Schema({
    ime: { type: String, required: [true, "Ime je zahtevano polje"] },
    ime_srednje: { type: String, required: false },
    priimek: { type: String, required: [true, "Priimek je zahtevano polje"] },
    stranka_id : { type: ObjectId, required: false },
    slika_uri: { type: String, required: false },
    slika_vir: { type: String, required: false },
    slika_avtor: { type: String, required: false },
    wikipedia_uri: { type: String, required: false },
    opis: { type: String, required: false },
    opombe: { type: String, required: false }
});

/**
 * @openapi
 * components:
 *  schemas:
 *   Prijava:
 *    type: object
 *    description:
 *    properties:
 *     _id:
 *      type: ObjectId
 *      description: <b>enolični identifikator</b> prijave
 *      example: 635a62f5dc5d7968e68464be
 *     tip:
 *      type: string
 *      description: tip napačnega podatka
 *     id:
 *      type: string
 *      description: enolični identifikator enitete z napačnim podatkom
 *     pot:
 *      type: string
 *      description: pot do enitete z napačnim podatkom 
 *     opis:
 *      type: string
 *      description: opis napake
 *     razreseno:
 *      type: boolean
 *      description: pove, če je bila napaka že razrešena
 *     upvotes:
 *      type: number
 *      description: število gorglasov (upvotes), ki pritrjujejo prijavi (napaka obstaja, lahko tudi indikator, da je pomembna)
 *     downvotes:
 *      type: number
 *      description: število dolglasov (downvotes), ki ne pritrjujejo prijavi (napaka ne obstaja)
 *     opombe:
 *      type: string
 *      description: opombe k prijavi
 *    required:
 *     - _id
 *     - tip
 */
const prijave_shema = new mongoose.Schema({
    tip: { type: String, required: [true, "Tip je zahtevano polje"] },
    id: { type: ObjectId, required: false },
    pot: { type: String, required: false },
    opis : { type: String, required: false },
    razreseno: { type: Boolean, required: true },
    upvotes: { type: Number, required: true },
    downvotes: { type: Number, required: true },
    opombe: { type: String, required: false }
});

mongoose.model("Glasovanje", glasovanja_shema, "Glasovanja");
mongoose.model("Anketa", ankete_shema, "Ankete");
mongoose.model("Vprasanje", vprasanja_shema, "Vprasanja");
mongoose.model("Izvajalec", izvajalci_shema, "Izvajalci");
mongoose.model("Zaloznik", zalozniki_shema, "Zalozniki");
mongoose.model("Stranka", stranke_shema, "Stranke");
mongoose.model("Oseba", osebe_shema, "Osebe");
mongoose.model("Prijava", prijave_shema, "Prijave");
