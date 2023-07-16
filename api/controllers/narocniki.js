const mongoose = require("mongoose");
const Narocniki = mongoose.model("Narocnik");

/**
 * @openapi
 *  /narocniki:
 *   get:
 *    summary: Pridobi seznam vseh naročnikov.
 *    description: Pridobi seznam vseh naročnikov, ki se nahajajo v podatkovni bazi.
 *    tags: [Narocniki]
 *    responses:
 *     '200':
 *      description: <b>OK</b>, s seznamom naročnikov.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Narocnik'
 *        example:
 *         - _id: 13153ec4d64ceb8d276eae42
 *           ime: Delo,
 *           opis: Delo je dnevni časopis, ki je začel izhajati leta 1959, ki izhaja tako v tiskani kot v spletni izdaji.
 *           opombe: Delo izvede veliko splošnih anket, ki jih bolj redkeje vključimo na naši spletni strani. Spletna in tiskana izdaja se pogosto razlikujeta.
 *     '404':
 *      description: <b>Napaka pri poizvedbi</b>, s sporočilom napake.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/SporociloNapake'
 *        example:
 *         sporocilo: "Napaka pri poizvedbi: <opis napake>"
 */
const seznamNarocnikov = (req, res) => {
    Narocniki.find().exec(function (error, seznam) {
        if (error) {
            res.status(404).json({sporocilo: "Napaka pri poizvedbi: " + error});
        } else {
            res.status(200).json(seznam);
        }
    });
};
/**
 * @openapi
 * /narocniki/{id}:
 *  get:
 *   summary: Vrni podrobnosti naročnika.
 *   description: Vrni podrobnosti naročnika na podlagi enoličnega identifikatorja.
 *   tags: [Narocniki]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> naročnika
 *      required: true
 *   responses:
 *    '200':
 *     description: <b>OK</b>, naročnik najden.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Narocnik'
 *       example:
 *        - _id: 13153ec4d64ceb8d276eae42
 *          ime: Delo
 *          opis: Delo je dnevni časopis, ki je začel izhajati leta 1959, ki izhaja tako v tiskani kot v spletni izdaji.
 *          opombe: Delo izvede veliko splošnih anket, ki jih bolj redkeje vključimo na naši spletni strani. Spletna in tiskana izdaja se pogosto razlikujeta.
 *    '404':
 *     description: 'Ne najdem naročnika s podanim enoličnim identifikatorjem.'
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
const podrobnostiNarocnika = (req, res) => {
    const idNarocnika = req.params.id;

    Narocniki.findById(idNarocnika).exec(function (
        error,
        narocnik
    ) {
        if (!narocnik) {
            res.status(404).json({
                sporocilo:
                    "Ne najdem naročnika s podanim enoličnim identifikatorjem",
            });
        } else if (error) {
            res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
        } else {
            res.status(200).json(narocnik);
        }
    });
};
/**
 * @openapi
 * /narocniki:
 *  post:
 *   summary: Doda novega naročnika v bazo.
 *   description: Doda novega naročnika z vsemi izpolnjenimi podatki v bazo.
 *   tags: [Narocniki]
 *   requestBody:
 *    description: Naročnik
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        ime:
 *          required: true
 *          example: Delo
 *        opis:
 *          required: true
 *          example: Delo je dnevni časopis, ki je začel izhajati leta 1959, ki izhaja tako v tiskani kot v spletni izdaji.
 *        opombe:
 *          required: true
 *          example: Delo izvede veliko splošnih anket, ki jih bolj redkeje vključimo na naši spletni strani. Spletna in tiskana izdaja se pogosto razlikujeta."
 *       required:
 *        - ime
 *   responses:
 *    '201':
 *     description: Uspešno <b>ustvarjen</b> naročnik.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Narocnik'
 *    '400':
 *     description: <b>Napaka</b>, niso vneseni vsi zahtevani podatki.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        vprasanja is required:
 *         value:
 *          message: Parameter 'vprasanja' je obvezen.
 *    '401':
 *     description: <b>Napaka</b>, ni pravice dostopa.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo.
 */
const ustvariNarocnika = (req, res) => {
    if (!req.body.ime) {
        res
            .status(400)
            .json({sporocilo: "Potrebno je vnesti vse obvezne podatke!"});
    } else {
        const novNarocnik = {ime: req.body.ime};
        if (req.body.opis) {
            novNarocnik.opis = req.body.opis;
        }
        if (req.body.opombe) {
            novNarocnik.opombe = req.body.opombe;
        }

        Narocniki.create(novNarocnik, function (error, narocnik) {
            if (error) {
                res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
            } else {
                res.status(201).json(narocnik);
            }
        });
    }
};

/**
 * @openapi
 * /narocniki/{id}:
 *  put:
 *   summary: Posodobi naročnika.
 *   description: Posodobi naročnika z izbranim enoličnim identifikatorjem.
 *   tags: [Narocniki]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: <b>enolični identifikator</b> naročnika
 *      required: true
 *      example: 5f8024542bc87c975ffc1a70
 *   requestBody:
 *    description: Naročnik
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        ime:
 *          example: Delo
 *        opis:
 *          example: Delo je dnevni časopis, ki je začel izhajati leta 1959, ki izhaja tako v tiskani kot v spletni izdaji.
 *        opombe:
 *          example: Delo izvede veliko splošnih anket, ki jih bolj redkeje vključimo na naši spletni strani. Spletna in tiskana izdaja se pogosto razlikujeta."
 *       required:
 *        - ime
 *   responses:
 *    '200':
 *     description: <b>OK</b>, pri posodabljanju naročnika
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Narocnik'
 *    '400':
 *     description: <b>Napaka</b>, niso vneseni vsi zahtevani podatki
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        ime is required:
 *         value:
 *          message: Polje 'ime' mora biti obvezno podano
 *    '404':
 *     description: Naročnik s tem <b>enoličnim identifikatorjem</b> ne obstaja, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        naročnik ni najden:
 *         value:
 *          message: Ne najdem naročnika s podanim enoličnim identifikatorjem
 *    '500':
 *     description: <b>Napaka na strežniku</b>, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo
 */
const posodobiNarocnika = (req, res) => {
    const idNarocnika = req.params.id;

    if (!req.body.ime) {
        res.status(400).json({
            sporocilo: "Napaka, niso vneseni vsi zahtevani podatki"
        });
    } else {
        Narocniki.findById(idNarocnika).exec(function (
            error,
            narocnik
        ) {
            if (!narocnik) {
                res.status(404).json({
                    sporocilo:
                        "Ne najdem naročnika s podanim enoličnim identifikatorjem",
                });
            } else {
                narocnik.ime = req.body.ime;
                if (req.body.opis) {
                    narocnik.opis = req.body.opis;
                }
                if (req.body.opombe) {
                    narocnik.opombe = req.body.opombe;
                }

                narocnik.save(function (error, narocnik) {
                    if (error) {
                        res
                            .status(500)
                            .json({sporocilo: "Napaka na strežniku: " + error});
                    } else {
                        res.status(200).json(narocnik);
                    }
                });
            }
        });
    }
};

/**
 * @openapi
 * /narocniki/{id}:
 *  delete:
 *   summary: Izbriše naročnika.
 *   description: Izbriše naročnika s podanim enoličnim identifikatorjem.
 *   tags: [Narocniki]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> naročnika
 *      required: true
 *      example: 5f8024542bc87c975ffc1a70
 *   responses:
 *    '204':
 *     description: Naročnik je izbrisan.
 *    '400':
 *     description: <b>Napaka</b>, enolični identifikator naročnika je zahtevan podatek.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: 'Enolični identifikator naročnika je obvezen podatek!'
 *    '404':
 *     description: Naročnik ni bil najden.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        Naročnik ni bila najden:
 *         value:
 *          message: Ne najdem naročnika s podanim enoličnim identifikatorjem.
 *    '500':
 *     description: '<b>Napaka na strežniku</b>, s sporočilom napake.'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo.
 */
const izbrisiNarocnika = (req, res) => {
    const idNarocnika = req.params.id;
    if (!idNarocnika) {
        res
            .status(400)
            .json({sporocilo: "Identifikator naročnika je obvezen podatek!"});
    } else {
        Narocniki.findByIdAndRemove(
            idNarocnika,
            function (error, rezultat) {
                if (!rezultat) {
                    res.status(404).json({
                        sporocilo:
                            "Ne najdem naročnika s podanim enoličnim identifikatorjem",
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
    seznamNarocnikov,
    podrobnostiNarocnika,
    ustvariNarocnika,
    posodobiNarocnika,
    izbrisiNarocnika,
};
