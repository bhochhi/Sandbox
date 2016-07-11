/* globals angular */
'use strict';

var app = angular.module('planningPoker.create', []);

app.controller('CreateController', require('./controllers/CreateController'));

module.exports = app;
