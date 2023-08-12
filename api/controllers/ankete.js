const mongoose = require("mongoose");
var ObjectId = require('mongoose').Types.ObjectId;
const Ankete = mongoose.model("Anketa");

/**
 * @openapi
 *  /ankete:
 *   get:
 *    summary: Pridobi seznam vseh anket.
 *    description: Pridobi seznam vseh anket, začenši s tistimi, ki so zadnje končale z anketiranjem.
 *    tags: [Ankete]
 *    responses:
 *     '200':
 *      description: <b>OK</b>, s seznamom anket.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Anketa'
 *        example:
 *         - _id: 873c017fc587d5ade7830b7a
 *           anketarji_id: [45a25e54cc55e42a456bdb32]
 *           narocniki_id: [13153ec4d64ceb8d276eae42]
 *           velikost_vzorca: 800
 *           metoda: CATI
 *           zacetek: 2023-02-16
 *           sredina: 2023-02-18
 *           konec: 2023-02-20
 *           opis: Anketa je bila izvedena v času razgretih družbenopolitičnih razmer
 *           opombe: Malo več kot polovica ljudi se na klic ni odzvalo
 *     '404':
 *      description: <b>Napaka pri poizvedbi</b>, s sporočilom napake.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/SporociloNapake'
 *        example:
 *         sporocilo: "Napaka pri poizvedbi: <opis napake>"
 */
const seznamAnket = (req, res) => {
    const query = {};
    if (req.query.anketar) {
        query.anketarji_id = [new ObjectId(req.query.anketar)]
    }
    if (req.query.narocnik) {
        query.narocniki_id = [new ObjectId(req.query.narocnik)]
    }
    // če je req.query.limit undefined, se limit() ignorira
    Ankete.find(query).sort('-sredina').limit(req.query.limit).exec(function (error, seznam) {
        if (error) {
            res.status(404).json({sporocilo: "Napaka pri poizvedbi: " + error});
        } else {
            res.status(200).json(seznam);
        }
    });
};

/**
 * @openapi
 * /ankete/{id}:
 *  get:
 *   summary: Vrni podrobnosti ankete.
 *   description: Vrni podrobnosti ankete na podlagi enoličnega identifikatorja.
 *   tags: [Ankete]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> ankete
 *      required: true
 *   responses:
 *    '200':
 *     description: <b>OK</b>, anketa najdena.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Anketa'
 *       example:
 *        - _id: 873c017fc587d5ade7830b7a
 *          anketarji_id: [45a25e54cc55e42a456bdb32]
 *          narocniki_id: [13153ec4d64ceb8d276eae42]
 *          velikost_vzorca: 800
 *          metoda: CATI
 *          zacetek: 2023-02-16
 *          sredina: 2023-02-18
 *          konec: 2023-02-20
 *          opis: Anketa je bila izvedena v času razgretih družbenopolitičnih razmer
 *          opombe: Malo več kot polovica ljudi se na klic ni odzvalo
 *    '404':
 *     description: 'Ne najdem ankete s podanim enoličnim identifikatorjem.'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        sporocilo: "Napaka pri poizvedbi: <opis napake>"
 *    '500':
 *     description: 'Nepričakovana napaka na strežniku.'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        sporocilo: "Napaka na strežniku: <opis napake>"
 */
const podrobnostiAnkete = (req, res) => {
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
        } else if (error) {
            res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
        } else {
            res.status(200).json(anketa);
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
 *        anketarji_id:
 *          required: false
 *          example: [45a25e54cc55e42a456bdb32]
 *        narocniki_id:
 *          required: false
 *          example: [13153ec4d64ceb8d276eae42]
 *        velikost_vzorca:
 *          required: false
 *          example: 800
 *        metoda:
 *          required: false
 *          example: CATI
 *        zacetek:
 *          required: false
 *          example: 2023-02-16
 *        sredina:
 *          required: false
 *          example: 2023-02-18
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
const ustvariAnketo = (req, res) => {
    const novaAnketa = {};

    // POTREBNO POSODOBITI
    if (req.body.anketarji_id) {
        novaAnketa.anketarji_id = req.body.anketarji_id;
    }
    if (req.body.narocniki_id) {
        novaAnketa.narocniki_id = req.body.narocniki_id;
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
 *        anketarji_id:
 *          example: [45a25e54cc55e42a456bdb32]
 *        narocniki_id:
 *          example: [13153ec4d64ceb8d276eae42]
 *        velikost_vzorca:
 *          example: 800
 *        metoda:
 *          example: CATI
 *        zacetek:
 *          example: 2023-02-16
 *        sredina:
 *          example: 2023-02-18
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
const posodobiAnketo = (req, res) => {
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
            if (req.body.anketarji_id) {
                anketa.anketarji_id = req.body.anketarji_id;
            }
            if (req.body.narocniki_id) {
                anketa.narocniki_id = req.body.narocniki_id;
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
    seznamAnket,
    podrobnostiAnkete,
    ustvariAnketo,
    posodobiAnketo,
    izbrisiAnketo,
};
