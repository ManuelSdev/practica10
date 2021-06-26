'use strict';

const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
//const JWT_SECRET = 'lhalhlashslaslhlha646464646';
//const nodemailer = require('nodemailer');

class LoginController {

  /**
   * GET /login
   */
  index(req, res, next) {
    res.locals.email = '';
    res.locals.error = '';
    res.render('login');
  }


  /**
   * POST /loginJWT
   */
  async postJWT(req, res, next) {
    try {
      const { email, password } = req.body;

      // buscar el usuario en la BD
      const usuario = await Usuario.findOne({ email })

      // si no lo encontramos --> error
      // si no coincide la clave --> error
      if (!usuario || !(await usuario.comparePassword(password))) {
        if (!(await usuario.comparePassword(password))) {
          console.log('usuario')
        }
        const error = new Error('invalid credentials');
        error.status = 401;
        next(error);
        return;
      }

      // si el usuario existe y la clave coincide

      // crear un token JWT (firmado)
      jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '2h' }, (err, jwtToken) => {
        if (err) {
          next(err);
          return;
        }
        // devolveselo al cliente
        res.json({ token: jwtToken });
      });




    } catch (err) {
      next(err);
    }
  }



  /**
   * GET /logout
   */
  logout(req, res, next) {
    req.session.regenerate(err => {
      if (err) {
        next(err);
        return;
      }
      res.redirect('/');
    })
  }

}


module.exports = new LoginController();


// Lo de arriba es lo mismo que esto de abajo:
// module.exports = {
//   index: (req, res, next) => {
//     res.render('login');
//   },
//   post: (req, res, next) => {

//   }
// };
