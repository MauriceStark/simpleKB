var mongoose = require('mongoose');
var   Schema = mongoose.Schema;

var UserSchema = new Schema({
    username:   { type: String, required: true, minlength: 4, maxlength: 36, unique: true, },
    password:   { type: String, required: true, minlength: 8 },
    isAdmin:    { type: Boolean, default: false },
    isActive:   { type: Boolean, default: true },
    createdAt:  { type: Date, 	required: true,	default: Date.now },
    lastLogin:  { type: Date, 	required: true, default: Date.now },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Solution' }],
    teams:     [{ type: Schema.Types.ObjectId, ref: 'Team' }]
});

UserSchema.index({ username: "text"}, { default_language: "spanish"}); // Index schema level

// Por defecto Update no corre las validaciones del modelo
// Se activan con un Pre hook for "findOneAndUpdate"
UserSchema.pre('findOneAndUpdate', function(next) {
  this.options.runValidators = true;
  next();
});

module.exports = mongoose.model('User', UserSchema)