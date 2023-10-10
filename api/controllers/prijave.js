const mongoose = require("mongoose");
const Prijave = mongoose.model("Prijava");

/**
 * @openapi
 *  /prijave:
 *   get:
 *    summary: Pridobi seznam vseh prijav.
 *    description: Pridobi seznam vseh prijav, ki se nahajajo v podatkovni bazi.
 *    tags: [Prijave]
 *    responses:
 *     '200':
 *      description: <b>OK</b>, s seznamom prijav.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Prijava'
 *        example:
 *         - _id: 65255e7d192b6e67bacc61c5
 *           tip: vprasanje
 *           id: 65158b712fa21d078bc09df1
 *           opis: Napačen tip glasovanja
 *           razreseno: false
 *           uvpotes: 5
 *           downvote: 0
 *           opombe: V fazi razreševanja, ki bo nekaj časa trajalo, saj je potrebno zamenjati strukturo tipa glasovanja
 *     '404':
 *      description: <b>Napaka pri poizvedbi</b>, s sporočilom napake.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/SporociloNapake'
 *        example:
 *         sporocilo: "Napaka pri poizvedbi: <opis napake>"
 */
const seznamPrijav = (req, res) => {
    Prijave.find().exec(function (error, seznam) {
        if (error) {
            res.status(404).json({sporocilo: "Napaka pri poizvedbi: " + error});
        } else {
            res.status(200).json(seznam);
        }
    })
}

/**
 * @openapi
 * /prijave/{id}:
 *  get:
 *   summary: Vrni podrobnosti prijave.
 *   description: Vrni podrobnosti prijave na podlagi njenega enoličnega identifikatorja.
 *   tags: [Prijave]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> prijave
 *      required: true
 *   responses:
 *    '200':
 *     description: <b>OK</b>, prijava najdena.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Prijava'
 *       example:
 *         - _id: 65255e7d192b6e67bacc61c5
 *           tip: vprasanje
 *           id: 65158b712fa21d078bc09df1
 *           opis: Napačen tip glasovanja
 *           razreseno: false
 *           uvpotes: 5
 *           downvote: 0
 *           opombe: V fazi razreševanja, ki bo nekaj časa trajalo, saj je potrebno zamenjati strukturo tipa glasovanja
 *    '404':
 *     description: 'Ne najdem prijave s podanim enoličnim identifikatorjem.'
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
const podrobnostiPrijave = (req, res) => {
    const idPrijave = req.params.id;

    Prijave.findById(idPrijave).exec(function (
        error,
        prijava
    ) {
        if (!prijava) {
            res.status(404).json({sporocilo: "Ne najdem prijave s podanim enoličnim identifikatorjem"});
        } else if (error) {
            res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
        } else {
            res.status(200).json(prijava);
        }
    });
};
/**
 * @openapi
 * /prijave:
 *  post:
 *   summary: Doda novo prijavo v bazo.
 *   description: Doda novo prijavo z vsemi zahtevanimi podatki v bazo.
 *   tags: [Prijave]
 *   requestBody:
 *    description: Prijava
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        tip:
 *          required: true
 *          example: vprasanje
 *        id:
 *          required: true
 *          example: 65158b712fa21d078bc09df1
 *        opis:
 *          required: false
 *          example: Napačen tip glasovanja
 *        razreseno:
 *          required: true
 *          example: false
 *        upvotes:
 *          required: true
 *          example: 5
 *        downvotes:
 *          required: true
 *          example: 0
 *        opombe:
 *          required: true
 *          example: V fazi razreševanja, ki bo nekaj časa trajalo, saj je potrebno zamenjati strukturo tipa glasovanja
 *       required:
 *        - tip
 *        - id
 *   responses:
 *    '201':
 *     description: Uspešno <b>ustvarjena</b> nova prijava.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Prijava'
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
const ustvariPrijavo = (req, res) => {
    if (!req.body.id || !req.body.tip) {
        console.log(req.body.id)
        console.log(req.body.tip)
        res
            .status(400)
            .json({sporocilo: "Potrebno je vnesti vse obvezne podatke!"});
    } else {
        const novaPrijava = {tip: req.body.tip, id: req.body.id};
        
        if (req.body.opis) {
            novaPrijava.opis = req.body.opis;
        }
        
        novaPrijava.razreseno = false
        novaPrijava.upvotes = 0
        novaPrijava.downvotes = 0

        Prijave.create(novaPrijava, function (error, prijava) {
            if (error) {
                res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
            } else {
                res.status(201).json(prijava);
            }
        });
    }
};

/**
 * @openapi
 * /prijave/{id}:
 *  put:
 *   summary: Posodobi prijavo.
 *   description: Posodobi prijavo z izbranim enoličnim identifikatorjem.
 *   tags: [Prijave]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: <b>enolični identifikator</b> prijave
 *      required: true
 *      example: a79677ebd4dbd3bd7642deca
 *   requestBody:
 *    description: Prijava
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
 *     description: <b>OK</b>, pri posodabljanju prijave
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Prijava'
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
 *     description: Prijava s tem <b>enoličnim identifikatorjem</b> ne obstaja, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        prijava ni najdena:
 *         value:
 *          message: Ne najdem prijave s podanim enoličnim identifikatorjem
 *    '500':
 *     description: <b>Napaka na strežniku</b>, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo
 */
const posodobiPrijavo = (req, res) => {
    const idPrijave = req.params.id;

    if (
        !req.body.ime
    ) {
        res.status(400).json({
            sporocilo: "Napaka, niso vneseni vsi zahtevani podatki",
        });
    } else {
        Prijave.findById(idPrijave).exec(function (
            error,
            prijava
        ) {
            if (!prijava) {
                res.status(404).json({
                    sporocilo:
                        "Ne najdem prijave s podanim enoličnim identifikatorjem",
                });
            } else {
                prijava.ime = req.body.ime;
                if (req.body.ime_kratica) {
                    novaPrijava.opis = req.body.ime_kratica;
                }
                if (req.body.barva) {
                    novaPrijava.opis = req.body.barva;
                }
                if (req.body.logo_uri) {
                    novaPrijava.opis = req.body.logo_uri;
                }
                if (req.body.opis) {
                    prijava.opis = req.body.opis;
                }
                if (req.body.opombe) {
                    prijava.opombe = req.body.opombe;
                }

                prijava.save(function (error, prijava) {
                    if (error) {
                        res
                            .status(500)
                            .json({sporocilo: "Napaka na strežniku: " + error});
                    } else {
                        res.status(200).json(prijava);
                    }
                });
            }
        });
    }
};

/**
 * @openapi
 * /prijave/{id}:
 *  delete:
 *   summary: Izbriše prijavo.
 *   description: Izbriše prijavo s podanim enoličnim identifikatorjem.
 *   tags: [Prijave]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> prijave
 *      required: true
 *      example: a79677ebd4dbd3bd7642deca
 *   responses:
 *    '204':
 *     description: Prijava je izbrisana
 *    '400':
 *     description: <b>Napaka</b>, enolični identifikator prijave je zahtevan podatek.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Enolični identifikator prijave je obvezen podatek
 *    '404':
 *     description: Prijava ni bila najdena
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        Prijava ni bila najdena:
 *         value:
 *          message: Ne najdem prijave s podanim enoličnim identifikatorjem
 *    '500':
 *     description: '<b>Napaka na strežniku</b>, s sporočilom napake.'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo
 */
const izbrisiPrijavo = (req, res) => {
    const idPrijave = req.params.id;
    if (!idPrijave) {
        res
            .status(400)
            .json({sporocilo: "Enolični identifikator prijave je obvezen podatek"});
    } else {
        Prijave.findByIdAndRemove(
            idPrijave,
            function (error, rezultat) {
                if (!rezultat) {
                    res.status(404).json({
                        sporocilo:
                            "Ne najdem prijave s podanim enoličnim identifikatorjem",
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
    seznamPrijav,
    podrobnostiPrijave,
    ustvariPrijavo,
    posodobiPrijavo,
    izbrisiPrijavo
};
