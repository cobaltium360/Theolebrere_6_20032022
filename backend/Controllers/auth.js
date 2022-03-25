const userModel = require('../models/signup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const newUser = new userModel({
      email : req.body.email,
      password : hash
    });

    newUser.save()
      .then(() => res.status(201).json({ message: 'Utilisateur crée !'}))
      .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  userModel.findOne({ email: req.body.email })
    .then(account => {
      if (!account) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, account.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: account._id,
            token: jwt.sign(
              { userId: account._id },
              process.env.JWTPRIV8,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error}));
    })
    .catch(error => res.status(500).json({ error }));
};