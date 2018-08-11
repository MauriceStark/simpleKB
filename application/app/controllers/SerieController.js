const m = require('mongoose');
//using es6 promises with mongoosejs queries
m.Promise = global.Promise;

const Solution  = m.model('Solution'),
      Serie     = m.model('Serie');

module.exports = {

  new: (req, res, next) => {

    Solution
    .find({owner: req.user._id})
    .sort('title')
    .select({ title: 1})
		.exec()
		.catch(err => next(err))
    .then(result => {
			res.render('serie',{
				solutions: result
			});
    });

  },

  create: (req, res, next) => {

    if(!req.body.title){
      return  res.json({
        success: false,
        message: "Escriba un titulo"
      });
    };

    if(!req.user){
      return  res.json({
        success: false,
        message: "Inicie sesion"
      });
    };

    data = {
      title: req.body.title,
      description: req.body.body,
      owner: req.user._id,
      solutions: req.body.solutionsIds
    };

    Serie.create(data, (err, serie) => {

      if(err) return res.json({ message: err, success: false });

      res.status(200).json({
        message: 'Guardado',
        _id: serie._id
      });
    })
  },

  edit: (req, res, next) => {
    res.render('usuario');
  },

  update: (req, res, next) => {
    res.render('');
  },

  delete: (req, res, next) => {
    res.render('');
  },

  view: (req, res, next) => {
    const _id = req.params.id;

    if(m.Types.ObjectId.isValid(_id)) {

      Serie.findById(_id)
      .populate('solutions', 'title') // only return the Title solution
			.exec()
			.catch(err => next(err))
      .then(result => {
        if (result) {
          return res.render("serieView", result);
        }
        return res.render("404");
      });

    }else{
      return res.render("404");
    }
  },
}
