var multipart 			= require('connect-multiparty');
var bodyParser 			= require('body-parser');
var morgan 					= require('morgan');
var cookieParser 		= require('cookie-parser');
var methodOverride 	= require('method-override');
var flash 					= require('connect-flash');
// Configuring Passport
var passport 				= require('passport');
var session 				= require('express-session');
var MongoStore 			= require('connect-mongo')(session);
// 	Router specific middlewares
var injectionDefense 	= require("./middlewares/injectionDefense");
var routes = require('./routes.js');

module.exports = function(express, config) {
	var app = express();

	/* ===========================================================================
		views - la ruta absoluta al directorio con las plantillas
	============================================================================*/
	app.set('views', './app/views');
	app.set('view engine', 'ejs');
	app.set('view cache', process.env.NODE_ENV == "production" ? true : false);
	//Configure Express
	app.engine('.html', require('ejs').__express);

	// Se nesesita para tratar con archivos binarios
	app.use(multipart({
    uploadDir:  __dirname + '/../public/files/images' // Ruta donde se subiran las imagenes
  }));

	/* ===========================================================================
		Para servir contenido estatico se usa el middleware express.static incorporado en express.
	============================================================================*/
	app.use(express.static(__dirname + '/../public'));
	app.use('/bower_components',  express.static(__dirname + '/../bower_components'));

	/* ===========================================================================
		body-parser - permite procesar los datos que vienen y convertirlos en objetos javascript
	============================================================================*/
	/*app.use(morgan('dev'));					// log every request to the console*/
	app.use(bodyParser.json()); 			// get information from html forms
	app.use(bodyParser.urlencoded({
		limit:'10mb',
		parameterLimit: 20,
		extended: true
	 }));

	/* ===========================================================================
	 	express-session - permite al servidor usar sesiones web. Necesita tener activo antes a cookie-parser.
	============================================================================*/
	app.use(cookieParser());										// read cookies (needed for auth
	app.use(session({
		store: new MongoStore({ url: config.mongoSessionuri}),
		secret: config.sessionSecret,
		key: 'sid', 															// Nombre con el que se guarda el ID de la session; por default es connect.sid
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 1000 * 60 * 60 * 24 }, 	// maxAge : one Day
	}));

	app.use(passport.initialize());
	app.use(passport.session());								// persistent login sessions
	// use connect-flash for flash messages stored in session
	app.use(flash());
	// method-override - permite al servidor soportar metodos http que el cliente no soporte.
	app.use(methodOverride());

 	// Custom headers
	app.use(( req, res, next ) => {
	  app.disable('x-powered-by');
	  res.setHeader('X-Powered-By', 'SimpleKB');
	  next();
	});

	/* ===========================================================================
		res.locals - 	Aqui se guardan datos del usuario autentificado para ser usados en las vistas
	============================================================================*/
	app.use(function(req, res, next) {
		// req.user se genera en passport.deserializeUser
		res.locals.teams 			= req.isAuthenticated() ? req.user.teams : "";
	  res.locals.username 	= req.isAuthenticated() ? req.user.username : "";
	  res.locals.userid 		= req.isAuthenticated() ? req.user._id : "";
	  res.locals.favorites 	= req.isAuthenticated() ? req.user.favorites : "";
		res.locals.isAdmin 		= req.isAuthenticated() ? req.user.isAdmin : "";
	  next();
	});

	/* ===========================================================================
		development - configuracion de desarrollo
	============================================================================*/
	if(process.env.NODE_ENV == "development"){
		app.set('json spaces', 1);
	}

	/* ===========================================================================
		Routing - manejadores de ruta
	============================================================================*/
	// Lo cargamos en la app antes de definir las rutas o nunca se ejecutara

	app.use(injectionDefense);
	app.use(routes);

	return app;
};
