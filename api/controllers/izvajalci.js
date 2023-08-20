const mongoose = require("mongoose");
const Izvajalci = mongoose.model("Izvajalec");

/**
 * @openapi
 *  /izvajalci:
 *   get:
 *    summary: Pridobi seznam vseh izvajalecev.
 *    description: Pridobi seznam vseh izvajalecev, ki se nahajajo v podatkovni bazi.
 *    tags: [Izvajalci]
 *    responses:
 *     '200':
 *      description: <b>OK</b>, s seznamom izvajalecev.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Izvajalec'
 *        example:
 *         - _id: 45a25e54cc55e42a456bdb32
 *           ime: Ninamedia
 *           ime_polno: Ninamedia organizacija za raziskovalno dejavnost, založništvo in distribucijo, d.o.o.
 *           opis: Ustanovljena leta 1991, Ninamedia organizacija za raziskovalno dejavnost, založništvo in distribucijo, d.o.o., pogosto izdeluje ankete za Večer in Dnevnik
 *           opombe: Njihove javno-mnenjske ankete se pogosto imenujejo Vox Populi
 *     '404':
 *      description: <b>Napaka pri poizvedbi</b>, s sporočilom napake.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/SporociloNapake'
 *        example:
 *         sporocilo: "Napaka pri poizvedbi: <opis napake>"
 */
const seznamIzvajalcev = (req, res) => {
    Izvajalci.find().exec(function (error, seznam) {
        if (error) {
            res.status(404).json({sporocilo: "Napaka pri poizvedbi: " + error});
        } else {
            res.status(200).json(seznam);
        }
    });
};
/**
 * @openapi
 * /izvajalci/{id}:
 *  get:
 *   summary: Vrni podrobnosti izvajalca.
 *   description: Vrni podrobnosti izvajalca na podlagi njegovega enoličnega identifikatorja.
 *   tags: [Izvajalci]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> izvajalca
 *      required: true
 *   responses:
 *    '200':
 *     description: <b>OK</b>, izvajalec najden.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Anketa'
 *       example:
 *        - _id: 14dcac4803f6df6ffe905704
 *          ime: Mediana
 *          ime_polno: Ninamedia organizacija za raziskovalno dejavnost, založništvo in distribucijo, d.o.o.
 *    '404':
 *     description: 'Ne najdem izvajalca s podanim enoličnim identifikatorjem.'
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
const podrobnostiIzvajalca = (req, res) => {
    const idIzvajalca = req.params.id;

    Izvajalci.findById(idIzvajalca).exec(function (
        error,
        izvajalec
    ) {
        if (!izvajalec) {
            res.status(404).json({sporocilo: "Ne najdem izvajalca s podanim enoličnim identifikatorjem"});
        } else if (error) {
            res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
        } else {
            res.status(200).json(izvajalec);
        }
    });
};
/**
 * @openapi
 * /izvajalci:
 *  post:
 *   summary: Doda novega izvajalca v bazo.
 *   description: Doda novega izvajalca z vsemi zahtevanimi podatki v bazo.
 *   tags: [Izvajalci]
 *   requestBody:
 *    description: Izvajalec
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        ime:
 *          required: true
 *          example: Parsifal
 *        ime_polno:
 *          required: true
 *          example: Ninamedia organizacija za raziskovalno dejavnost, založništvo in distribucijo, d.o.o.
 *       required:
 *        - ime
 *   responses:
 *    '201':
 *     description: Uspešno <b>ustvarjen</b> nov izvajalec.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Izvajalec'
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
const ustvariIzvajalca = (req, res) => {
    if (!req.body.ime) {
        res
            .status(400)
            .json({sporocilo: "Potrebno je vnesti vse obvezne podatke!"});
    } else {
        const novIzvajalec = {ime: req.body.ime};
        if (req.body.ime_polno) {
            novIzvajalec.ime_polno = req.body.ime_polno;
        }
        if (req.body.opis) {
            novIzvajalec.opis = req.body.opis;
        }
        if (req.body.opombe) {
            novIzvajalec.opombe = req.body.opombe;
        }

        Izvajalci.create(novIzvajalec, function (error, izvajalec) {
            if (error) {
                res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
            } else {
                res.status(201).json(izvajalec);
            }
        });
    }
};

/**
 * @openapi
 * /izvajalci/{id}:
 *  put:
 *   summary: Posodobi izvajalca.
 *   description: Posodobi izvajalca z izbranim enoličnim identifikatorjem.
 *   tags: [Izvajalci]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: <b>enolični identifikator</b> izvajalca
 *      required: true
 *      example: 45a25e54cc55e42a456bdb32
 *   requestBody:
 *    description: Izvajalec
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        ime:
 *          example: Ninamedia
 *        ime_polno:
 *          example: Ninamedia organizacija za raziskovalno dejavnost, založništvo in distribucijo, d.o.o.
 *        opis:
 *          example: Ustanovljena leta 1991, Ninamedia organizacija za raziskovalno dejavnost, založništvo in distribucijo, d.o.o., pogosto izdeluje ankete za Večer in Dnevnik
 *        opombe:
 *          example: Njihove javno-mnenjske ankete se pogosto imenujejo Vox Populi
 *       required:
 *        - ime
 *   responses:
 *    '200':
 *     description: <b>OK</b>, pri posodabljanju izvajalca
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Izvajalec'
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
 *     description: Izvajalec s tem <b>enoličnim identifikatorjem</b> ne obstaja, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        izvajalec ni najden:
 *         value:
 *          message: Ne najdem izvajalca s podanim enoličnim identifikatorjem
 *    '500':
 *     description: <b>Napaka na strežniku</b>, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo
 */
const posodobiIzvajalca = (req, res) => {
    const idIzvajalca = req.params.id;

    if (
        !req.body.ime
    ) {
        res.status(400).json({
            sporocilo: "Napaka, niso vneseni vsi zahtevani podatki",
        });
    } else {
        Izvajalci.findById(idIzvajalca).exec(function (
            error,
            izvajalec
        ) {
            if (!izvajalec) {
                res.status(404).json({
                    sporocilo:
                        "Ne najdem ankete s podanim enoličnim identifikatorjem",
                });
            } else {
                izvajalec.ime = req.body.ime;
                if (req.body.ime_polno) {
                    izvajalec.ime_polno = req.body.ime_polno;
                }
                if (req.body.opis) {
                    izvajalec.opis = req.body.opis;
                }
                if (req.body.opombe) {
                    izvajalec.opombe = req.body.opombe;
                }

                izvajalec.save(function (error, izvajalec) {
                    if (error) {
                        res
                            .status(500)
                            .json({sporocilo: "Napaka na strežniku: " + error});
                    } else {
                        res.status(200).json(izvajalec);
                    }
                });
            }
        });
    }
};

/**
 * @openapi
 * /izvajalci/{id}:
 *  delete:
 *   summary: Izbriše izvajalca.
 *   description: Izbriše izvajalca s podanim enoličnim identifikatorjem.
 *   tags: [Izvajalci]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> izvajalca
 *      required: true
 *      example: 14dcac4803f6df6ffe905704
 *   responses:
 *    '204':
 *     description: Izvajalec je izbrisan
 *    '400':
 *     description: <b>Napaka</b>, enolični identifikator izvajalca je zahtevan podatek.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Enolični identifikator izvajalca je obvezen podatek
 *    '404':
 *     description: Izvajalec ni bil najden
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        Izvajalec ni bil najden:
 *         value:
 *          message: Ne najdem izvajalca s podanim enoličnim identifikatorjem
 *    '500':
 *     description: '<b>Napaka na strežniku</b>, s sporočilom napake.'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo
 */
const izbrisiIzvajalca = (req, res) => {
    const idIzvajalca = req.params.id;
    if (!idIzvajalca) {
        res
            .status(400)
            .json({sporocilo: "Enolični identifikator izvajalca je obvezen podatek"});
    } else {
        Izvajalci.findByIdAndRemove(
            idIzvajalca,
            function (error, rezultat) {
                if (!rezultat) {
                    res.status(404).json({
                        sporocilo:
                            "Ne najdem izvajalca s podanim enoličnim identifikatorjem",
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
    seznamIzvajalcev,
    podrobnostiIzvajalca,
    ustvariIzvajalca,
    posodobiIzvajalca,
    izbrisiIzvajalca,
};
