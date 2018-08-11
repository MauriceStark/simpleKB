const mongoose  = require('mongoose');
const passport  = require('passport');
const express   = require("express");
const router    = express.Router();
require('./passport.js');

/* ===========================================================================
	Router specific middlewares
============================================================================*/

const isLoggedIn 	= require("./permissions/isLoggedIn"),
      canEdit 		= require("./permissions/canEdit"),
      canView 		= require("./permissions/canView"),
      isAdmin 		= require("./permissions/isAdmin");

/* ===========================================================================
	controllers
============================================================================*/
var controller = {
	index: 		require('../app/controllers/IndexController.js'),
	solution: require('../app/controllers/SolutionController.js'),
	serie: 		require('../app/controllers/SerieController.js'),
	user: 		require('../app/controllers/UserController.js'),
  admin: 		require('../app/controllers/AdminController.js'),
  team: 		require('../app/controllers/TeamController.js'),
}

// Dashboard routers
router.get('/admin',    isLoggedIn, isAdmin, controller.admin.index);

router.get('/api/v1/admin/users',       isLoggedIn, isAdmin, controller.admin.getAllUsers);
router.get('/api/v1/admin/solutions',   isLoggedIn, isAdmin, controller.admin.getAllSolutions);
router.get('/api/v1/admin/series',      isLoggedIn, isAdmin, controller.admin.getAllSeries);

router.get('/api/v1/admin/teams',         isLoggedIn, isAdmin, controller.team.getAll);
router.post('/api/v1/admin/team',         isLoggedIn, isAdmin, controller.team.create);
router.put('/api/v1/admin/team/:id',      isLoggedIn, isAdmin, controller.team.update);
router.put('/api/v1/admin/user/:id',      isLoggedIn, isAdmin, controller.admin.updateUser);

// Contacto routers
router.get('/solution/add',       isLoggedIn, controller.solution.new);
router.post('/api/v1/solution',   isLoggedIn, controller.solution.create);

router.get('/solution/:id',               canView, controller.solution.view);

router.get('/api/v1/solution/:id',        canView, controller.solution.get);
router.put('/api/v1/solution/:id',        isLoggedIn, canEdit, controller.solution.update);
router.delete('/api/v1/solution/:id',     isLoggedIn, canEdit, controller.solution.delete);

// Serie routers
router.get('/serie/add',  		isLoggedIn, controller.serie.new);
router.post('/serie/add', 		isLoggedIn, controller.serie.create);

router.get('/serie/:id', 			controller.serie.view);
router.put('/serie/:id', 			isLoggedIn, canEdit, controller.serie.update);
router.delete('/serie/:id', 	isLoggedIn, canEdit, controller.serie.delete);


//router.get('/api/v1/user/favorites',  isLoggedIn, controller.user.favorites);
//router.get('/user/series', 		isLoggedIn, controller.user.series);

router.get('/user/add', 			isLoggedIn, controller.user.new);
router.post('/user/add', 			isLoggedIn, controller.user.create);
router.get('/user/:id/edit', 	isLoggedIn, controller.user.edit);
router.post('/user/:id/edit',	isLoggedIn, controller.user.update);
router.delete('/user/:id', 		isLoggedIn, controller.user.delete);

// Usuario routers
router.get('/user',            isLoggedIn, controller.user.view);
router.get('/api/v1/user',	   isLoggedIn, controller.user.index);

/*
  http://localhost:3000/api/v1/user                                  ->  Devuelve todos los usuarios del sistema
  http://localhost:3000/api/v1/user?teamId=588a796684fbf33b00a30c8e  ->  Devuelve solo los usuarios de un equipo
  http://localhost:3000/api/v1/user?username=administrador           ->  Devuelve solo el usuario buscado
*/
//router.get('/api/v1/users',          isLoggedIn, controller.user.getAllUsers);
router.get('/api/v1/user/teams', 		isLoggedIn, controller.user.getTeams);

router.post('/api/v1/user/:userId/team/:teamId',    isLoggedIn, controller.user.addTeam);
router.delete('/api/v1/user/:userId/team/:teamId',  isLoggedIn, controller.user.removeTeam);

// Favorites routers
router.post('/api/v1/favorite/:id', 			isLoggedIn, controller.user.addFavorite);
router.delete('/api/v1/favorite/:id',	  	isLoggedIn, controller.user.removeFavorite);

router.get('/api/v1/admin/tags',		      isLoggedIn, controller.solution.tags);
//router.get('/tag/:tag', isLoggedIn, controller.solution.findTag);

// Site routers
router.get('/?', controller.index.index);

router.get('/api/v1/solutions/?', controller.index.getAll);

// User Login/Register routers
router.get('/login', controller.index.login);

router.post('/login', passport.authenticate('login',{
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));

/* Manipular la salida */
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/signup', (req, res) => {
  res.render("signup");
});

router.post('/signup', passport.authenticate('signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash : true
}));

router.use((req, res, next) => {
  res.status(404).render('404');
});

// Verifica si el parametro :id es un identificador valido de mongodb
router.param('id', (req, res, next, value) => {
  if(mongoose.Types.ObjectId.isValid(value)) {
		return next();
	}else{
		return res.status(404).render('404');
	}
});

module.exports = router;
