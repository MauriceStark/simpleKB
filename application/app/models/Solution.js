var mongoose = require('mongoose');
var 	Schema = mongoose.Schema;

const tagsLimit = 3;

// Valida la cantidad de elementos qeu se insertan en el array
function arrayLimit(val) {
  return val.length <= tagsLimit;
}

var SolutionSchema = new Schema({
	title: 				   { type: String, 	required: true,  minlength: 6, maxlength: 100  },
  body: 				   { type: String, 	required: true },
  published:       { type: Boolean, required: true },
	tags: 				   { type: Array, validate: [arrayLimit, '{PATH} exceeds the limit of ' + tagsLimit ] },
	createdAt:       { type: Date, 	required: true,	default: Date.now },
	lastModifiedAt:  { type: Date, 	required: true, default: Date.now },
	owner:           { type: Schema.ObjectId, ref: "User" }, // ID --> Model: User
  //autor:           { type: Schema.ObjectId, ref: "User" }, // ID --> Model: User
  teams:          [{ type: Schema.Types.ObjectId, ref: 'Team' }]
});

SolutionSchema.index({ title: "text"}, { default_language: "spanish"}); // Index schema level
SolutionSchema.index({ tags: 1});       // Index schema level
SolutionSchema.index({ owner: 1});   // Index schema level

// Por defecto Update no corre las validaciones del modelo
// Se activan con un Pre hook for "findOneAndUpdate"
SolutionSchema.pre('findOneAndUpdate', function(next){
  this.options.runValidators = true;
  next();
});

mongoose.model('Solution', SolutionSchema);
