const express = require('express');
const router = express.Router();

const ctrlAnkete = require('../controllers/ankete');
const ctrlAnketarji =  require('../controllers/anketarji');
const ctrlNarocniki = require('../controllers/narocniki');
const ctrlVprasanja = require('../controllers/vprasanja');

// Ankete storitve
router.get('/ankete', ctrlAnkete.seznamAnket);
router.get('/ankete/:id', ctrlAnkete.podrobnostiAnkete);
router.delete('/ankete/:id', ctrlAnkete.izbrisiAnketo);
router.post('/ankete', ctrlAnkete.ustvariAnketo);
router.put('/ankete/:id', ctrlAnkete.posodobiAnketo);

// Anketarji storitve
router.get('/anketarji', ctrlAnketarji.seznamAnketarjev);
router.get('/anketarji/:id', ctrlAnketarji.podrobnostiAnketarja);
router.delete('/anketarji/:id', ctrlAnketarji.izbrisiAnketarja);
router.post('/anketarji/', ctrlAnketarji.ustvariAnketarja);
router.put('/anketarji/:id', ctrlAnketarji.posodobiAnketarja);

// Narocniki storitve
router.get('/narocniki', ctrlNarocniki.seznamNarocnikov);
router.get('/narocniki/:id', ctrlNarocniki.podrobnostiNarocnika);
router.delete('/narocniki/:id', ctrlNarocniki.izbrisiNarocnika);
router.post('/narocniki/', ctrlNarocniki.ustvariNarocnika);
router.put('/narocniki/:id', ctrlNarocniki.posodobiNarocnika);

// Vprasanja storitve
router.get('/vprasanja', ctrlVprasanja.seznamVprasanj);
router.get('/vprasanja/:id', ctrlVprasanja.podrobnostiVprasanj);
router.get('/vprasanja/glasovalna/dz', ctrlVprasanja.seznamVprasanjGlasovalnaDZ);
// router.delete('/vprasanja/:id', ctrlVprasanja.izbrisiVprasanje);
// router.post('/vprasanja/', ctrlVprasanja.ustvariVprasanje);
// router.put('/vprasanja/:id', ctrlVprasanja.posodobiVprasanje);

module.exports = router;