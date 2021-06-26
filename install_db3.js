'use strict';

//require('dotenv').config();

const { mongoose, connectMongoose, Usuario, Anuncio } = require('./models');


main().catch(err => console.error(err));

async function main() {

  // inicializo colección de usuarios
  await initUsuarios();
  await initAnuncios();

  mongoose.connection.close();
}

async function initAnuncios() {

  await Anuncio.remove({});
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
    {
      email: 'admin@example.com',
      password: await Usuario.hashPassword('1234')
    },
    {
      email: 'jamg44@gmail.com',
      password: await Usuario.hashPassword('1234')
    }
  ]);
  console.log(`Insertados ${result.length} usuario${result.length > 1 ? 's' : ''}.`)
}