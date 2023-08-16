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
const glasovanja_shema = new mongoose.Schema({
    tip: { type: tipi_glasovanja_shema, required: [true, "Tip glasovanja je zahtevano polje"] },
    ime: { type: String, required: [true, "Ime je zahtevano polje"] },
    wikipedia_uri: { type: String, required: false },
    zacetek: { type: Date, required: false }, // predčasno glasovanje, začetek glasovanja po pošti (ZAENKRAT TO ŠETEJEM KOT ZAČETEK PREDČASNEGA GLASOVANJA)
    konec: { type: Date, required: false }, // datum na katerega se glasovanje začne
    opis: { type: String, required: false }, // ni v API dokumentaciji
    opombe: { type: String, required: false } // ni v API dokumentaciji
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
 *     anketarji_id:
 *      type: [ObjectId]
 *      description: enolični identifikatorji anketarjev
 *     narocniki_id:
 *      type: [ObjectId]
 *      description: enolični identifikatorji naročnikov
 *     velikost_vzorca:
 *      type: string
 *      description: velikost vzorca ankete
 *     metoda:
 *      type: string
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
 *      description: opis anketarja
 *     opombe:
 *      type: string
 *      description: opombe anketarja
 *    required:
 *     - _id
 */
const ankete_shema = new mongoose.Schema({
    anketarji_id: { type: [ObjectId], required: false },
    narocniki_id: { type: [ObjectId], required: false },
    velikost_vzorca: { type: Number, required: false },
    metoda: { type: String, required: false },
    zacetek: { type: Date, required: false },
    sredina: { type: Date, required: false },
    konec: { type: Date, required: false },
    opis: { type: String, required: false },
    opombe: { type: String, required: false },
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
 *     - anketa_eid
 *     - tip
 */

// MANJKAJOČA SHEMA!!!!!
const odgovori_shema = new mongoose.Schema({ // tudi ti odgovori imajo svoje _id
    odgovor_tip: { type: String, required: [true, "Tip odgovora je zahtevano polje"] },
    odgovor: { type: String, required: false }, // upoštevno le pri določenih vprašanjih; vrednost lahko le DA ali NE
    odgovor_stranka_id: {
        type: ObjectId,
        required:
            [
                this.tip === "glasovalno" && this.odgovor_tip === "BG-V" && this.glasovalno_tip === "dz",
                "Če je tip odgovora BG-V, potem mora biti izbrana stranka"
            ]
    },
    procent_anketar: { type: Number, required: false },
    procent_iz_calculated: { type: Number, required: false },
    procent_spodnja_meja_anketar: { type: Number, required: false },
    procent_spodnja_meja_iz_calculated: { type: Number, required: false },
    procent_zgornja_meja_anketar: { type: Number, required: false },
    procent_zgornja_meja_iz_calculated: { type: Number, required: false },
    st_mandatov_anketar: { type: Number, required: false },
    st_mandatov_iz_calculated: { type: Number, required: false },
    st_mandatov_spodnja_meja_anketar: { type: Number, required: false },
    st_mandatov_spodnja_meja_iz_calculated: { type: Number, required: false },
    st_mandatov_zgornja_meja_anketar: { type: Number, required: false },
    st_mandatov_zgornja_meja_iz_calculated: { type: Number, required: false },
    stevilo_anketirancev_anketar: { type: Number, required: false },
    stevilo_anketirancev_iz_calculated: { type: Number, required: false }
});

const vprasanja_shema = new mongoose.Schema({
    anketa_id: { type: ObjectId, required: [true, "Zunanji enolični identifikator ankete je zahtevano polje"] }, // had to be changed to String from ObjectId because I could otherwise not get /api/vprasanja/anketa/:id to work because Mongoose appeared to sense some conflicts; https://stackoverflow.com/questions/7878557/cant-find-documents-searching-by-objectid-using-mongoose didn't work
    vprasanje: { type: String, required: false },
    tip: { type: String, required: [true, "Tip vprašanja je zahtevano polje"] },
    glasovalno_tip: { type: tipi_glasovanja_shema, required: [this.tip === "glasovalno", "Če je vprašanje glasovalno, potem je tip glasovanja zahtevano polje"] },
    opis: { type: String, required: false },
    opombe: { type: String, required: false },
    odgovori: { type: [odgovori_shema], required: [true, "Vprašanje mora vsebovati odgovore!"] }
});

/**
 * @openapi
 * components:
 *  schemas:
 *   Anketar:
 *    type: object
 *    description:
 *    properties:
 *     _id:
 *      type: ObjectId
 *      description: <b>enolični identifikator</b> anketarja
 *      example: 45a25e54cc55e42a456bdb32
 *     ime:
 *      type: string
 *      description: ime anketarja
 *     barva:
 *      type: string
 *      description: barva določena anketarju
 *     logo_uri:
 *      type: string
 *      description: povezava do logota anketarja
 *     wikipedia_uri:
 *      type: string
 *      description: povezava do Wikipedia strani anketarja
 *     opis:
 *      type: string
 *      description: opis anketarja
 *     opombe:
 *      type: string
 *      description: opombe anketarja
 *    required:
 *     - _id
 *     - ime
 */
const anketarji_shema = new mongoose.Schema({
    ime: { type: String, required: [true, "Ime je zahtevano polje"] },
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
 *      description: <b>enolični identifikator</b> naročnika
 *      example: 5f8024542bc87c975ffc1a70
 *     ime:
 *      type: string
 *      description: ime naročnika
 *     barva:
 *      type: string
 *      description: barva določena naročniku
 *     logo_uri:
 *      type: string
 *      description: povezava do logota naročnika
 *     wikipedia_uri:
 *      type: string
 *      description: povezava do Wikipedia strani naročnika
 *     opis:
 *      type: string
 *      description: opis naročnika
 *     opombe:
 *      type: string
 *      description: opombe naročnika
 *    required:
 *     - _id
 *     - ime
 */
const narocniki_shema = new mongoose.Schema({
    ime: { type: String, required: [true, "Ime je zahtevano polje"] },
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
 *   Kandidat:
 *    type: object
 *    description:
 *    properties:
 *     _id:
 *      type: ObjectId
 *      description: <b>enolični identifikator</b> kandidata
 *      example: 635a62f5dc5d7968e68464be
 *     ime:
 *      type: string
 *      description: ime kandidata
 *     priimek:
 *      type: string
 *      description: priimek kandidata
 *     stranka_id:
 *      type: ObjectId
 *      description: enolični identifikator stranke kandidata
 *     slika_uri:
 *      type: string
 *      description: povezava do slike kandidata
 *     wikipedia_uri:
 *      type: string
 *      description: povezava do Wikipedia strani kandidata
 *     opis:
 *      type: string
 *      description: opis kandidata
 *     opombe:
 *      type: string
 *      description: opombe kandidata
 *    required:
 *     - _id
 *     - ime
 *     - priimek
 */
const kandidati_shema = new mongoose.Schema({
    eid: { type: Number, required: [true, "Zunanji enolični identifikator je zahtevano polje"] },
    ime: { type: String, required: [true, "Ime je zahtevano polje"] },
    priimek: { type: String, required: [true, "Priimek je zahtevano polje"] },
    stranka_id : { type: ObjectId, required: false },
    slika_uri: { type: String, required: false },
    wikipedia_uri: { type: String, required: false },
    opis: { type: String, required: false },
    opombe: { type: String, required: false }
});

mongoose.model("Glasovanje", glasovanja_shema, "Glasovanja");
mongoose.model("Anketa", ankete_shema, "Ankete");
mongoose.model("Vprasanje", vprasanja_shema, "Vprasanja");
mongoose.model("Anketar", anketarji_shema, "Anketarji");
mongoose.model("Narocnik", narocniki_shema, "Narocniki");
mongoose.model("Stranka", stranke_shema, "Stranke");
mongoose.model("Kandidat", kandidati_shema, "Kandidati");
