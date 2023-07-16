const mongoose = require("mongoose");
const Anketarji = mongoose.model("Anketar");

/**
 * @openapi
 *  /anketarji:
 *   get:
 *    summary: Pridobi seznam vseh anketarjev.
 *    description: Pridobi seznam vseh anketarjev, ki se nahajajo v podatkovni bazi.
 *    tags: [Anketarji]
 *    responses:
 *     '200':
 *      description: <b>OK</b>, s seznamom anketarjev.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Anketar'
 *        example:
 *         - _id: 45a25e54cc55e42a456bdb32
 *           ime: Ninamedia
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
const seznamAnketarjev = (req, res) => {
    Anketarji.find().exec(function (error, seznam) {
        if (error) {
            res.status(404).json({sporocilo: "Napaka pri poizvedbi: " + error});
        } else {
            res.status(200).json(seznam);
        }
    });
};
/**
 * @openapi
 * /anketarji/{id}:
 *  get:
 *   summary: Vrni podrobnosti anketarja.
 *   description: Vrni podrobnosti anketarja na podlagi njegovega enoličnega identifikatorja.
 *   tags: [Anketarji]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> anketarja
 *      required: true
 *   responses:
 *    '200':
 *     description: <b>OK</b>, anketar najden.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Anketa'
 *       example:
 *        - _id: 14dcac4803f6df6ffe905704
 *          ime: Mediana
 *    '404':
 *     description: 'Ne najdem anketarja s podanim enoličnim identifikatorjem.'
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
const podrobnostiAnketarja = (req, res) => {
    const idAnketarja = req.params.id;

    Anketarji.findById(idAnketarja).exec(function (
        error,
        anketar
    ) {
        if (!anketar) {
            res.status(404).json({sporocilo: "Ne najdem anketarja s podanim enoličnim identifikatorjem"});
        } else if (error) {
            res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
        } else {
            res.status(200).json(anketar);
        }
    });
};
/**
 * @openapi
 * /anketarji:
 *  post:
 *   summary: Doda novega anketarja v bazo.
 *   description: Doda novega anketarja z vsemi zahtevanimi podatki v bazo.
 *   tags: [Anketarji]
 *   requestBody:
 *    description: Anketar
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        ime:
 *          required: true
 *          example: Parsifal
 *       required:
 *        - ime
 *   responses:
 *    '201':
 *     description: Uspešno <b>ustvarjen</b> nov anketar.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Anketar'
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
const ustvariAnketarja = (req, res) => {
    if (!req.body.ime) {
        res
            .status(400)
            .json({sporocilo: "Potrebno je vnesti vse obvezne podatke!"});
    } else {
        const novAnketar = {ime: req.body.ime};
        if (req.body.opis) {
            novAnketar.opis = req.body.opis;
        }
        if (req.body.opombe) {
            novAnketar.opombe = req.body.opombe;
        }

        Anketarji.create(novAnketar, function (error, anketar) {
            if (error) {
                res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
            } else {
                res.status(201).json(anketar);
            }
        });
    }
};

/**
 * @openapi
 * /anketarji/{id}:
 *  put:
 *   summary: Posodobi anketarja.
 *   description: Posodobi anketarja z izbranim enoličnim identifikatorjem.
 *   tags: [Anketarji]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: <b>enolični identifikator</b> anketarja
 *      required: true
 *      example: 45a25e54cc55e42a456bdb32
 *   requestBody:
 *    description: Anketar
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        ime:
 *          example: Ninamedia
 *        opis:
 *          example: Ustanovljena leta 1991, Ninamedia organizacija za raziskovalno dejavnost, založništvo in distribucijo, d.o.o., pogosto izdeluje ankete za Večer in Dnevnik
 *        opombe:
 *          example: Njihove javno-mnenjske ankete se pogosto imenujejo Vox Populi
 *       required:
 *        - ime
 *   responses:
 *    '200':
 *     description: <b>OK</b>, pri posodabljanju anketarja
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Anketar'
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
 *     description: Anketar s tem <b>enoličnim identifikatorjem</b> ne obstaja, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        anketar ni najden:
 *         value:
 *          message: Ne najdem anketarja s podanim enoličnim identifikatorjem
 *    '500':
 *     description: <b>Napaka na strežniku</b>, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo
 */
const posodobiAnketarja = (req, res) => {
    const idAnketarja = req.params.id;

    if (
        !req.body.ime
    ) {
        res.status(400).json({
            sporocilo: "Napaka, niso vneseni vsi zahtevani podatki",
        });
    } else {
        Anketarji.findById(idAnketarja).exec(function (
            error,
            anketar
        ) {
            if (!anketar) {
                res.status(404).json({
                    sporocilo:
                        "Ne najdem ankete s podanim enoličnim identifikatorjem",
                });
            } else {
                anketar.ime = req.body.ime;
                if (req.body.opis) {
                    anketar.opis = req.body.opis;
                }
                if (req.body.opombe) {
                    anketar.opombe = req.body.opombe;
                }

                anketar.save(function (error, anketar) {
                    if (error) {
                        res
                            .status(500)
                            .json({sporocilo: "Napaka na strežniku: " + error});
                    } else {
                        res.status(200).json(anketar);
                    }
                });
            }
        });
    }
};

/**
 * @openapi
 * /anketarji/{id}:
 *  delete:
 *   summary: Izbriše anketarja.
 *   description: Izbriše anketarja s podanim enoličnim identifikatorjem.
 *   tags: [Anketarji]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> anketarja
 *      required: true
 *      example: 14dcac4803f6df6ffe905704
 *   responses:
 *    '204':
 *     description: Anketar je izbrisan
 *    '400':
 *     description: <b>Napaka</b>, enolični identifikator anketarja je zahtevan podatek.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Enolični identifikator anketarja je obvezen podatek
 *    '404':
 *     description: Anketar ni bil najden
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        Anketar ni bil najden:
 *         value:
 *          message: Ne najdem anketarja s podanim enoličnim identifikatorjem
 *    '500':
 *     description: '<b>Napaka na strežniku</b>, s sporočilom napake.'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo
 */
const izbrisiAnketarja = (req, res) => {
    const idAnketarja = req.params.id;
    if (!idAnketarja) {
        res
            .status(400)
            .json({sporocilo: "Enolični identifikator anketarja je obvezen podatek"});
    } else {
        Anketarji.findByIdAndRemove(
            idAnketarja,
            function (error, rezultat) {
                if (!rezultat) {
                    res.status(404).json({
                        sporocilo:
                            "Ne najdem anketarja s podanim enoličnim identifikatorjem",
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
    seznamAnketarjev,
    podrobnostiAnketarja,
    ustvariAnketarja,
    posodobiAnketarja,
    izbrisiAnketarja,
};
