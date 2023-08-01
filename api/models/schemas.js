const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

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
 *     anketar_id:
 *      type: number
 *      description: enolični identifikator ankete
 *     narocnik_id:
 *      type: number
 *      description: enolični identifikator ankete
 *     velikost_vzorca:
 *      type: string
 *      description: velikost vzorca ankete
 *     metoda:
 *      type: string
 *      description: metoda anketiranja
 *     zacetek:
 *      type: date
 *      description: datum začetka anketiranja
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
    anketar_id: { type: ObjectId, required: false },
    narocnik_id: { type: ObjectId, required: false },
    velikost_vzorca: { type: Number, required: false },
    metoda: { type: String, required: false },
    zacetek: { type: Date, required: false },
    konec: { type: Date, required: false },
    opis: { type: String, required: false },
    opombe: { type: String, required: false }
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
 *      type: string
 *      description: opombe vprašanja
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
    anketa_id: { type: ObjectId, required: [true, "Zunanji enolični identifikator ankete je zahtevano polje"] },
    vprasanje: { type: String, required: false },
    tip: { type: String, required: [true, "Tip vprašanja je zahtevano polje"] },
    glasovalno_tip: { type: String, required: [this.tip === "glasovalno", "Če je vprašanje glasovalno, potem je tip glasovanja zahtevano polje"] },
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
    ime_kratica: { type: String, required: false},
    barva: { type: String, required: false},
    logo_uri: { type: String, required: false},
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
 *      type: string
 *      description: <b>enolični identifikator</b> kandidata
 *      example: 635a62f5dc5d7968e68464be
 *     ime:
 *      type: string
 *      description: ime kandidata
 *     priimek:
 *      type: string
 *      description: priimek kandidata
 *     stranka_id:
 *      type: number
 *      description: enolični identifikator stranke kandidata
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
    opis: { type: String, required: false },
    opombe: { type: String, required: false }
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
 *      type: string
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
    ime: { type: String, required: [true, "Ime je zahtevano polje"] },
    tip: { type: String, required: false },
    zacetek: { type: Date, required: false },
    konec: { type: Date, required: false },
    opis: { type: String, required: false },
    opombe: { type: String, required: false }
});

mongoose.model("Anketa", ankete_shema, "Ankete");
mongoose.model("Vprasanje", vprasanja_shema, "Vprasanja");
mongoose.model("Anketar", anketarji_shema, "Anketarji");
mongoose.model("Narocnik", narocniki_shema, "Narocniki");
mongoose.model("Stranka", stranke_shema, "Stranke");
mongoose.model("Kandidat", kandidati_shema, "Kandidati");
mongoose.model("Glasovanje", glasovanja_shema, "Glasovanja");
