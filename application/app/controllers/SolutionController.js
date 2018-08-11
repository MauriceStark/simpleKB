"use strict"
const m = require('mongoose');
//using es6 promises with mongoosejs queries
m.Promise = global.Promise;

const Solution  = m.model('Solution');

const sanitizeHtml = require('sanitize-html');
const sanitizeOptions = {
  allowedTags: [ 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
  'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br',
  'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img' ],
  allowedAttributes: {
    a: [ 'href', 'name', 'target' ],
    // We don't currently allow img itself by default, but this
    // would make sense if we did
    img: [ 'src' ]
  },
  // Lots of these won't come up by default because we don't allow them
  selfClosing: ['br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
  // URL schemes we permit
  allowedSchemes: [ 'data', 'http', 'https' ],
  allowedSchemesByTag: {},
  transformTags: {
    'ol': 'ul'
  },
  nonTextTags: [ 'style', 'script', 'textarea', 'noscript' ]
}

class SolutionController {
  /*constructor() {

  }*/

  view(req, res, next){

    const _id = req.params.id;

    if(m.Types.ObjectId.isValid(_id)) {

      Solution.findById(_id)
      //.populate('owner', 'username') // only return the Persons name
      .select({ id: 1})
      .exec()
      .catch(err => next(err))
      .then(result => {
        if (result) {
          return res.render('solution', {
            solution: result
          });
        }
        return res.render("404");
      });

    }else{
      return res.render("404");
    }
  }

  get(req, res, next){

    const _id = req.params.id;

    if(m.Types.ObjectId.isValid(_id)) {

      Solution.findById(_id)
      .populate('owner', 'username') // only return the Persons name
      .exec()
      .catch(err => next(err))
      .then(result => {
        if (result) {
          return res.json(result);
        }
        return res.render("404");
      });

    }else{
      return res.render("404");
    }
  }

  new(req, res, next){
    res.render('solution', {
      solution: {},
    });
  }

  create(req, res, next){

    var published = req.body.published == "1" ? true : false;

    if(!req.body.title){
      return res.status(400).json({
        success: false,
        message: "Escriba un titulo"
      });
    };

    if(!req.user){
      return res.status(400).json({
        success: false,
        message: "Inicie sesion"
      });
    };

    const data = {
      title: sanitizeHtml(req.body.title, { allowedTags: [ "h1" ] }),
      body: sanitizeHtml(req.body.body, sanitizeOptions),
      tags: req.body.tags,
      published: published,
      owner: req.user._id,
      teams: req.body.teams || []
    };

    Solution.create(data, (err, solution) => {

      if(err) return res.json({ message: err, success: false });

      res.status(200).json({
        message: 'Guardado',
        _id: solution._id
      });
    })
  }

  update(req, res, next){

    const id = req.params.id;

    let published = req.body.published == "1" ? true : false;

    if(!req.body.title){
      return res.status(400).json({
        success: false,
        message: "Escriba un titulo"
      });
    };

    if(!req.user){
      return res.status(400).json({
        success: false,
        message: "Inicie sesion"
      });
    };

    const date = Date.now();

    const data = {
      title: sanitizeHtml(req.body.title, { allowedTags: [ "h1" ] }),
      body: sanitizeHtml(req.body.body, sanitizeOptions),
      tags: req.body.tags,
      lastModifiedAt: date,
      published: published,
      teams: req.body.teams || []
    };

    Solution.findOneAndUpdate({_id: id}, data)
    .exec()
    .catch(err => res.json({ message: err, success: false }) )
    .then( result => {
      if(result){
        return res.status(200).json({
          message: 'Actualizado'
        });
      }else{
        return res.status(400).json({
          message: 'No existe la solucion',
        });
      }
    });

  }

  delete(req, res, next){
    const _id = req.params.id;
    Solution.findByIdAndRemove(_id)
    .exec()
    .catch(err => res.json({ message: "No se pudo eliminar por un error", success: false }))
    .then( result => {
      if(result){
        return res.status(200).json({
          message: 'Solution borrada'
        });
      }
    });
  }

  tags(req, res, next){

    // http://charlascylon.com/2013-10-17-tutorial-mongodb-pipelines-aggregation-i

    // Model.aggregate( [<pipeline>] ) consultas para agrupar datos y calcular valores a partir de ellos.

    const aggregateOptions = [
      { $match: {} },             // $match: filtra la entrada para reducir el número de documentos, dejando solo los que cumplan las condiciones establecidas.
      { $project: { tags: 1 } },  // $project: se utiliza para modificar el conjunto de datos de entrada, añadiendo, eliminando o recalculando campos para que la salida sea diferente.
      { $unwind: "$tags" },       // $unwind: convierte un array para devolverlo separado en documentos.
      { $group: {                 // $group: agrupa documentos según una determinada condición.
          _id: "$tags",           // $group siempre tiene que tener un campo_id. se usa el 'token' value en el _id
          count: { $sum: 1 }      // suma la cantidad de tags que existen
      }},
      { $sort: { count: -1 }}     // $sort: ordena un conjunto de documentos según el campo especificado.
    ];

    Solution.aggregate(aggregateOptions)
    .exec()
    .catch(err => next(err))
    .then(result => {
      // [
      //   {
      //     "_id": "<NOMBRE ETIQUETA>",
      //     "count": <CANTIDAD>
      //   },
      // ]
      return res.json(result);
    });

  }

}

module.exports =  new SolutionController();
