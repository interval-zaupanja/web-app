const express = require('express');
const router = express.Router();

const ctrlAnkete = require('../controllers/ankete');
const ctrlAnketarji =  require('../controllers/anketarji');
const ctrlNarocniki = require('../controllers/narocniki');
const ctrlStranke = require('../controllers/stranke');
const ctrlVprasanja = require('../controllers/vprasanja');
const ctrlGlasovanja = require('../controllers/glasovanja');

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

// Stranke storitve
router.get('/stranke', ctrlStranke.seznamStrank);
router.get('/stranke/:id', ctrlStranke.podrobnostiStranke);
router.delete('/stranke/:id', ctrlStranke.izbrisiStranko);
router.post('/stranke/', ctrlStranke.ustvariStranko);
router.put('/stranke/:id', ctrlStranke.posodobiStranko);

// Vprasanja storitve
router.get('/vprasanja', ctrlVprasanja.seznamVprasanj);
router.get('/vprasanja/:id', ctrlVprasanja.podrobnostiVprasanja);
router.get('/vprasanja/anketa/:id', ctrlVprasanja.seznamVprasanjAnketa);
router.get('/vprasanja/glasovanje/:id', ctrlVprasanja.seznamVprasanjGlasovanje);
router.get('/vprasanja/glasovalna/dz', ctrlVprasanja.seznamVprasanjGlasovalnaDZ);
// router.delete('/vprasanja/:id', ctrlVprasanja.izbrisiVprasanje);
// router.post('/vprasanja/', ctrlVprasanja.ustvariVprasanje);
// router.put('/vprasanja/:id', ctrlVprasanja.posodobiVprasanje);

// Glasovanja storitve
router.get('/glasovanja', ctrlGlasovanja.seznamGlasovanj);
router.get('/glasovanja/:id', ctrlGlasovanja.podrobnostiGlasovanja);
router.delete('/glasovanja/:id', ctrlGlasovanja.izbrisiGlasovanje);
router.post('/glasovanja', ctrlGlasovanja.ustvariGlasovanje);
router.put('/glasovanja/:id', ctrlGlasovanja.posodobiGlasovanje);

module.exports = router;