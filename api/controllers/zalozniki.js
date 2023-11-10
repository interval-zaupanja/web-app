const mongoose = require("mongoose");
const Zalozniki = mongoose.model("Zaloznik");

/**
 * @openapi
 *  /zalozniki:
 *   get:
 *    summary: Pridobi seznam vseh založnikov.
 *    description: Pridobi seznam vseh založnikov, ki se nahajajo v podatkovni bazi.
 *    tags: [Zalozniki]
 *    responses:
 *     '200':
 *      description: <b>OK</b>, s seznamom založnikov.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Zaloznik'
 *        example:
 *         - _id: 13153ec4d64ceb8d276eae42
 *           ime: Delo
 *           ime_polno: Delo d.o.o
 *           tip: narocnik
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
const seznamZaloznikov = (req, res) => {
    Zalozniki.find().exec(function (error, seznam) {
        if (error) {
            res.status(404).json({sporocilo: "Napaka pri poizvedbi: " + error});
        } else {
            res.status(200).json(seznam);
        }
    });
};
/**
 * @openapi
 * /zalozniki/{id}:
 *  get:
 *   summary: Vrni podrobnosti založnika.
 *   description: Vrni podrobnosti založnika na podlagi enoličnega identifikatorja.
 *   tags: [Zalozniki]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> založnika
 *      required: true
 *   responses:
 *    '200':
 *     description: <b>OK</b>, založnik najden.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Zaloznik'
 *       example:
 *        - _id: 13153ec4d64ceb8d276eae42
 *          ime: Delo
 *          ime_polno: Delo d.o.o
 *          tip: narocnik
 *          opis: Delo je dnevni časopis, ki je začel izhajati leta 1959, ki izhaja tako v tiskani kot v spletni izdaji.
 *          opombe: Delo izvede veliko splošnih anket, ki jih bolj redkeje vključimo na naši spletni strani. Spletna in tiskana izdaja se pogosto razlikujeta.
 *    '404':
 *     description: 'Ne najdem založnika s podanim enoličnim identifikatorjem.'
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
const podrobnostiZaloznika = (req, res) => {
    const idZaloznika = req.params.id;

    Zalozniki.findById(idZaloznika).exec(function (
        error,
        zaloznik
    ) {
        if (!zaloznik) {
            res.status(404).json({
                sporocilo:
                    "Ne najdem založnika s podanim enoličnim identifikatorjem",
            });
        } else if (error) {
            res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
        } else {
            res.status(200).json(zaloznik);
        }
    });
};
/**
 * @openapi
 * /zalozniki:
 *  post:
 *   summary: Doda novega založnika v bazo.
 *   description: Doda novega založnika z vsemi izpolnjenimi podatki v bazo.
 *   tags: [Zalozniki]
 *   requestBody:
 *    description: Založnik
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        ime:
 *          required: true
 *          example: Delo
 *        ime_polno:
 *          required: false
 *          example: Delo d.o.o.
 *        tip:
 *          required: true
 *          example: narocnik
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
 *     description: Uspešno <b>ustvarjen</b> založnik.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Zaloznik'
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
const ustvariZaloznika = (req, res) => {
    if (!req.body.ime) {
        res
            .status(400)
            .json({sporocilo: "Potrebno je vnesti vse obvezne podatke!"});
    } else {
        const novZaloznik = {ime: req.body.ime};
        if (req.body.ime_polno) {
            novZaloznik.ime_polno = req.body.ime_polno;
        }
        if (req.body.opis) {
            novZaloznik.opis = req.body.opis;
        }
        if (req.body.opombe) {
            novZaloznik.opombe = req.body.opombe;
        }

        Zalozniki.create(novZaloznik, function (error, zaloznik) {
            if (error) {
                res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
            } else {
                res.status(201).json(zaloznik);
            }
        });
    }
};

/**
 * @openapi
 * /zalozniki/{id}:
 *  put:
 *   summary: Posodobi založnika.
 *   description: Posodobi založnika z izbranim enoličnim identifikatorjem.
 *   tags: [Zalozniki]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: <b>enolični identifikator</b> založnika
 *      required: true
 *      example: 5f8024542bc87c975ffc1a70
 *   requestBody:
 *    description: Založnik
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        ime:
 *          example: Delo
 *        ime_polno:
 *          example: Delo d.o.o.
 *        tip:
 *          example: narocnik
 *        opis:
 *          example: Delo je dnevni časopis, ki je začel izhajati leta 1959, ki izhaja tako v tiskani kot v spletni izdaji.
 *        opombe:
 *          example: Delo izvede veliko splošnih anket, ki jih bolj redkeje vključimo na naši spletni strani. Spletna in tiskana izdaja se pogosto razlikujeta."
 *       required:
 *        - ime
 *   responses:
 *    '200':
 *     description: <b>OK</b>, pri posodabljanju založnika
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Zaloznik'
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
 *     description: Založnik s tem <b>enoličnim identifikatorjem</b> ne obstaja, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        založnik ni najden:
 *         value:
 *          message: Ne najdem založnika s podanim enoličnim identifikatorjem
 *    '500':
 *     description: <b>Napaka na strežniku</b>, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo
 */
const posodobiZaloznika = (req, res) => {
    const idZaloznika = req.params.id;

    if (!req.body.ime) {
        res.status(400).json({
            sporocilo: "Napaka, niso vneseni vsi zahtevani podatki"
        });
    } else {
        Zalozniki.findById(idZaloznika).exec(function (
            error,
            zaloznik
        ) {
            if (!zaloznik) {
                res.status(404).json({
                    sporocilo:
                        "Ne najdem založnika s podanim enoličnim identifikatorjem",
                });
            } else {
                zaloznik.ime = req.body.ime;
                if (req.body.ime_polno) {
                    zaloznik.ime_polno = req.body.ime_polno;
                }
                if (req.body.opis) {
                    zaloznik.opis = req.body.opis;
                }
                if (req.body.opombe) {
                    zaloznik.opombe = req.body.opombe;
                }

                zaloznik.save(function (error, zaloznik) {
                    if (error) {
                        res
                            .status(500)
                            .json({sporocilo: "Napaka na strežniku: " + error});
                    } else {
                        res.status(200).json(zaloznik);
                    }
                });
            }
        });
    }
};

/**
 * @openapi
 * /zalozniki/{id}:
 *  delete:
 *   summary: Izbriše založnika.
 *   description: Izbriše založnika s podanim enoličnim identifikatorjem.
 *   tags: [Zalozniki]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> založnika
 *      required: true
 *      example: 5f8024542bc87c975ffc1a70
 *   responses:
 *    '204':
 *     description: Založnik je izbrisan.
 *    '400':
 *     description: <b>Napaka</b>, enolični identifikator založnika je zahtevan podatek.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: 'Enolični identifikator založnika je obvezen podatek!'
 *    '404':
 *     description: Založnik ni bil najden.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        Založnik ni bila najden:
 *         value:
 *          message: Ne najdem založnika s podanim enoličnim identifikatorjem.
 *    '500':
 *     description: '<b>Napaka na strežniku</b>, s sporočilom napake.'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo.
 */
const izbrisiZaloznika = (req, res) => {
    const idZaloznika = req.params.id;
    if (!idZaloznika) {
        res
            .status(400)
            .json({sporocilo: "Identifikator založnika je obvezen podatek!"});
    } else {
        Zalozniki.findByIdAndRemove(
            idZaloznika,
            function (error, rezultat) {
                if (!rezultat) {
                    res.status(404).json({
                        sporocilo:
                            "Ne najdem založnika s podanim enoličnim identifikatorjem",
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
    seznamZaloznikov,
    podrobnostiZaloznika,
    ustvariZaloznika,
    posodobiZaloznika,
    izbrisiZaloznika,
};
