const mongoose = require("mongoose");
const Stranke = mongoose.model("Stranka");

/**
 * @openapi
 *  /stranke:
 *   get:
 *    summary: Pridobi seznam vseh strank.
 *    description: Pridobi seznam vseh strank, ki se nahajajo v podatkovni bazi.
 *    tags: [Stranke]
 *    responses:
 *     '200':
 *      description: <b>OK</b>, s seznamom strank.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Stranka'
 *        example:
 *         - _id: a79677ebd4dbd3bd7642deca
 *           ime: Gibanje svoboda
 *           ime_kratica: GS
 *           indeks_LD: 5
 *           barva: #015CA4
 *           opis: Gibanje svoboda je stranka, ki je nastala pred državnozborskimi volitvami leta 2022
 *           opombe: Včasih se je imenovala Stranka zelenih dejanj
 *     '404':
 *      description: <b>Napaka pri poizvedbi</b>, s sporočilom napake.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/SporociloNapake'
 *        example:
 *         sporocilo: "Napaka pri poizvedbi: <opis napake>"
 */
const seznamStrank = (req, res) => {
    Stranke.find().exec(function (error, seznam) {
        if (error) {
            res.status(404).json({sporocilo: "Napaka pri poizvedbi: " + error});
        } else {
            res.status(200).json(seznam);
        }
    });
};
/**
 * @openapi
 * /stranke/{id}:
 *  get:
 *   summary: Vrni podrobnosti stranke.
 *   description: Vrni podrobnosti stranke na podlagi njenega enoličnega identifikatorja.
 *   tags: [Stranke]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> stranke
 *      required: true
 *   responses:
 *    '200':
 *     description: <b>OK</b>, stranka najdena.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Stranka'
 *       example:
 *         - _id: a79677ebd4dbd3bd7642deca
 *           ime: Gibanje svoboda
 *           ime_kratica: GS
 *           indeks_LD: 5
 *           barva: #015CA4
 *           opis: Gibanje svoboda je stranka, ki je nastala pred državnozborskimi volitvami leta 2022
 *           opombe: Včasih se je imenovala Stranka zelenih dejanj
 *    '404':
 *     description: 'Ne najdem stranke s podanim enoličnim identifikatorjem.'
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
const podrobnostiStranke = (req, res) => {
    const idStranke = req.params.id;

    Stranke.findById(idStranke).exec(function (
        error,
        stranka
    ) {
        if (!stranka) {
            res.status(404).json({sporocilo: "Ne najdem stranke s podanim enoličnim identifikatorjem"});
        } else if (error) {
            res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
        } else {
            res.status(200).json(stranka);
        }
    });
};
/**
 * @openapi
 * /stranke:
 *  post:
 *   summary: Doda novo stranko v bazo.
 *   description: Doda novo stranko z vsemi zahtevanimi podatki v bazo.
 *   tags: [Stranke]
 *   requestBody:
 *    description: Stranka
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        ime:
 *          required: true
 *          example: Gibanje svoboda
 *       required:
 *        - ime
 *   responses:
 *    '201':
 *     description: Uspešno <b>ustvarjena</b> nova stranka.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Stranka'
 *    '400':
 *     description: <b>Napaka</b>, niso vneseni vsi zahtevani podatki.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        ime is required:
 *         value:
 *          message: Parameter 'ime' je obvezen
 *    '401':
 *     description: <b>Napaka</b>, ni pravice dostopa.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo
 */
const ustvariStranko = (req, res) => {
    if (!req.body.ime) {
        res
            .status(400)
            .json({sporocilo: "Potrebno je vnesti vse obvezne podatke!"});
    } else {
        const novaStranka = {ime: req.body.ime};
        if (req.body.ime_kratica) {
            novaStranka.opis = req.body.ime_kratica;
        }
        if (req.body.indeks_LD) {
            novaStranka.indeks_LD = req.body.indeks_LD;
        }
        if (req.body.barva) {
            novaStranka.opis = req.body.barva;
        }
        if (req.body.logo_uri) {
            novaStranka.opis = req.body.logo_uri;
        }
        if (req.body.opis) {
            novaStranka.opis = req.body.opis;
        }
        if (req.body.opombe) {
            novaStranka.opombe = req.body.opombe;
        }

        Stranke.create(novaStranka, function (error, stranka) {
            if (error) {
                res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
            } else {
                res.status(201).json(stranka);
            }
        });
    }
};

/**
 * @openapi
 * /stranke/{id}:
 *  put:
 *   summary: Posodobi stranko.
 *   description: Posodobi stranko z izbranim enoličnim identifikatorjem.
 *   tags: [Stranke]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: <b>enolični identifikator</b> stranke
 *      required: true
 *      example: a79677ebd4dbd3bd7642deca
 *   requestBody:
 *    description: Stranka
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        ime:
 *          example: Gibanje svoboda
 *        ime_kratica:
 *          example: GS
 *        indeks_LD:
 *          example: 5
 *        barva:
 *          example: #015CA4
 *        logo_uri:
 *          example: https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Gibanje_Svoboda_logo.svg/2880px-Gibanje_Svoboda_logo.svg.png
 *        opis:
 *          example: Gibanje svoboda je stranka, ki je nastala pred državnozborskimi volitvami leta 2022
 *        opombe:
 *          example: Včasih se je imenovala Stranka zelenih dejanj
 *       required:
 *        - ime
 *   responses:
 *    '200':
 *     description: <b>OK</b>, pri posodabljanju stranke
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Stranka'
 *    '400':
 *     description: <b>Napaka</b>, niso vneseni vsi zahtevani podatki
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        ime ni podano:
 *         value:
 *          message: Polje 'ime' mora biti obvezno podano
 *    '404':
 *     description: Stranka s tem <b>enoličnim identifikatorjem</b> ne obstaja, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        stranka ni najdena:
 *         value:
 *          message: Ne najdem stranke s podanim enoličnim identifikatorjem
 *    '500':
 *     description: <b>Napaka na strežniku</b>, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo
 */
const posodobiStranko = (req, res) => {
    const idStranke = req.params.id;

    if (
        !req.body.ime
    ) {
        res.status(400).json({
            sporocilo: "Napaka, niso vneseni vsi zahtevani podatki",
        });
    } else {
        Stranke.findById(idStranke).exec(function (
            error,
            stranka
        ) {
            if (!stranka) {
                res.status(404).json({
                    sporocilo:
                        "Ne najdem stranke s podanim enoličnim identifikatorjem",
                });
            } else {
                stranka.ime = req.body.ime;
                if (req.body.ime_kratica) {
                    novaStranka.opis = req.body.ime_kratica;
                }
                if (req.body.indeks_LD) {
                    novaStranka.indeks_LD = req.body.indeks_LD;
                }
                if (req.body.barva) {
                    novaStranka.opis = req.body.barva;
                }
                if (req.body.logo_uri) {
                    novaStranka.opis = req.body.logo_uri;
                }
                if (req.body.opis) {
                    stranka.opis = req.body.opis;
                }
                if (req.body.opombe) {
                    stranka.opombe = req.body.opombe;
                }

                stranka.save(function (error, stranka) {
                    if (error) {
                        res
                            .status(500)
                            .json({sporocilo: "Napaka na strežniku: " + error});
                    } else {
                        res.status(200).json(stranka);
                    }
                });
            }
        });
    }
};

/**
 * @openapi
 * /stranke/{id}:
 *  delete:
 *   summary: Izbriše stranko.
 *   description: Izbriše stranko s podanim enoličnim identifikatorjem.
 *   tags: [Stranke]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> stranke
 *      required: true
 *      example: a79677ebd4dbd3bd7642deca
 *   responses:
 *    '204':
 *     description: Stranka je izbrisana
 *    '400':
 *     description: <b>Napaka</b>, enolični identifikator stranke je zahtevan podatek.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Enolični identifikator stranke je obvezen podatek
 *    '404':
 *     description: Stranka ni bila najdena
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        Stranka ni bila najdena:
 *         value:
 *          message: Ne najdem stranke s podanim enoličnim identifikatorjem
 *    '500':
 *     description: '<b>Napaka na strežniku</b>, s sporočilom napake.'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo
 */
const izbrisiStranko = (req, res) => {
    const idStranke = req.params.id;
    if (!idStranke) {
        res
            .status(400)
            .json({sporocilo: "Enolični identifikator stranke je obvezen podatek"});
    } else {
        Stranke.findByIdAndRemove(
            idStranke,
            function (error, rezultat) {
                if (!rezultat) {
                    res.status(404).json({
                        sporocilo:
                            "Ne najdem stranke s podanim enoličnim identifikatorjem",
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
    seznamStrank,
    podrobnostiStranke,
    ustvariStranko,
    posodobiStranko,
    izbrisiStranko
};
