const mongoose = require("mongoose");
var ObjectId = require('mongoose').Types.ObjectId;
const Glasovanja = mongoose.model("Glasovanje");

// VERJETNO MORAM DODATI ŠE PARAMETRE, TUKAJ IN MARISKJE DRUGJE
/**
 * @openapi
 *  /glasovanja:
 *   get:
 *    summary: Pridobi seznam vseh glasovanj.
 *    description: Pridobi seznam vseh glasovanj, začenši s tistimi, ki so zadnja končala.
 *    tags: [Glasovanja]
 *    responses:
 *     '200':
 *      description: <b>OK</b>, s seznamom glasovanj.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Glasovanje'
 *        example:
 *         - _id: 64dd0169fc95108f8a064c40
 *           tip: [MANJKA]
 *           ime: Referendum o spremembah Zakona o vladi
 *           wikipedia: https://sl.wikipedia.org/wiki/Referendum_o_spremembah_Zakona_o_vladi
 *           zacetek: 2022-11-22
 *           konec: 2022-11-27
 *     '404':
 *      description: <b>Napaka pri poizvedbi</b>, s sporočilom napake.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/SporociloNapake'
 *        example:
 *         sporocilo: "Napaka pri poizvedbi: <opis napake>"
 */
const seznamGlasovanj = (req, res) => {
    // IZ NEZNANEGA RAZLOGA NE DELA (DELA PA V MONGOSH IN COMPASS)
    const query = {};
    if (req.query.raven_oblasti) {
        query.tip = {}
        query.tip.raven_oblasti = req.query.raven_oblasti
    }
    if (req.query.tip) {
        query.tip.tip = req.query.tip
    }
    if (req.query.referendum_tip) {
        query.tip.referendum_tip = req.query.referendum_tip
    }
    if (req.query.volitve_tip) {
        query.tip.volitve_tip = req.query.volitve_tip
    }

    Glasovanja.find(query).sort('-konec').limit(req.query.limit).exec(function (error, seznam) { // če je req.query.limit undefined, se limit() ignorira
        if (error) {
            res.status(404).json({sporocilo: "Napaka pri poizvedbi: " + error});
        } else {
            res.status(200).json(seznam);
        }
    });
};

/**
 * @openapi
 * /glasovanja/{id}:
 *  get:
 *   summary: Vrni podrobnosti glasovanja.
 *   description: Vrni podrobnosti glasovanja na podlagi enoličnega identifikatorja.
 *   tags: [Glasovanja]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> glasovanja
 *      required: true
 *   responses:
 *    '200':
 *     description: <b>OK</b>, glasovanje najdeno.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Glasovanja'
 *       example:
 *        - _id: 64dd0169fc95108f8a064c40
 *          tip: MANJKA
 *          ime: Referendum o spremembah Zakona o vladi
 *          wikipedia_uri: https://sl.wikipedia.org/wiki/Referendum_o_spremembah_Zakona_o_vladi
 *          zacetek: 2022-11-22
 *          konec: 2022-11-27
 *    '404':
 *     description: 'Ne najdem glasovanja s podanim enoličnim identifikatorjem.'
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
const podrobnostiGlasovanja = (req, res) => {
    const idGlasovanja = req.params.id;

    Glasovanja.findById(idGlasovanja).exec(function (
        error,
        glasovanje
    ) {
        if (!glasovanje) {
            res.status(404).json({
                sporocilo:
                    "Ne najdem glasovanja s podanim enoličnim identifikatorjem",
            });
        } else if (error) {
            res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
        } else {
            res.status(200).json(glasovanje);
        }
    });
};
/**
 * @openapi
 * /glasovanja:
 *  post:
 *   summary: Doda novo glasovanje v bazo.
 *   description: Doda novo glasovanje z vsemi izpolnjenimi podatki v bazo.
 *   tags: [Glasovanja]
 *   requestBody:
 *    description: Glasovanje
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        tip:
 *          required: true
 *          example: MANJKA
 *        ime:
 *          required: true
 *          example: Referendum o spremembah Zakona o vladi
 *        wikipedia_uri:
 *          required: false
 *          example: https://sl.wikipedia.org/wiki/Referendum_o_spremembah_Zakona_o_vladi
 *        zacetek:
 *          required: false
 *          example: 2022-11-22
 *        konec:
 *          required: false
 *          example: 2022-11-27
 *   responses:
 *    '201':
 *     description: Uspešno <b>ustvarjeno</b> novo glasovanje.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Glasovanje'
 *    '401':
 *     description: <b>Napaka</b>, ni pravice dostopa.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo.
 */
const ustvariGlasovanje = (req, res) => {
    const glasovanje = {};

    // VERJETNO POTREBNO POPRAVITI, DA USTREZA REQUIRED ZAHTEVAM
    if (req.body.tip.raven_oblasti) {
        glasovanje.tip.raven_oblasti = req.body.tip.raven_oblasti
    }
    if (req.body.tip.tip) {
        glasovanje.tip.tip = req.body.tip.tip
    }
    if (req.body.tip.tip === 'volitve' && req.body.tip.volitve_tip) {
        glasovanje.tip.volitve_tip = req.body.tip.volitve_tip;
    }
    if (req.body.tip.tip === 'referendum' && req.body.tip.referendum_tip) {
        glasovanje.tip.referendum_tip = req.body.tip.referendum_tip;
    }
    if (req.body.ime) {
        glasovanje.ime = req.body.ime;
    }
    if (req.body.zacetek) {
        glasovanje.zacetek = req.body.zacetek;
    }
    if (req.body.konec) {
        glasovanje.konec = req.body.konec;
    }
    if (req.body.opis) {
        glasovanje.opis = req.body.opis;
    }
    if (req.body.opombe) {
        glasovanje.opombe = req.body.opombe;
    }

    Glasovanja.create(glasovanje, function (error, glasovanje) {
        if (error) {
            res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
        } else {
            res.status(201).json(glasovanje);
        }
    });
};

/**
 * @openapi
 * /glasovanja/{id}:
 *  put:
 *   summary: Posodobi glasovanje.
 *   description: Posodobi glasovanje z izbranim enoličnim identifikatorjem.
 *   tags: [Glasovanja]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: <b>enolični identifikator</b> glasovanja
 *      required: true
 *      example: 64dd0169fc95108f8a064c40
 *   requestBody:
 *    description: Glasovanje
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        tip:
 *          example: MANJKA
 *        ime:
 *          example: Referendum o spremembah Zakona o vladi
 *        wikipedia_uri:
 *          example: https://sl.wikipedia.org/wiki/Referendum_o_spremembah_Zakona_o_vladi
 *        zacetek:
 *          example: 2022-11-22
 *        konec:
 *          example: 2022-11-27
 *   responses:
 *    '200':
 *     description: <b>OK</b>, pri posodabljanju glasovanja
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Glasovanje'
 *    '404':
 *     description: Glasovanje s tem <b>enoličnim identifikatorjem</b> ne obstaja, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        glasovanje ni najdeno:
 *         value:
 *          message: Ne najdem glasovanja s podanim enoličnim identifikatorjem
 *    '500':
 *     description: <b>Napaka na strežniku</b>, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo
 */
const posodobiGlasovanje = (req, res) => {
    const idGlasovanja= req.params.id;

    Glasovanja.findById(idGlasovanja).exec(function (
        error,
        glasovanje
    ) {
        if (!glasovanje) {
            res.status(404).json({
                sporocilo:
                    "Ne najdem glasovanja s podanim enoličnim identifikatorjem",
            });
        } else {
            // VERJETNO POTREBNO POPRAVITI, DA USTREZA REQUIRED ZAHTEVAM
            if (req.body.tip.raven_oblasti) {
                glasovanje.tip.raven_oblasti = req.body.tip.raven_oblasti
            }
            if (req.body.tip.tip) {
                glasovanje.tip.tip = req.body.tip.tip
            }
            if (req.body.tip.tip === 'volitve' && req.body.tip.volitve_tip) {
                glasovanje.tip.volitve_tip = req.body.tip.volitve_tip;
            }
            if (req.body.tip.tip === 'referendum' && req.body.tip.referendum_tip) {
                glasovanje.tip.referendum_tip = req.body.tip.referendum_tip;
            }
            if (req.body.ime) {
                glasovanje.ime = req.body.ime;
            }
            if (req.body.zacetek) {
                glasovanje.zacetek = req.body.zacetek;
            }
            if (req.body.konec) {
                glasovanje.konec = req.body.konec;
            }
            if (req.body.opis) {
                glasovanje.opis = req.body.opis;
            }
            if (req.body.opombe) {
                glasovanje.opombe = req.body.opombe;
            }

            glasovanje.save(function (error, glasovanje) {
                if (error) {
                    res
                        .status(500)
                        .json({sporocilo: "Napaka na strežniku: " + error});
                } else {
                    res.status(200).json(glasovanje);
                }
            });
        }
    });
};

/**
 * @openapi
 * /glasovanja/{id}:
 *  delete:
 *   summary: Izbriše glasovanje.
 *   description: Izbriše glasovanje s podanim enoličnim identifikatorjem.
 *   tags: [Glasovanja]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> glasovanja
 *      required: true
 *      example: 64dd0169fc95108f8a064c40
 *   responses:
 *    '204':
 *     description: Glasovanje je izbrisano.
 *    '400':
 *     description: <b>Napaka</b>, enolični identifikator glasovanja je zahtevan podatek.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: 'Enolični identifikator glasovanja je obvezen podatek!'
 *    '404':
 *     description: Glasovanje ni bilo najdeno.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        Glasovanje ni bilo najdeno:
 *         value:
 *          message: Ne najdem glasovanja s podanim enoličnim identifikatorjem.
 *    '500':
 *     description: '<b>Napaka na strežniku</b>, s sporočilom napake.'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo.
 */
const izbrisiGlasovanje = (req, res) => {
    const idGlasovanja = req.params.id;
    if (!idGlasovanja) {
        res
            .status(400)
            .json({sporocilo: "Enolični identifikator glasovanja je obvezen podatek!"});
    } else {
        Glasovanja.findByIdAndRemove(
            idGlasovanja,
            function (error, rezultat) {
                if (!rezultat) {
                    res.status(404).json({
                        sporocilo:
                            "Ne najdem glasovanja s podanim enoličnim identifikatorjem",
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
    seznamGlasovanj,
    podrobnostiGlasovanja,
    ustvariGlasovanje,
    posodobiGlasovanje,
    izbrisiGlasovanje,
};
