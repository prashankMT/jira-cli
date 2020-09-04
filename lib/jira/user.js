/*global console*/
module.exports = function () {
  var request = require('superagent');
  const utils = require('../utils');
  var config = require('../../lib/config');

  var watch = {
    query: null,
    table: null,
    get: function (assignee, callback) {
      this.query = 'rest/api/2/user/search?query=' + assignee;
      request
        .get(config.auth.url + this.query)
        .send('"' + assignee + '"').set('Content-Type', 'application/json')
        .set('Authorization', 'Basic ' + config.auth.token)
        .end((err, res) => {
          if (!res.ok) {
            const errorMessages = utils.extractErrorMessages(res).join('\n');
            return console.log(errorMessages);
          }
          console.log(res.body[0]);
          if (callback){
            callback(res.body[0]);
          }
          return res.body[0];
        });
    }
  };
  return watch;
}();
