"use strict"
const m = require('mongoose');
//using es6 promises with mongoosejs queries
m.Promise = global.Promise;

const Solution  = m.model('Solution'),
      Serie     = m.model('Serie'),
      User      = m.model('User'),
      Team      = m.model('Team');

module.exports = {

  edit: (req, res, next) => {
    res.render('usuario');
  },

  update: (req, res, next) => {
    res.render('');
  },

  new: (req, res, next) => {
    res.render('usuario');
  },

  create: (req, res, next) => {
    res.render('');
  },

  delete: (req, res, next) => {
    res.render('');
  },

/*
  http://localhost:3000/api/v1/user                                  ->  Devuelve todos los usuarios del sistema
  http://localhost:3000/api/v1/user?teamId=588a796684fbf33b00a30c8e  ->  Devuelve solo los usuarios de un equipo
  http://localhost:3000/api/v1/user?username=administrador           ->  Devuelve solo el usuario buscado
*/

  getAllUsers: (req, res, next) => {
    let q = {};
    
    let limit = 30;

    if(req.query.teamId){
      q.teams = req.query.teamId;
    }

    if(req.query.username){
      // i es para ignorar mayúsculas o minúsculas
      q.username = new RegExp(req.query.username, "i");
      limit = 1;
    }

    User.find(q)
    .limit(limit)
    .sort({createdAt: -1})
    .select({username: 1})
    .exec()
    .catch(err => next(err))
    .then(result => res.json(result));
  },

  getTeams: (req, res, next) => {
    User.findById(req.user._id)
    .populate('teams', 'team')          // only return the team name
    .select({ username: 1 ,teams: 1 })
    .exec()
    .catch(err => next(err))
    .then(result => {
      res.json(result);
    });
  },

  view: (req, res, next) => {
    res.render('user.ejs');
  },

  index: (req, res, next) => {

    const userId = req.query.id;

    let objectsQuery = {
      owner: userId
    };

    const objectsSelect = {
      title:    1,
      published:1,
      tags:     1,
      teams:    1,
      lastModifiedAt: 1
    };

    const userSelect = {
      username: 1,
      teams:    1,
      favorites:1,
      createdAt:1,
      isAdmin:  1
    };

    const teamSelect = {
      id:   1,
      team: 1,
    };

    // Si el usuario que visita la pagina no es el mismo que esta logueado
    if(userId != req.user._id){
      objectsQuery.published = true;  // Solo vera los documentos publicados
      userSelect.favorites = -1;      // No retornara el atributo favoritos
    }

    var Model = req.query.type == "series" ? Serie : Solution;

    Promise.all([
      User.findById(userId)
      .select(userSelect)
      .populate('teams', 'team')
      .populate('favorites', {
        title: 1,                    // only return the team name
        lastModifiedAt: 1            // return the title and lastModifiedAt
      })
      .catch(err => next(err))
      .then(result => result),
      Model.find(objectsQuery)
      .select(objectsSelect)
      .populate('teams', 'team')    // only return the team name
      .sort({lastModifiedAt: -1})
      .then(result => result),
      Team.find({leader: userId})
      .select(teamSelect)
      //.populate('teams', 'team')    // only return the team name
      .then(result => result)
      ]).then(results => {
        res.json({
          user:    results[0],
          objects: results[1],
          leader:  results[2],
          type:    req.query.type == "series" ? "serie" : "solution"
        });
      });
  },

  addFavorite: (req, res, next) => {

    const id = req.params.id;

    User.findByIdAndUpdate(
    { _id: req.user._id },
    { $addToSet: { favorites: id }})      // $addToSet - Agrega elementos a un arreglo solo sí estos no existen ya.
    /*{safe: true, upsert: true, new : true},*/
    .exec()
    .catch(err => res.json({ message: err }))
    .then(result => {
      if(result){
        return res.status(200).json({
          message: 'Favorito guardado'
        });
      }else{
        return res.status(400).json({
          success: false,
          message: 'No se pudo guardar',
        });
      }
    });
  },

  removeFavorite: (req, res, next) => {

    const id = req.params.id;

    User.findByIdAndUpdate(
    { _id: req.user._id },
    { $pull: { favorites: id }})      // $pull - elimina los valores de un arreglo que cumplan con el filtro indicado.
    /*{safe: true, upsert: true, new : true},*/
    .exec()
    .catch(err => res.json({ message: err }))
    .then(result => {
      if(result){
        return res.status(200).json({
          message: 'Favorito eliminado'
        });
      }else{
        return res.status(400).json({
          success: false,
          message: 'No se pudo eliminar',
        });
      }
    });
  },

  addTeam: (req, res, next) => {

    const teamId = req.params.teamId;
    const userId = req.params.userId;

    User.findByIdAndUpdate(
    { _id: userId },
    { $addToSet: { teams: teamId }})  // $addToSet - Agrega elementos a un arreglo solo sí estos no existen ya.
    .select({username: 1})
    .exec()
    .catch(err => res.json({ message: err }))
    .then(result => {
      if(result){
        return res.status(200).json({
          message: `Usuario ${result.username} agregado al equipo`
        });
      }else{
        return res.status(400).json({
          success: false,
          message: 'No se pudo guardar',
        });
      }
    });
  },

removeTeam: (req, res, next) => {

  const teamId = req.params.teamId;
  const userId = req.params.userId;

  User.findByIdAndUpdate(
  { _id: userId },
  { $pull: { teams: teamId }}) // $pull - elimina los valores de un arreglo que cumplan con el filtro indicado.
  .select({username: 1})
  .exec()
  .catch(err => res.json({ message: err }))
  .then(result => {
    if(result){
      return res.status(200).json({
        message: `Usuario ${result.username} eliminado del equipo`
      });
    }else{
      return res.status(400).json({
        success: false,
        message: 'No se pudo eliminar',
      });
    }
  });
},

};
