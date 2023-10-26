const express = require('express');
const router = express.Router();

const ctrlAnkete = require('../controllers/ankete');
const ctrlIzvajalci =  require('../controllers/izvajalci');
const ctrlNarocniki = require('../controllers/narocniki');
const ctrlStranke = require('../controllers/stranke');
const ctrlVprasanja = require('../controllers/vprasanja');
const ctrlGlasovanja = require('../controllers/glasovanja');
const ctrlOsebe = require('../controllers/osebe');
const ctrlPrijave = require('../controllers/prijave');

// Ankete storitve
router.get('/ankete', ctrlAnkete.seznamAnket);
router.get('/ankete/:id', ctrlAnkete.podrobnostiAnkete);
router.delete('/ankete/:id', ctrlAnkete.izbrisiAnketo);
router.post('/ankete', ctrlAnkete.ustvariAnketo);
router.put('/ankete/:id', ctrlAnkete.posodobiAnketo);

// izvajalci storitve
router.get('/izvajalci', ctrlIzvajalci.seznamIzvajalcev);
router.get('/izvajalci/:id', ctrlIzvajalci.podrobnostiIzvajalca);
router.delete('/izvajalci/:id', ctrlIzvajalci.izbrisiIzvajalca);
router.post('/izvajalci/', ctrlIzvajalci.ustvariIzvajalca);
router.put('/izvajalci/:id', ctrlIzvajalci.posodobiIzvajalca);

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
// router.delete('/vprasanja/:id', ctrlVprasanja.izbrisiVprasanje);
// router.post('/vprasanja/', ctrlVprasanja.ustvariVprasanje);
// router.put('/vprasanja/:id', ctrlVprasanja.posodobiVprasanje);

// Glasovanja storitve
router.get('/glasovanja', ctrlGlasovanja.seznamGlasovanj);
router.get('/glasovanja/:id', ctrlGlasovanja.podrobnostiGlasovanja);
router.delete('/glasovanja/:id', ctrlGlasovanja.izbrisiGlasovanje);
router.post('/glasovanja', ctrlGlasovanja.ustvariGlasovanje);
router.put('/glasovanja/:id', ctrlGlasovanja.posodobiGlasovanje);

// Osebe storitve
router.get('/osebe', ctrlOsebe.seznamOseb);
router.get('/osebe/:id', ctrlOsebe.podrobnostiOsebe);
router.delete('/osebe/:id', ctrlOsebe.izbrisiOsebo);
router.post('/osebe', ctrlOsebe.ustvariOsebo);
router.put('/osebe/:id', ctrlOsebe.posodobiOsebo);

// Prijave storitve (MOGOČE TE POTI NISO RAVNO NAJBOLJ SKLADNE)
router.get('/prijave', ctrlPrijave.seznamPrijav);
router.get('/prijave/:id', ctrlPrijave.podrobnostiPrijave);
router.delete('/prijave/:id', ctrlPrijave.izbrisiPrijavo);
router.post('/prijave', ctrlPrijave.ustvariPrijavo);
router.put('/prijave/:id', ctrlPrijave.posodobiPrijavo);

module.exports = router;