"use strict"
const Solution = require('mongoose').model('Solution');

// Verifica si pueden editar
function canView() {

  return (req, res, next) => {

    const _id = req.params.id;

    Solution
    .findById(_id)
    //.select({ teams: 1}) // Solo retorna los equipos
    .exec()
    .catch(err => next(err))
    .then( solution => {
      // si la solucion no tiene ningun equipo entonces es publica
      if(solution.teams.length){

        let permission = false;

        // debe existir una sesion activa para comprobar los permisos del usuario
        if(req.user){

          if(req.user.teams) {
            req.user.teams.forEach(function(team) {
              let result = solution.teams.indexOf(team._id) >= 0;
              permission = result ? true : permission;
            })
          }

          if(permission){
            return next();
          }else {
            return res.status(403).json({
              message: 'No tiene permiso para ver',
            });
          }

        }else{
          return res.status(403).json({
            message: 'Inicia sesion',
          });
        }
      }else {
        return next();
      }
    })

  }
}

module.exports = canView();
