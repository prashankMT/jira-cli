/*global console*/
module.exports = (function() {
  var request = require('superagent');
  const utils = require('../utils');
  var config = require('../../lib/config');
  var user = require('./user');

  var watch = {
    query: null,
    table: null,
    to: function(ticket, assignee) {
      var that = this;
      var execute = function(assignee) {
        that.query = 'rest/api/2/issue/' + ticket + '/watchers';
        request
          .post(config.auth.url + that.query)
          .send('"' + assignee + '"')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'Basic ' + config.auth.token)
          .end((err, res) => {
            if (!res.ok) {
              const errorMessages = utils.extractErrorMessages(res).join('\n');
              return console.log(errorMessages);
            }
            return console.log('Added ' + assignee + ' as watcher to [' + ticket + '] ' + '.');
          });
      };
      if (assignee.indexOf('@') === -1) {
        execute(assignee);
      } else {
        var callback = function(user) {
          execute(user.accountId);
        };
        user.get(assignee, callback);
      }
    },
    me: function(ticket) {
      this.to(ticket, config.auth.user);
    }
  };
  return watch;
})();
