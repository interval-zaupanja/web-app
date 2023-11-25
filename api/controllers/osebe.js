const mongoose = require("mongoose");
const Osebe = mongoose.model("Oseba");

/**
 * @openapi
 *  /osebe:
 *   get:
 *    summary: Pridobi seznam vseh oseb.
 *    description: Pridobi seznam vseh oseb, ki se nahajajo v podatkovni bazi.
 *    tags: [Osebe]
 *    responses:
 *     '200':
 *      description: <b>OK</b>, s seznamom oseb.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Oseba'
 *        example:
 *         - _id: 6537a983686e658414ccb6b1
 *           ime: Dominika
 *           ime_srednje: Švarc
 *           priimek: Pipan
 *           stranka_id: 651450a3a3e11c09560bfb8b
 *           slika_uri: /dominika-svarc-pipan
 *           slika_vir: https://www.gov.si/en/state-authorities/ministries/ministry-of-justice/about-the-ministry-of-justice/ministers-office/dr-dominika-svarc-pipan/
 *           slika_avtor: Tamino Petelinšek / STA
 *           wikipedia_uri: https://sl.wikipedia.org/wiki/Dominika_%C5%A0varc_Pipan
 *     '404':
 *      description: <b>Napaka pri poizvedbi</b>, s sporočilom napake.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/SporociloNapake'
 *        example:
 *         sporocilo: "Napaka pri poizvedbi: <opis napake>"
 */
// const seznamOseb = (req, res) => {
//     Osebe.find().exec(function (error, seznam) {
//         if (error) {
//             res.status(404).json({sporocilo: "Napaka pri poizvedbi: " + error});
//         } else {
//             res.status(200).json(seznam);
//         }
//     });
// };

// BREZ SLIK
const seznamOseb = (req, res) => {
    Osebe.aggregate(
        [
            {
                $unset: [
                    'slika_vir',
                    // 'slika_uri',
                    'slika_avtor'
                ]
            }
        ]
    ).exec(function (error, seznam) {
        if (error) {
            res.status(404).json({sporocilo: "Napaka pri poizvedbi: " + error});
        } else {
            res.status(200).json(seznam);
        }
    });
};

/**
 * @openapi
 * /osebe/{id}:
 *  get:
 *   summary: Vrni podrobnosti osebe.
 *   description: Vrni podrobnosti osebe na podlagi njenega enoličnega identifikatorja.
 *   tags: [Osebe]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> osebe
 *      required: true
 *   responses:
 *    '200':
 *     description: <b>OK</b>, oseba najdena.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Oseba'
 *       example:
 *         - _id: 6537a983686e658414ccb6b1
 *           ime: Dominika
 *           ime_srednje: Švarc
 *           priimek: Pipan
 *           stranka_id: 651450a3a3e11c09560bfb8b
 *           slika_uri: /dominika-svarc-pipan
 *           slika_vir: https://www.gov.si/en/state-authorities/ministries/ministry-of-justice/about-the-ministry-of-justice/ministers-office/dr-dominika-svarc-pipan/
 *           slika_avtor: Tamino Petelinšek / STA
 *           wikipedia_uri: https://sl.wikipedia.org/wiki/Dominika_%C5%A0varc_Pipan
 *    '404':
 *     description: 'Ne najdem osebe s podanim enoličnim identifikatorjem.'
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
const podrobnostiOsebe = (req, res) => {
    const idOsebe = req.params.id;

    // S SLIKAMI
    // Osebe.findById(idOsebe).exec(function (
    //     error,
    //     oseba
    // ) {
    //     if (!oseba) {
    //         res.status(404).json({sporocilo: "Ne najdem osebe s podanim enoličnim identifikatorjem"});
    //     } else if (error) {
    //         res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
    //     } else {
    //         res.status(200).json(oseba);
    //     }
    // });

    // BREZ SLIK
    Osebe.aggregate(
        [
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.id)
                }
            },
            {
                $unset: [
                    'slika_vir',
                    // 'slika_uri',
                    'slika_avtor'
                ]
            }
        ]
    ).exec(function (
        error,
        oseba
    ) {
        // ker je sicer oseba = [] in ni prazno in ne vrne sporočila "Ne najdem osebe s podanim enoličnim identifikatorjem" dodamo:
        if (oseba.length == 0) {
            oseba = null
        }

        if (!oseba) {
            res.status(404).json({sporocilo: "Ne najdem osebe s podanim enoličnim identifikatorjem"});
        } else if (error) {
            res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
        } else {
            res.status(200).json(oseba[0]);
        }
    });
};

/**
 * @openapi
 * /osebe:
 *  post:
 *   summary: Doda novo osebo v bazo.
 *   description: Doda novo osebo z vsemi zahtevanimi podatki v bazo.
 *   tags: [Osebe]
 *   requestBody:
 *    description: Oseba
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        ime:
 *          required: true
 *          example: Dominika
 *        ime_srednje:
 *          required: false
 *          example: Švarc
 *        priimek:
 *          required: true
 *          example: Pipan
 *       required:
 *        - ime
 *        - priimek
 *   responses:
 *    '201':
 *     description: Uspešno <b>ustvarjena</b> nova oseba.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Oseba'
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
const ustvariOsebo = (req, res) => {
    if (!req.body.ime) {
        res
            .status(400)
            .json({sporocilo: "Potrebno je vnesti vse obvezne podatke!"});
    } else {
        const novaOseba = {
            ime: req.body.ime,
            priimek: req.body.priimek
        }
        if (req.body.ime_srednje) {
            novaOseba.ime_srednje = req.body.ime_srednje;
        }
        if (req.body.stranka_id) {
            novaOseba.stranka_id = req.body.stranka_id;
        }
        if (req.body.slika_uri) {
            novaOseba.slika_uri = req.body.slika_uri;
        }
        if (req.body.slika_vir) {
            novaOseba.slika_vir = req.body.slika_vir;
        }
        if (req.body.slika_avtor) {
            novaOseba.slika_avtor = req.body.slika_avtor;
        }
        if (req.body.wikipedia_uri) {
            novaOseba.wikipedia_uri = req.body.wikipedia_uri;
        }
        if (req.body.opis) {
            novaOseba.opis = req.body.opis;
        }
        if (req.body.opombe) {
            novaOseba.opombe = req.body.opombe;
        }

        Osebe.create(novaOseba, function (error, oseba) {
            if (error) {
                res.status(500).json({sporocilo: "Napaka na strežniku: " + error});
            } else {
                res.status(201).json(oseba);
            }
        });
    }
};

/**
 * @openapi
 * /osebe/{id}:
 *  put:
 *   summary: Posodobi osebo.
 *   description: Posodobi osebo z izbranim enoličnim identifikatorjem.
 *   tags: [Osebe]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: <b>enolični identifikator</b> osebe
 *      required: true
 *      example: 6537a983686e658414ccb6b1
 *   requestBody:
 *    description: Oseba
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        ime:
 *          example: Dominika
 *        ime_srednje:
 *          example: Švarc
 *        priimek:
 *          example: Pipan
 *        stranka_id:
 *          example: 651450a3a3e11c09560bfb8b
 *        slika_uri:
 *          example: dominika_svarc_pipan
 *        slika_vir:
 *          example: https://www.gov.si/en/state-authorities/ministries/ministry-of-justice/about-the-ministry-of-justice/ministers-office/dr-dominika-svarc-pipan/
 *        slika_avtor:
 *          example: Tamino Petelinšek / STA
 *        wikipedia_uri:
 *          example: https://sl.wikipedia.org/wiki/Dominika_%C5%A0varc_Pipan
 *       required:
 *        - ime
 *        - priimek
 *   responses:
 *    '200':
 *     description: <b>OK</b>, pri posodabljanju osebe
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Oseba'
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
 *     description: Oseba s tem <b>enoličnim identifikatorjem</b> ne obstaja, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        oseba ni najdena:
 *         value:
 *          message: Ne najdem osebe s podanim enoličnim identifikatorjem
 *    '500':
 *     description: <b>Napaka na strežniku</b>, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo
 */
const posodobiOsebo = (req, res) => {
    const idOsebe = req.params.id;

    if (!req.body.ime && !req.body.priimek) {
        res.status(400).json({
            sporocilo: "Napaka, niso vneseni vsi zahtevani podatki",
        });
    } else {
        Osebe.findById(idOsebe).exec(function (
            error,
            oseba
        ) {
            if (!oseba) {
                res.status(404).json({
                    sporocilo:
                        "Ne najdem osebe s podanim enoličnim identifikatorjem",
                });
            } else {
                oseba.ime = req.body.ime;
                oseba.priimek = req.body.priimek;
                if (req.body.ime_srednje) {
                    oseba.ime_srednje = req.body.ime_srednje;
                }
                if (req.body.stranka_id) {
                    oseba.stranka_id = req.body.stranka_id;
                }
                if (req.body.slika_uri) {
                    oseba.slika_uri = req.body.slika_uri;
                }
                if (req.body.slika_vir) {
                    oseba.slika_vir = req.body.slika_vir;
                }
                if (req.body.slika_avtor) {
                    oseba.slika_avtor = req.body.slika_avtor;
                }
                if (req.body.wikipedia_uri) {
                    oseba.wikipedia_uri = req.body.wikipedia_uri;
                }
                if (req.body.opis) {
                    oseba.opis = req.body.opis;
                }
                if (req.body.opombe) {
                    oseba.opombe = req.body.opombe;
                }

                oseba.save(function (error, oseba) {
                    if (error) {
                        res
                            .status(500)
                            .json({sporocilo: "Napaka na strežniku: " + error});
                    } else {
                        res.status(200).json(oseba);
                    }
                });
            }
        });
    }
};

/**
 * @openapi
 * /osebe/{id}:
 *  delete:
 *   summary: Izbriše osebo.
 *   description: Izbriše osebo s podanim enoličnim identifikatorjem.
 *   tags: [Osebe]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> osebe
 *      required: true
 *      example: 6537a983686e658414ccb6b1
 *   responses:
 *    '204':
 *     description: Oseba je izbrisana
 *    '400':
 *     description: <b>Napaka</b>, enolični identifikator osebe je zahtevan podatek.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Enolični identifikator osebe je obvezen podatek
 *    '404':
 *     description: Oseba ni bila najdena
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       examples:
 *        Oseba ni bila najdena:
 *         value:
 *          message: Ne najdem osebe s podanim enoličnim identifikatorjem
 *    '500':
 *     description: '<b>Napaka na strežniku</b>, s sporočilom napake.'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporociloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo
 */
const izbrisiOsebo = (req, res) => {
    const idOsebe = req.params.id;
    if (!idOsebe) {
        res
            .status(400)
            .json({sporocilo: "Enolični identifikator osebe je obvezen podatek"});
    } else {
        Osebe.findByIdAndRemove(
            idOsebe,
            function (error, rezultat) {
                if (!rezultat) {
                    res.status(404).json({
                        sporocilo:
                            "Ne najdem osebe s podanim enoličnim identifikatorjem",
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
    seznamOseb,
    podrobnostiOsebe,
    ustvariOsebo,
    posodobiOsebo,
    izbrisiOsebo
};
