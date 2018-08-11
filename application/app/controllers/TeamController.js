const m = require('mongoose');
//using es6 promises with mongoosejs queries
m.Promise = global.Promise;

const Team  = m.model('Team'),
      User  = m.model('User');

module.exports = {


  getAll: (req, res, next) => {
    var q = {};

    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;

    if(req.query.q) {
      q = querySearch(req.query.q);
    };

    Team.find(q)
    .populate('leader', 'username') // only return the username
    .exec()
    .catch(err => next(err))
    .then(result => {
      res.json(result);
    });
  },

  create: (req, res, next) => {

    if(!req.body.team){
      return  res.json({
        success: false,
        message: "Escriba un titulo"
      });
    };

    if(!req.body.leader){
      return  res.json({
        success: false,
        message: "Falta el lider"
      });
    };

    const data = {
      team: req.body.team,
      leader: req.body.leader,
    };

    // Primero se tiene que crear el Team para que nos de un ID.
    Team.create(data)
    .catch(err => res.json({ message: err, success: false }) )
    .then(result => {
      // El segundo paso es: agregar el ID del team creado al array de "teams" del usuario que se escogió como lider.
      // Esto para que el usuario tenga permisos sobre ese equipo.
      User.findByIdAndUpdate(
      { _id: data.leader },
      { $addToSet: { teams: result._id }}) // $addToSet - agrega elementos a un arreglo solo sí estos no existen ya.
      .exec()
      .catch(err => res.json({ message: err, success: false }) )
      .then(result => {

        if(result){
          return res.status(200).json({
            success: true,
            message: 'Guardado',
            _id: result._id
          });
        }else{
          return res.status(200).json({
            success: false,
            message: 'No existe el usuario.',
          });
        }

      });

    })
  },

  update: (req, res, next) => {
    var id = req.params.id;

    if(!req.body.team){
      return  res.json({
        success: false,
        message: "Escriba un titulo"
      });
    };

    if(!req.body.leader){
      return res.json({
        success: false,
        message: "Falta el lider"
      });
    };

    const data = {
      team: req.body.team,
      leader: req.body.leader,
    };

    Team.findOneAndUpdate({_id: id}, data)
    .exec()
    .catch(err => res.json({ message: err, success: false }) )
    .then(result => {
      if(result){
        return res.status(200).json({
          success: true,
          message: 'Guardado'
        });
      }else{
        return res.status(200).json({
          success: false,
          message: 'No existe el team.',
        });
      }
    });
  },

  delete: (req, res, next) => {
    res.render('');
  },
}

function querySearch(stringSearch) {
  // i es para ignorar mayúsculas o minúsculas
  /*{
    $or:[
      {'title': new RegExp(stringSearch, "i")},
      {'username': new RegExp(stringSearch, "i")}
  ]}*/
  return  { $text: { $search: "/'" + stringSearch + "/i'" } };
}
