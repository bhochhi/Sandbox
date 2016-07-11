/* globals angular */
'use strict';

require('angular-route');

var createModule = require('./create');
var roomModule = require('./room');
var joinModule = require('./join');

var routes = require('./routes');

var app = angular.module('planningPoker', [
  'ngRoute',
  'firebase',
  createModule.name,
  roomModule.name,
  joinModule.name
]);

app.factory('getRoom', require('./common/services/getRoom'));
app.factory('firebaseSync', require('./common/services/firebaseSync'));

app.config(routes);
