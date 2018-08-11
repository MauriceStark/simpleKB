"use strict"
const m = require('mongoose');
//using es6 promises with mongoosejs queries
m.Promise = global.Promise;

const Solution  = m.model('Solution'),
      Serie     = m.model('Serie'),
      User      = m.model('User'),
      Team      = m.model('Team');

function querySearch(stringSearch) {
  // i es para ignorar mayúsculas o minúsculas
  /*{
    $or:[
      {'title': new RegExp(stringSearch, "i")},
      {'username': new RegExp(stringSearch, "i")}
  ]}*/
  return  { $text: { $search: "/'" + stringSearch + "/i'" } };
}


class AdminController {
  /*constructor() {

  }*/
  index(req, res, next){
    // scale value of 1024 will display the results in kilobytes
    Promise.all([
      Solution.collection.stats({scale: 1024}).then( results => {
        return {
          name: "Soluciones",
          count: results.count,
          storageSize: results.storageSize,
          size: results.size
        }
      }),
      Serie.collection.stats({scale: 1024}).then( results => {
        return {
          name: "Series",
          count: results.count,
          storageSize: results.storageSize,
          size: results.size
        }
      }),
      User.collection.stats({scale: 1024}).then( results => {
        return {
          name: "Usuarios",
          count: results.count,
          storageSize: results.storageSize,
          size: results.size
         }
      }),
      Team.collection.stats({scale: 1024}).then( results => {
        return {
          name: "Equipos",
          count: results.count,
          storageSize: results.storageSize,
          size: results.size
        }
      })
    ]).then(results => {

      res.render("admin", {
        stats: results
      });

    });
  }

  getAllUsers(req, res, next){
    let q = {};

    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;

    if(req.query.q) {
      q = querySearch(req.query.q);
    };

    User.find(q)
    .sort({createdAt: -1})
    .select({ password: 0, favorites: 0 })
    .limit(limit)
    .skip(skip)
    .populate('teams', 'team') // only return the team name
    .exec()
    .catch(err => next(err))
    .then(result => res.json(result));

  }

  getAllSolutions(req, res, next){

    let q = {};

    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;

    if(req.query.q) {
      q = querySearch(req.query.q);
    };

    Solution.find(q)
    .sort({lastModifiedAt: -1})
    .select({ body: 0 })
    .limit(limit)
    .skip(skip)
    .populate('owner', 'username') // only return the Persons name
    .populate('teams', 'team') // only return the team name
    .exec()
    .catch(err => next(err))
    .then(result => res.json(result));

  }

  getAllSeries(req, res, next){
    let q = {};

    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;

    if(req.query.q) {
      q = querySearch(req.query.q);
    };

    Serie.find(q)
    .sort({lastModifiedAt: -1})
    .select({ description: 0 })
    .limit(limit)
    .skip(skip)
    .populate('owner', 'username') // only return the Persons name
    .populate('solutions', 'title') // only return the title
    .exec()
    .catch(err => next(err))
    .then(result => res.json(result));

  }

  updateUser(req, res, next){
    const id = req.params.id;

    /*if(!req.body.username){
      return  res.json({
        success: false,
        message: "Escriba el nombre"
      });
    };*/

    const data = {
      //username: req.body.username,
      teams:    req.body.teams,
      isActive: req.body.isActive,
      isAdmin:  req.body.isAdmin,
    };

    User.findOneAndUpdate({_id: id}, data)
    .exec()
    .catch(err => res.json({ message: err, success: false }) )
    .then( result => {
      if(result){
        return res.status(200).json({
          success: true,
          message: 'Guardado'
        });
      }else{
        return res.status(200).json({
          success: false,
          message: 'No existe el usuario.',
        });
      }
    });
  }

};

module.exports =  new AdminController();
