var mongoose = require('mongoose');
var 	Schema = mongoose.Schema;

var SerieSchema = new Schema({
	title: 					{ type: String, 	required: true,  minlength: 6, maxlength: 100  },
  description: 		{ type: String, 	required: true },
  //published: 			{ type: Boolean, 	required: true },
	createdAt: 			{ type: Date, 		default: Date.now },
	lastModifiedAt: { type: Date, 		default: Date.now },
	owner: 					{ type: Schema.ObjectId, ref: "User" }, 			// ID --> Model: User
	solutions: 		 [{ type: Schema.Types.ObjectId, ref: 'Solution' }] 	// ID --> Model: Solution
});

SerieSchema.index({ title: "text"}, { default_language: "spanish"}); // Index schema level

// Por defecto Update no corre las validaciones del modelo
// Se activan con un Pre hook for "findOneAndUpdate"
SerieSchema.pre('findOneAndUpdate', function(next){
  this.options.runValidators = true;
  next();
});

mongoose.model('Serie', SerieSchema);
