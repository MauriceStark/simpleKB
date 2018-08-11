"use strict"

const Solution = require('mongoose').model('Solution');

// Verifica si pueden editar
function canEdit() {
  return (req, res, next) => {
    var _id = req.params.id;
    // Se busca el documento en la base de datos
    Solution
    .findById(_id)
    .select({
      owner: 1,
      teams: 1
    }) // Solo retorna el nombre del autor
    .exec((err, result) => {
      if (err) return res.sendStatus(500);
      // Si existe el documento
      if(result){
        // SI el id del usuario logueado es IGUAL que el autor del documento
        if(req.user.id == result.owner){
          return next();
        }else{

          //req.body = { title: req.body.body };

          // si no perteneze a ningun equipo es publica
          if(result.teams.length <= 0) {
            return next();
          }

          let permission = false;

          // debe existir una sesion activa para comprobar los permisos del usuario
          if(req.user){
            console.log(result);
            if(req.user.teams) {
              req.user.teams.forEach(function(team) {
                let result = solution.teams.indexOf(team._id) >= 0;
                permission = result ? true : permission;
              })
            }

            if(permission){
              return next();
            }else {
              return res.status(401).json({
                success: false,
                message: 'No tiene permiso para editar',
              });
            }

          }else{
            return res.status(401).json({
              message: 'Inicia sesion',
            });
          }

        }

      }
      // Si no existe
      return res.sendStatus(404);
    });
  }
}

module.exports = canEdit();
