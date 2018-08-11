"use strict"

// Verifica si esta logueado
function isLoggedIn() {
  return (req, res, next) => {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){

      // if user is active
      if(req.user.isActive){
        return next();
      }else {
        return res.render('suspend');
      }
    }

    // if they aren't redirect them to the home page
    return res.redirect('/login');
  }
}


module.exports = isLoggedIn();
