const m = require('mongoose');
//using es6 promises with mongoosejs queries
m.Promise = global.Promise;

const Solution  = m.model('Solution'),
      Serie     = m.model('Serie');

module.exports = {

  index: (req, res, next) => {
    var q = {};
    const stringSearch = req.query.q ? req.query.q : false;
    if(stringSearch) {
      // i es para ignorar mayúsculas o minúsculas
      q =  { $text: { $search: "/'" + stringSearch + "/i'" } };
    };

    q.published = true;

    var Model = req.query.type == "series" ? Serie : Solution;

    Model
    .find(q)
    .limit(25)
    .sort({lastModifiedAt: -1})
    .select({
      title: 1,
      createdAt: 1
    })
    .exec()
    .catch(err => next(err))
    .then(solutions => {

      var result = {
        solutions: solutions,
        type: req.query.type == "series" ? "serie" : "solution"
      };

      if(stringSearch) result.search = stringSearch

      res.render('index', result);
    });
  },

  getAll: (req, res, next) => {

    var q = {};

    const stringSearch = req.query.q ? req.query.q : false;

    if(stringSearch) {
      // i es para ignorar mayúsculas o minúsculas
      q =  { $text: { $search: "/'" + stringSearch + "/i'" } };
    };

    q.published = true;

    var Model = req.query.type == "series" ? Serie : Solution;

    if (req.query.tag) q.tags = req.query.tag;

    if (req.isAuthenticated()){
      // SI esta logueado, muestra los docuentos de los equipos del usuario o documentos sin equipo
      q.$or = [
        { teams: { $in : req.user.teams } }, // $in, busca una coincidencia dentro de un array
        { teams: [] }
      ];

    }else{
      // si no  esta logueado se mostrara los documentos sin equipo (publicos)
      q.teams = [];
    }

    Model
    .find(q)
    .limit(20)
    .sort({lastModifiedAt: -1})
    .populate('owner', 'username') // only return the Persons name
    .populate('teams', 'team') // only return the team name
    .select({
      title: 1,
      createdAt: 1,
      owner: 1,
      teams: 1,
      tags:1
    })
    .exec()
    .catch(err => next(err))
    .then(results => {

      var result = {
        objects: results,
        type: req.query.type == "series" ? "serie" : "solution"
      };

      if(stringSearch) result.search = stringSearch

      res.json(result);
    });
  },

/*  getAllSolutions(req, res, next){

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

  }*/

  login: (req, res, next) => {
    res.render('login');
  },

};
