const { find } = require('../models/sauces');
const sauceModel = require('../models/sauces');
const fs = require('fs')

exports.createSauce = (req, res, next) => {

    const SAUCE = JSON.parse(req.body.sauce);

      const newSauce = new sauceModel({
        ...SAUCE,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      });
      newSauce.save()
        .then(() => res.status(201).json({ message: 'sauce crée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.getSauce = (req, res, next) => {
  sauceModel.find()
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(500).json({ error }));
};

exports.getId = (req, res, next) => {
  sauceModel.findOne({ _id: req.params.id })
    .then(sauceId => res.status(200).json(sauceId))
    .catch(error => res.status(500).json({ error }));
};

exports.putId = (req, res, next) => {

  sauceModel.findOne({ _id: req.params.id })
    .then(sauceId => {
      if(req.auth == sauceId.userId){
        if(req.body.sauce){
          const sauce = JSON.parse(req.body.sauce);
          const filename = sauceId.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
              sauceModel.updateOne({ 
                _id: req.params.id},
                {...sauce,
                imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
              })
              .then(() => res.status(200).json({ message: 'Objet modifié !'}))
              .catch(error => res.status(400).json({ error }));
          });
          
          
        }else{
          sauceModel.updateOne({ _id: req.params.id}, {...req.body,})
            .then(() => res.status(200).json({ message: 'Objet modifié !'}))
            .catch(error => res.status(400).json({ error }));
        }
      }else{
        res.status(401).json({message: 'unauthorized'})
      }
    })
    .catch(error => res.status(500).json({ error }));
};



exports.postLike = (req, res, next) => {

  if(req.body.like == 1){
    sauceModel.findOne({ _id: req.params.id })
    .then(sauceId => {

      const findlike = sauceId.usersLiked.find(caca => caca === req.auth);
      if(findlike){
        res.status(403).json({message:"l'utilisateur à déja liker ce produit"})
      }else{
        sauceModel.updateOne({
        _id: req.params.id}, {
        $inc: {likes: +1},
        $push: {usersLiked: req.body.userId}
      })
        .then(() => res.status(200).json({ message: 'like ajouté'}))
        .catch(error => res.status(400).json({ error }));
      }})

      
    .catch(error => res.status(500).json({ error }));
  
  }else if(req.body.like == 0){

    sauceModel.findOne({ _id: req.params.id })
    .then(sauceId => {
      
      const findlike = sauceId.usersLiked.find(elm => elm === req.auth);
      const finddislike = sauceId.usersDisliked.find(elm => elm === req.auth);
      if(findlike){
        sauceModel.updateOne({
          _id: req.params.id}, {
          $inc: {likes: -1},
          $pull: {usersLiked: req.body.userId}
        })
          .then(() => res.status(200).json({ message: 'like retiré'}))
          .catch(error => res.status(400).json({ error }));
      }
      if(finddislike){
        sauceModel.updateOne({
          _id: req.params.id}, {
          $inc: {dislikes: -1},
          $pull: {usersDisliked: req.body.userId}
        })
          .then(() => res.status(200).json({ message: 'dislike retiré'}))
          .catch(error => res.status(400).json({ error }));
      }
      
    }).catch(error => res.status(500).json({ error }));

  }else if(req.body.like == -1){
    sauceModel.findOne({ _id: req.params.id })
    .then(sauceId => {
      const finddislike = sauceId.usersDisliked.find(elm => elm === req.auth);
      if(finddislike){
        res.status(403).json({message:"l'utilisateur à déja disliker ce produit"})
      }else{
        sauceModel.updateOne({
        _id: req.params.id}, {
        $inc: {dislikes: +1},
        $push: {usersDisliked: req.body.userId}
      })
        .then(() => res.status(200).json({ message: 'dislike ajouté'}))
        .catch(error => res.status(400).json({ error }));
      }})
    .catch(error => res.status(500).json({ error }));
  };
};

exports.deleteSauce = (req, res, next) => {
  
    sauceModel.findOne({ _id: req.params.id })
      .then(sauce => {
        if(req.auth == sauce.userId){
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            sauceModel.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
              .catch(error => res.status(400).json({ error }));
          });
        }else{
          res.status(401).json({message: 'unauthorized'})
        }
        
      })
      .catch(error => res.status(500).json({ error }));
  
};