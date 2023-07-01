const express = require('express');
const router = express.Router();

// verjetno ni potreben
const multer = require('multer');
const upload = multer();

// require("../models/schemas")

const ctrlAnkete = require('../controllers/ankete');
const ctrlAnketarji =  require('../controllers/anketarji');
const ctrlNarocniki = require('../controllers/narocniki');

/* Ankete storitve */
router.get('/ankete', ctrlAnkete.seznamAnket);
router.get('/ankete/:id', ctrlAnkete.podrobnostiAnkete);
router.delete('/ankete/:id', ctrlAnkete.izbrisiAnketo);
router.post('/ankete', upload.single('anketa'),ctrlAnkete.ustvariAnketo);
router.put('/ankete/:id', upload.single('anketa'),ctrlAnkete.posodobiAnketo);

/* Anketarji storitve */
router.get('/anketarji', ctrlAnketarji.seznamAnketarjev);
router.get('/anketarji/:id', ctrlAnketarji.podrobnostiAnketarja);
router.delete('/anketarji/:id', ctrlAnketarji.izbrisiAnketarja);
router.post('/anketarji/', ctrlAnketarji.ustvariAnketarja);
router.put('/anketarji/:id', ctrlAnketarji.posodobiAnketarja);

/* Narocniki storitve */
router.get('/narocniki', ctrlNarocniki.seznamNarocnikov);
router.get('/narocniki/:id', ctrlNarocniki.podrobnostiNarocnika);
router.delete('/narocniki/:id', ctrlNarocniki.izbrisiNarocnika);
router.post('/narocniki/', ctrlNarocniki.ustvariNarocnika);
router.put('/narocniki/:id', ctrlNarocniki.posodobiNarocnika);


module.exports = router;