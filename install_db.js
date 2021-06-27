'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const readLine = require('readline');
const async = require('async');

const db = require('./lib/connectMongoose');

// Cargamos las definiciones de todos nuestros modelos
const Anuncio = require('./models/Anuncio');
const Usuario = require('./models/Usuario');

db.once('open', async function () {
  try {
    const answer = await askUser('Are you sure you want to empty DB? (no) ');
    if (answer.toLowerCase() === 'yes') {

      // Inicializar nuestros modelos
      await initAnuncios();
      await initUsuarios();
      console.log(process.env.JWT_SECRET)
    } else {
      console.log('DB install aborted!');
    }
    return process.exit(0);
  } catch (err) {
    console.log('Error!', err);
    return process.exit(1);
  }
});

function askUser(question) {
  return new Promise((resolve, reject) => {
    const rl = readLine.createInterface({
      input: process.stdin, output: process.stdout
    });
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function initAnuncios() {

  await Anuncio.deleteMany({});
  console.log('Anuncios borrados.');

  // Cargar anuncios.json
  const fichero = './anuncios.json';

  console.log('Cargando ' + fichero + '...');
  const numLoaded = await Anuncio.cargaJson(fichero);
  console.log(`Se han cargado ${numLoaded} anuncios.`);

  return numLoaded;

}

async function initUsuarios() {
  const { deletedCount } = await Usuario.deleteMany();
  console.log(`Eliminados ${deletedCount} usuarios.`);

  const result = await Usuario.insertMany([
    /*
    {
      email: 'admin@example.com',
      password: '1234'
    }
    */
    {
      email: 'a@example.com',
      password: await Usuario.hashPassword('1234')
    },
    {
      email: 'user@example.com',
      password: await Usuario.hashPassword('1234')
    }
  ]);
  console.log(`Insertados ${result.length} usuario${result.length > 1 ? 's' : ''}.`)
}
