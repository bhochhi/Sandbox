'use strict';

require('firebase');
var uuid = require('node-uuid');

module.exports = function($location) {
  this.createRoom = function() {
    $location.path('/room/'+uuid.v4());
  };
};
