'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');
const jwtAuth = require('../../lib/jwtAuth');
const multer = require('multer')
const path = require('path')
const cote = require('cote');

const requester = new cote.Requester({ name: 'cliente de crearThumbnail' });

router.get('/', jwtAuth, (req, res, next) => {

  const start = parseInt(req.query.start) || 0;
  const limit = parseInt(req.query.limit) || 1000; // nuestro api devuelve max 1000 registros
  const sort = req.query.sort || '_id';
  const includeTotal = req.query.includeTotal === 'true';
  const filters = {};
  if (typeof req.query.tag !== 'undefined') {
    filters.tags = req.query.tag;
  }

  if (typeof req.query.venta !== 'undefined') {
    filters.venta = req.query.venta;
  }

  if (typeof req.query.precio !== 'undefined' && req.query.precio !== '-') {
    if (req.query.precio.indexOf('-') !== -1) {
      filters.precio = {};
      let rango = req.query.precio.split('-');
      if (rango[0] !== '') {
        filters.precio.$gte = rango[0];
      }

      if (rango[1] !== '') {
        filters.precio.$lte = rango[1];
      }
    } else {
      filters.precio = req.query.precio;
    }
  }

  if (typeof req.query.nombre !== 'undefined') {
    filters.nombre = new RegExp('^' + req.query.nombre, 'i');
  }

  Anuncio.list(filters, start, limit, sort, includeTotal, function (err, anuncios) {
    if (err) return next(err);
    res.json({ ok: true, result: anuncios });
  });
});

// CONFIGURACIÓN MULTER
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/images/anuncios'))
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
  }

})
var upload = multer({ storage: storage })

//AÑADIR ANUNCIOS
router.post('/', upload.single('imagen'), async (req, res, next) => {
  try {

    const fotoName = { foto: req.file.filename }
    const fotoPath = { path: req.file.path }
    const datosAnuncio = { ...req.body, ...fotoName }


    const anuncio = new Anuncio(datosAnuncio)

    const nuevoAnuncio = await anuncio.save()

    requester.send({ type: 'crearThumbnail', ...fotoPath })

    res.status(201).json({ result: nuevoAnuncio })
  } catch (error) {
    next(error)

  }
})

// Return the list of available tags
router.get('/tags', function (req, res) {
  res.json({ ok: true, allowedTags: Anuncio.allowedTags() });
});

module.exports = router;
