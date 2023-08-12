const mongoose = require("mongoose");
var ObjectId = require('mongoose').Types.ObjectId; 
const { isConstructorDeclaration } = require("typescript"); // od kje to?
const Vprasanja = mongoose.model("Vprasanje");

// TU MANJKA ŠE DOKUMENTACIJA
// /**
//  * @openapi
//  *  /vprasanja:
//  *   get:
//  *    summary: Pridobi seznam vseh vprašanj.
//  *    description: Pridobi seznam vseh vprašanj, ki se nahajajo v podatkovni bazi. Vprašanja so sortirana po datumu
//  *    tags: [Vprašanja]
//  *    responses:
//  *     '200':
//  *      description: <b>OK</b>, s seznamom vprašanj.
//  *      content:
//  *       application/json:
//  *        schema:
//  *         $ref: '#/components/schemas/Vprasanje'
//  *        example:
//  *         - _id: 8de77b45a6a5236288aa264f
//  *           anketa_id: 873c017fc587d5ade7830b7a
//  *           vprasanje: Če bi bile volitve v nedeljo, katero stranko bi volili v Državni zbor?
//  *           tip: glasovalno
//  *           glasovalno_tip: dz
//  *           odgovori: [
//  *             {
//  *                odgovor_tip: BG-V
//  *                odgovor_stranka_id: c32ae76a892c5c270a7acb1f
//  *                procent_anketar: 24.7
//  *                procent_iz_calculated: null
//  *                procent_spodnja_meja_anketar: null
//  *                procent_spodnja_meja_iz_calculated: 22.1
//  *                procent_zgornja_meja_anketar: null
//  *                procent_zgornja_meja_iz_calculated: 28.2
//  *                st_mandatov_anketar: 25
//  *                st_mandatov_iz_calculated: null
//  *                st_mandatov_spodnja_meja_anketar: null
//  *                st_mandatov_spodnja_meja_iz_calculated: 22
//  *                st_mandatov_zgornja_meja_anketar: null
//  *                st_mandatov_zgornja_meja_iz_calculated: 28
//  *                stevilo_anketirancev_anketar: null
//  *                stevilo_anketirancev_iz_calculated: 28
//  *             },
//  *             {
//  *                odgovor_tip: BG-V
//  *                odgovor_stranka_id: a79677ebd4dbd3bd7642deca
//  *                procent_anketar: 52.3
//  *                procent_iz_calculated: null
//  *                procent_spodnja_meja_anketar: null
//  *                procent_spodnja_meja_iz_calculated: 48.3
//  *                procent_zgornja_meja_anketar: null
//  *                procent_zgornja_meja_iz_calculated: 55.1
//  *                st_mandatov_anketar: 25
//  *                st_mandatov_iz_calculated: null
//  *                st_mandatov_spodnja_meja_anketar: null
//  *                st_mandatov_spodnja_meja_iz_calculated: 22
//  *                st_mandatov_zgornja_meja_anketar: null
//  *                st_mandatov_zgornja_meja_iz_calculated: 28
//  *                stevilo_anketirancev_anketar: null
//  *                stevilo_anketirancev_iz_calculated: 748
//  *              }
//  *              {
//  *                  odgovor_tip: BG-NV
//  *                  procent_anketar: 52.3
//  *                  procent_iz_calculated: null
//  *                  procent_spodnja_meja_anketar: null
//  *                  procent_spodnja_meja_iz_calculated: 48.3
//  *                  procent_zgornja_meja_anketar: null
//  *                  procent_zgornja_meja_iz_calculated: 55.1
//  *                  stevilo_anketirancev_anketar: null
//  *                  stevilo_anketirancev_iz_calculated: 748
//  *              }
//  *              {
//  *                  odgovor_tip: NBG
//  *                  procent_anketar: 52.3
//  *                  procent_iz_calculated: null
//  *                  procent_spodnja_meja_anketar: null
//  *                  procent_spodnja_meja_iz_calculated: 48.3
//  *                  procent_zgornja_meja_anketar: null
//  *                  procent_zgornja_meja_iz_calculated: 55.1
//  *                  stevilo_anketirancev_anketar: null
//  *                  stevilo_anketirancev_iz_calculated: 748
//  *              }
//  *              ]
//  *     '404':
//  *      description: <b>Napaka pri poizvedbi</b>, s sporočilom napake.
//  *      content:
//  *       application/json:
//  *        schema:
//  *         $ref: '#/components/schemas/SporociloNapake'
//  *        example:
//  *         sporocilo: "Napaka pri poizvedbi: <opis napake>"
//  */
// BREZ SORTIRANJA PO DATUMU
// const seznamVprasanj = (req, res) => {
//     Vprasanja.find().exec(function (error, seznam) {
//         if (error) {
//             res.status(404).json({sporocilo: "Napaka pri poizvedbi: " + error});
//         } else {
//             res.status(200).json(seznam);
//         }
//     });
// };

// S SORTIRANJEM PO DATUMU
const seznamVprasanj = (req, res) => {
    Vprasanja.aggregate([
        {
            $lookup: {
                from: 'Ankete',
                localField: 'anketa_id',
                foreignField: '_id',
                as: 'anketa_details'
            }
        },
        {
            $unwind: '$anketa_details'
        },
        {
            $project: {
                '_id': 1,
                'anketa_id': 1,
                'anketa_zacetek': "$anketa_details.zacetek",
                'anketa_sredina': "$anketa_details.sredina",
                'anketa_konec': "$anketa_details.konec",
                'vprasanje': 1,
                'tip': 1,
                'glasovalno_tip': 1,
                'opis': 1,
                'opombe': 1,
                'odgovori': 1
            }
        },
        {
            $sort: {
                'anketa_sredina': -1
            }
        }
    ]).exec(function (error, seznam) {
        if (error) {
            res.status(404).json({sporocilo: "Napaka pri poizvedbi: " + error});
        } else {
            res.status(200).json(seznam);
        }
    });
};

// TU MANJKA ŠE DOKUMENTACIJA
// /**
//  * @openapi
//  * /ankete/{id}:
//  *  get:
//  *   summary: Vrni podrobnosti ankete.
//  *   description: Vrni podrobnosti ankete na podlagi enoličnega identifikatorja.
//  *   tags: [Ankete]
//  *   parameters:
//  *    - name: id
//  *      in: path
//  *      schema:
//  *       type: string
//  *      description: <b>enolični identifikator</b> ankete
//  *      required: true
//  *   responses:
//  *    '200':
//  *     description: <b>OK</b>, anketa najdena.
//  *     content:
//  *      application/json:
//  *       schema:
//  *        $ref: '#/components/schemas/Anketa'
//  *       example:
//  *        - _id: 873c017fc587d5ade7830b7a
//  *          anketar_id: 45a25e54cc55e42a456bdb32
//  *          narocnik_id: 13153ec4d64ceb8d276eae42
//  *          velikost_vzorca: 800
//  *          metoda: CATI
//  *          zacetek: 2023-02-16
//  *          konec: 2023-02-20
//  *          opis: Anketa je bila izvedena v času razgretih družbenopolitičnih razmer
//  *          opombe: Malo več kot polovica ljudi se na klic ni odzvalo
//  *    '404':
//  *     description: 'Ne najdem ankete s podanim enoličnim identifikatorjem.'
//  *     content:
//  *      application/json:
//  *       schema:
//  *        $ref: '#/components/schemas/SporociloNapake'
//  *       example:
//  *        sporocilo: "Napaka pri poizvedbi: <opis napake>"
//  *    '500':
//  *     description: 'Nepričakovana napaka na strežniku.'
//  *     content:
//  *      application/json:
//  *       schema:
//  *        $ref: '#/components/schemas/SporociloNapake'
//  *       example:
//  *        sporocilo: "Napaka na strežniku: <opis napake>"
//  */
const podrobnostiVprasanja = (req, res) => {
    const idVprasanja = req.params.id;

    Vprasanja.findById(idVprasanja).exec(function (
        error,
        vprasanje
    ) {
        if (!vprasanje) {
            res.status(404).json({
                sporocilo:
                    "Ne najdem vprašanja s podanim enoličnim identifikatorjem",
            });
        } else if (error) {
            res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
        } else {
            res.status(200).json(vprasanje);
        }
    });
};

// MANJKA DOKUMENTACIJA
const seznamVprasanjAnketa = (req, res) => {
    const idAnkete = req.params.id;
    Vprasanja.find({anketa_id: new ObjectId(req.params.id)}).exec(function (
        error,
        vprasanja
    ) {
        if (!vprasanja) {
            res.status(404).json({
                sporocilo:
                    "Ne najdem vprašanj pripadajočih anketi s podanim enoličnim identifikatorjem",
            });
        } else if (error) {
            res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
        } else {
            res.status(200).json(vprasanja);
        }
    });
};

// MANJKA DOKUMENTACIJA
const seznamVprasanjGlasovalnaDZ = (req, res) => {
    Vprasanja.find({glasovalno_tip: "DZ"}).exec(function (error, seznam) {
        if (error) {
            res.status(404).json({sporocilo: "Napaka pri poizvedbi: " + error});
        } else {
            res.status(200).json(seznam);
        }
    });
};
/**
 * @openapi
 * /ankete:
 *  post:
 *   summary: Doda novo anketo v bazo.
 *   description: Doda novo anketo z vsemi izpolnjenimi podatki v bazo.
 *   tags: [Ankete]
 *   requestBody:
 *    description: Anketa
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        anketar_id:
 *          required: false
 *          example: 45a25e54cc55e42a456bdb32
 *        narocnik_id:
 *          required: false
 *          example: 13153ec4d64ceb8d276eae42
 *        velikost_vzorca:
 *          required: false
 *          example: 800
 *        metoda:
 *          required: false
 *          example: CATI
 *        zacetek:
 *          required: false
 *          example: 2023-02-16
 *        konec:
 *          required: false
 *          example: 2023-02-28
 *        opis:
 *          required: false
 *          example: Anketa je bila izvedena v času razgretih družbenopolitičnih razmer
 *        opombe:
 *          required: false
 *          example: Malo več kot polovica ljudi se na klic ni odzvalo
 *   responses:
 *    '201':
 *     description: Uspešno <b>ustvarjena</b> nova anketa.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Anketa'
 *    '401':
 *     description: <b>Napaka</b>, ni pravice dostopa.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo.
 */
const ustvariAnketo = (req, res) => { // !!! še vedno govori o anketah
    const novaAnketa = {};

    if (req.body.anketar_id) {
        novaAnketa.anketar_id = req.body.anketar_id;
    }
    if (req.body.narocnik_id) {
        novaAnketa.narocnik_id = req.body.narocnik_id;
    }
    if (req.body.velikost_vzorca) {
        novaAnketa.velikost_vzorca = req.body.velikost_vzorca;
    }
    if (req.body.metoda) {
        novaAnketa.metoda = req.body.metoda;
    }
    if (req.body.zacetek) {
        novaAnketa.zacetek = req.body.zacetek;
    }
    if (req.body.konec) {
        novaAnketa.konec = req.body.konec;
    }
    if (req.body.opis) {
        novaAnketa.opis = req.body.opis;
    }
    if (req.body.opombe) {
        novaAnketa.opombe = req.body.opombe;
    }

    Ankete.create(novaAnketa, function (error, anketa) {
        if (error) {
            res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
        } else {
            res.status(201).json(anketa);
        }
    });
};

/**
 * @openapi
 * /ankete/{id}:
 *  put:
 *   summary: Posodobi anketo.
 *   description: Posodobi anketo z izbranim enoličnim identifikatorjem.
 *   tags: [Ankete]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: <b>enolični identifikator</b> ankete
 *      required: true
 *      example: 873c017fc587d5ade7830b7a
 *   requestBody:
 *    description: Anketa
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        anketar_id:
 *          example: 45a25e54cc55e42a456bdb32
 *        narocnik_id:
 *          example: 13153ec4d64ceb8d276eae42
 *        velikost_vzorca:
 *          example: 800
 *        metoda:
 *          example: CATI
 *        zacetek:
 *          example: 2023-02-16
 *        konec:
 *          example: 2023-02-28
 *        opis:
 *          example: Anketa je bila izvedena v času razgretih družbenopolitičnih razmer
 *        opombe:
 *          example: Malo več kot polovica ljudi se na klic ni odzvalo
 *   responses:
 *    '200':
 *     description: <b>OK</b>, pri posodabljanju ankete
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Anketa'
 *    '404':
 *     description: Anketa s tem <b>enoličnim identifikatorjem</b> ne obstaja, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        anketa ni najdena:
 *         value:
 *          message: Ne najdem ankete s podanim enoličnim identifikatorjem
 *    '500':
 *     description: <b>Napaka na strežniku</b>, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo
 */
const posodobiAnketo = (req, res) => { // !!! še vedno govori o anketah
    const idAnkete = req.params.id;

    Ankete.findById(idAnkete).exec(function (
        error,
        anketa
    ) {
        if (!anketa) {
            res.status(404).json({
                sporocilo:
                    "Ne najdem ankete s podanim enoličnim identifikatorjem",
            });
        } else {
            if (req.body.anketar_id) {
                anketa.anketar_id = req.body.anketar_id;
            }
            if (req.body.narocnik_id) {
                anketa.narocnik_id = req.body.narocnik_id;
            }
            if (req.body.velikost_vzorca) {
                anketa.velikost_vzorca = req.body.velikost_vzorca;
            }
            if (req.body.metoda) {
                anketa.metoda = req.body.metoda;
            }
            if (req.body.zacetek) {
                anketa.zacetek = req.body.zacetek;
            }
            if (req.body.konec) {
                anketa.konec = req.body.konec;
            }
            if (req.body.opis) {
                anketa.opis = req.body.opis;
            }
            if (req.body.opombe) {
                anketa.opombe = req.body.opombe;
            }

            anketa.save(function (error, anketa) {
                if (error) {
                    res
                        .status(500)
                        .json({sporocilo: "Napaka na strežniku: " + error});
                } else {
                    res.status(200).json(anketa);
                }
            });
        }
    });
};

/**
 * @openapi
 * /ankete/{id}:
 *  delete:
 *   summary: Izbriše anketo.
 *   description: Izbriše anketo s podanim enoličnim identifikatorjem.
 *   tags: [Ankete]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> ankete
 *      required: true
 *      example: 873c017fc587d5ade7830b7a
 *   responses:
 *    '204':
 *     description: Anketa je izbrisana.
 *    '400':
 *     description: <b>Napaka</b>, enolični identifikator ankete je zahtevan podatek.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: 'Enolični identifikator ankete je obvezen podatek!'
 *    '404':
 *     description: Anketa ni bila najdena.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        Anketa ni bila najdena:
 *         value:
 *          message: Ne najdem ankete s podanim enoličnim identifikatorjem.
 *    '500':
 *     description: '<b>Napaka na strežniku</b>, s sporočilom napake.'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo.
 */
const izbrisiAnketo = (req, res) => {
    const idAnkete = req.params.id;
    if (!idAnkete) {
        res
            .status(400)
            .json({sporocilo: "Enolični identifikator ankete je obvezen podatek!"});
    } else {
        Ankete.findByIdAndRemove(
            idAnkete,
            function (error, rezultat) {
                if (!rezultat) {
                    res.status(404).json({
                        sporocilo:
                            "Ne najdem ankete s podanim enoličnim identifikatorjem",
                    });
                } else if (error) {
                    res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
                } else {
                    res.status(204).send();
                }
            }
        );
    }
};

module.exports = {
    seznamVprasanj,
    podrobnostiVprasanja,
    seznamVprasanjAnketa,
    seznamVprasanjGlasovalnaDZ,
    ustvariAnketo,
    posodobiAnketo,
    izbrisiAnketo,
};
