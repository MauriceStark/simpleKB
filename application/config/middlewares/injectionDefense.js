// This express middleware ensures that basic noSQL injection attacks are blocked when
// request query parameters are used for MongoDB queries.
module.exports = function(req, res, next) {
var parameter
for (parameter in req.query) {
  /*
    # Abort any requests having nested query parameters, therfore anything
    # else than strings. Otherwise it would be possible to inject advanced
    # query parameters to mongoDB.
    # Example:
    #   /api/?filter=string
    #   -> db.collection.findOne({ key: string })
    #   /api/?filter[$ne]=string
    #   -> db.collection.findOne({ key: { $ne : string } })
    */
  if (typeof req.query[parameter] !== 'string') {
    //next(new Error("For security reasons no nested query paramters are allowed other than strings."));
    //return;
    return res.render("404");
  }
  /*
  # Abort any requests possibly containg javascript functions in the query.
  # Otherwise it would be possible that these might be executed or evaluated
  # in a mongodb query.
  # Example:
  #   db.collection.mapReduce({ map: "function()", reduce: "function()",
  #      finalize: "function()" })
  #   db.eval("function()")
  #   db.collection.find({ $where: "" })
  # Warning: As it is possible to pass javascript into $where without any
  # function() prefix, using $where should be generally avoided.
  */
  if (req.query[parameter].match(/^[ ]*function[ ]*\(/)) {
    //next(new Error("Your request has been blocked for security reasons."));
    //return;
    return res.render("404");
  }
}
return next();
};
