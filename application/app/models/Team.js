const  mongoose = require('mongoose');
const  Schema   = mongoose.Schema;

var TeamSchema = new Schema({
  team:       { type: String, required: true, minlength: 4, maxlength: 36, unique: true, },
  leader:     { type: Schema.ObjectId, required: true, ref: "User" }, // ID --> Model: User
  //solutions: [{ type: Schema.Types.ObjectId, ref: 'Solution' }] 	   // ID --> Model: Solution
  createdAt:  { type: Date, 	required: true,	default: Date.now },
});

TeamSchema.index({ team: "text"}, { default_language: "spanish"}); // Index schema level

// Por defecto Update no corre las validaciones del modelo
// Se activan con un Pre hook for "findOneAndUpdate"
TeamSchema.pre('findOneAndUpdate', function(next) {
  this.options.runValidators = true;
  next();
});

module.exports = mongoose.model('Team', TeamSchema)
