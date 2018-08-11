// Verifica si pueden editar
function isAdmin() {
  return (req, res, next) => {
    if(req.user.isAdmin){
      return next();
    }
    return res.render("404");
  }
}

module.exports = isAdmin();
