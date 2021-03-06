/*
@title Search HN Who is hiring?
@input
{
  "content-type" : "application/json",
  "example" : "[\"seattle\"]"
}
@output
{
  "content-type" : "application/json"
}
*/

var _ = require('underscore');

module.exports = function(req, res, next) {
  var query = req.query['query'] || req.body;

  this.request('a7medkamel/tm-data/blob/master/hn/who_is_hiring.js', function(err, httpResponse, body){
    if (err) {
      next(err);
      return;
    }

    if (_.isEmpty(query)) {
      query = [];
    }

    if (_.isString(query)) {
      query = [query]
    }

    var jobs = JSON.parse(body);

    var found = _.filter(jobs, function(job){
      if (!job.text) {
        return;
      }

      var text  = job.text;
      return !!_.find(query, function(term){ 
        var regex = new RegExp('[\\W]+' + term + '[\\W]+', 'gi');
        
        return regex.test(text);
      });
    });

    res.send(found);
  })
};