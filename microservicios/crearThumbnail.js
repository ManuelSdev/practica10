
//Servicio de creación de thumbnails

const cote = require('cote');
var jimp = require('jimp')
// declarar el microservicio
const responder = new cote.Responder({ name: 'servicio crear thumbnail' });

responder.on('crearThumbnail', async req => {
    const fotoPath = req.path

    const thumbnailPath = fotoPath.replace(".", "_thumbnail.")
    //console.log(thumbnailPath)

    const image = await jimp.read(fotoPath)
    image.scaleToFit(100, 100)
    image.write(thumbnailPath)
})