(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/* globals Firebase */
'use strict';

module.exports = function ($firebase) {

  /**
   * Factory to create Firebase sync objects. This is mainly just to get around the global Firebase
   * object dependency to make unit testing easier.
   */
  return function (firebaseUrl) {
    var ref = new Firebase(firebaseUrl);
    return $firebase(ref);
  };
};
}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/common\\services\\firebaseSync.js","/common\\services")
},{"VCmEsw":22,"buffer":13}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

module.exports = function (firebaseSync) {

  /**
   * Service to get a room by id.
   */
  return function (roomId) {

    var userSync
        = firebaseSync('https://glowing-fire-5810.firebaseio.com/' + roomId + '/users');

    var attributesSync
        = firebaseSync('https://glowing-fire-5810.firebaseio.com/' + roomId + '/attributes');
    var attributes = attributesSync.$asObject();

    /**
     * Get the room's identifier.
     * @returns {String}
     */
    function getId() {
      return roomId;
    }

    /**
     * Get room attributes.
     * @returns {Object} attributes object. currently only has 'show' property.
     */
    function getAttributes() {
      return attributes;
    }

    /**
     * Show cards.
     */
    function show() {
      attributes.show = true;
      attributes.$save();
    }

    /**
     * Join room.
     * @param {String} userName
     * @returns {Promise} promise to pass back created Firebase ref
     */
    function join(userName) {
      var user = {
        name: userName,
        card: ''
      };

      return userSync.$push(user);
    }

    /**
     * Get users array.
     * @returns {Array}
     */
    function getUsers() {
      return userSync.$asArray();
    }

    /**
     * Vote.
     * @param {String} userId id of user to vote as
     * @param {String} card card value
     */
    function vote(userId, card) {
      if(attributes.show) {
        return;
      }

      var users = getUsers(roomId);

      var obj = users.$getRecord(userId);
      obj.card = card;
      users.$save(obj);
    }

    /**
     * Reset room to start a new vote.
     */
    function reset() {
      var users = getUsers();
      users.forEach(function (user) {
        user.card = '';
        users.$save(user);
      });

      attributes.show = false;
      attributes.$save();
    }

    return {
      getId: getId,
      join: join,
      getUsers: getUsers,
      vote: vote,
      reset: reset,
      getAttributes: getAttributes,
      show: show
    };

  };
};


}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/common\\services\\getRoom.js","/common\\services")
},{"VCmEsw":22,"buffer":13}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

require('firebase');
var uuid = require('node-uuid');

module.exports = function($location) {
  this.createRoom = function() {
    $location.path('/room/'+uuid.v4());
  };
};

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/create\\controllers\\CreateController.js","/create\\controllers")
},{"VCmEsw":22,"buffer":13,"firebase":12,"node-uuid":23}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/* globals angular */
'use strict';

var app = angular.module('planningPoker.create', []);

app.controller('CreateController', require('./controllers/CreateController'));

module.exports = app;

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/create\\index.js","/create")
},{"./controllers/CreateController":3,"VCmEsw":22,"buffer":13}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
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

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_f79ee5cf.js","/")
},{"./common/services/firebaseSync":1,"./common/services/getRoom":2,"./create":4,"./join":7,"./room":9,"./routes":10,"VCmEsw":22,"angular-route":11,"buffer":13}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

module.exports = function($scope, $location, room) {

  this.submit = function() {
    room.join($scope.name).then(function(newChildRef) {

      $location.path('/room/' + room.getId() + '/' + newChildRef.name());
    });
  };
};


}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/join\\controllers\\JoinController.js","/join\\controllers")
},{"VCmEsw":22,"buffer":13}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
//require('angular');

var app = angular.module('planningPoker.join', []);

app.controller('JoinController', require('./controllers/JoinController'));

module.exports = app;

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/join\\index.js","/join")
},{"./controllers/JoinController":6,"VCmEsw":22,"buffer":13}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = function($routeParams, $scope, $location, room) {
  var userId = $routeParams.userId;

  this.cards = [ '?', '.5', '1', '2', '3', '5', '8', '13', '20', '100', '∞' ];

  var users = room.getUsers();
  this.users = users;

  this.attributes = room.getAttributes();

  this.joinUri = function() {
    var uri = $location.absUrl();

    var index = uri.lastIndexOf('/');

    return  uri.substring(0,index);
  };

  users.$watch(function() {
    users.forEach(function(user) {
      if(user.$id === userId) {
        $scope.selectedCard = user.card;
      }
    });
  });

  this.vote = function(card) {
    room.vote(userId, card);
  };

  this.reset = function() {
    room.reset();
  };

  this.show = function() {
    room.show();
  };

};

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/room\\controllers\\RoomController.js","/room\\controllers")
},{"VCmEsw":22,"buffer":13}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var app = angular.module('planningPoker.room', []);

app.controller('RoomController', require('./controllers/RoomController'));

module.exports = app;

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/room\\index.js","/room")
},{"./controllers/RoomController":8,"VCmEsw":22,"buffer":13}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

module.exports = function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: './create/create.html',
    controller: 'CreateController',
    controllerAs: 'create'
  });

  function validateRoom(getRoom, $route) {
    var roomId = $route.current.params.roomId;
    var room = getRoom(roomId);

    return room;
  }

  $routeProvider.when('/room/:roomId', {
    templateUrl: './join/join.html',
    controller: 'JoinController',
    controllerAs: 'join',
    resolve: {
      room: validateRoom
    }
  });

  $routeProvider.when('/room/:roomId/:userId', {
    templateUrl: './room/room.html',
    controller: 'RoomController',
    controllerAs: 'room',
    resolve: {
      room: validateRoom
    }
  });

  $routeProvider.when('/error', {
    template: '<p>Error Page Not Found</p>'
  });

  $routeProvider.otherwise({
    redirectTo: '/error'
  });

};


}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/routes.js","/")
},{"VCmEsw":22,"buffer":13}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * @license AngularJS v1.3.0
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc module
 * @name ngRoute
 * @description
 *
 * # ngRoute
 *
 * The `ngRoute` module provides routing and deeplinking services and directives for angular apps.
 *
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 *
 *
 * <div doc-module-components="ngRoute"></div>
 */
 /* global -ngRouteModule */
var ngRouteModule = angular.module('ngRoute', ['ng']).
                        provider('$route', $RouteProvider),
    $routeMinErr = angular.$$minErr('ngRoute');

/**
 * @ngdoc provider
 * @name $routeProvider
 *
 * @description
 *
 * Used for configuring routes.
 *
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 *
 * ## Dependencies
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 */
function $RouteProvider(){
  function inherit(parent, extra) {
    return angular.extend(new (angular.extend(function() {}, {prototype:parent}))(), extra);
  }

  var routes = {};

  /**
   * @ngdoc method
   * @name $routeProvider#when
   *
   * @param {string} path Route path (matched against `$location.path`). If `$location.path`
   *    contains redundant trailing slash or is missing one, the route will still match and the
   *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
   *    route definition.
   *
   *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
   *        to the next slash are matched and stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain named groups starting with a colon and ending with a star:
   *        e.g.`:name*`. All characters are eagerly stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
   *
   *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
   *    `/color/brown/largecode/code/with/slashes/edit` and extract:
   *
   *    * `color: brown`
   *    * `largecode: code/with/slashes`.
   *
   *
   * @param {Object} route Mapping information to be assigned to `$route.current` on route
   *    match.
   *
   *    Object properties:
   *
   *    - `controller` – `{(string|function()=}` – Controller fn that should be associated with
   *      newly created scope or the name of a {@link angular.Module#controller registered
   *      controller} if passed as a string.
   *    - `controllerAs` – `{string=}` – A controller alias name. If present the controller will be
   *      published to scope under the `controllerAs` name.
   *    - `template` – `{string=|function()=}` – html template as a string or a function that
   *      returns an html template as a string which should be used by {@link
   *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
   *      This property takes precedence over `templateUrl`.
   *
   *      If `template` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `templateUrl` – `{string=|function()=}` – path or function that returns a path to an html
   *      template that should be used by {@link ngRoute.directive:ngView ngView}.
   *
   *      If `templateUrl` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
   *      be injected into the controller. If any of these dependencies are promises, the router
   *      will wait for them all to be resolved or one to be rejected before the controller is
   *      instantiated.
   *      If all the promises are resolved successfully, the values of the resolved promises are
   *      injected and {@link ngRoute.$route#$routeChangeSuccess $routeChangeSuccess} event is
   *      fired. If any of the promises are rejected the
   *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event is fired. The map object
   *      is:
   *
   *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
   *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
   *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
   *        and the return value is treated as the dependency. If the result is a promise, it is
   *        resolved before its value is injected into the controller. Be aware that
   *        `ngRoute.$routeParams` will still refer to the previous route within these resolve
   *        functions.  Use `$route.current.params` to access the new route parameters, instead.
   *
   *    - `redirectTo` – {(string|function())=} – value to update
   *      {@link ng.$location $location} path with and trigger route redirection.
   *
   *      If `redirectTo` is a function, it will be called with the following parameters:
   *
   *      - `{Object.<string>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route templateUrl.
   *      - `{string}` - current `$location.path()`
   *      - `{Object}` - current `$location.search()`
   *
   *      The custom `redirectTo` function is expected to return a string which will be used
   *      to update `$location.path()` and `$location.search()`.
   *
   *    - `[reloadOnSearch=true]` - {boolean=} - reload route when only `$location.search()`
   *      or `$location.hash()` changes.
   *
   *      If the option is set to `false` and url in the browser changes, then
   *      `$routeUpdate` event is broadcasted on the root scope.
   *
   *    - `[caseInsensitiveMatch=false]` - {boolean=} - match routes without being case sensitive
   *
   *      If the option is set to `true`, then the particular route can be matched without being
   *      case sensitive
   *
   * @returns {Object} self
   *
   * @description
   * Adds a new route definition to the `$route` service.
   */
  this.when = function(path, route) {
    routes[path] = angular.extend(
      {reloadOnSearch: true},
      route,
      path && pathRegExp(path, route)
    );

    // create redirection for trailing slashes
    if (path) {
      var redirectPath = (path[path.length-1] == '/')
            ? path.substr(0, path.length-1)
            : path +'/';

      routes[redirectPath] = angular.extend(
        {redirectTo: path},
        pathRegExp(redirectPath, route)
      );
    }

    return this;
  };

   /**
    * @param path {string} path
    * @param opts {Object} options
    * @return {?Object}
    *
    * @description
    * Normalizes the given path, returning a regular expression
    * and the original path.
    *
    * Inspired by pathRexp in visionmedia/express/lib/utils.js.
    */
  function pathRegExp(path, opts) {
    var insensitive = opts.caseInsensitiveMatch,
        ret = {
          originalPath: path,
          regexp: path
        },
        keys = ret.keys = [];

    path = path
      .replace(/([().])/g, '\\$1')
      .replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option){
        var optional = option === '?' ? option : null;
        var star = option === '*' ? option : null;
        keys.push({ name: key, optional: !!optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (star && '(.+?)' || '([^/]+)')
          + (optional || '')
          + ')'
          + (optional || '');
      })
      .replace(/([\/$\*])/g, '\\$1');

    ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
    return ret;
  }

  /**
   * @ngdoc method
   * @name $routeProvider#otherwise
   *
   * @description
   * Sets route definition that will be used on route change when no other route definition
   * is matched.
   *
   * @param {Object|string} params Mapping information to be assigned to `$route.current`.
   * If called with a string, the value maps to `redirectTo`.
   * @returns {Object} self
   */
  this.otherwise = function(params) {
    if (typeof params === 'string') {
      params = {redirectTo: params};
    }
    this.when(null, params);
    return this;
  };


  this.$get = ['$rootScope',
               '$location',
               '$routeParams',
               '$q',
               '$injector',
               '$templateRequest',
               '$sce',
      function($rootScope, $location, $routeParams, $q, $injector, $templateRequest, $sce) {

    /**
     * @ngdoc service
     * @name $route
     * @requires $location
     * @requires $routeParams
     *
     * @property {Object} current Reference to the current route definition.
     * The route definition contains:
     *
     *   - `controller`: The controller constructor as define in route definition.
     *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
     *     controller instantiation. The `locals` contain
     *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
     *
     *     - `$scope` - The current route scope.
     *     - `$template` - The current route template HTML.
     *
     * @property {Object} routes Object with all route configuration Objects as its properties.
     *
     * @description
     * `$route` is used for deep-linking URLs to controllers and views (HTML partials).
     * It watches `$location.url()` and tries to map the path to an existing route definition.
     *
     * Requires the {@link ngRoute `ngRoute`} module to be installed.
     *
     * You can define routes through {@link ngRoute.$routeProvider $routeProvider}'s API.
     *
     * The `$route` service is typically used in conjunction with the
     * {@link ngRoute.directive:ngView `ngView`} directive and the
     * {@link ngRoute.$routeParams `$routeParams`} service.
     *
     * @example
     * This example shows how changing the URL hash causes the `$route` to match a route against the
     * URL, and the `ngView` pulls in the partial.
     *
     * <example name="$route-service" module="ngRouteExample"
     *          deps="angular-route.js" fixBase="true">
     *   <file name="index.html">
     *     <div ng-controller="MainController">
     *       Choose:
     *       <a href="Book/Moby">Moby</a> |
     *       <a href="Book/Moby/ch/1">Moby: Ch1</a> |
     *       <a href="Book/Gatsby">Gatsby</a> |
     *       <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
     *       <a href="Book/Scarlet">Scarlet Letter</a><br/>
     *
     *       <div ng-view></div>
     *
     *       <hr />
     *
     *       <pre>$location.path() = {{$location.path()}}</pre>
     *       <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>
     *       <pre>$route.current.params = {{$route.current.params}}</pre>
     *       <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
     *       <pre>$routeParams = {{$routeParams}}</pre>
     *     </div>
     *   </file>
     *
     *   <file name="book.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *   </file>
     *
     *   <file name="chapter.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *     Chapter Id: {{params.chapterId}}
     *   </file>
     *
     *   <file name="script.js">
     *     angular.module('ngRouteExample', ['ngRoute'])
     *
     *      .controller('MainController', function($scope, $route, $routeParams, $location) {
     *          $scope.$route = $route;
     *          $scope.$location = $location;
     *          $scope.$routeParams = $routeParams;
     *      })
     *
     *      .controller('BookController', function($scope, $routeParams) {
     *          $scope.name = "BookController";
     *          $scope.params = $routeParams;
     *      })
     *
     *      .controller('ChapterController', function($scope, $routeParams) {
     *          $scope.name = "ChapterController";
     *          $scope.params = $routeParams;
     *      })
     *
     *     .config(function($routeProvider, $locationProvider) {
     *       $routeProvider
     *        .when('/Book/:bookId', {
     *         templateUrl: 'book.html',
     *         controller: 'BookController',
     *         resolve: {
     *           // I will cause a 1 second delay
     *           delay: function($q, $timeout) {
     *             var delay = $q.defer();
     *             $timeout(delay.resolve, 1000);
     *             return delay.promise;
     *           }
     *         }
     *       })
     *       .when('/Book/:bookId/ch/:chapterId', {
     *         templateUrl: 'chapter.html',
     *         controller: 'ChapterController'
     *       });
     *
     *       // configure html5 to get links working on jsfiddle
     *       $locationProvider.html5Mode(true);
     *     });
     *
     *   </file>
     *
     *   <file name="protractor.js" type="protractor">
     *     it('should load and compile correct template', function() {
     *       element(by.linkText('Moby: Ch1')).click();
     *       var content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: ChapterController/);
     *       expect(content).toMatch(/Book Id\: Moby/);
     *       expect(content).toMatch(/Chapter Id\: 1/);
     *
     *       element(by.partialLinkText('Scarlet')).click();
     *
     *       content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: BookController/);
     *       expect(content).toMatch(/Book Id\: Scarlet/);
     *     });
     *   </file>
     * </example>
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeStart
     * @eventType broadcast on root scope
     * @description
     * Broadcasted before a route change. At this  point the route services starts
     * resolving all of the dependencies needed for the route change to occur.
     * Typically this involves fetching the view template as well as any dependencies
     * defined in `resolve` route property. Once  all of the dependencies are resolved
     * `$routeChangeSuccess` is fired.
     *
     * The route change (and the `$location` change that triggered it) can be prevented
     * by calling `preventDefault` method of the event. See {@link ng.$rootScope.Scope#$on}
     * for more details about event object.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} next Future route information.
     * @param {Route} current Current route information.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeSuccess
     * @eventType broadcast on root scope
     * @description
     * Broadcasted after a route dependencies are resolved.
     * {@link ngRoute.directive:ngView ngView} listens for the directive
     * to instantiate the controller and render the view.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} current Current route information.
     * @param {Route|Undefined} previous Previous route information, or undefined if current is
     * first route entered.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeError
     * @eventType broadcast on root scope
     * @description
     * Broadcasted if any of the resolve promises are rejected.
     *
     * @param {Object} angularEvent Synthetic event object
     * @param {Route} current Current route information.
     * @param {Route} previous Previous route information.
     * @param {Route} rejection Rejection of the promise. Usually the error of the failed promise.
     */

    /**
     * @ngdoc event
     * @name $route#$routeUpdate
     * @eventType broadcast on root scope
     * @description
     *
     * The `reloadOnSearch` property has been set to false, and we are reusing the same
     * instance of the Controller.
     */

    var forceReload = false,
        preparedRoute,
        preparedRouteIsUpdateOnly,
        $route = {
          routes: routes,

          /**
           * @ngdoc method
           * @name $route#reload
           *
           * @description
           * Causes `$route` service to reload the current route even if
           * {@link ng.$location $location} hasn't changed.
           *
           * As a result of that, {@link ngRoute.directive:ngView ngView}
           * creates new scope, reinstantiates the controller.
           */
          reload: function() {
            forceReload = true;
            $rootScope.$evalAsync(function() {
              // Don't support cancellation of a reload for now...
              prepareRoute();
              commitRoute();
            });
          },

          /**
           * @ngdoc method
           * @name $route#updateParams
           *
           * @description
           * Causes `$route` service to update the current URL, replacing
           * current route parameters with those specified in `newParams`.
           * Provided property names that match the route's path segment
           * definitions will be interpolated into the location's path, while
           * remaining properties will be treated as query params.
           *
           * @param {Object} newParams mapping of URL parameter names to values
           */
          updateParams: function(newParams) {
            if (this.current && this.current.$$route) {
              var searchParams = {}, self=this;

              angular.forEach(Object.keys(newParams), function(key) {
                if (!self.current.pathParams[key]) searchParams[key] = newParams[key];
              });

              newParams = angular.extend({}, this.current.params, newParams);
              $location.path(interpolate(this.current.$$route.originalPath, newParams));
              $location.search(angular.extend({}, $location.search(), searchParams));
            }
            else {
              throw $routeMinErr('norout', 'Tried updating route when with no current route');
            }
          }
        };

    $rootScope.$on('$locationChangeStart', prepareRoute);
    $rootScope.$on('$locationChangeSuccess', commitRoute);

    return $route;

    /////////////////////////////////////////////////////

    /**
     * @param on {string} current url
     * @param route {Object} route regexp to match the url against
     * @return {?Object}
     *
     * @description
     * Check if the route matches the current url.
     *
     * Inspired by match in
     * visionmedia/express/lib/router/router.js.
     */
    function switchRouteMatcher(on, route) {
      var keys = route.keys,
          params = {};

      if (!route.regexp) return null;

      var m = route.regexp.exec(on);
      if (!m) return null;

      for (var i = 1, len = m.length; i < len; ++i) {
        var key = keys[i - 1];

        var val = m[i];

        if (key && val) {
          params[key.name] = val;
        }
      }
      return params;
    }

    function prepareRoute($locationEvent) {
      var lastRoute = $route.current;

      preparedRoute = parseRoute();
      preparedRouteIsUpdateOnly = preparedRoute && lastRoute && preparedRoute.$$route === lastRoute.$$route
          && angular.equals(preparedRoute.pathParams, lastRoute.pathParams)
          && !preparedRoute.reloadOnSearch && !forceReload;

      if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
        if ($rootScope.$broadcast('$routeChangeStart', preparedRoute, lastRoute).defaultPrevented) {
          if ($locationEvent) {
            $locationEvent.preventDefault();
          }
        }
      }
    }

    function commitRoute() {
      var lastRoute = $route.current;
      var nextRoute = preparedRoute;

      if (preparedRouteIsUpdateOnly) {
        lastRoute.params = nextRoute.params;
        angular.copy(lastRoute.params, $routeParams);
        $rootScope.$broadcast('$routeUpdate', lastRoute);
      } else if (nextRoute || lastRoute) {
        forceReload = false;
        $route.current = nextRoute;
        if (nextRoute) {
          if (nextRoute.redirectTo) {
            if (angular.isString(nextRoute.redirectTo)) {
              $location.path(interpolate(nextRoute.redirectTo, nextRoute.params)).search(nextRoute.params)
                       .replace();
            } else {
              $location.url(nextRoute.redirectTo(nextRoute.pathParams, $location.path(), $location.search()))
                       .replace();
            }
          }
        }

        $q.when(nextRoute).
          then(function() {
            if (nextRoute) {
              var locals = angular.extend({}, nextRoute.resolve),
                  template, templateUrl;

              angular.forEach(locals, function(value, key) {
                locals[key] = angular.isString(value) ?
                    $injector.get(value) : $injector.invoke(value, null, null, key);
              });

              if (angular.isDefined(template = nextRoute.template)) {
                if (angular.isFunction(template)) {
                  template = template(nextRoute.params);
                }
              } else if (angular.isDefined(templateUrl = nextRoute.templateUrl)) {
                if (angular.isFunction(templateUrl)) {
                  templateUrl = templateUrl(nextRoute.params);
                }
                templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                if (angular.isDefined(templateUrl)) {
                  nextRoute.loadedTemplateUrl = templateUrl;
                  template = $templateRequest(templateUrl);
                }
              }
              if (angular.isDefined(template)) {
                locals['$template'] = template;
              }
              return $q.all(locals);
            }
          }).
          // after route change
          then(function(locals) {
            if (nextRoute == $route.current) {
              if (nextRoute) {
                nextRoute.locals = locals;
                angular.copy(nextRoute.params, $routeParams);
              }
              $rootScope.$broadcast('$routeChangeSuccess', nextRoute, lastRoute);
            }
          }, function(error) {
            if (nextRoute == $route.current) {
              $rootScope.$broadcast('$routeChangeError', nextRoute, lastRoute, error);
            }
          });
      }
    }


    /**
     * @returns {Object} the current active route, by matching it against the URL
     */
    function parseRoute() {
      // Match a route
      var params, match;
      angular.forEach(routes, function(route, path) {
        if (!match && (params = switchRouteMatcher($location.path(), route))) {
          match = inherit(route, {
            params: angular.extend({}, $location.search(), params),
            pathParams: params});
          match.$$route = route;
        }
      });
      // No route matched; fallback to "otherwise" route
      return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});
    }

    /**
     * @returns {string} interpolation of the redirect path with the parameters
     */
    function interpolate(string, params) {
      var result = [];
      angular.forEach((string||'').split(':'), function(segment, i) {
        if (i === 0) {
          result.push(segment);
        } else {
          var segmentMatch = segment.match(/(\w+)(.*)/);
          var key = segmentMatch[1];
          result.push(params[key]);
          result.push(segmentMatch[2] || '');
          delete params[key];
        }
      });
      return result.join('');
    }
  }];
}

ngRouteModule.provider('$routeParams', $RouteParamsProvider);


/**
 * @ngdoc service
 * @name $routeParams
 * @requires $route
 *
 * @description
 * The `$routeParams` service allows you to retrieve the current set of route parameters.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * The route parameters are a combination of {@link ng.$location `$location`}'s
 * {@link ng.$location#search `search()`} and {@link ng.$location#path `path()`}.
 * The `path` parameters are extracted when the {@link ngRoute.$route `$route`} path is matched.
 *
 * In case of parameter name collision, `path` params take precedence over `search` params.
 *
 * The service guarantees that the identity of the `$routeParams` object will remain unchanged
 * (but its properties will likely change) even when a route change occurs.
 *
 * Note that the `$routeParams` are only updated *after* a route change completes successfully.
 * This means that you cannot rely on `$routeParams` being correct in route resolve functions.
 * Instead you can use `$route.current.params` to access the new route's parameters.
 *
 * @example
 * ```js
 *  // Given:
 *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
 *  // Route: /Chapter/:chapterId/Section/:sectionId
 *  //
 *  // Then
 *  $routeParams ==> {chapterId:'1', sectionId:'2', search:'moby'}
 * ```
 */
function $RouteParamsProvider() {
  this.$get = function() { return {}; };
}

ngRouteModule.directive('ngView', ngViewFactory);
ngRouteModule.directive('ngView', ngViewFillContentFactory);


/**
 * @ngdoc directive
 * @name ngView
 * @restrict ECA
 *
 * @description
 * # Overview
 * `ngView` is a directive that complements the {@link ngRoute.$route $route} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$route` service.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * @animations
 * enter - animation is used to bring new content into the browser.
 * leave - animation is used to animate existing content away.
 *
 * The enter and leave animation occur concurrently.
 *
 * @scope
 * @priority 400
 * @param {string=} onload Expression to evaluate whenever the view updates.
 *
 * @param {string=} autoscroll Whether `ngView` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the view is updated.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
 *                    as an expression yields a truthy value.
 * @example
    <example name="ngView-directive" module="ngViewExample"
             deps="angular-route.js;angular-animate.js"
             animations="true" fixBase="true">
      <file name="index.html">
        <div ng-controller="MainCtrl as main">
          Choose:
          <a href="Book/Moby">Moby</a> |
          <a href="Book/Moby/ch/1">Moby: Ch1</a> |
          <a href="Book/Gatsby">Gatsby</a> |
          <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
          <a href="Book/Scarlet">Scarlet Letter</a><br/>

          <div class="view-animate-container">
            <div ng-view class="view-animate"></div>
          </div>
          <hr />

          <pre>$location.path() = {{main.$location.path()}}</pre>
          <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
          <pre>$route.current.params = {{main.$route.current.params}}</pre>
          <pre>$routeParams = {{main.$routeParams}}</pre>
        </div>
      </file>

      <file name="book.html">
        <div>
          controller: {{book.name}}<br />
          Book Id: {{book.params.bookId}}<br />
        </div>
      </file>

      <file name="chapter.html">
        <div>
          controller: {{chapter.name}}<br />
          Book Id: {{chapter.params.bookId}}<br />
          Chapter Id: {{chapter.params.chapterId}}
        </div>
      </file>

      <file name="animations.css">
        .view-animate-container {
          position:relative;
          height:100px!important;
          position:relative;
          background:white;
          border:1px solid black;
          height:40px;
          overflow:hidden;
        }

        .view-animate {
          padding:10px;
        }

        .view-animate.ng-enter, .view-animate.ng-leave {
          -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;
          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

          display:block;
          width:100%;
          border-left:1px solid black;

          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          padding:10px;
        }

        .view-animate.ng-enter {
          left:100%;
        }
        .view-animate.ng-enter.ng-enter-active {
          left:0;
        }
        .view-animate.ng-leave.ng-leave-active {
          left:-100%;
        }
      </file>

      <file name="script.js">
        angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
          .config(['$routeProvider', '$locationProvider',
            function($routeProvider, $locationProvider) {
              $routeProvider
                .when('/Book/:bookId', {
                  templateUrl: 'book.html',
                  controller: 'BookCtrl',
                  controllerAs: 'book'
                })
                .when('/Book/:bookId/ch/:chapterId', {
                  templateUrl: 'chapter.html',
                  controller: 'ChapterCtrl',
                  controllerAs: 'chapter'
                });

              $locationProvider.html5Mode(true);
          }])
          .controller('MainCtrl', ['$route', '$routeParams', '$location',
            function($route, $routeParams, $location) {
              this.$route = $route;
              this.$location = $location;
              this.$routeParams = $routeParams;
          }])
          .controller('BookCtrl', ['$routeParams', function($routeParams) {
            this.name = "BookCtrl";
            this.params = $routeParams;
          }])
          .controller('ChapterCtrl', ['$routeParams', function($routeParams) {
            this.name = "ChapterCtrl";
            this.params = $routeParams;
          }]);

      </file>

      <file name="protractor.js" type="protractor">
        it('should load and compile correct template', function() {
          element(by.linkText('Moby: Ch1')).click();
          var content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: ChapterCtrl/);
          expect(content).toMatch(/Book Id\: Moby/);
          expect(content).toMatch(/Chapter Id\: 1/);

          element(by.partialLinkText('Scarlet')).click();

          content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: BookCtrl/);
          expect(content).toMatch(/Book Id\: Scarlet/);
        });
      </file>
    </example>
 */


/**
 * @ngdoc event
 * @name ngView#$viewContentLoaded
 * @eventType emit on the current ngView scope
 * @description
 * Emitted every time the ngView content is reloaded.
 */
ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];
function ngViewFactory(   $route,   $anchorScroll,   $animate) {
  return {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    link: function(scope, $element, attr, ctrl, $transclude) {
        var currentScope,
            currentElement,
            previousLeaveAnimation,
            autoScrollExp = attr.autoscroll,
            onloadExp = attr.onload || '';

        scope.$on('$routeChangeSuccess', update);
        update();

        function cleanupLastView() {
          if(previousLeaveAnimation) {
            $animate.cancel(previousLeaveAnimation);
            previousLeaveAnimation = null;
          }

          if(currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if(currentElement) {
            previousLeaveAnimation = $animate.leave(currentElement);
            previousLeaveAnimation.then(function() {
              previousLeaveAnimation = null;
            });
            currentElement = null;
          }
        }

        function update() {
          var locals = $route.current && $route.current.locals,
              template = locals && locals.$template;

          if (angular.isDefined(template)) {
            var newScope = scope.$new();
            var current = $route.current;

            // Note: This will also link all children of ng-view that were contained in the original
            // html. If that content contains controllers, ... they could pollute/change the scope.
            // However, using ng-view on an element with additional content does not make sense...
            // Note: We can't remove them in the cloneAttchFn of $transclude as that
            // function is called before linking the content, which would apply child
            // directives to non existing elements.
            var clone = $transclude(newScope, function(clone) {
              $animate.enter(clone, null, currentElement || $element).then(function onNgViewEnter () {
                if (angular.isDefined(autoScrollExp)
                  && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              });
              cleanupLastView();
            });

            currentElement = clone;
            currentScope = current.scope = newScope;
            currentScope.$emit('$viewContentLoaded');
            currentScope.$eval(onloadExp);
          } else {
            cleanupLastView();
          }
        }
    }
  };
}

// This directive is called during the $transclude call of the first `ngView` directive.
// It will replace and compile the content of the element with the loaded template.
// We need this directive so that the element content is already filled when
// the link function of another directive on the same element as ngView
// is called.
ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];
function ngViewFillContentFactory($compile, $controller, $route) {
  return {
    restrict: 'ECA',
    priority: -400,
    link: function(scope, $element) {
      var current = $route.current,
          locals = current.locals;

      $element.html(locals.$template);

      var link = $compile($element.contents());

      if (current.controller) {
        locals.$scope = scope;
        var controller = $controller(current.controller, locals);
        if (current.controllerAs) {
          scope[current.controllerAs] = controller;
        }
        $element.data('$ngControllerController', controller);
        $element.children().data('$ngControllerController', controller);
      }

      link(scope);
    }
  };
}


})(window, window.angular);

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\angular-route\\angular-route.js","/..\\node_modules\\angular-route")
},{"VCmEsw":22,"buffer":13}],12:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*! @license Firebase v1.1.3 - License: https://www.firebase.com/terms/terms-of-service.html */ (function() {var k,ba=this;function l(a){return void 0!==a}function ca(){}function da(a){a.ib=function(){return a.Ld?a.Ld:a.Ld=new a}}
function ea(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function fa(a){return"array"==ea(a)}function ga(a){var b=ea(a);return"array"==b||"object"==b&&"number"==typeof a.length}function p(a){return"string"==typeof a}function ha(a){return"number"==typeof a}function ia(a){return"function"==ea(a)}function ja(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}function ka(a,b,c){return a.call.apply(a.bind,arguments)}
function la(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function r(a,b,c){r=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ka:la;return r.apply(null,arguments)}var ma=Date.now||function(){return+new Date};
function na(a,b){function c(){}c.prototype=b.prototype;a.cf=b.prototype;a.prototype=new c;a.$e=function(a,c,f){return b.prototype[c].apply(a,Array.prototype.slice.call(arguments,2))}};function oa(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);}function pa(){this.Ec=void 0}
function qa(a,b,c){switch(typeof b){case "string":ra(b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(null==b){c.push("null");break}if(fa(b)){var d=b.length;c.push("[");for(var e="",f=0;f<d;f++)c.push(e),e=b[f],qa(a,a.Ec?a.Ec.call(b,String(f),e):e,c),e=",";c.push("]");break}c.push("{");d="";for(f in b)Object.prototype.hasOwnProperty.call(b,f)&&(e=b[f],"function"!=typeof e&&(c.push(d),ra(f,c),
c.push(":"),qa(a,a.Ec?a.Ec.call(b,f,e):e,c),d=","));c.push("}");break;case "function":break;default:throw Error("Unknown type: "+typeof b);}}var sa={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},ta=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;
function ra(a,b){b.push('"',a.replace(ta,function(a){if(a in sa)return sa[a];var b=a.charCodeAt(0),e="\\u";16>b?e+="000":256>b?e+="00":4096>b&&(e+="0");return sa[a]=e+b.toString(16)}),'"')};function ua(a){return"undefined"!==typeof JSON&&l(JSON.parse)?JSON.parse(a):oa(a)}function u(a){if("undefined"!==typeof JSON&&l(JSON.stringify))a=JSON.stringify(a);else{var b=[];qa(new pa,a,b);a=b.join("")}return a};function va(a){for(var b=[],c=0,d=0;d<a.length;d++){var e=a.charCodeAt(d);55296<=e&&56319>=e&&(e-=55296,d++,v(d<a.length,"Surrogate pair missing trail surrogate."),e=65536+(e<<10)+(a.charCodeAt(d)-56320));128>e?b[c++]=e:(2048>e?b[c++]=e>>6|192:(65536>e?b[c++]=e>>12|224:(b[c++]=e>>18|240,b[c++]=e>>12&63|128),b[c++]=e>>6&63|128),b[c++]=e&63|128)}return b};var wa={};function x(a,b,c,d){var e;d<b?e="at least "+b:d>c&&(e=0===c?"none":"no more than "+c);if(e)throw Error(a+" failed: Was called with "+d+(1===d?" argument.":" arguments.")+" Expects "+e+".");}
function y(a,b,c){var d="";switch(b){case 1:d=c?"first":"First";break;case 2:d=c?"second":"Second";break;case 3:d=c?"third":"Third";break;case 4:d=c?"fourth":"Fourth";break;default:xa.assert(!1,"errorPrefix_ called with argumentNumber > 4.  Need to update it?")}return a=a+" failed: "+(d+" argument ")}function z(a,b,c,d){if((!d||l(c))&&!ia(c))throw Error(y(a,b,d)+"must be a valid function.");}function ya(a,b,c){if(l(c)&&(!ja(c)||null===c))throw Error(y(a,b,!0)+"must be a valid context object.");};function A(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function B(a,b){if(Object.prototype.hasOwnProperty.call(a,b))return a[b]}function za(a,b){for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&b(c,a[c])}function Aa(a){var b={};za(a,function(a,d){b[a]=d});return b};var xa={},Ba=/[\[\].#$\/\u0000-\u001F\u007F]/,Ca=/[\[\].#$\u0000-\u001F\u007F]/;function Da(a){return p(a)&&0!==a.length&&!Ba.test(a)}function Ea(a,b,c){c&&!l(b)||Fa(y(a,1,c),b)}
function Fa(a,b,c,d){c||(c=0);d=d||[];if(!l(b))throw Error(a+"contains undefined"+Ga(d));if(ia(b))throw Error(a+"contains a function"+Ga(d)+" with contents: "+b.toString());if(Ha(b))throw Error(a+"contains "+b.toString()+Ga(d));if(1E3<c)throw new TypeError(a+"contains a cyclic object value ("+d.slice(0,100).join(".")+"...)");if(p(b)&&b.length>10485760/3&&10485760<va(b).length)throw Error(a+"contains a string greater than 10485760 utf8 bytes"+Ga(d)+" ('"+b.substring(0,50)+"...')");if(ja(b))for(var e in b)if(A(b,
e)){var f=b[e];if(".priority"!==e&&".value"!==e&&".sv"!==e&&!Da(e))throw Error(a+" contains an invalid key ("+e+")"+Ga(d)+'.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');d.push(e);Fa(a,f,c+1,d);d.pop()}}function Ga(a){return 0==a.length?"":" in property '"+a.join(".")+"'"}function Ia(a,b){if(!ja(b)||fa(b))throw Error(y(a,1,!1)+" must be an Object containing the children to replace.");Ea(a,b,!1)}
function Ja(a,b,c,d){if(!d||l(c)){if(Ha(c))throw Error(y(a,b,d)+"is "+c.toString()+", but must be a valid Firebase priority (a string, finite number, or null).");if(!(null===c||ha(c)||p(c)||ja(c)&&A(c,".sv")))throw Error(y(a,b,d)+"must be a valid Firebase priority (a string, finite number, or null).");}}
function Ka(a,b,c){if(!c||l(b))switch(b){case "value":case "child_added":case "child_removed":case "child_changed":case "child_moved":break;default:throw Error(y(a,1,c)+'must be a valid event type: "value", "child_added", "child_removed", "child_changed", or "child_moved".');}}function La(a,b){if(l(b)&&!Da(b))throw Error(y(a,2,!0)+'was an invalid key: "'+b+'".  Firebase keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]").');}
function Ma(a,b){if(!p(b)||0===b.length||Ca.test(b))throw Error(y(a,1,!1)+'was an invalid path: "'+b+'". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"');}function C(a,b){if(".info"===D(b))throw Error(a+" failed: Can't modify data under /.info/");}function Na(a,b){if(!p(b))throw Error(y(a,1,!1)+"must be a valid credential (a string).");}function Oa(a,b,c){if(!p(c))throw Error(y(a,b,!1)+"must be a valid string.");}
function E(a,b,c,d){if(!d||l(c))if(!ja(c)||null===c)throw Error(y(a,b,d)+"must be a valid object.");}function Pa(a,b,c){if(!ja(b)||null===b||!A(b,c))throw Error(y(a,1,!1)+'must contain the key "'+c+'"');if(!p(B(b,c)))throw Error(y(a,1,!1)+'must contain the key "'+c+'" with type "string"');};function F(a,b,c,d,e,f,g){this.i=a;this.path=b;this.Ga=c;this.fa=d;this.za=e;this.Ea=f;this.fb=g;if(l(this.fa)&&l(this.Ea)&&l(this.Ga))throw"Query: Can't combine startAt(), endAt(), and limit().";}F.prototype.rd=function(){x("Query.ref",0,0,arguments.length);return new G(this.i,this.path)};F.prototype.ref=F.prototype.rd;
F.prototype.Ua=function(a,b){x("Query.on",2,4,arguments.length);Ka("Query.on",a,!1);z("Query.on",2,b,!1);var c=Qa("Query.on",arguments[2],arguments[3]);this.i.ec(this,a,b,c.cancel,c.$);return b};F.prototype.on=F.prototype.Ua;F.prototype.nb=function(a,b,c){x("Query.off",0,3,arguments.length);Ka("Query.off",a,!0);z("Query.off",2,b,!0);ya("Query.off",3,c);this.i.Dc(this,a,b,c)};F.prototype.off=F.prototype.nb;
F.prototype.Ke=function(a,b){function c(g){f&&(f=!1,e.nb(a,c),b.call(d.$,g))}x("Query.once",2,4,arguments.length);Ka("Query.once",a,!1);z("Query.once",2,b,!1);var d=Qa("Query.once",arguments[2],arguments[3]),e=this,f=!0;this.Ua(a,c,function(b){e.nb(a,c);d.cancel&&d.cancel.call(d.$,b)})};F.prototype.once=F.prototype.Ke;
F.prototype.ze=function(a){x("Query.limit",1,1,arguments.length);if(!ha(a)||Math.floor(a)!==a||0>=a)throw"Query.limit: First argument must be a positive integer.";return new F(this.i,this.path,a,this.fa,this.za,this.Ea,this.fb)};F.prototype.limit=F.prototype.ze;F.prototype.ae=function(a,b){x("Query.startAt",0,2,arguments.length);Ja("Query.startAt",1,a,!0);La("Query.startAt",b);l(a)||(b=a=null);return new F(this.i,this.path,this.Ga,a,b,this.Ea,this.fb)};F.prototype.startAt=F.prototype.ae;
F.prototype.Hd=function(a,b){x("Query.endAt",0,2,arguments.length);Ja("Query.endAt",1,a,!0);La("Query.endAt",b);return new F(this.i,this.path,this.Ga,this.fa,this.za,a,b)};F.prototype.endAt=F.prototype.Hd;F.prototype.se=function(a,b){x("Query.equalTo",1,2,arguments.length);Ja("Query.equalTo",1,a,!1);La("Query.equalTo",b);return this.ae(a,b).Hd(a,b)};F.prototype.equalTo=F.prototype.se;
function Ra(a){var b={};l(a.fa)&&(b.sp=a.fa);l(a.za)&&(b.sn=a.za);l(a.Ea)&&(b.ep=a.Ea);l(a.fb)&&(b.en=a.fb);l(a.Ga)&&(b.l=a.Ga);l(a.fa)&&l(a.za)&&null===a.fa&&null===a.za&&(b.vf="l");return b}F.prototype.Wa=function(){var a=Sa(Ra(this));return"{}"===a?"default":a};
function Qa(a,b,c){var d={};if(b&&c)d.cancel=b,z(a,3,d.cancel,!0),d.$=c,ya(a,4,d.$);else if(b)if("object"===typeof b&&null!==b)d.$=b;else if("function"===typeof b)d.cancel=b;else throw Error(wa.af(a,3,!0)+"must either be a cancel callback or a context object.");return d};function H(a,b){if(1==arguments.length){this.u=a.split("/");for(var c=0,d=0;d<this.u.length;d++)0<this.u[d].length&&(this.u[c]=this.u[d],c++);this.u.length=c;this.W=0}else this.u=a,this.W=b}function D(a){return a.W>=a.u.length?null:a.u[a.W]}function Ta(a){var b=a.W;b<a.u.length&&b++;return new H(a.u,b)}function Ua(a){return a.W<a.u.length?a.u[a.u.length-1]:null}k=H.prototype;k.toString=function(){for(var a="",b=this.W;b<this.u.length;b++)""!==this.u[b]&&(a+="/"+this.u[b]);return a||"/"};
k.parent=function(){if(this.W>=this.u.length)return null;for(var a=[],b=this.W;b<this.u.length-1;b++)a.push(this.u[b]);return new H(a,0)};k.J=function(a){for(var b=[],c=this.W;c<this.u.length;c++)b.push(this.u[c]);if(a instanceof H)for(c=a.W;c<a.u.length;c++)b.push(a.u[c]);else for(a=a.split("/"),c=0;c<a.length;c++)0<a[c].length&&b.push(a[c]);return new H(b,0)};k.f=function(){return this.W>=this.u.length};k.length=function(){return this.u.length-this.W};
function Va(a,b){var c=D(a);if(null===c)return b;if(c===D(b))return Va(Ta(a),Ta(b));throw"INTERNAL ERROR: innerPath ("+b+") is not within outerPath ("+a+")";}k.contains=function(a){var b=this.W,c=a.W;if(this.length()>a.length())return!1;for(;b<this.u.length;){if(this.u[b]!==a.u[c])return!1;++b;++c}return!0};function Wa(){this.children={};this.gc=0;this.value=null}function Xa(a,b,c){this.Ha=a?a:"";this.Qb=b?b:null;this.A=c?c:new Wa}function I(a,b){for(var c=b instanceof H?b:new H(b),d=a,e;null!==(e=D(c));)d=new Xa(e,d,B(d.A.children,e)||new Wa),c=Ta(c);return d}k=Xa.prototype;k.k=function(){return this.A.value};function Ya(a,b){v("undefined"!==typeof b,"Cannot set value to undefined");a.A.value=b;Za(a)}k.clear=function(){this.A.value=null;this.A.children={};this.A.gc=0;Za(this)};
k.Fb=function(){return 0<this.A.gc};k.f=function(){return null===this.k()&&!this.Fb()};k.B=function(a){for(var b in this.A.children)a(new Xa(b,this,this.A.children[b]))};function $a(a,b,c,d){c&&!d&&b(a);a.B(function(a){$a(a,b,!0,d)});c&&d&&b(a)}function ab(a,b,c){for(a=c?a:a.parent();null!==a;){if(b(a))return!0;a=a.parent()}return!1}k.path=function(){return new H(null===this.Qb?this.Ha:this.Qb.path()+"/"+this.Ha)};k.name=function(){return this.Ha};k.parent=function(){return this.Qb};
function Za(a){if(null!==a.Qb){var b=a.Qb,c=a.Ha,d=a.f(),e=A(b.A.children,c);d&&e?(delete b.A.children[c],b.A.gc--,Za(b)):d||e||(b.A.children[c]=a.A,b.A.gc++,Za(b))}};function bb(a,b){this.ab=a?a:cb;this.ea=b?b:db}function cb(a,b){return a<b?-1:a>b?1:0}k=bb.prototype;k.ta=function(a,b){return new bb(this.ab,this.ea.ta(a,b,this.ab).M(null,null,!1,null,null))};k.remove=function(a){return new bb(this.ab,this.ea.remove(a,this.ab).M(null,null,!1,null,null))};k.get=function(a){for(var b,c=this.ea;!c.f();){b=this.ab(a,c.key);if(0===b)return c.value;0>b?c=c.left:0<b&&(c=c.right)}return null};
function eb(a,b){for(var c,d=a.ea,e=null;!d.f();){c=a.ab(b,d.key);if(0===c){if(d.left.f())return e?e.key:null;for(d=d.left;!d.right.f();)d=d.right;return d.key}0>c?d=d.left:0<c&&(e=d,d=d.right)}throw Error("Attempted to find predecessor key for a nonexistent key.  What gives?");}k.f=function(){return this.ea.f()};k.count=function(){return this.ea.count()};k.Lb=function(){return this.ea.Lb()};k.lb=function(){return this.ea.lb()};k.Fa=function(a){return this.ea.Fa(a)};k.Xa=function(a){return this.ea.Xa(a)};
k.jb=function(a){return new fb(this.ea,a)};function fb(a,b){this.Wd=b;for(this.pc=[];!a.f();)this.pc.push(a),a=a.left}function gb(a){if(0===a.pc.length)return null;var b=a.pc.pop(),c;c=a.Wd?a.Wd(b.key,b.value):{key:b.key,value:b.value};for(b=b.right;!b.f();)a.pc.push(b),b=b.left;return c}function hb(a,b,c,d,e){this.key=a;this.value=b;this.color=null!=c?c:!0;this.left=null!=d?d:db;this.right=null!=e?e:db}k=hb.prototype;
k.M=function(a,b,c,d,e){return new hb(null!=a?a:this.key,null!=b?b:this.value,null!=c?c:this.color,null!=d?d:this.left,null!=e?e:this.right)};k.count=function(){return this.left.count()+1+this.right.count()};k.f=function(){return!1};k.Fa=function(a){return this.left.Fa(a)||a(this.key,this.value)||this.right.Fa(a)};k.Xa=function(a){return this.right.Xa(a)||a(this.key,this.value)||this.left.Xa(a)};function ib(a){return a.left.f()?a:ib(a.left)}k.Lb=function(){return ib(this).key};
k.lb=function(){return this.right.f()?this.key:this.right.lb()};k.ta=function(a,b,c){var d,e;e=this;d=c(a,e.key);e=0>d?e.M(null,null,null,e.left.ta(a,b,c),null):0===d?e.M(null,b,null,null,null):e.M(null,null,null,null,e.right.ta(a,b,c));return jb(e)};function kb(a){if(a.left.f())return db;a.left.R()||a.left.left.R()||(a=lb(a));a=a.M(null,null,null,kb(a.left),null);return jb(a)}
k.remove=function(a,b){var c,d;c=this;if(0>b(a,c.key))c.left.f()||c.left.R()||c.left.left.R()||(c=lb(c)),c=c.M(null,null,null,c.left.remove(a,b),null);else{c.left.R()&&(c=mb(c));c.right.f()||c.right.R()||c.right.left.R()||(c=nb(c),c.left.left.R()&&(c=mb(c),c=nb(c)));if(0===b(a,c.key)){if(c.right.f())return db;d=ib(c.right);c=c.M(d.key,d.value,null,null,kb(c.right))}c=c.M(null,null,null,null,c.right.remove(a,b))}return jb(c)};k.R=function(){return this.color};
function jb(a){a.right.R()&&!a.left.R()&&(a=ob(a));a.left.R()&&a.left.left.R()&&(a=mb(a));a.left.R()&&a.right.R()&&(a=nb(a));return a}function lb(a){a=nb(a);a.right.left.R()&&(a=a.M(null,null,null,null,mb(a.right)),a=ob(a),a=nb(a));return a}function ob(a){return a.right.M(null,null,a.color,a.M(null,null,!0,null,a.right.left),null)}function mb(a){return a.left.M(null,null,a.color,null,a.M(null,null,!0,a.left.right,null))}
function nb(a){return a.M(null,null,!a.color,a.left.M(null,null,!a.left.color,null,null),a.right.M(null,null,!a.right.color,null,null))}function pb(){}k=pb.prototype;k.M=function(){return this};k.ta=function(a,b){return new hb(a,b,null)};k.remove=function(){return this};k.count=function(){return 0};k.f=function(){return!0};k.Fa=function(){return!1};k.Xa=function(){return!1};k.Lb=function(){return null};k.lb=function(){return null};k.R=function(){return!1};var db=new pb;function qb(a){this.Cb=a;this.zc="firebase:"}k=qb.prototype;k.set=function(a,b){null==b?this.Cb.removeItem(this.zc+a):this.Cb.setItem(this.zc+a,u(b))};k.get=function(a){a=this.Cb.getItem(this.zc+a);return null==a?null:ua(a)};k.remove=function(a){this.Cb.removeItem(this.zc+a)};k.Nd=!1;k.toString=function(){return this.Cb.toString()};function tb(){this.yb={}}tb.prototype.set=function(a,b){null==b?delete this.yb[a]:this.yb[a]=b};tb.prototype.get=function(a){return A(this.yb,a)?this.yb[a]:null};tb.prototype.remove=function(a){delete this.yb[a]};tb.prototype.Nd=!0;function ub(a){try{if("undefined"!==typeof window&&"undefined"!==typeof window[a]){var b=window[a];b.setItem("firebase:sentinel","cache");b.removeItem("firebase:sentinel");return new qb(b)}}catch(c){}return new tb}var vb=ub("localStorage"),J=ub("sessionStorage");function wb(a,b,c,d,e){this.host=a.toLowerCase();this.domain=this.host.substr(this.host.indexOf(".")+1);this.Ya=b;this.Ta=c;this.Ye=d;this.yc=e||"";this.ia=vb.get("host:"+a)||this.host}function xb(a,b){b!==a.ia&&(a.ia=b,"s-"===a.ia.substr(0,2)&&vb.set("host:"+a.host,a.ia))}wb.prototype.toString=function(){var a=(this.Ya?"https://":"http://")+this.host;this.yc&&(a+="<"+this.yc+">");return a};function yb(){this.ra=-1};function zb(){this.ra=-1;this.ra=64;this.F=[];this.Sc=[];this.ge=[];this.vc=[];this.vc[0]=128;for(var a=1;a<this.ra;++a)this.vc[a]=0;this.Kc=this.kb=0;this.reset()}na(zb,yb);zb.prototype.reset=function(){this.F[0]=1732584193;this.F[1]=4023233417;this.F[2]=2562383102;this.F[3]=271733878;this.F[4]=3285377520;this.Kc=this.kb=0};
function Ab(a,b,c){c||(c=0);var d=a.ge;if(p(b))for(var e=0;16>e;e++)d[e]=b.charCodeAt(c)<<24|b.charCodeAt(c+1)<<16|b.charCodeAt(c+2)<<8|b.charCodeAt(c+3),c+=4;else for(e=0;16>e;e++)d[e]=b[c]<<24|b[c+1]<<16|b[c+2]<<8|b[c+3],c+=4;for(e=16;80>e;e++){var f=d[e-3]^d[e-8]^d[e-14]^d[e-16];d[e]=(f<<1|f>>>31)&4294967295}b=a.F[0];c=a.F[1];for(var g=a.F[2],h=a.F[3],m=a.F[4],n,e=0;80>e;e++)40>e?20>e?(f=h^c&(g^h),n=1518500249):(f=c^g^h,n=1859775393):60>e?(f=c&g|h&(c|g),n=2400959708):(f=c^g^h,n=3395469782),f=(b<<
5|b>>>27)+f+m+n+d[e]&4294967295,m=h,h=g,g=(c<<30|c>>>2)&4294967295,c=b,b=f;a.F[0]=a.F[0]+b&4294967295;a.F[1]=a.F[1]+c&4294967295;a.F[2]=a.F[2]+g&4294967295;a.F[3]=a.F[3]+h&4294967295;a.F[4]=a.F[4]+m&4294967295}
zb.prototype.update=function(a,b){l(b)||(b=a.length);for(var c=b-this.ra,d=0,e=this.Sc,f=this.kb;d<b;){if(0==f)for(;d<=c;)Ab(this,a,d),d+=this.ra;if(p(a))for(;d<b;){if(e[f]=a.charCodeAt(d),++f,++d,f==this.ra){Ab(this,e);f=0;break}}else for(;d<b;)if(e[f]=a[d],++f,++d,f==this.ra){Ab(this,e);f=0;break}}this.kb=f;this.Kc+=b};function Bb(){return Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^ma()).toString(36)};var L=Array.prototype,Cb=L.indexOf?function(a,b,c){return L.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(p(a))return p(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},Db=L.forEach?function(a,b,c){L.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=p(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},Eb=L.filter?function(a,b,c){return L.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,g=p(a)?
a.split(""):a,h=0;h<d;h++)if(h in g){var m=g[h];b.call(c,m,h,a)&&(e[f++]=m)}return e},Fb=L.map?function(a,b,c){return L.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=p(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e},Gb=L.reduce?function(a,b,c,d){d&&(b=r(b,d));return L.reduce.call(a,b,c)}:function(a,b,c,d){var e=c;Db(a,function(c,g){e=b.call(d,e,c,g,a)});return e},Hb=L.every?function(a,b,c){return L.every.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=
p(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&!b.call(c,e[f],f,a))return!1;return!0};function Ib(a,b){var c;a:{c=a.length;for(var d=p(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){c=e;break a}c=-1}return 0>c?null:p(a)?a.charAt(c):a[c]}function Jb(a,b){a.sort(b||Kb)}function Kb(a,b){return a>b?1:a<b?-1:0};var Lb;a:{var Mb=ba.navigator;if(Mb){var Nb=Mb.userAgent;if(Nb){Lb=Nb;break a}}Lb=""}function Ob(a){return-1!=Lb.indexOf(a)};var Pb=Ob("Opera")||Ob("OPR"),Qb=Ob("Trident")||Ob("MSIE"),Rb=Ob("Gecko")&&-1==Lb.toLowerCase().indexOf("webkit")&&!(Ob("Trident")||Ob("MSIE")),Sb=-1!=Lb.toLowerCase().indexOf("webkit");(function(){var a="",b;if(Pb&&ba.opera)return a=ba.opera.version,ia(a)?a():a;Rb?b=/rv\:([^\);]+)(\)|;)/:Qb?b=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:Sb&&(b=/WebKit\/(\S+)/);b&&(a=(a=b.exec(Lb))?a[1]:"");return Qb&&(b=(b=ba.document)?b.documentMode:void 0,b>parseFloat(a))?String(b):a})();var Tb=null,Ub=null;
function Vb(a,b){if(!ga(a))throw Error("encodeByteArray takes an array as a parameter");if(!Tb){Tb={};Ub={};for(var c=0;65>c;c++)Tb[c]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(c),Ub[c]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(c)}for(var c=b?Ub:Tb,d=[],e=0;e<a.length;e+=3){var f=a[e],g=e+1<a.length,h=g?a[e+1]:0,m=e+2<a.length,n=m?a[e+2]:0,q=f>>2,f=(f&3)<<4|h>>4,h=(h&15)<<2|n>>6,n=n&63;m||(n=64,g||(h=64));d.push(c[q],c[f],c[h],c[n])}return d.join("")}
;var Wb=function(){var a=1;return function(){return a++}}();function v(a,b){if(!a)throw Error("Firebase INTERNAL ASSERT FAILED:"+b);}function Xb(a){try{if("undefined"!==typeof atob)return atob(a)}catch(b){M("base64DecodeIfNativeSupport failed: ",b)}return null}
function Yb(a){var b=va(a);a=new zb;a.update(b);var b=[],c=8*a.Kc;56>a.kb?a.update(a.vc,56-a.kb):a.update(a.vc,a.ra-(a.kb-56));for(var d=a.ra-1;56<=d;d--)a.Sc[d]=c&255,c/=256;Ab(a,a.Sc);for(d=c=0;5>d;d++)for(var e=24;0<=e;e-=8)b[c]=a.F[d]>>e&255,++c;return Vb(b)}function Zb(a){for(var b="",c=0;c<arguments.length;c++)b=ga(arguments[c])?b+Zb.apply(null,arguments[c]):"object"===typeof arguments[c]?b+u(arguments[c]):b+arguments[c],b+=" ";return b}var $b=null,ac=!0;
function M(a){!0===ac&&(ac=!1,null===$b&&!0===J.get("logging_enabled")&&bc(!0));if($b){var b=Zb.apply(null,arguments);$b(b)}}function cc(a){return function(){M(a,arguments)}}function dc(a){if("undefined"!==typeof console){var b="FIREBASE INTERNAL ERROR: "+Zb.apply(null,arguments);"undefined"!==typeof console.error?console.error(b):console.log(b)}}function ec(a){var b=Zb.apply(null,arguments);throw Error("FIREBASE FATAL ERROR: "+b);}
function O(a){if("undefined"!==typeof console){var b="FIREBASE WARNING: "+Zb.apply(null,arguments);"undefined"!==typeof console.warn?console.warn(b):console.log(b)}}
function fc(a){var b="",c="",d="",e=!0,f="https",g="";if(p(a)){var h=a.indexOf("//");0<=h&&(f=a.substring(0,h-1),a=a.substring(h+2));h=a.indexOf("/");-1===h&&(h=a.length);b=a.substring(0,h);a=a.substring(h+1);var m=b.split(".");if(3===m.length){h=m[2].indexOf(":");e=0<=h?"https"===f||"wss"===f:!0;c=m[1];d=m[0];g="";a=("/"+a).split("/");for(h=0;h<a.length;h++)if(0<a[h].length){m=a[h];try{m=decodeURIComponent(m.replace(/\+/g," "))}catch(n){}g+="/"+m}d=d.toLowerCase()}else 2===m.length&&(c=m[0])}return{host:b,
domain:c,Ve:d,Ya:e,scheme:f,Rb:g}}function Ha(a){return ha(a)&&(a!=a||a==Number.POSITIVE_INFINITY||a==Number.NEGATIVE_INFINITY)}
function gc(a){if("complete"===document.readyState)a();else{var b=!1,c=function(){document.body?b||(b=!0,a()):setTimeout(c,Math.floor(10))};document.addEventListener?(document.addEventListener("DOMContentLoaded",c,!1),window.addEventListener("load",c,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",function(){"complete"===document.readyState&&c()}),window.attachEvent("onload",c))}}
function hc(a,b){return a!==b?null===a?-1:null===b?1:typeof a!==typeof b?"number"===typeof a?-1:1:a>b?1:-1:0}function ic(a,b){if(a===b)return 0;var c=jc(a),d=jc(b);return null!==c?null!==d?0==c-d?a.length-b.length:c-d:-1:null!==d?1:a<b?-1:1}function kc(a,b){if(b&&a in b)return b[a];throw Error("Missing required key ("+a+") in object: "+u(b));}
function Sa(a){if("object"!==typeof a||null===a)return u(a);var b=[],c;for(c in a)b.push(c);b.sort();c="{";for(var d=0;d<b.length;d++)0!==d&&(c+=","),c+=u(b[d]),c+=":",c+=Sa(a[b[d]]);return c+"}"}function lc(a,b){if(a.length<=b)return[a];for(var c=[],d=0;d<a.length;d+=b)d+b>a?c.push(a.substring(d,a.length)):c.push(a.substring(d,d+b));return c}function mc(a,b){if(fa(a))for(var c=0;c<a.length;++c)b(c,a[c]);else nc(a,b)}function oc(a,b){return b?r(a,b):a}
function pc(a){v(!Ha(a),"Invalid JSON number");var b,c,d,e;0===a?(d=c=0,b=-Infinity===1/a?1:0):(b=0>a,a=Math.abs(a),a>=Math.pow(2,-1022)?(d=Math.min(Math.floor(Math.log(a)/Math.LN2),1023),c=d+1023,d=Math.round(a*Math.pow(2,52-d)-Math.pow(2,52))):(c=0,d=Math.round(a/Math.pow(2,-1074))));e=[];for(a=52;a;a-=1)e.push(d%2?1:0),d=Math.floor(d/2);for(a=11;a;a-=1)e.push(c%2?1:0),c=Math.floor(c/2);e.push(b?1:0);e.reverse();b=e.join("");c="";for(a=0;64>a;a+=8)d=parseInt(b.substr(a,8),2).toString(16),1===d.length&&
(d="0"+d),c+=d;return c.toLowerCase()}function qc(a){var b="Unknown Error";"too_big"===a?b="The data requested exceeds the maximum size that can be accessed with a single request.":"permission_denied"==a?b="Client doesn't have permission to access the desired data.":"unavailable"==a&&(b="The service is unavailable");b=Error(a+": "+b);b.code=a.toUpperCase();return b}var rc=/^-?\d{1,10}$/;function jc(a){return rc.test(a)&&(a=Number(a),-2147483648<=a&&2147483647>=a)?a:null}
function sc(a){try{a()}catch(b){setTimeout(function(){throw b;},Math.floor(0))}}function P(a,b){if(ia(a)){var c=Array.prototype.slice.call(arguments,1).slice();sc(function(){a.apply(null,c)})}};function tc(a,b){this.H=a;v(null!==this.H,"LeafNode shouldn't be created with null value.");this.pb="undefined"!==typeof b?b:null}k=tc.prototype;k.Q=function(){return!0};k.m=function(){return this.pb};k.La=function(a){return new tc(this.H,a)};k.P=function(){return Q};k.N=function(a){return null===D(a)?this:Q};k.ha=function(){return null};k.K=function(a,b){return(new R).K(a,b).La(this.pb)};k.Ba=function(a,b){var c=D(a);return null===c?b:this.K(c,Q.Ba(Ta(a),b))};k.f=function(){return!1};k.qc=function(){return 0};
k.X=function(a){return a&&null!==this.m()?{".value":this.k(),".priority":this.m()}:this.k()};k.hash=function(){var a="";null!==this.m()&&(a+="priority:"+uc(this.m())+":");var b=typeof this.H,a=a+(b+":"),a="number"===b?a+pc(this.H):a+this.H;return Yb(a)};k.k=function(){return this.H};k.toString=function(){return"string"===typeof this.H?this.H:'"'+this.H+'"'};function vc(a,b){return hc(a.la,b.la)||ic(a.name,b.name)}function wc(a,b){return ic(a.name,b.name)}function xc(a,b){return ic(a,b)};function R(a,b){this.o=a||new bb(xc);this.pb="undefined"!==typeof b?b:null}k=R.prototype;k.Q=function(){return!1};k.m=function(){return this.pb};k.La=function(a){return new R(this.o,a)};k.K=function(a,b){var c=this.o.remove(a);b&&b.f()&&(b=null);null!==b&&(c=c.ta(a,b));return b&&null!==b.m()?new yc(c,null,this.pb):new R(c,this.pb)};k.Ba=function(a,b){var c=D(a);if(null===c)return b;var d=this.P(c).Ba(Ta(a),b);return this.K(c,d)};k.f=function(){return this.o.f()};k.qc=function(){return this.o.count()};
var zc=/^(0|[1-9]\d*)$/;k=R.prototype;k.X=function(a){if(this.f())return null;var b={},c=0,d=0,e=!0;this.B(function(f,g){b[f]=g.X(a);c++;e&&zc.test(f)?d=Math.max(d,Number(f)):e=!1});if(!a&&e&&d<2*c){var f=[],g;for(g in b)f[g]=b[g];return f}a&&null!==this.m()&&(b[".priority"]=this.m());return b};k.hash=function(){var a="";null!==this.m()&&(a+="priority:"+uc(this.m())+":");this.B(function(b,c){var d=c.hash();""!==d&&(a+=":"+b+":"+d)});return""===a?"":Yb(a)};
k.P=function(a){a=this.o.get(a);return null===a?Q:a};k.N=function(a){var b=D(a);return null===b?this:this.P(b).N(Ta(a))};k.ha=function(a){return eb(this.o,a)};k.Jd=function(){return this.o.Lb()};k.Kd=function(){return this.o.lb()};k.B=function(a){return this.o.Fa(a)};k.$c=function(a){return this.o.Xa(a)};k.jb=function(){return this.o.jb()};k.toString=function(){var a="{",b=!0;this.B(function(c,d){b?b=!1:a+=", ";a+='"'+c+'" : '+d.toString()});return a+="}"};var Q=new R;function yc(a,b,c){R.call(this,a,c);null===b&&(b=new bb(vc),a.Fa(function(a,c){b=b.ta({name:a,la:c.m()},c)}));this.ya=b}na(yc,R);k=yc.prototype;k.K=function(a,b){var c=this.P(a),d=this.o,e=this.ya;null!==c&&(d=d.remove(a),e=e.remove({name:a,la:c.m()}));b&&b.f()&&(b=null);null!==b&&(d=d.ta(a,b),e=e.ta({name:a,la:b.m()},b));return new yc(d,e,this.m())};k.ha=function(a,b){var c=eb(this.ya,{name:a,la:b.m()});return c?c.name:null};k.B=function(a){return this.ya.Fa(function(b,c){return a(b.name,c)})};
k.$c=function(a){return this.ya.Xa(function(b,c){return a(b.name,c)})};k.jb=function(){return this.ya.jb(function(a,b){return{key:a.name,value:b}})};k.Jd=function(){return this.ya.f()?null:this.ya.Lb().name};k.Kd=function(){return this.ya.f()?null:this.ya.lb().name};function S(a,b){if(null===a)return Q;var c=null;"object"===typeof a&&".priority"in a?c=a[".priority"]:"undefined"!==typeof b&&(c=b);v(null===c||"string"===typeof c||"number"===typeof c||"object"===typeof c&&".sv"in c,"Invalid priority type found: "+typeof c);"object"===typeof a&&".value"in a&&null!==a[".value"]&&(a=a[".value"]);if("object"!==typeof a||".sv"in a)return new tc(a,c);if(a instanceof Array){var d=Q,e=a;nc(e,function(a,b){if(A(e,b)&&"."!==b.substring(0,1)){var c=S(a);if(c.Q()||!c.f())d=
d.K(b,c)}});return d.La(c)}var f=[],g={},h=!1,m=a;mc(m,function(a,b){if("string"!==typeof b||"."!==b.substring(0,1)){var c=S(m[b]);c.f()||(h=h||null!==c.m(),f.push({name:b,la:c.m()}),g[b]=c)}});var n=Ac(f,g,!1);if(h){var q=Ac(f,g,!0);return new yc(n,q,c)}return new R(n,c)}var Bc=Math.log(2);function Cc(a){this.count=parseInt(Math.log(a+1)/Bc,10);this.Fd=this.count-1;this.pe=a+1&parseInt(Array(this.count+1).join("1"),2)}function Dc(a){var b=!(a.pe&1<<a.Fd);a.Fd--;return b}
function Ac(a,b,c){function d(e,f){var m=f-e;if(0==m)return null;if(1==m){var m=a[e].name,n=c?a[e]:m;return new hb(n,b[m],!1,null,null)}var n=parseInt(m/2,10)+e,q=d(e,n),s=d(n+1,f),m=a[n].name,n=c?a[n]:m;return new hb(n,b[m],!1,q,s)}var e=c?vc:wc;a.sort(e);var f=function(e){function f(e,g){var h=q-e,s=q;q-=e;var t=a[h].name,h=new hb(c?a[h]:t,b[t],g,null,d(h+1,s));m?m.left=h:n=h;m=h}for(var m=null,n=null,q=a.length,s=0;s<e.count;++s){var t=Dc(e),w=Math.pow(2,e.count-(s+1));t?f(w,!1):(f(w,!1),f(w,!0))}return n}(new Cc(a.length)),
e=c?vc:xc;return null!==f?new bb(e,f):new bb(e)}function uc(a){return"number"===typeof a?"number:"+pc(a):"string:"+a};function T(a,b){this.A=a;this.Cc=b}T.prototype.X=function(){x("Firebase.DataSnapshot.val",0,0,arguments.length);return this.A.X()};T.prototype.val=T.prototype.X;T.prototype.te=function(){x("Firebase.DataSnapshot.exportVal",0,0,arguments.length);return this.A.X(!0)};T.prototype.exportVal=T.prototype.te;T.prototype.J=function(a){x("Firebase.DataSnapshot.child",0,1,arguments.length);ha(a)&&(a=String(a));Ma("Firebase.DataSnapshot.child",a);var b=new H(a),c=this.Cc.J(b);return new T(this.A.N(b),c)};
T.prototype.child=T.prototype.J;T.prototype.ed=function(a){x("Firebase.DataSnapshot.hasChild",1,1,arguments.length);Ma("Firebase.DataSnapshot.hasChild",a);var b=new H(a);return!this.A.N(b).f()};T.prototype.hasChild=T.prototype.ed;T.prototype.m=function(){x("Firebase.DataSnapshot.getPriority",0,0,arguments.length);return this.A.m()};T.prototype.getPriority=T.prototype.m;
T.prototype.forEach=function(a){x("Firebase.DataSnapshot.forEach",1,1,arguments.length);z("Firebase.DataSnapshot.forEach",1,a,!1);if(this.A.Q())return!1;var b=this;return this.A.B(function(c,d){return a(new T(d,b.Cc.J(c)))})};T.prototype.forEach=T.prototype.forEach;T.prototype.Fb=function(){x("Firebase.DataSnapshot.hasChildren",0,0,arguments.length);return this.A.Q()?!1:!this.A.f()};T.prototype.hasChildren=T.prototype.Fb;
T.prototype.name=function(){x("Firebase.DataSnapshot.name",0,0,arguments.length);return this.Cc.name()};T.prototype.name=T.prototype.name;T.prototype.qc=function(){x("Firebase.DataSnapshot.numChildren",0,0,arguments.length);return this.A.qc()};T.prototype.numChildren=T.prototype.qc;T.prototype.rd=function(){x("Firebase.DataSnapshot.ref",0,0,arguments.length);return this.Cc};T.prototype.ref=T.prototype.rd;function Ec(a){v(fa(a)&&0<a.length,"Requires a non-empty array");this.he=a;this.Jb={}}Ec.prototype.Mc=function(a,b){for(var c=this.Jb[a]||[],d=0;d<c.length;d++)c[d].ca.apply(c[d].$,Array.prototype.slice.call(arguments,1))};Ec.prototype.Ua=function(a,b,c){Fc(this,a);this.Jb[a]=this.Jb[a]||[];this.Jb[a].push({ca:b,$:c});(a=this.cd(a))&&b.apply(c,a)};Ec.prototype.nb=function(a,b,c){Fc(this,a);a=this.Jb[a]||[];for(var d=0;d<a.length;d++)if(a[d].ca===b&&(!c||c===a[d].$)){a.splice(d,1);break}};
function Fc(a,b){v(Ib(a.he,function(a){return a===b}),"Unknown event: "+b)};function Gc(){Ec.call(this,["visible"]);var a,b;"undefined"!==typeof document&&"undefined"!==typeof document.addEventListener&&("undefined"!==typeof document.hidden?(b="visibilitychange",a="hidden"):"undefined"!==typeof document.mozHidden?(b="mozvisibilitychange",a="mozHidden"):"undefined"!==typeof document.msHidden?(b="msvisibilitychange",a="msHidden"):"undefined"!==typeof document.webkitHidden&&(b="webkitvisibilitychange",a="webkitHidden"));this.xb=!0;if(b){var c=this;document.addEventListener(b,
function(){var b=!document[a];b!==c.xb&&(c.xb=b,c.Mc("visible",b))},!1)}}na(Gc,Ec);da(Gc);Gc.prototype.cd=function(a){v("visible"===a,"Unknown event type: "+a);return[this.xb]};function Hc(){Ec.call(this,["online"]);this.Ob=!0;if("undefined"!==typeof window&&"undefined"!==typeof window.addEventListener){var a=this;window.addEventListener("online",function(){a.Ob||a.Mc("online",!0);a.Ob=!0},!1);window.addEventListener("offline",function(){a.Ob&&a.Mc("online",!1);a.Ob=!1},!1)}}na(Hc,Ec);da(Hc);Hc.prototype.cd=function(a){v("online"===a,"Unknown event type: "+a);return[this.Ob]};function nc(a,b){for(var c in a)b.call(void 0,a[c],c,a)}function Ic(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b}function Jc(a){for(var b in a)return!1;return!0}function Kc(a){var b={},c;for(c in a)b[c]=a[c];return b}var Lc="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function Mc(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<Lc.length;f++)c=Lc[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};function Nc(){this.Bb={}}function Oc(a,b,c){l(c)||(c=1);A(a.Bb,b)||(a.Bb[b]=0);a.Bb[b]+=c}Nc.prototype.get=function(){return Kc(this.Bb)};function Qc(a){this.qe=a;this.mc=null}Qc.prototype.get=function(){var a=this.qe.get(),b=Kc(a);if(this.mc)for(var c in this.mc)b[c]-=this.mc[c];this.mc=a;return b};function Rc(a,b){this.yd={};this.Hc=new Qc(a);this.n=b;var c=1E4+2E4*Math.random();setTimeout(r(this.Ud,this),Math.floor(c))}Rc.prototype.Ud=function(){var a=this.Hc.get(),b={},c=!1,d;for(d in a)0<a[d]&&A(this.yd,d)&&(b[d]=a[d],c=!0);c&&(a=this.n,a.T&&(b={c:b},a.e("reportStats",b),a.Ja("s",b)));setTimeout(r(this.Ud,this),Math.floor(6E5*Math.random()))};var Sc={},Tc={};function Uc(a){a=a.toString();Sc[a]||(Sc[a]=new Nc);return Sc[a]}function Vc(a,b){var c=a.toString();Tc[c]||(Tc[c]=b());return Tc[c]};var Wc=null;"undefined"!==typeof MozWebSocket?Wc=MozWebSocket:"undefined"!==typeof WebSocket&&(Wc=WebSocket);function Xc(a,b,c){this.Wc=a;this.e=cc(this.Wc);this.frames=this.Hb=null;this.Na=this.Oa=this.Ad=0;this.ga=Uc(b);this.Ca=(b.Ya?"wss://":"ws://")+b.ia+"/.ws?v=5";"undefined"!==typeof location&&location.href&&-1!==location.href.indexOf("firebaseio.com")&&(this.Ca+="&r=f");b.host!==b.ia&&(this.Ca=this.Ca+"&ns="+b.Ta);c&&(this.Ca=this.Ca+"&s="+c)}var Yc;
Xc.prototype.open=function(a,b){this.ka=b;this.Ge=a;this.e("Websocket connecting to "+this.Ca);this.Db=!1;vb.set("previous_websocket_failure",!0);try{this.Y=new Wc(this.Ca)}catch(c){this.e("Error instantiating WebSocket.");var d=c.message||c.data;d&&this.e(d);this.Ia();return}var e=this;this.Y.onopen=function(){e.e("Websocket connected.");e.Db=!0};this.Y.onclose=function(){e.e("Websocket connection was disconnected.");e.Y=null;e.Ia()};this.Y.onmessage=function(a){if(null!==e.Y)if(a=a.data,e.Na+=a.length,
Oc(e.ga,"bytes_received",a.length),Zc(e),null!==e.frames)$c(e,a);else{a:{v(null===e.frames,"We already have a frame buffer");if(6>=a.length){var b=Number(a);if(!isNaN(b)){e.Ad=b;e.frames=[];a=null;break a}}e.Ad=1;e.frames=[]}null!==a&&$c(e,a)}};this.Y.onerror=function(a){e.e("WebSocket error.  Closing connection.");(a=a.message||a.data)&&e.e(a);e.Ia()}};Xc.prototype.start=function(){};
Xc.isAvailable=function(){var a=!1;if("undefined"!==typeof navigator&&navigator.userAgent){var b=navigator.userAgent.match(/Android ([0-9]{0,}\.[0-9]{0,})/);b&&1<b.length&&4.4>parseFloat(b[1])&&(a=!0)}return!a&&null!==Wc&&!Yc};Xc.responsesRequiredToBeHealthy=2;Xc.healthyTimeout=3E4;k=Xc.prototype;k.nc=function(){vb.remove("previous_websocket_failure")};function $c(a,b){a.frames.push(b);if(a.frames.length==a.Ad){var c=a.frames.join("");a.frames=null;c=ua(c);a.Ge(c)}}
k.send=function(a){Zc(this);a=u(a);this.Oa+=a.length;Oc(this.ga,"bytes_sent",a.length);a=lc(a,16384);1<a.length&&this.Y.send(String(a.length));for(var b=0;b<a.length;b++)this.Y.send(a[b])};k.ac=function(){this.Ra=!0;this.Hb&&(clearInterval(this.Hb),this.Hb=null);this.Y&&(this.Y.close(),this.Y=null)};k.Ia=function(){this.Ra||(this.e("WebSocket is closing itself"),this.ac(),this.ka&&(this.ka(this.Db),this.ka=null))};k.close=function(){this.Ra||(this.e("WebSocket is being closed"),this.ac())};
function Zc(a){clearInterval(a.Hb);a.Hb=setInterval(function(){a.Y&&a.Y.send("0");Zc(a)},Math.floor(45E3))};function ad(a){this.ob=a;this.xc=[];this.eb=0;this.Vc=-1;this.Va=null}function bd(a,b,c){a.Vc=b;a.Va=c;a.Vc<a.eb&&(a.Va(),a.Va=null)}function cd(a,b,c){for(a.xc[b]=c;a.xc[a.eb];){var d=a.xc[a.eb];delete a.xc[a.eb];for(var e=0;e<d.length;++e)if(d[e]){var f=a;sc(function(){f.ob(d[e])})}if(a.eb===a.Vc){a.Va&&(clearTimeout(a.Va),a.Va(),a.Va=null);break}a.eb++}};function dd(){this.set={}}k=dd.prototype;k.add=function(a,b){this.set[a]=null!==b?b:!0};k.contains=function(a){return A(this.set,a)};k.get=function(a){return this.contains(a)?this.set[a]:void 0};k.remove=function(a){delete this.set[a]};k.clear=function(){this.set={}};k.f=function(){return Jc(this.set)};k.count=function(){var a=this.set,b=0,c;for(c in a)b++;return b};function ed(a,b){nc(a.set,function(a,d){b(d,a)})}k.keys=function(){var a=[];nc(this.set,function(b,c){a.push(c)});return a};function fd(a,b,c){this.Wc=a;this.e=cc(a);this.Na=this.Oa=0;this.ga=Uc(b);this.Gc=c;this.Db=!1;this.dc=function(a){b.host!==b.ia&&(a.ns=b.Ta);var c=[],f;for(f in a)a.hasOwnProperty(f)&&c.push(f+"="+a[f]);return(b.Ya?"https://":"http://")+b.ia+"/.lp?"+c.join("&")}}var gd,hd;
fd.prototype.open=function(a,b){this.Ed=0;this.U=b;this.Od=new ad(a);this.Ra=!1;var c=this;this.Pa=setTimeout(function(){c.e("Timed out trying to connect.");c.Ia();c.Pa=null},Math.floor(3E4));gc(function(){if(!c.Ra){c.na=new id(function(a,b,d,h,m){jd(c,arguments);if(c.na)if(c.Pa&&(clearTimeout(c.Pa),c.Pa=null),c.Db=!0,"start"==a)c.id=b,c.Td=d;else if("close"===a)b?(c.na.Fc=!1,bd(c.Od,b,function(){c.Ia()})):c.Ia();else throw Error("Unrecognized command received: "+a);},function(a,b){jd(c,arguments);
cd(c.Od,a,b)},function(){c.Ia()},c.dc);var a={start:"t"};a.ser=Math.floor(1E8*Math.random());c.na.Nc&&(a.cb=c.na.Nc);a.v="5";c.Gc&&(a.s=c.Gc);"undefined"!==typeof location&&location.href&&-1!==location.href.indexOf("firebaseio.com")&&(a.r="f");a=c.dc(a);c.e("Connecting via long-poll to "+a);kd(c.na,a,function(){})}})};
fd.prototype.start=function(){var a=this.na,b=this.Td;a.Be=this.id;a.Ce=b;for(a.Qc=!0;ld(a););a=this.id;b=this.Td;this.mb=document.createElement("iframe");var c={dframe:"t"};c.id=a;c.pw=b;this.mb.src=this.dc(c);this.mb.style.display="none";document.body.appendChild(this.mb)};fd.isAvailable=function(){return!hd&&!("object"===typeof window&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))&&!("object"===typeof Windows&&"object"===typeof Windows.Ze)&&(gd||!0)};k=fd.prototype;
k.nc=function(){};k.ac=function(){this.Ra=!0;this.na&&(this.na.close(),this.na=null);this.mb&&(document.body.removeChild(this.mb),this.mb=null);this.Pa&&(clearTimeout(this.Pa),this.Pa=null)};k.Ia=function(){this.Ra||(this.e("Longpoll is closing itself"),this.ac(),this.U&&(this.U(this.Db),this.U=null))};k.close=function(){this.Ra||(this.e("Longpoll is being closed."),this.ac())};
k.send=function(a){a=u(a);this.Oa+=a.length;Oc(this.ga,"bytes_sent",a.length);a=va(a);a=Vb(a,!0);a=lc(a,1840);for(var b=0;b<a.length;b++){var c=this.na;c.Tb.push({Pe:this.Ed,We:a.length,Gd:a[b]});c.Qc&&ld(c);this.Ed++}};function jd(a,b){var c=u(b).length;a.Na+=c;Oc(a.ga,"bytes_received",c)}
function id(a,b,c,d){this.dc=d;this.ka=c;this.od=new dd;this.Tb=[];this.Yc=Math.floor(1E8*Math.random());this.Fc=!0;this.Nc=Wb();window["pLPCommand"+this.Nc]=a;window["pRTLPCB"+this.Nc]=b;a=document.createElement("iframe");a.style.display="none";if(document.body){document.body.appendChild(a);try{a.contentWindow.document||M("No IE domain setting required")}catch(e){a.src="javascript:void((function(){document.open();document.domain='"+document.domain+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
a.contentDocument?a.Da=a.contentDocument:a.contentWindow?a.Da=a.contentWindow.document:a.document&&(a.Da=a.document);this.aa=a;a="";this.aa.src&&"javascript:"===this.aa.src.substr(0,11)&&(a='<script>document.domain="'+document.domain+'";\x3c/script>');a="<html><body>"+a+"</body></html>";try{this.aa.Da.open(),this.aa.Da.write(a),this.aa.Da.close()}catch(f){M("frame writing exception"),f.stack&&M(f.stack),M(f)}}
id.prototype.close=function(){this.Qc=!1;if(this.aa){this.aa.Da.body.innerHTML="";var a=this;setTimeout(function(){null!==a.aa&&(document.body.removeChild(a.aa),a.aa=null)},Math.floor(0))}var b=this.ka;b&&(this.ka=null,b())};
function ld(a){if(a.Qc&&a.Fc&&a.od.count()<(0<a.Tb.length?2:1)){a.Yc++;var b={};b.id=a.Be;b.pw=a.Ce;b.ser=a.Yc;for(var b=a.dc(b),c="",d=0;0<a.Tb.length;)if(1870>=a.Tb[0].Gd.length+30+c.length){var e=a.Tb.shift(),c=c+"&seg"+d+"="+e.Pe+"&ts"+d+"="+e.We+"&d"+d+"="+e.Gd;d++}else break;md(a,b+c,a.Yc);return!0}return!1}function md(a,b,c){function d(){a.od.remove(c);ld(a)}a.od.add(c);var e=setTimeout(d,Math.floor(25E3));kd(a,b,function(){clearTimeout(e);d()})}
function kd(a,b,c){setTimeout(function(){try{if(a.Fc){var d=a.aa.Da.createElement("script");d.type="text/javascript";d.async=!0;d.src=b;d.onload=d.onreadystatechange=function(){var a=d.readyState;a&&"loaded"!==a&&"complete"!==a||(d.onload=d.onreadystatechange=null,d.parentNode&&d.parentNode.removeChild(d),c())};d.onerror=function(){M("Long-poll script failed to load: "+b);a.Fc=!1;a.close()};a.aa.Da.body.appendChild(d)}}catch(e){}},Math.floor(1))};function nd(a){od(this,a)}var pd=[fd,Xc];function od(a,b){var c=Xc&&Xc.isAvailable(),d=c&&!(vb.Nd||!0===vb.get("previous_websocket_failure"));b.Ye&&(c||O("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),d=!0);if(d)a.bc=[Xc];else{var e=a.bc=[];mc(pd,function(a,b){b&&b.isAvailable()&&e.push(b)})}}function qd(a){if(0<a.bc.length)return a.bc[0];throw Error("No transports available");};function rd(a,b,c,d,e,f){this.id=a;this.e=cc("c:"+this.id+":");this.ob=c;this.Nb=d;this.U=e;this.md=f;this.D=b;this.wc=[];this.Dd=0;this.ce=new nd(b);this.oa=0;this.e("Connection created");sd(this)}
function sd(a){var b=qd(a.ce);a.C=new b("c:"+a.id+":"+a.Dd++,a.D);a.qd=b.responsesRequiredToBeHealthy||0;var c=td(a,a.C),d=ud(a,a.C);a.cc=a.C;a.$b=a.C;a.w=null;a.Sa=!1;setTimeout(function(){a.C&&a.C.open(c,d)},Math.floor(0));b=b.healthyTimeout||0;0<b&&(a.kc=setTimeout(function(){a.kc=null;a.Sa||(a.C&&102400<a.C.Na?(a.e("Connection exceeded healthy timeout but has received "+a.C.Na+" bytes.  Marking connection healthy."),a.Sa=!0,a.C.nc()):a.C&&10240<a.C.Oa?a.e("Connection exceeded healthy timeout but has sent "+
a.C.Oa+" bytes.  Leaving connection alive."):(a.e("Closing unhealthy connection after timeout."),a.close()))},Math.floor(b)))}function ud(a,b){return function(c){b===a.C?(a.C=null,c||0!==a.oa?1===a.oa&&a.e("Realtime connection lost."):(a.e("Realtime connection failed."),"s-"===a.D.ia.substr(0,2)&&(vb.remove("host:"+a.D.host),a.D.ia=a.D.host)),a.close()):b===a.w?(a.e("Secondary connection lost."),c=a.w,a.w=null,a.cc!==c&&a.$b!==c||a.close()):a.e("closing an old connection")}}
function td(a,b){return function(c){if(2!=a.oa)if(b===a.$b){var d=kc("t",c);c=kc("d",c);if("c"==d){if(d=kc("t",c),"d"in c)if(c=c.d,"h"===d){var d=c.ts,e=c.v,f=c.h;a.Gc=c.s;xb(a.D,f);0==a.oa&&(a.C.start(),vd(a,a.C,d),"5"!==e&&O("Protocol version mismatch detected"),c=a.ce,(c=1<c.bc.length?c.bc[1]:null)&&wd(a,c))}else if("n"===d){a.e("recvd end transmission on primary");a.$b=a.w;for(c=0;c<a.wc.length;++c)a.tc(a.wc[c]);a.wc=[];xd(a)}else"s"===d?(a.e("Connection shutdown command received. Shutting down..."),
a.md&&(a.md(c),a.md=null),a.U=null,a.close()):"r"===d?(a.e("Reset packet received.  New host: "+c),xb(a.D,c),1===a.oa?a.close():(yd(a),sd(a))):"e"===d?dc("Server Error: "+c):"o"===d?(a.e("got pong on primary."),zd(a),Ad(a)):dc("Unknown control packet command: "+d)}else"d"==d&&a.tc(c)}else if(b===a.w)if(d=kc("t",c),c=kc("d",c),"c"==d)"t"in c&&(c=c.t,"a"===c?Bd(a):"r"===c?(a.e("Got a reset on secondary, closing it"),a.w.close(),a.cc!==a.w&&a.$b!==a.w||a.close()):"o"===c&&(a.e("got pong on secondary."),
a.Yd--,Bd(a)));else if("d"==d)a.wc.push(c);else throw Error("Unknown protocol layer: "+d);else a.e("message on old connection")}}rd.prototype.Zd=function(a){Ed(this,{t:"d",d:a})};function xd(a){a.cc===a.w&&a.$b===a.w&&(a.e("cleaning up and promoting a connection: "+a.w.Wc),a.C=a.w,a.w=null)}
function Bd(a){0>=a.Yd?(a.e("Secondary connection is healthy."),a.Sa=!0,a.w.nc(),a.w.start(),a.e("sending client ack on secondary"),a.w.send({t:"c",d:{t:"a",d:{}}}),a.e("Ending transmission on primary"),a.C.send({t:"c",d:{t:"n",d:{}}}),a.cc=a.w,xd(a)):(a.e("sending ping on secondary."),a.w.send({t:"c",d:{t:"p",d:{}}}))}rd.prototype.tc=function(a){zd(this);this.ob(a)};function zd(a){a.Sa||(a.qd--,0>=a.qd&&(a.e("Primary connection is healthy."),a.Sa=!0,a.C.nc()))}
function wd(a,b){a.w=new b("c:"+a.id+":"+a.Dd++,a.D,a.Gc);a.Yd=b.responsesRequiredToBeHealthy||0;a.w.open(td(a,a.w),ud(a,a.w));setTimeout(function(){a.w&&(a.e("Timed out trying to upgrade."),a.w.close())},Math.floor(6E4))}function vd(a,b,c){a.e("Realtime connection established.");a.C=b;a.oa=1;a.Nb&&(a.Nb(c),a.Nb=null);0===a.qd?(a.e("Primary connection is healthy."),a.Sa=!0):setTimeout(function(){Ad(a)},Math.floor(5E3))}
function Ad(a){a.Sa||1!==a.oa||(a.e("sending ping on primary."),Ed(a,{t:"c",d:{t:"p",d:{}}}))}function Ed(a,b){if(1!==a.oa)throw"Connection is not connected";a.cc.send(b)}rd.prototype.close=function(){2!==this.oa&&(this.e("Closing realtime connection."),this.oa=2,yd(this),this.U&&(this.U(),this.U=null))};function yd(a){a.e("Shutting down all connections");a.C&&(a.C.close(),a.C=null);a.w&&(a.w.close(),a.w=null);a.kc&&(clearTimeout(a.kc),a.kc=null)};function Fd(a){var b={},c={},d={},e="";try{var f=a.split("."),b=ua(Xb(f[0])||""),c=ua(Xb(f[1])||""),e=f[2],d=c.d||{};delete c.d}catch(g){}return{bf:b,Uc:c,data:d,Ue:e}}function Gd(a){a=Fd(a).Uc;return"object"===typeof a&&a.hasOwnProperty("iat")?B(a,"iat"):null}function Hd(a){a=Fd(a);var b=a.Uc;return!!a.Ue&&!!b&&"object"===typeof b&&b.hasOwnProperty("iat")};function Id(a,b,c,d,e){this.id=Jd++;this.e=cc("p:"+this.id+":");this.Za=!0;this.ja={};this.V=[];this.Pb=0;this.Mb=[];this.T=!1;this.va=1E3;this.oc=3E5;this.uc=b||ca;this.sc=c||ca;this.nd=d||ca;this.dd=e||ca;this.D=a;this.ud=null;this.Xb={};this.Oe=0;this.Ib=this.hd=null;Kd(this,0);Gc.ib().Ua("visible",this.Je,this);-1===a.host.indexOf("fblocal")&&Hc.ib().Ua("online",this.He,this)}var Jd=0,Ld=0;k=Id.prototype;
k.Ja=function(a,b,c){var d=++this.Oe;a={r:d,a:a,b:b};this.e(u(a));v(this.T,"sendRequest_ call when we're not connected not allowed.");this.ma.Zd(a);c&&(this.Xb[d]=c)};function Md(a,b,c){var d=b.toString(),e=b.path().toString();a.ja[e]=a.ja[e]||{};v(!a.ja[e][d],"listen() called twice for same path/queryId.");a.ja[e][d]={qb:b.qb(),G:c};a.T&&Nd(a,e,d,b.qb(),c)}
function Nd(a,b,c,d,e){a.e("Listen on "+b+" for "+c);var f={p:b};d=Fb(d,function(a){return Ra(a)});"{}"!==c&&(f.q=d);f.h=a.dd(b);a.Ja("l",f,function(d){a.e("listen response",d);d=d.s;"ok"!==d&&Od(a,b,c);e&&e(d)})}k.I=function(a,b,c){this.bb={re:a,Id:!1,ca:b,fc:c};this.e("Authenticating using credential: "+a);Pd(this);(b=40==a.length)||(a=Fd(a).Uc,b="object"===typeof a&&!0===B(a,"admin"));b&&(this.e("Admin auth credential detected.  Reducing max reconnect time."),this.oc=3E4)};
k.Bd=function(a){delete this.bb;this.T&&this.Ja("unauth",{},function(b){a(b.s,b.d)})};function Pd(a){var b=a.bb;a.T&&b&&a.Ja("auth",{cred:b.re},function(c){var d=c.s;c=c.d||"error";"ok"!==d&&a.bb===b&&delete a.bb;b.Id?"ok"!==d&&b.fc&&b.fc(d,c):(b.Id=!0,b.ca&&b.ca(d,c))})}function Qd(a,b,c,d){b=b.toString();Od(a,b,c)&&a.T&&Rd(a,b,c,d)}function Rd(a,b,c,d){a.e("Unlisten on "+b+" for "+c);b={p:b};d=Fb(d,function(a){return Ra(a)});"{}"!==c&&(b.q=d);a.Ja("u",b)}
function Sd(a,b,c,d){a.T?Td(a,"o",b,c,d):a.Mb.push({Rb:b,action:"o",data:c,G:d})}function Ud(a,b,c,d){a.T?Td(a,"om",b,c,d):a.Mb.push({Rb:b,action:"om",data:c,G:d})}k.ld=function(a,b){this.T?Td(this,"oc",a,null,b):this.Mb.push({Rb:a,action:"oc",data:null,G:b})};function Td(a,b,c,d,e){c={p:c,d:d};a.e("onDisconnect "+b,c);a.Ja(b,c,function(a){e&&setTimeout(function(){e(a.s,a.d)},Math.floor(0))})}k.put=function(a,b,c,d){Vd(this,"p",a,b,c,d)};function Wd(a,b,c,d){Vd(a,"m",b,c,d,void 0)}
function Vd(a,b,c,d,e,f){c={p:c,d:d};l(f)&&(c.h=f);a.V.push({action:b,Vd:c,G:e});a.Pb++;b=a.V.length-1;a.T&&Xd(a,b)}function Xd(a,b){var c=a.V[b].action,d=a.V[b].Vd,e=a.V[b].G;a.V[b].Le=a.T;a.Ja(c,d,function(d){a.e(c+" response",d);delete a.V[b];a.Pb--;0===a.Pb&&(a.V=[]);e&&e(d.s,d.d)})}
k.tc=function(a){if("r"in a){this.e("from server: "+u(a));var b=a.r,c=this.Xb[b];c&&(delete this.Xb[b],c(a.b))}else{if("error"in a)throw"A server-side error has occurred: "+a.error;"a"in a&&(b=a.a,c=a.b,this.e("handleServerMessage",b,c),"d"===b?this.uc(c.p,c.d,!1):"m"===b?this.uc(c.p,c.d,!0):"c"===b?Yd(this,c.p,c.q):"ac"===b?(a=c.s,b=c.d,c=this.bb,delete this.bb,c&&c.fc&&c.fc(a,b)):"sd"===b?this.ud?this.ud(c):"msg"in c&&"undefined"!==typeof console&&console.log("FIREBASE: "+c.msg.replace("\n","\nFIREBASE: ")):
dc("Unrecognized action received from server: "+u(b)+"\nAre you using the latest client?"))}};k.Nb=function(a){this.e("connection ready");this.T=!0;this.Ib=(new Date).getTime();this.nd({serverTimeOffset:a-(new Date).getTime()});Pd(this);for(var b in this.ja)for(var c in this.ja[b])a=this.ja[b][c],Nd(this,b,c,a.qb,a.G);for(b=0;b<this.V.length;b++)this.V[b]&&Xd(this,b);for(;this.Mb.length;)b=this.Mb.shift(),Td(this,b.action,b.Rb,b.data,b.G);this.sc(!0)};
function Kd(a,b){v(!a.ma,"Scheduling a connect when we're already connected/ing?");a.gb&&clearTimeout(a.gb);a.gb=setTimeout(function(){a.gb=null;Zd(a)},Math.floor(b))}k.Je=function(a){a&&!this.xb&&this.va===this.oc&&(this.e("Window became visible.  Reducing delay."),this.va=1E3,this.ma||Kd(this,0));this.xb=a};
k.He=function(a){a?(this.e("Browser went online.  Reconnecting."),this.va=1E3,this.Za=!0,this.ma||Kd(this,0)):(this.e("Browser went offline.  Killing connection; don't reconnect."),this.Za=!1,this.ma&&this.ma.close())};
k.Qd=function(){this.e("data client disconnected");this.T=!1;this.ma=null;for(var a=0;a<this.V.length;a++){var b=this.V[a];b&&"h"in b.Vd&&b.Le&&(b.G&&b.G("disconnect"),delete this.V[a],this.Pb--)}0===this.Pb&&(this.V=[]);if(this.Za)this.xb?this.Ib&&(3E4<(new Date).getTime()-this.Ib&&(this.va=1E3),this.Ib=null):(this.e("Window isn't visible.  Delaying reconnect."),this.va=this.oc,this.hd=(new Date).getTime()),a=Math.max(0,this.va-((new Date).getTime()-this.hd)),a*=Math.random(),this.e("Trying to reconnect in "+
a+"ms"),Kd(this,a),this.va=Math.min(this.oc,1.3*this.va);else for(var c in this.Xb)delete this.Xb[c];this.sc(!1)};function Zd(a){if(a.Za){a.e("Making a connection attempt");a.hd=(new Date).getTime();a.Ib=null;var b=r(a.tc,a),c=r(a.Nb,a),d=r(a.Qd,a),e=a.id+":"+Ld++;a.ma=new rd(e,a.D,b,c,d,function(b){O(b+" ("+a.D.toString()+")");a.Za=!1})}}k.Qa=function(){this.Za=!1;this.ma?this.ma.close():(this.gb&&(clearTimeout(this.gb),this.gb=null),this.T&&this.Qd())};
k.tb=function(){this.Za=!0;this.va=1E3;this.T||Kd(this,0)};function Yd(a,b,c){c=c?Fb(c,function(a){return Sa(a)}).join("$"):"{}";(a=Od(a,b,c))&&a.G&&a.G("permission_denied")}function Od(a,b,c){b=(new H(b)).toString();c||(c="{}");var d=a.ja[b][c];delete a.ja[b][c];return d};function $d(){this.o=this.H=null}$d.prototype.rb=function(a,b){if(a.f())this.H=b,this.o=null;else if(null!==this.H)this.H=this.H.Ba(a,b);else{null==this.o&&(this.o=new dd);var c=D(a);this.o.contains(c)||this.o.add(c,new $d);c=this.o.get(c);a=Ta(a);c.rb(a,b)}};
function ae(a,b){if(b.f())return a.H=null,a.o=null,!0;if(null!==a.H){if(a.H.Q())return!1;var c=a.H;a.H=null;c.B(function(b,c){a.rb(new H(b),c)});return ae(a,b)}return null!==a.o?(c=D(b),b=Ta(b),a.o.contains(c)&&ae(a.o.get(c),b)&&a.o.remove(c),a.o.f()?(a.o=null,!0):!1):!0}function be(a,b,c){null!==a.H?c(b,a.H):a.B(function(a,e){var f=new H(b.toString()+"/"+a);be(e,f,c)})}$d.prototype.B=function(a){null!==this.o&&ed(this.o,function(b,c){a(b,c)})};function ce(){this.ba=Q}function U(a,b){return a.ba.N(b)}function V(a,b,c){a.ba=a.ba.Ba(b,c)}ce.prototype.toString=function(){return this.ba.toString()};function de(){this.wa=new ce;this.O=new ce;this.qa=new ce;this.Sb=new Xa}function ee(a,b,c){V(a.wa,b,c);return fe(a,b)}function fe(a,b){for(var c=U(a.wa,b),d=U(a.O,b),e=I(a.Sb,b),f=!1,g=e;null!==g;){if(null!==g.k()){f=!0;break}g=g.parent()}if(f)return!1;c=ge(c,d,e);return c!==d?(V(a.O,b,c),!0):!1}function ge(a,b,c){if(c.f())return a;if(null!==c.k())return b;a=a||Q;c.B(function(d){d=d.name();var e=a.P(d),f=b.P(d),g=I(c,d),e=ge(e,f,g);a=a.K(d,e)});return a}
de.prototype.set=function(a,b){var c=this,d=[];Db(b,function(a){var b=a.path;a=a.ua;var g=Wb();Ya(I(c.Sb,b),g);V(c.O,b,a);d.push({path:b,Re:g})});return d};function he(a,b){Db(b,function(b){var d=b.Re;b=I(a.Sb,b.path);var e=b.k();v(null!==e,"pendingPut should not be null.");e===d&&Ya(b,null)})};function ie(a,b){return a&&"object"===typeof a?(v(".sv"in a,"Unexpected leaf node or priority contents"),b[a[".sv"]]):a}function je(a,b){var c=new $d;be(a,new H(""),function(a,e){c.rb(a,ke(e,b))});return c}function ke(a,b){var c=ie(a.m(),b),d;if(a.Q()){var e=ie(a.k(),b);return e!==a.k()||c!==a.m()?new tc(e,c):a}d=a;c!==a.m()&&(d=d.La(c));a.B(function(a,c){var e=ke(c,b);e!==c&&(d=d.K(a,e))});return d};var le="auth.firebase.com";function me(a,b,c){this.hc=a||{};this.Lc=b||{};this.ub=c||{};this.hc.remember||(this.hc.remember="default")}var ne=["remember","redirectTo"];function oe(a){var b={},c={};za(a||{},function(a,e){0<=Cb(ne,a)?b[a]=e:c[a]=e});return new me(b,{},c)};var pe={NETWORK_ERROR:"Unable to contact the Firebase server.",SERVER_ERROR:"An unknown server error occurred.",TRANSPORT_UNAVAILABLE:"There are no login transports available for the requested method.",REQUEST_INTERRUPTED:"The browser redirected the page before the login request could complete.",USER_CANCELLED:"The user cancelled authentication."};function W(a){var b=Error(B(pe,a),a);b.code=a;return b};function qe(){var a=window.opener.frames,b;for(b=a.length-1;0<=b;b--)try{if(a[b].location.protocol===window.location.protocol&&a[b].location.host===window.location.host&&"__winchan_relay_frame"===a[b].name)return a[b]}catch(c){}return null}function re(a,b,c){a.attachEvent?a.attachEvent("on"+b,c):a.addEventListener&&a.addEventListener(b,c,!1)}function se(a,b,c){a.detachEvent?a.detachEvent("on"+b,c):a.removeEventListener&&a.removeEventListener(b,c,!1)}
function te(a){/^https?:\/\//.test(a)||(a=window.location.href);var b=/^(https?:\/\/[\-_a-zA-Z\.0-9:]+)/.exec(a);return b?b[1]:a}function ue(a){var b="";try{a=a.replace("#","");var c={},d=a.replace(/^\?/,"").split("&");for(a=0;a<d.length;a++)if(d[a]){var e=d[a].split("=");c[e[0]]=e[1]}c&&A(c,"__firebase_request_key")&&(b=B(c,"__firebase_request_key"))}catch(f){}return b}
function ve(a){var b=[],c;for(c in a)if(A(a,c)){var d=B(a,c);if(fa(d))for(var e=0;e<d.length;e++)b.push(encodeURIComponent(c)+"="+encodeURIComponent(d[e]));else b.push(encodeURIComponent(c)+"="+encodeURIComponent(B(a,c)))}return b.join("&")}function we(){var a=fc(le);return a.scheme+"://"+a.host+"/v2"};function xe(){return!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(navigator.userAgent)}function ye(){var a=navigator.userAgent;if("Microsoft Internet Explorer"===navigator.appName){if((a=a.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/))&&1<a.length)return 8<=parseFloat(a[1])}else if(-1<a.indexOf("Trident")&&(a=a.match(/rv:([0-9]{2,2}[\.0-9]{0,})/))&&1<a.length)return 8<=parseFloat(a[1]);return!1};function ze(a){a=a||{};a.method||(a.method="GET");a.headers||(a.headers={});a.headers.content_type||(a.headers.content_type="application/json");a.headers.content_type=a.headers.content_type.toLowerCase();this.options=a}
ze.prototype.open=function(a,b,c){function d(){c&&(c(W("REQUEST_INTERRUPTED")),c=null)}var e=new XMLHttpRequest,f=this.options.method.toUpperCase(),g;re(window,"beforeunload",d);e.onreadystatechange=function(){if(c&&4===e.readyState){var a;if(200<=e.status&&300>e.status){try{a=ua(e.responseText)}catch(b){}c(null,a)}else 500<=e.status&&600>e.status?c(W("SERVER_ERROR")):c(W("NETWORK_ERROR"));c=null;se(window,"beforeunload",d)}};if("GET"===f)a+=(/\?/.test(a)?"":"?")+ve(b),g=null;else{var h=this.options.headers.content_type;
"application/json"===h&&(g=u(b));"application/x-www-form-urlencoded"===h&&(g=ve(b))}e.open(f,a,!0);a={"X-Requested-With":"XMLHttpRequest",Accept:"application/json;text/plain"};Mc(a,this.options.headers);for(var m in a)e.setRequestHeader(m,a[m]);e.send(g)};ze.isAvailable=function(){return!!window.XMLHttpRequest&&"string"===typeof(new XMLHttpRequest).responseType&&(!(navigator.userAgent.match(/MSIE/)||navigator.userAgent.match(/Trident/))||ye())};ze.prototype.Ab=function(){return"json"};function Ae(a){a=a||{};this.Yb=Bb()+Bb()+Bb();this.Rd=a||{}}
Ae.prototype.open=function(a,b,c){function d(){c&&(c(W("USER_CANCELLED")),c=null)}var e=this,f=fc(le),g;b.requestId=this.Yb;b.redirectTo=f.scheme+"://"+f.host+"/blank/page.html";a+=/\?/.test(a)?"":"?";a+=ve(b);(g=window.open(a,"_blank","location=no"))&&ia(g.addEventListener)?(g.addEventListener("loadstart",function(a){var b;if(b=a&&a.url)a:{var f=a.url;try{var q=document.createElement("a");q.href=f;b=q.host===fc(le).host&&"/blank/page.html"===q.pathname;break a}catch(s){}b=!1}b&&(a=ue(a.url),g.removeEventListener("exit",
d),g.close(),a=new me(null,null,{requestId:e.Yb,requestKey:a}),e.Rd.requestWithCredential("/auth/session",a,c),c=null)}),g.addEventListener("exit",d)):c(W("TRANSPORT_UNAVAILABLE"))};Ae.isAvailable=function(){return xe()};Ae.prototype.Ab=function(){return"redirect"};function Be(a){a=a||{};if(!a.window_features||-1!==navigator.userAgent.indexOf("Fennec/")||-1!==navigator.userAgent.indexOf("Firefox/")&&-1!==navigator.userAgent.indexOf("Android"))a.window_features=void 0;a.window_name||(a.window_name="_blank");a.relay_url||(a.relay_url=we()+"/auth/channel");this.options=a}
Be.prototype.open=function(a,b,c){function d(a){g&&(document.body.removeChild(g),g=void 0);q&&(q=clearInterval(q));se(window,"message",e);se(window,"unload",d);if(n&&!a)try{n.close()}catch(b){h.postMessage("die",m)}n=h=void 0}function e(a){if(a.origin===m)try{var b=ua(a.data);"ready"===b.a?h.postMessage(s,m):"error"===b.a?(d(!1),c&&(c(b.d),c=null)):"response"===b.a&&(d(b.forceKeepWindowOpen),c&&(c(null,b.d),c=null))}catch(e){}}var f=ye(),g,h,m=te(a);if(m!==te(this.options.relay_url))c&&setTimeout(function(){c(Error("invalid arguments: origin of url and relay_url must match"))},
0);else{f&&(g=document.createElement("iframe"),g.setAttribute("src",this.options.relay_url),g.style.display="none",g.setAttribute("name","__winchan_relay_frame"),document.body.appendChild(g),h=g.contentWindow);a+=(/\?/.test(a)?"":"?")+ve(b);var n=window.open(a,this.options.window_name,this.options.window_features);h||(h=n);var q=setInterval(function(){n&&n.closed&&(d(!1),c&&(c(W("USER_CANCELLED")),c=null))},500),s=u({a:"request",d:b});re(window,"unload",d);re(window,"message",e)}};
Be.isAvailable=function(){return"postMessage"in window&&!/^file:\//.test(location.href)&&!(xe()||navigator.userAgent.match(/Windows Phone/)||window.Windows&&/^ms-appx:/.test(location.href)||navigator.userAgent.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i)||navigator.userAgent.match(/CriOS/)||navigator.userAgent.match(/Twitter for iPhone/)||navigator.userAgent.match(/FBAN\/FBIOS/)||window.navigator.standalone)&&!navigator.userAgent.match(/PhantomJS/)};Be.prototype.Ab=function(){return"popup"};function Ce(a){a=a||{};a.callback_parameter||(a.callback_parameter="callback");this.options=a;window.__firebase_auth_jsonp=window.__firebase_auth_jsonp||{}}
Ce.prototype.open=function(a,b,c){function d(){c&&(c(W("REQUEST_INTERRUPTED")),c=null)}function e(){setTimeout(function(){delete window.__firebase_auth_jsonp[f];Jc(window.__firebase_auth_jsonp)&&delete window.__firebase_auth_jsonp;try{var a=document.getElementById(f);a&&a.parentNode.removeChild(a)}catch(b){}},1);se(window,"beforeunload",d)}var f="fn"+(new Date).getTime()+Math.floor(99999*Math.random());b[this.options.callback_parameter]="__firebase_auth_jsonp."+f;a+=(/\?/.test(a)?"":"?")+ve(b);re(window,
"beforeunload",d);window.__firebase_auth_jsonp[f]=function(a){c&&(c(null,a),c=null);e()};De(f,a,c)};function De(a,b,c){setTimeout(function(){try{var d=document.createElement("script");d.type="text/javascript";d.id=a;d.async=!0;d.src=b;d.onerror=function(){var b=document.getElementById(a);null!==b&&b.parentNode.removeChild(b);c&&c(W("NETWORK_ERROR"))};var e=document.getElementsByTagName("head");(e&&0!=e.length?e[0]:document.documentElement).appendChild(d)}catch(f){c&&c(W("NETWORK_ERROR"))}},0)}
Ce.isAvailable=function(){return!xe()};Ce.prototype.Ab=function(){return"json"};function Ee(a,b){this.pd=["session",a.yc,a.Ta].join(":");this.Ic=b}Ee.prototype.set=function(a,b){if(!b)if(this.Ic.length)b=this.Ic[0];else throw Error("fb.login.SessionManager : No storage options available!");b.set(this.pd,a)};Ee.prototype.get=function(){var a=Fb(this.Ic,r(this.we,this)),a=Eb(a,function(a){return null!==a});Jb(a,function(a,c){return Gd(c.token)-Gd(a.token)});return 0<a.length?a.shift():null};Ee.prototype.we=function(a){try{var b=a.get(this.pd);if(b&&b.token)return b}catch(c){}return null};
Ee.prototype.clear=function(){var a=this;Db(this.Ic,function(b){b.remove(a.pd)})};function Fe(a){a=a||{};this.Yb=Bb()+Bb()+Bb();this.Rd=a||{}}Fe.prototype.open=function(a,b){J.set("redirect_request_id",this.Yb);b.requestId=this.Yb;b.redirectTo=b.redirectTo||window.location.href;a+=(/\?/.test(a)?"":"?")+ve(b);window.location=a};Fe.isAvailable=function(){return!/^file:\//.test(location.href)&&!xe()};Fe.prototype.Ab=function(){return"redirect"};function Ge(a,b,c,d){Ec.call(this,["auth_status"]);this.D=a;this.Cd=b;this.Xe=c;this.jd=d;this.vb=new Ee(a,[vb,J]);this.Ma=null;He(this)}na(Ge,Ec);k=Ge.prototype;k.bd=function(){return this.Ma||null};function He(a){J.get("redirect_request_id")&&Ie(a);var b=a.vb.get();b&&b.token?(Je(a,b),a.Cd(b.token,function(c,d){Ke(a,c,d,!1,b.token,b)},function(b,d){Le(a,"resumeSession()",b,d)})):Je(a,null)}
function Me(a,b,c,d,e,f){"firebaseio-demo.com"===a.D.domain&&O("FirebaseRef.auth() not supported on demo Firebases (*.firebaseio-demo.com). Please use on production Firebases only (*.firebaseio.com).");a.Cd(b,function(f,h){Ke(a,f,h,!0,b,c,d||{},e)},function(b,c){Le(a,"auth()",b,c,f)})}function Ne(a,b){a.vb.clear();Je(a,null);a.Xe(function(a,d){if("ok"===a)P(b);else{var e=(a||"error").toUpperCase(),f=e;d&&(f+=": "+d);f=Error(f);f.code=e;P(b,f)}})}
function Ke(a,b,c,d,e,f,g,h){"ok"===b?(d&&(b=c.auth,f.auth=b,f.expires=c.expires,f.token=Hd(e)?e:"",c=null,b&&A(b,"uid")?c=B(b,"uid"):A(f,"uid")&&(c=B(f,"uid")),f.uid=c,c="custom",b&&A(b,"provider")?c=B(b,"provider"):A(f,"provider")&&(c=B(f,"provider")),f.provider=c,a.vb.clear(),Hd(e)&&(g=g||{},c=vb,"sessionOnly"===g.remember&&(c=J),"none"!==g.remember&&a.vb.set(f,c)),Je(a,f)),P(h,null,f)):(a.vb.clear(),Je(a,null),f=a=(b||"error").toUpperCase(),c&&(f+=": "+c),f=Error(f),f.code=a,P(h,f))}
function Le(a,b,c,d,e){O(b+" was canceled: "+d);a.vb.clear();Je(a,null);a=Error(d);a.code=c.toUpperCase();P(e,a)}function Oe(a,b,c,d,e){Pe(a);var f=[ze,Ce];c=new me(d,{},c);Qe(a,f,"/auth/"+b,c,e)}
function Re(a,b,c,d){Pe(a);var e=[Be,Ae];c=oe(c);"anonymous"===b||"password"===b?setTimeout(function(){P(d,W("TRANSPORT_UNAVAILABLE"))},0):(c.Lc.window_features="menubar=yes,modal=yes,alwaysRaised=yeslocation=yes,resizable=yes,scrollbars=yes,status=yes,height=625,width=625,top="+("object"===typeof screen?.5*(screen.height-625):0)+",left="+("object"===typeof screen?.5*(screen.width-625):0),c.Lc.relay_url=we()+"/"+a.D.Ta+"/auth/channel",c.Lc.requestWithCredential=r(a.Zb,a),Qe(a,e,"/auth/"+b,c,d))}
function Ie(a){var b=J.get("redirect_request_id");if(b){var c=J.get("redirect_client_options");J.remove("redirect_request_id");J.remove("redirect_client_options");var d=[ze,Ce],b={requestId:b,requestKey:ue(document.location.hash)},c=new me(c,{},b);try{document.location.hash=document.location.hash.replace(/&__firebase_request_key=([a-zA-z0-9]*)/,"")}catch(e){}Qe(a,d,"/auth/session",c)}}k.Xc=function(a,b){Pe(this);var c=oe(a);c.ub._method="POST";this.Zb("/users",c,function(a){P(b,a)})};
k.sd=function(a,b){var c=this;Pe(this);var d="/users/"+encodeURIComponent(a.email),e=oe(a);e.ub._method="DELETE";this.Zb(d,e,function(a,d){!a&&d&&d.uid&&c.Ma&&c.Ma.uid&&c.Ma.uid===d.uid&&Ne(c);P(b,a)})};k.Tc=function(a,b){Pe(this);var c="/users/"+encodeURIComponent(a.email)+"/password",d=oe(a);d.ub._method="PUT";d.ub.password=a.newPassword;this.Zb(c,d,function(a){P(b,a)})};
k.td=function(a,b){Pe(this);var c="/users/"+encodeURIComponent(a.email)+"/password",d=oe(a);d.ub._method="POST";this.Zb(c,d,function(a){P(b,a)})};k.Zb=function(a,b,c){Se(this,[ze,Ce],a,b,c)};function Qe(a,b,c,d,e){Se(a,b,c,d,function(b,c){!b&&c&&c.token&&c.uid?Me(a,c.token,c,d.hc,function(a,b){a?P(e,a):P(e,null,b)}):P(e,b||W("UNKNOWN_ERROR"))})}
function Se(a,b,c,d,e){b=Eb(b,function(a){return"function"===typeof a.isAvailable&&a.isAvailable()});0===b.length?setTimeout(function(){P(e,W("TRANSPORT_UNAVAILABLE"))},0):(b=new (b.shift())(d.Lc),d=Aa(d.ub),d.v="js-1.1.3",d.transport=b.Ab(),d.suppress_status_codes=!0,a=we()+"/"+a.D.Ta+c,b.open(a,d,function(a,b){if(a)P(e,a);else if(b&&b.error){var c=Error(b.error.message);c.code=b.error.code;c.details=b.error.details;P(e,c)}else P(e,null,b)}))}
function Je(a,b){var c=null!==a.Ma||null!==b;a.Ma=b;c&&a.Mc("auth_status",b);a.jd(null!==b)}k.cd=function(a){v("auth_status"===a,'initial event must be of type "auth_status"');return[this.Ma]};function Pe(a){var b=a.D;if("firebaseio.com"!==b.domain&&"firebaseio-demo.com"!==b.domain&&"auth.firebase.com"===le)throw Error("This custom Firebase server ('"+a.D.domain+"') does not support delegated login.");};function Te(){this.hb=[]}function Ue(a,b){if(0!==b.length)for(var c=0;c<b.length;c++)a.hb.push(b[c])}Te.prototype.Vb=function(){for(var a=0;a<this.hb.length;a++)if(this.hb[a]){var b=this.hb[a];this.hb[a]=null;Ve(b)}this.hb=[]};function Ve(a){var b=a.ca,c=a.$d,d=a.Ub;sc(function(){b(c,d)})};function X(a,b,c,d){this.type=a;this.xa=b;this.da=c;this.Ub=d};function We(a){this.S=a;this.sa=[];this.Zc=new Te}function Xe(a,b,c,d,e){a.sa.push({type:b,ca:c,cancel:d,$:e});d=[];var f=Ye(a.j);a.Gb&&f.push(new X("value",a.j));for(var g=0;g<f.length;g++)if(f[g].type===b){var h=new G(a.S.i,a.S.path);f[g].da&&(h=h.J(f[g].da));d.push({ca:oc(c,e),$d:new T(f[g].xa,h),Ub:f[g].Ub})}Ue(a.Zc,d)}We.prototype.Ac=function(a,b){b=this.Bc(a,b);null!=b&&Ze(this,b)};
function Ze(a,b){for(var c=[],d=0;d<b.length;d++){var e=b[d],f=e.type,g=new G(a.S.i,a.S.path);b[d].da&&(g=g.J(b[d].da));g=new T(b[d].xa,g);"value"!==e.type||g.Fb()?"value"!==e.type&&(f+=" "+g.name()):f+="("+g.X()+")";M(a.S.i.n.id+": event:"+a.S.path+":"+a.S.Wa()+":"+f);for(f=0;f<a.sa.length;f++){var h=a.sa[f];b[d].type===h.type&&c.push({ca:oc(h.ca,h.$),$d:g,Ub:e.Ub})}}Ue(a.Zc,c)}We.prototype.Vb=function(){this.Zc.Vb()};
function Ye(a){var b=[];if(!a.Q()){var c=null;a.B(function(a,e){b.push(new X("child_added",e,a,c));c=a})}return b}function $e(a){a.Gb||(a.Gb=!0,Ze(a,[new X("value",a.j)]))};function af(a,b){We.call(this,a);this.j=b}na(af,We);af.prototype.Bc=function(a,b){this.j=a;this.Gb&&null!=b&&b.push(new X("value",this.j));return b};af.prototype.Eb=function(){return{}};function bf(a,b){this.jc=a;this.kd=b}function cf(a,b,c,d,e){var f=a.N(c),g=b.N(c);d=new bf(d,e);e=df(d,c,f,g);g=!f.f()&&!g.f()&&f.m()!==g.m();if(e||g)for(f=c,c=e;null!==f.parent();){var h=a.N(f);e=b.N(f);var m=f.parent();if(!d.jc||I(d.jc,m).k()){var n=b.N(m),q=[],f=Ua(f);h.f()?(h=n.ha(f,e),q.push(new X("child_added",e,f,h))):e.f()?q.push(new X("child_removed",h,f)):(h=n.ha(f,e),g&&q.push(new X("child_moved",e,f,h)),c&&q.push(new X("child_changed",e,f,h)));d.kd(m,n,q)}g&&(g=!1,c=!0);f=m}}
function df(a,b,c,d){var e,f=[];c===d?e=!1:c.Q()&&d.Q()?e=c.k()!==d.k():c.Q()?(ef(a,b,Q,d,f),e=!0):d.Q()?(ef(a,b,c,Q,f),e=!0):e=ef(a,b,c,d,f);e?a.kd(b,d,f):c.m()!==d.m()&&a.kd(b,d,null);return e}
function ef(a,b,c,d,e){var f=!1,g=!a.jc||!I(a.jc,b).f(),h=[],m=[],n=[],q=[],s={},t={},w,aa,K,N;w=c.jb();K=gb(w);aa=d.jb();for(N=gb(aa);null!==K||null!==N;){c=N;c=null===K?1:null===c?-1:K.key===c.key?0:vc({name:K.key,la:K.value.m()},{name:c.key,la:c.value.m()});if(0>c)f=B(s,K.key),l(f)?(n.push({ad:K,zd:h[f]}),h[f]=null):(t[K.key]=m.length,m.push(K)),f=!0,K=gb(w);else{if(0<c)f=B(t,N.key),l(f)?(n.push({ad:m[f],zd:N}),m[f]=null):(s[N.key]=h.length,h.push(N)),f=!0;else{c=b.J(N.key);if(c=df(a,c,K.value,
N.value))q.push(N),f=!0;K.value.m()!==N.value.m()&&(n.push({ad:K,zd:N}),f=!0);K=gb(w)}N=gb(aa)}if(!g&&f)return!0}for(g=0;g<m.length;g++)if(s=m[g])c=b.J(s.key),df(a,c,s.value,Q),e.push(new X("child_removed",s.value,s.key));for(g=0;g<h.length;g++)if(s=h[g])c=b.J(s.key),m=d.ha(s.key,s.value),df(a,c,Q,s.value),e.push(new X("child_added",s.value,s.key,m));for(g=0;g<n.length;g++)s=n[g].ad,h=n[g].zd,c=b.J(h.key),m=d.ha(h.key,h.value),e.push(new X("child_moved",h.value,h.key,m)),(c=df(a,c,s.value,h.value))&&
q.push(h);for(g=0;g<q.length;g++)a=q[g],m=d.ha(a.key,a.value),e.push(new X("child_changed",a.value,a.key,m));return f};function ff(){this.Z=this.Aa=null;this.set={}}na(ff,dd);k=ff.prototype;k.setActive=function(a){this.Aa=a};function gf(a,b,c){a.add(b,c);a.Z||(a.Z=c.S.path)}function hf(a){var b=a.Aa;a.Aa=null;return b}function jf(a){return a.contains("default")}function kf(a){return null!=a.Aa&&jf(a)}k.defaultView=function(){return jf(this)?this.get("default"):null};k.path=function(){return this.Z};k.toString=function(){return Fb(this.keys(),function(a){return"default"===a?"{}":a}).join("$")};
k.qb=function(){var a=[];ed(this,function(b,c){a.push(c.S)});return a};function lf(a,b){We.call(this,a);this.j=Q;this.Bc(b,Ye(b))}na(lf,We);
lf.prototype.Bc=function(a,b){if(null===b)return b;var c=[],d=this.S;l(d.fa)&&(l(d.za)&&null!=d.za?c.push(function(a,b){var c=hc(b,d.fa);return 0<c||0===c&&0<=ic(a,d.za)}):c.push(function(a,b){return 0<=hc(b,d.fa)}));l(d.Ea)&&(l(d.fb)?c.push(function(a,b){var c=hc(b,d.Ea);return 0>c||0===c&&0>=ic(a,d.fb)}):c.push(function(a,b){return 0>=hc(b,d.Ea)}));var e=null,f=null;if(l(this.S.Ga))if(l(this.S.fa)){if(e=mf(a,c,this.S.Ga,!1)){var g=a.P(e).m();c.push(function(a,b){var c=hc(b,g);return 0>c||0===c&&
0>=ic(a,e)})}}else if(f=mf(a,c,this.S.Ga,!0)){var h=a.P(f).m();c.push(function(a,b){var c=hc(b,h);return 0<c||0===c&&0<=ic(a,f)})}for(var m=[],n=[],q=[],s=[],t=0;t<b.length;t++){var w=b[t].da,aa=b[t].xa;switch(b[t].type){case "child_added":nf(c,w,aa)&&(this.j=this.j.K(w,aa),n.push(b[t]));break;case "child_removed":this.j.P(w).f()||(this.j=this.j.K(w,null),m.push(b[t]));break;case "child_changed":!this.j.P(w).f()&&nf(c,w,aa)&&(this.j=this.j.K(w,aa),s.push(b[t]));break;case "child_moved":var K=!this.j.P(w).f(),
N=nf(c,w,aa);K?N?(this.j=this.j.K(w,aa),q.push(b[t])):(m.push(new X("child_removed",this.j.P(w),w)),this.j=this.j.K(w,null)):N&&(this.j=this.j.K(w,aa),n.push(b[t]))}}var Cd=e||f;if(Cd){var Dd=(t=null!==f)?this.j.Jd():this.j.Kd(),Pc=!1,rb=!1,sb=this;(t?a.$c:a.B).call(a,function(a,b){rb||null!==Dd||(rb=!0);if(rb&&Pc)return!0;Pc?(m.push(new X("child_removed",sb.j.P(a),a)),sb.j=sb.j.K(a,null)):rb&&(n.push(new X("child_added",b,a)),sb.j=sb.j.K(a,b));Dd===a&&(rb=!0);a===Cd&&(Pc=!0)})}for(t=0;t<n.length;t++)c=
n[t],w=this.j.ha(c.da,c.xa),m.push(new X("child_added",c.xa,c.da,w));for(t=0;t<q.length;t++)c=q[t],w=this.j.ha(c.da,c.xa),m.push(new X("child_moved",c.xa,c.da,w));for(t=0;t<s.length;t++)c=s[t],w=this.j.ha(c.da,c.xa),m.push(new X("child_changed",c.xa,c.da,w));this.Gb&&0<m.length&&m.push(new X("value",this.j));return m};function mf(a,b,c,d){if(a.Q())return null;var e=null;(d?a.$c:a.B).call(a,function(a,d){if(nf(b,a,d)&&(e=a,c--,0===c))return!0});return e}
function nf(a,b,c){for(var d=0;d<a.length;d++)if(!a[d](b,c.m()))return!1;return!0}lf.prototype.ed=function(a){return this.j.P(a)!==Q};
lf.prototype.Eb=function(a,b,c){var d={};this.j.Q()||this.j.B(function(a){d[a]=3});var e=this.j;c=U(c,new H(""));var f=new Xa;Ya(I(f,this.S.path),!0);b=Q.Ba(a,b);var g=this;cf(c,b,a,f,function(a,b,c){null!==c&&a.toString()===g.S.path.toString()&&g.Bc(b,c)});this.j.Q()?nc(d,function(a,b){d[b]=2}):(this.j.B(function(a){A(d,a)||(d[a]=1)}),nc(d,function(a,b){g.j.P(b).f()&&(d[b]=2)}));this.j=e;return d};function of(a,b){this.n=a;this.g=b;this.rc=b.ba;this.pa=new Xa}of.prototype.ec=function(a,b,c,d,e){var f=a.path,g=I(this.pa,f),h=g.k();null===h?(h=new ff,Ya(g,h)):v(!h.f(),"We shouldn't be storing empty QueryMaps");var m=a.Wa();if(h.contains(m))a=h.get(m),Xe(a,b,c,d,e);else{var n=this.g.ba.N(f);a=pf(a,n);qf(this,g,h,m,a);Xe(a,b,c,d,e);(b=(b=ab(I(this.pa,f),function(a){var b;if(b=a.k()&&a.k().defaultView())b=a.k().defaultView().Gb;if(b)return!0},!0))||null===this.n&&!U(this.g,f).f())&&$e(a)}a.Vb()};
function rf(a,b,c,d,e){var f=a.get(b),g;if(g=f){g=!1;for(var h=f.sa.length-1;0<=h;h--){var m=f.sa[h];if(!(c&&m.type!==c||d&&m.ca!==d||e&&m.$!==e)&&(f.sa.splice(h,1),g=!0,c&&d))break}}(c=g&&!(0<f.sa.length))&&a.remove(b);return c}function sf(a,b,c,d,e){b=b?b.Wa():null;var f=[];b&&"default"!==b?rf(a,b,c,d,e)&&f.push(b):Db(a.keys(),function(b){rf(a,b,c,d,e)&&f.push(b)});return f}of.prototype.Dc=function(a,b,c,d){var e=I(this.pa,a.path).k();return null===e?null:tf(this,e,a,b,c,d)};
function tf(a,b,c,d,e,f){var g=b.path(),g=I(a.pa,g);c=sf(b,c,d,e,f);b.f()&&Ya(g,null);d=uf(g);if(0<c.length&&!d){d=g;e=g.parent();for(c=!1;!c&&e;){if(f=e.k()){v(!kf(f));var h=d.name(),m=!1;ed(f,function(a,b){m=b.ed(h)||m});m&&(c=!0)}d=e;e=e.parent()}d=null;kf(b)||(b=hf(b),d=vf(a,g),b&&b());return c?null:d}return null}function wf(a,b,c){$a(I(a.pa,b),function(a){(a=a.k())&&ed(a,function(a,b){$e(b)})},c,!0)}
function xf(a,b,c){function d(a){do{if(g[a.toString()])return!0;a=a.parent()}while(null!==a);return!1}var e=a.rc,f=a.g.ba;a.rc=f;for(var g={},h=0;h<c.length;h++)g[c[h].toString()]=!0;cf(e,f,b,a.pa,function(c,e,f){if(b.contains(c)){var g=d(c);g&&wf(a,c,!1);a.Ac(c,e,f);g&&wf(a,c,!0)}else a.Ac(c,e,f)});d(b)&&wf(a,b,!0);yf(a,b)}function yf(a,b){var c=I(a.pa,b);$a(c,function(a){(a=a.k())&&ed(a,function(a,b){b.Vb()})},!0,!0);ab(c,function(a){(a=a.k())&&ed(a,function(a,b){b.Vb()})},!1)}
of.prototype.Ac=function(a,b,c){a=I(this.pa,a).k();null!==a&&ed(a,function(a,e){e.Ac(b,c)})};function uf(a){return ab(a,function(a){return a.k()&&kf(a.k())})}function qf(a,b,c,d,e){if(kf(c)||uf(b))gf(c,d,e);else{var f,g;c.f()||(f=c.toString(),g=c.qb());gf(c,d,e);c.setActive(zf(a,c));f&&g&&Qd(a.n,c.path(),f,g)}kf(c)&&$a(b,function(a){if(a=a.k())a.Aa&&a.Aa(),a.Aa=null})}
function vf(a,b){function c(b){var f=b.k();if(f&&jf(f))d.push(f.path()),null==f.Aa&&f.setActive(zf(a,f));else{if(f){null!=f.Aa||f.setActive(zf(a,f));var g={};ed(f,function(a,b){b.j.B(function(a){A(g,a)||(g[a]=!0,a=f.path().J(a),d.push(a))})})}b.B(c)}}var d=[];c(b);return d}
function zf(a,b){if(a.n){var c=a.n,d=b.path(),e=b.toString(),f=b.qb(),g,h=b.keys(),m=jf(b);Md(a.n,b,function(c){"ok"!==c?(c=qc(c),O("on() or once() for "+b.path().toString()+" failed: "+c.toString()),Af(a,b,c)):g||(m?wf(a,b.path(),!0):Db(h,function(a){(a=b.get(a))&&$e(a)}),yf(a,b.path()))});return function(){g=!0;Qd(c,d,e,f)}}return ca}function Af(a,b,c){b&&(ed(b,function(a,b){for(var f=0;f<b.sa.length;f++){var g=b.sa[f];g.cancel&&oc(g.cancel,g.$)(c)}}),tf(a,b))}
function pf(a,b){return"default"===a.Wa()?new af(a,b):new lf(a,b)}of.prototype.Eb=function(a,b,c,d){function e(a){nc(a,function(a,b){f[b]=3===a?3:(B(f,b)||a)===a?a:3})}var f={};ed(b,function(b,f){e(f.Eb(a,c,d))});c.Q()||c.B(function(a){A(f,a)||(f[a]=4)});return f};function Bf(a,b,c,d,e){var f=b.path();b=a.Eb(f,b,d,e);var g=Q,h=[];nc(b,function(b,n){var q=new H(n);3===b||1===b?g=g.K(n,d.N(q)):(2===b&&h.push({path:f.J(n),ua:Q}),h=h.concat(Cf(a,d.N(q),I(c,q),e)))});return[{path:f,ua:g}].concat(h)}
function Df(a,b,c,d){var e;a:{var f=I(a.pa,b);e=f.parent();for(var g=[];null!==e;){var h=e.k();if(null!==h){if(jf(h)){e=[{path:b,ua:c}];break a}h=a.Eb(b,h,c,d);f=B(h,f.name());if(3===f||1===f){e=[{path:b,ua:c}];break a}2===f&&g.push({path:b,ua:Q})}f=e;e=e.parent()}e=g}if(1==e.length&&(!e[0].ua.f()||c.f()))return e;g=I(a.pa,b);f=g.k();null!==f?jf(f)?e.push({path:b,ua:c}):e=e.concat(Bf(a,f,g,c,d)):e=e.concat(Cf(a,c,g,d));return e}
function Cf(a,b,c,d){var e=c.k();if(null!==e)return jf(e)?[{path:c.path(),ua:b}]:Bf(a,e,c,b,d);var f=[];c.B(function(c){var e=b.Q()?Q:b.P(c.name());c=Cf(a,e,c,d);f=f.concat(c)});return f};function Ef(a){this.D=a;this.ga=Uc(a);this.n=new Id(this.D,r(this.uc,this),r(this.sc,this),r(this.nd,this),r(this.dd,this));this.be=Vc(a,r(function(){return new Rc(this.ga,this.n)},this));this.$a=new Xa;this.Ka=new ce;this.g=new de;this.L=new of(this.n,this.g.qa);this.fd=new ce;this.gd=new of(null,this.fd);Ff(this,"connected",!1);this.U=new $d;this.I=new Ge(a,r(this.n.I,this.n),r(this.n.Bd,this.n),r(this.jd,this));this.ic=0}k=Ef.prototype;
k.toString=function(){return(this.D.Ya?"https://":"http://")+this.D.host};k.name=function(){return this.D.Ta};function Gf(a){a=U(a.fd,new H(".info/serverTimeOffset")).X()||0;return(new Date).getTime()+a}function Hf(a){a=a={timestamp:Gf(a)};a.timestamp=a.timestamp||(new Date).getTime();return a}
k.uc=function(a,b,c){this.ic++;this.Md&&(b=this.Md(a,b));var d,e,f=[];9<=a.length&&a.lastIndexOf(".priority")===a.length-9?(d=new H(a.substring(0,a.length-9)),e=U(this.g.wa,d).La(b),f.push(d)):c?(d=new H(a),e=U(this.g.wa,d),nc(b,function(a,b){var c=new H(b);".priority"===b?e=e.La(a):(e=e.Ba(c,S(a)),f.push(d.J(b)))})):(d=new H(a),e=S(b),f.push(d));a=Df(this.L,d,e,this.g.O);b=!1;for(c=0;c<a.length;++c){var g=a[c];b=ee(this.g,g.path,g.ua)||b}b&&(d=If(this,d));xf(this.L,d,f)};
k.sc=function(a){Ff(this,"connected",a);!1===a&&Jf(this)};k.nd=function(a){var b=this;mc(a,function(a,d){Ff(b,d,a)})};k.dd=function(a){a=new H(a);return U(this.g.wa,a).hash()};k.jd=function(a){Ff(this,"authenticated",a)};function Ff(a,b,c){b=new H("/.info/"+b);V(a.fd,b,S(c));xf(a.gd,b,[b])}
k.wb=function(a,b,c,d){this.e("set",{path:a.toString(),value:b,la:c});var e=Hf(this);b=S(b,c);var e=ke(b,e),e=Df(this.L,a,e,this.g.O),f=this.g.set(a,e),g=this;this.n.put(a.toString(),b.X(!0),function(b,c){"ok"!==b&&O("set at "+a+" failed: "+b);he(g.g,f);fe(g.g,a);var e=If(g,a);xf(g.L,e,[]);Kf(d,b,c)});e=Lf(this,a);If(this,e);xf(this.L,e,[a])};
k.update=function(a,b,c){this.e("update",{path:a.toString(),value:b});var d=U(this.g.qa,a),e=!0,f=[],g=Hf(this),h=[],m;for(m in b){var e=!1,n=S(b[m]),n=ke(n,g),d=d.K(m,n),q=a.J(m);f.push(q);n=Df(this.L,q,n,this.g.O);h=h.concat(this.g.set(a,n))}if(e)M("update() called with empty data.  Don't do anything."),Kf(c,"ok");else{var s=this;Wd(this.n,a.toString(),b,function(b,d){"ok"!==b&&O("update at "+a+" failed: "+b);he(s.g,h);fe(s.g,a);var e=If(s,a);xf(s.L,e,[]);Kf(c,b,d)});b=Lf(this,a);If(this,b);xf(s.L,
b,f)}};k.vd=function(a,b,c){this.e("setPriority",{path:a.toString(),la:b});var d=Hf(this),d=ie(b,d),d=U(this.g.O,a).La(d),d=Df(this.L,a,d,this.g.O),e=this.g.set(a,d),f=this;this.n.put(a.toString()+"/.priority",b,function(b,d){"permission_denied"===b&&O("setPriority at "+a+" failed: "+b);he(f.g,e);fe(f.g,a);var m=If(f,a);xf(f.L,m,[]);Kf(c,b,d)});b=If(this,a);xf(f.L,b,[])};
function Jf(a){a.e("onDisconnectEvents");var b=[],c=Hf(a);be(je(a.U,c),new H(""),function(c,e){var f=Df(a.L,c,e,a.g.O);b.push.apply(b,a.g.set(c,f));f=Lf(a,c);If(a,f);xf(a.L,f,[c])});he(a.g,b);a.U=new $d}k.ld=function(a,b){var c=this;this.n.ld(a.toString(),function(d,e){"ok"===d&&ae(c.U,a);Kf(b,d,e)})};function Mf(a,b,c,d){var e=S(c);Sd(a.n,b.toString(),e.X(!0),function(c,g){"ok"===c&&a.U.rb(b,e);Kf(d,c,g)})}
function Nf(a,b,c,d,e){var f=S(c,d);Sd(a.n,b.toString(),f.X(!0),function(c,d){"ok"===c&&a.U.rb(b,f);Kf(e,c,d)})}function Of(a,b,c,d){var e=!0,f;for(f in c)e=!1;e?(M("onDisconnect().update() called with empty data.  Don't do anything."),Kf(d,"ok")):Ud(a.n,b.toString(),c,function(e,f){if("ok"===e)for(var m in c){var n=S(c[m]);a.U.rb(b.J(m),n)}Kf(d,e,f)})}function Pf(a){Oc(a.ga,"deprecated_on_disconnect");a.be.yd.deprecated_on_disconnect=!0}
k.ec=function(a,b,c,d,e){".info"===D(a.path)?this.gd.ec(a,b,c,d,e):this.L.ec(a,b,c,d,e)};k.Dc=function(a,b,c,d){if(".info"===D(a.path))this.gd.Dc(a,b,c,d);else{b=this.L.Dc(a,b,c,d);if(c=null!==b){c=this.g;d=a.path;for(var e=[],f=0;f<b.length;++f)e[f]=U(c.wa,b[f]);V(c.wa,d,Q);for(f=0;f<b.length;++f)V(c.wa,b[f],e[f]);c=fe(c,d)}c&&(v(this.g.qa.ba===this.L.rc,"We should have raised any outstanding events by now.  Else, we'll blow them away."),V(this.g.qa,a.path,U(this.g.O,a.path)),this.L.rc=this.g.qa.ba)}};
k.Qa=function(){this.n.Qa()};k.tb=function(){this.n.tb()};k.wd=function(a){if("undefined"!==typeof console){a?(this.Hc||(this.Hc=new Qc(this.ga)),a=this.Hc.get()):a=this.ga.get();var b=Gb(Ic(a),function(a,b){return Math.max(b.length,a)},0),c;for(c in a){for(var d=a[c],e=c.length;e<b+2;e++)c+=" ";console.log(c+d)}}};k.xd=function(a){Oc(this.ga,a);this.be.yd[a]=!0};k.e=function(){M("r:"+this.n.id+":",arguments)};
function Kf(a,b,c){a&&sc(function(){if("ok"==b)a(null,c);else{var d=(b||"error").toUpperCase(),e=d;c&&(e+=": "+c);e=Error(e);e.code=d;a(e)}})};function Qf(a,b,c,d,e){function f(){}a.e("transaction on "+b);var g=new G(a,b);g.Ua("value",f);c={path:b,update:c,G:d,status:null,Sd:Wb(),Rc:e,Xd:0,Oc:function(){g.nb("value",f)},Pc:null};a.Ka.ba=Rf(a,a.Ka.ba,a.g.O.ba,a.$a);d=c.update(U(a.Ka,b).X());if(l(d)){Fa("transaction failed: Data returned ",d);c.status=1;e=I(a.$a,b);var h=e.k()||[];h.push(c);Ya(e,h);h="object"===typeof d&&null!==d&&A(d,".priority")?d[".priority"]:U(a.g.O,b).m();e=Hf(a);d=S(d,h);d=ke(d,e);V(a.Ka,b,d);c.Rc&&(V(a.g.qa,b,d),xf(a.L,
b,[b]));Sf(a)}else c.Oc(),c.G&&(a=Tf(a,b),c.G(null,!1,a))}function Sf(a,b){var c=b||a.$a;b||Uf(a,c);if(null!==c.k()){var d=Vf(a,c);v(0<d.length);Hb(d,function(a){return 1===a.status})&&Wf(a,c.path(),d)}else c.Fb()&&c.B(function(b){Sf(a,b)})}
function Wf(a,b,c){for(var d=0;d<c.length;d++)v(1===c[d].status,"tryToSendTransactionQueue_: items in queue should all be run."),c[d].status=2,c[d].Xd++;var e=U(a.g.O,b).hash();V(a.g.O,b,U(a.g.qa,b));for(var f=U(a.Ka,b).X(!0),g=Wb(),h=Xf(c),d=0;d<h.length;d++)Ya(I(a.g.Sb,h[d]),g);a.n.put(b.toString(),f,function(e){a.e("transaction put response",{path:b.toString(),status:e});for(d=0;d<h.length;d++){var f=I(a.g.Sb,h[d]),q=f.k();v(null!==q,"sendTransactionQueue_: pendingPut should not be null.");q===
g&&(Ya(f,null),V(a.g.O,h[d],U(a.g.wa,h[d])))}if("ok"===e){e=[];for(d=0;d<c.length;d++)c[d].status=3,c[d].G&&(f=Tf(a,c[d].path),e.push(r(c[d].G,null,null,!0,f))),c[d].Oc();Uf(a,I(a.$a,b));Sf(a);for(d=0;d<e.length;d++)sc(e[d])}else{if("datastale"===e)for(d=0;d<c.length;d++)c[d].status=4===c[d].status?5:1;else for(O("transaction at "+b+" failed: "+e),d=0;d<c.length;d++)c[d].status=5,c[d].Pc=e;e=If(a,b);xf(a.L,e,[b])}},e)}
function Xf(a){for(var b={},c=0;c<a.length;c++)a[c].Rc&&(b[a[c].path.toString()]=a[c].path);a=[];for(var d in b)a.push(b[d]);return a}
function If(a,b){var c=Yf(a,b),d=c.path(),c=Vf(a,c);V(a.g.qa,d,U(a.g.O,d));V(a.Ka,d,U(a.g.O,d));if(0!==c.length){for(var e=U(a.g.qa,d),f=e,g=[],h=0;h<c.length;h++){var m=Va(d,c[h].path),n=!1,q;v(null!==m,"rerunTransactionsUnderNode_: relativePath should not be null.");if(5===c[h].status)n=!0,q=c[h].Pc;else if(1===c[h].status)if(25<=c[h].Xd)n=!0,q="maxretry";else{var s=e.N(m),t=c[h].update(s.X());if(l(t)){Fa("transaction failed: Data returned ",t);var w=S(t);"object"===typeof t&&null!=t&&A(t,".priority")||
(w=w.La(s.m()));e=e.Ba(m,w);c[h].Rc&&(f=f.Ba(m,w))}else n=!0,q="nodata"}n&&(c[h].status=3,setTimeout(c[h].Oc,Math.floor(0)),c[h].G&&(n=new G(a,c[h].path),m=new T(e.N(m),n),"nodata"===q?g.push(r(c[h].G,null,null,!1,m)):g.push(r(c[h].G,null,Error(q),!1,m))))}V(a.Ka,d,e);V(a.g.qa,d,f);Uf(a,a.$a);for(h=0;h<g.length;h++)sc(g[h]);Sf(a)}return d}function Yf(a,b){for(var c,d=a.$a;null!==(c=D(b))&&null===d.k();)d=I(d,c),b=Ta(b);return d}
function Vf(a,b){var c=[];Zf(a,b,c);c.sort(function(a,b){return a.Sd-b.Sd});return c}function Zf(a,b,c){var d=b.k();if(null!==d)for(var e=0;e<d.length;e++)c.push(d[e]);b.B(function(b){Zf(a,b,c)})}function Uf(a,b){var c=b.k();if(c){for(var d=0,e=0;e<c.length;e++)3!==c[e].status&&(c[d]=c[e],d++);c.length=d;Ya(b,0<c.length?c:null)}b.B(function(b){Uf(a,b)})}function Lf(a,b){var c=Yf(a,b).path(),d=I(a.$a,b);ab(d,function(a){$f(a)});$f(d);$a(d,function(a){$f(a)});return c}
function $f(a){var b=a.k();if(null!==b){for(var c=[],d=-1,e=0;e<b.length;e++)4!==b[e].status&&(2===b[e].status?(v(d===e-1,"All SENT items should be at beginning of queue."),d=e,b[e].status=4,b[e].Pc="set"):(v(1===b[e].status),b[e].Oc(),b[e].G&&c.push(r(b[e].G,null,Error("set"),!1,null))));-1===d?Ya(a,null):b.length=d+1;for(e=0;e<c.length;e++)sc(c[e])}}function Tf(a,b){var c=new G(a,b);return new T(U(a.Ka,b),c)}
function Rf(a,b,c,d){if(d.f())return c;if(null!=d.k())return b;var e=c;d.B(function(d){var g=d.name(),h=new H(g);d=Rf(a,b.N(h),c.N(h),d);e=e.K(g,d)});return e};function Y(){this.sb={}}da(Y);Y.prototype.Qa=function(){for(var a in this.sb)this.sb[a].Qa()};Y.prototype.interrupt=Y.prototype.Qa;Y.prototype.tb=function(){for(var a in this.sb)this.sb[a].tb()};Y.prototype.resume=Y.prototype.tb;function ag(a){var b=this;this.zb=a;this.Jc="*";ye()?this.Kb=this.lc=qe():(this.Kb=window.opener,this.lc=window);if(!b.Kb)throw"Unable to find relay frame";re(this.lc,"message",r(this.ob,this));re(this.lc,"message",r(this.Pd,this));try{bg(this,{a:"ready"})}catch(c){re(this.Kb,"load",function(){bg(b,{a:"ready"})})}re(window,"unload",r(this.Ie,this))}function bg(a,b){b=u(b);ye()?a.Kb.doPost(b,a.Jc):a.Kb.postMessage(b,a.Jc)}
ag.prototype.ob=function(a){var b=this,c;try{c=ua(a.data)}catch(d){}c&&"request"===c.a&&(se(window,"message",this.ob),this.Jc=a.origin,this.zb&&setTimeout(function(){b.zb(b.Jc,c.d,function(a,c){b.oe=!c;b.zb=void 0;bg(b,{a:"response",d:a,forceKeepWindowOpen:c})})},0))};ag.prototype.Ie=function(){try{se(this.lc,"message",this.Pd)}catch(a){}this.zb&&(bg(this,{a:"error",d:"unknown closed window"}),this.zb=void 0);try{window.close()}catch(b){}};ag.prototype.Pd=function(a){if(this.oe&&"die"===a.data)try{window.close()}catch(b){}};var Z={xe:function(a){var b=R.prototype.hash;R.prototype.hash=a;var c=tc.prototype.hash;tc.prototype.hash=a;return function(){R.prototype.hash=b;tc.prototype.hash=c}}};Z.hijackHash=Z.xe;Z.Wa=function(a){return a.Wa()};Z.queryIdentifier=Z.Wa;Z.Ae=function(a){return a.i.n.ja};Z.listens=Z.Ae;Z.Me=function(a){return a.i.n.ma};Z.refConnection=Z.Me;Z.ee=Id;Z.DataConnection=Z.ee;Id.prototype.sendRequest=Id.prototype.Ja;Id.prototype.interrupt=Id.prototype.Qa;Z.fe=rd;Z.RealTimeConnection=Z.fe;
rd.prototype.sendRequest=rd.prototype.Zd;rd.prototype.close=rd.prototype.close;Z.de=wb;Z.ConnectionTarget=Z.de;Z.ue=function(){gd=Yc=!0};Z.forceLongPolling=Z.ue;Z.ve=function(){hd=!0};Z.forceWebSockets=Z.ve;Z.Te=function(a,b){a.i.n.ud=b};Z.setSecurityDebugCallback=Z.Te;Z.wd=function(a,b){a.i.wd(b)};Z.stats=Z.wd;Z.xd=function(a,b){a.i.xd(b)};Z.statsIncrementCounter=Z.xd;Z.ic=function(a){return a.i.ic};Z.dataUpdateCount=Z.ic;Z.ye=function(a,b){a.i.Md=b};Z.interceptServerData=Z.ye;Z.Fe=function(a){new ag(a)};
Z.onPopupOpen=Z.Fe;Z.Qe=function(a){le=a};Z.setAuthenticationServer=Z.Qe;function $(a,b,c){this.Wb=a;this.Z=b;this.Ha=c}$.prototype.cancel=function(a){x("Firebase.onDisconnect().cancel",0,1,arguments.length);z("Firebase.onDisconnect().cancel",1,a,!0);this.Wb.ld(this.Z,a)};$.prototype.cancel=$.prototype.cancel;$.prototype.remove=function(a){x("Firebase.onDisconnect().remove",0,1,arguments.length);C("Firebase.onDisconnect().remove",this.Z);z("Firebase.onDisconnect().remove",1,a,!0);Mf(this.Wb,this.Z,null,a)};$.prototype.remove=$.prototype.remove;
$.prototype.set=function(a,b){x("Firebase.onDisconnect().set",1,2,arguments.length);C("Firebase.onDisconnect().set",this.Z);Ea("Firebase.onDisconnect().set",a,!1);z("Firebase.onDisconnect().set",2,b,!0);Mf(this.Wb,this.Z,a,b)};$.prototype.set=$.prototype.set;
$.prototype.wb=function(a,b,c){x("Firebase.onDisconnect().setWithPriority",2,3,arguments.length);C("Firebase.onDisconnect().setWithPriority",this.Z);Ea("Firebase.onDisconnect().setWithPriority",a,!1);Ja("Firebase.onDisconnect().setWithPriority",2,b,!1);z("Firebase.onDisconnect().setWithPriority",3,c,!0);if(".length"===this.Ha||".keys"===this.Ha)throw"Firebase.onDisconnect().setWithPriority failed: "+this.Ha+" is a read-only object.";Nf(this.Wb,this.Z,a,b,c)};$.prototype.setWithPriority=$.prototype.wb;
$.prototype.update=function(a,b){x("Firebase.onDisconnect().update",1,2,arguments.length);C("Firebase.onDisconnect().update",this.Z);if(fa(a)){for(var c={},d=0;d<a.length;++d)c[""+d]=a[d];a=c;O("Passing an Array to Firebase.onDisconnect().update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}Ia("Firebase.onDisconnect().update",a);z("Firebase.onDisconnect().update",2,b,!0);Of(this.Wb,
this.Z,a,b)};$.prototype.update=$.prototype.update;var cg=function(){var a=0,b=[];return function(c){var d=c===a;a=c;for(var e=Array(8),f=7;0<=f;f--)e[f]="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c%64),c=Math.floor(c/64);v(0===c,"Cannot push at time == 0");c=e.join("");if(d){for(f=11;0<=f&&63===b[f];f--)b[f]=0;b[f]++}else for(f=0;12>f;f++)b[f]=Math.floor(64*Math.random());for(f=0;12>f;f++)c+="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);v(20===c.length,"NextPushId: Length should be 20.");
return c}}();function G(a,b){var c,d,e;if(a instanceof Ef)c=a,d=b;else{x("new Firebase",1,2,arguments.length);d=fc(arguments[0]);c=d.Ve;"firebase"===d.domain&&ec(d.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead");c||ec("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com");d.Ya||"undefined"!==typeof window&&window.location&&window.location.protocol&&-1!==window.location.protocol.indexOf("https:")&&O("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");
c=new wb(d.host,d.Ya,c,"ws"===d.scheme||"wss"===d.scheme);d=new H(d.Rb);e=d.toString();var f;!(f=!p(c.host)||0===c.host.length||!Da(c.Ta))&&(f=0!==e.length)&&(e&&(e=e.replace(/^\/*\.info(\/|$)/,"/")),f=!(p(e)&&0!==e.length&&!Ca.test(e)));if(f)throw Error(y("new Firebase",1,!1)+'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".');if(b)if(b instanceof Y)e=b;else if(p(b))e=Y.ib(),c.yc=b;else throw Error("Expected a valid Firebase.Context for second argument to new Firebase()");
else e=Y.ib();f=c.toString();var g=B(e.sb,f);g||(g=new Ef(c),e.sb[f]=g);c=g}F.call(this,c,d)}na(G,F);var dg=G,eg=["Firebase"],fg=ba;eg[0]in fg||!fg.execScript||fg.execScript("var "+eg[0]);for(var gg;eg.length&&(gg=eg.shift());)!eg.length&&l(dg)?fg[gg]=dg:fg=fg[gg]?fg[gg]:fg[gg]={};G.prototype.name=function(){x("Firebase.name",0,0,arguments.length);return this.path.f()?null:Ua(this.path)};G.prototype.name=G.prototype.name;
G.prototype.J=function(a){x("Firebase.child",1,1,arguments.length);if(ha(a))a=String(a);else if(!(a instanceof H))if(null===D(this.path)){var b=a;b&&(b=b.replace(/^\/*\.info(\/|$)/,"/"));Ma("Firebase.child",b)}else Ma("Firebase.child",a);return new G(this.i,this.path.J(a))};G.prototype.child=G.prototype.J;G.prototype.parent=function(){x("Firebase.parent",0,0,arguments.length);var a=this.path.parent();return null===a?null:new G(this.i,a)};G.prototype.parent=G.prototype.parent;
G.prototype.root=function(){x("Firebase.ref",0,0,arguments.length);for(var a=this;null!==a.parent();)a=a.parent();return a};G.prototype.root=G.prototype.root;G.prototype.toString=function(){x("Firebase.toString",0,0,arguments.length);var a;if(null===this.parent())a=this.i.toString();else{a=this.parent().toString()+"/";var b=this.name();a+=encodeURIComponent(String(b))}return a};G.prototype.toString=G.prototype.toString;
G.prototype.set=function(a,b){x("Firebase.set",1,2,arguments.length);C("Firebase.set",this.path);Ea("Firebase.set",a,!1);z("Firebase.set",2,b,!0);this.i.wb(this.path,a,null,b)};G.prototype.set=G.prototype.set;
G.prototype.update=function(a,b){x("Firebase.update",1,2,arguments.length);C("Firebase.update",this.path);if(fa(a)){for(var c={},d=0;d<a.length;++d)c[""+d]=a[d];a=c;O("Passing an Array to Firebase.update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}Ia("Firebase.update",a);z("Firebase.update",2,b,!0);if(A(a,".priority"))throw Error("update() does not currently support updating .priority.");
this.i.update(this.path,a,b)};G.prototype.update=G.prototype.update;G.prototype.wb=function(a,b,c){x("Firebase.setWithPriority",2,3,arguments.length);C("Firebase.setWithPriority",this.path);Ea("Firebase.setWithPriority",a,!1);Ja("Firebase.setWithPriority",2,b,!1);z("Firebase.setWithPriority",3,c,!0);if(".length"===this.name()||".keys"===this.name())throw"Firebase.setWithPriority failed: "+this.name()+" is a read-only object.";this.i.wb(this.path,a,b,c)};G.prototype.setWithPriority=G.prototype.wb;
G.prototype.remove=function(a){x("Firebase.remove",0,1,arguments.length);C("Firebase.remove",this.path);z("Firebase.remove",1,a,!0);this.set(null,a)};G.prototype.remove=G.prototype.remove;
G.prototype.transaction=function(a,b,c){x("Firebase.transaction",1,3,arguments.length);C("Firebase.transaction",this.path);z("Firebase.transaction",1,a,!1);z("Firebase.transaction",2,b,!0);if(l(c)&&"boolean"!=typeof c)throw Error(y("Firebase.transaction",3,!0)+"must be a boolean.");if(".length"===this.name()||".keys"===this.name())throw"Firebase.transaction failed: "+this.name()+" is a read-only object.";"undefined"===typeof c&&(c=!0);Qf(this.i,this.path,a,b,c)};G.prototype.transaction=G.prototype.transaction;
G.prototype.vd=function(a,b){x("Firebase.setPriority",1,2,arguments.length);C("Firebase.setPriority",this.path);Ja("Firebase.setPriority",1,a,!1);z("Firebase.setPriority",2,b,!0);this.i.vd(this.path,a,b)};G.prototype.setPriority=G.prototype.vd;G.prototype.push=function(a,b){x("Firebase.push",0,2,arguments.length);C("Firebase.push",this.path);Ea("Firebase.push",a,!0);z("Firebase.push",2,b,!0);var c=Gf(this.i),c=cg(c),c=this.J(c);"undefined"!==typeof a&&null!==a&&c.set(a,b);return c};
G.prototype.push=G.prototype.push;G.prototype.ka=function(){return new $(this.i,this.path,this.name())};G.prototype.onDisconnect=G.prototype.ka;G.prototype.Ne=function(){O("FirebaseRef.removeOnDisconnect() being deprecated. Please use FirebaseRef.onDisconnect().remove() instead.");this.ka().remove();Pf(this.i)};G.prototype.removeOnDisconnect=G.prototype.Ne;
G.prototype.Se=function(a){O("FirebaseRef.setOnDisconnect(value) being deprecated. Please use FirebaseRef.onDisconnect().set(value) instead.");this.ka().set(a);Pf(this.i)};G.prototype.setOnDisconnect=G.prototype.Se;G.prototype.I=function(a,b,c){O("FirebaseRef.auth() being deprecated. Please use FirebaseRef.authWithCustomToken() instead.");x("Firebase.auth",1,3,arguments.length);Na("Firebase.auth",a);z("Firebase.auth",2,b,!0);z("Firebase.auth",3,b,!0);Me(this.i.I,a,{},{remember:"none"},b,c)};
G.prototype.auth=G.prototype.I;G.prototype.Bd=function(a){x("Firebase.unauth",0,1,arguments.length);z("Firebase.unauth",1,a,!0);Ne(this.i.I,a)};G.prototype.unauth=G.prototype.Bd;G.prototype.bd=function(){x("Firebase.getAuth",0,0,arguments.length);return this.i.I.bd()};G.prototype.getAuth=G.prototype.bd;G.prototype.Ee=function(a,b){x("Firebase.onAuth",1,2,arguments.length);z("Firebase.onAuth",1,a,!1);ya("Firebase.onAuth",2,b);this.i.I.Ua("auth_status",a,b)};G.prototype.onAuth=G.prototype.Ee;
G.prototype.De=function(a,b){x("Firebase.offAuth",1,2,arguments.length);z("Firebase.offAuth",1,a,!1);ya("Firebase.offAuth",2,b);this.i.I.nb("auth_status",a,b)};G.prototype.offAuth=G.prototype.De;G.prototype.je=function(a,b,c){x("Firebase.authWithCustomToken",2,3,arguments.length);Na("Firebase.authWithCustomToken",a);z("Firebase.authWithCustomToken",2,b,!1);E("Firebase.authWithCustomToken",3,c,!0);Me(this.i.I,a,{},c||{},b)};G.prototype.authWithCustomToken=G.prototype.je;
G.prototype.ke=function(a,b,c){x("Firebase.authWithOAuthPopup",2,3,arguments.length);Oa("Firebase.authWithOAuthPopup",1,a);z("Firebase.authWithOAuthPopup",2,b,!1);E("Firebase.authWithOAuthPopup",3,c,!0);Re(this.i.I,a,c,b)};G.prototype.authWithOAuthPopup=G.prototype.ke;
G.prototype.le=function(a,b,c){x("Firebase.authWithOAuthRedirect",2,3,arguments.length);Oa("Firebase.authWithOAuthRedirect",1,a);z("Firebase.authWithOAuthRedirect",2,b,!1);E("Firebase.authWithOAuthRedirect",3,c,!0);var d=this.i.I;Pe(d);var e=[Fe],f=oe(c);"anonymous"===a||"firebase"===a?P(b,W("TRANSPORT_UNAVAILABLE")):(J.set("redirect_client_options",f.hc),Qe(d,e,"/auth/"+a,f,b))};G.prototype.authWithOAuthRedirect=G.prototype.le;
G.prototype.me=function(a,b,c,d){x("Firebase.authWithOAuthToken",3,4,arguments.length);Oa("Firebase.authWithOAuthToken",1,a);z("Firebase.authWithOAuthToken",3,c,!1);E("Firebase.authWithOAuthToken",4,d,!0);p(b)?(Oa("Firebase.authWithOAuthToken",2,b),Oe(this.i.I,a+"/token",{access_token:b},d,c)):(E("Firebase.authWithOAuthToken",2,b,!1),Oe(this.i.I,a+"/token",b,d,c))};G.prototype.authWithOAuthToken=G.prototype.me;
G.prototype.ie=function(a,b){x("Firebase.authAnonymously",1,2,arguments.length);z("Firebase.authAnonymously",1,a,!1);E("Firebase.authAnonymously",2,b,!0);Oe(this.i.I,"anonymous",{},b,a)};G.prototype.authAnonymously=G.prototype.ie;
G.prototype.ne=function(a,b,c){x("Firebase.authWithPassword",2,3,arguments.length);E("Firebase.authWithPassword",1,a,!1);Pa("Firebase.authWithPassword",a,"email");Pa("Firebase.authWithPassword",a,"password");z("Firebase.authAnonymously",2,b,!1);E("Firebase.authAnonymously",3,c,!0);Oe(this.i.I,"password",a,c,b)};G.prototype.authWithPassword=G.prototype.ne;
G.prototype.Xc=function(a,b){x("Firebase.createUser",2,2,arguments.length);E("Firebase.createUser",1,a,!1);Pa("Firebase.createUser",a,"email");Pa("Firebase.createUser",a,"password");z("Firebase.createUser",2,b,!1);this.i.I.Xc(a,b)};G.prototype.createUser=G.prototype.Xc;G.prototype.sd=function(a,b){x("Firebase.removeUser",2,2,arguments.length);E("Firebase.removeUser",1,a,!1);Pa("Firebase.removeUser",a,"email");Pa("Firebase.removeUser",a,"password");z("Firebase.removeUser",2,b,!1);this.i.I.sd(a,b)};
G.prototype.removeUser=G.prototype.sd;G.prototype.Tc=function(a,b){x("Firebase.changePassword",2,2,arguments.length);E("Firebase.changePassword",1,a,!1);Pa("Firebase.changePassword",a,"email");Pa("Firebase.changePassword",a,"oldPassword");Pa("Firebase.changePassword",a,"newPassword");z("Firebase.changePassword",2,b,!1);this.i.I.Tc(a,b)};G.prototype.changePassword=G.prototype.Tc;
G.prototype.td=function(a,b){x("Firebase.resetPassword",2,2,arguments.length);E("Firebase.resetPassword",1,a,!1);Pa("Firebase.resetPassword",a,"email");z("Firebase.resetPassword",2,b,!1);this.i.I.td(a,b)};G.prototype.resetPassword=G.prototype.td;G.goOffline=function(){x("Firebase.goOffline",0,0,arguments.length);Y.ib().Qa()};G.goOnline=function(){x("Firebase.goOnline",0,0,arguments.length);Y.ib().tb()};
function bc(a,b){v(!b||!0===a||!1===a,"Can't turn on custom loggers persistently.");!0===a?("undefined"!==typeof console&&("function"===typeof console.log?$b=r(console.log,console):"object"===typeof console.log&&($b=function(a){console.log(a)})),b&&J.set("logging_enabled",!0)):a?$b=a:($b=null,J.remove("logging_enabled"))}G.enableLogging=bc;G.ServerValue={TIMESTAMP:{".sv":"timestamp"}};G.SDK_VERSION="1.1.3";G.INTERNAL=Z;G.Context=Y;})();
module.exports = Firebase;

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\firebase\\lib\\firebase-web.js","/..\\node_modules\\firebase\\lib")
},{"VCmEsw":22,"buffer":13}],13:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\buffer\\index.js","/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\buffer")
},{"VCmEsw":22,"base64-js":14,"buffer":13,"ieee754":15}],14:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS)
			return 62 // '+'
		if (code === SLASH)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\buffer\\node_modules\\base64-js\\lib\\b64.js","/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\buffer\\node_modules\\base64-js\\lib")
},{"VCmEsw":22,"buffer":13}],15:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\buffer\\node_modules\\ieee754\\index.js","/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\buffer\\node_modules\\ieee754")
},{"VCmEsw":22,"buffer":13}],16:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var Buffer = require('buffer').Buffer;
var intSize = 4;
var zeroBuffer = new Buffer(intSize); zeroBuffer.fill(0);
var chrsz = 8;

function toArray(buf, bigEndian) {
  if ((buf.length % intSize) !== 0) {
    var len = buf.length + (intSize - (buf.length % intSize));
    buf = Buffer.concat([buf, zeroBuffer], len);
  }

  var arr = [];
  var fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;
  for (var i = 0; i < buf.length; i += intSize) {
    arr.push(fn.call(buf, i));
  }
  return arr;
}

function toBuffer(arr, size, bigEndian) {
  var buf = new Buffer(size);
  var fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;
  for (var i = 0; i < arr.length; i++) {
    fn.call(buf, arr[i], i * 4, true);
  }
  return buf;
}

function hash(buf, fn, hashSize, bigEndian) {
  if (!Buffer.isBuffer(buf)) buf = new Buffer(buf);
  var arr = fn(toArray(buf, bigEndian), buf.length * chrsz);
  return toBuffer(arr, hashSize, bigEndian);
}

module.exports = { hash: hash };

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\crypto-browserify\\helpers.js","/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\crypto-browserify")
},{"VCmEsw":22,"buffer":13}],17:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var Buffer = require('buffer').Buffer
var sha = require('./sha')
var sha256 = require('./sha256')
var rng = require('./rng')
var md5 = require('./md5')

var algorithms = {
  sha1: sha,
  sha256: sha256,
  md5: md5
}

var blocksize = 64
var zeroBuffer = new Buffer(blocksize); zeroBuffer.fill(0)
function hmac(fn, key, data) {
  if(!Buffer.isBuffer(key)) key = new Buffer(key)
  if(!Buffer.isBuffer(data)) data = new Buffer(data)

  if(key.length > blocksize) {
    key = fn(key)
  } else if(key.length < blocksize) {
    key = Buffer.concat([key, zeroBuffer], blocksize)
  }

  var ipad = new Buffer(blocksize), opad = new Buffer(blocksize)
  for(var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }

  var hash = fn(Buffer.concat([ipad, data]))
  return fn(Buffer.concat([opad, hash]))
}

function hash(alg, key) {
  alg = alg || 'sha1'
  var fn = algorithms[alg]
  var bufs = []
  var length = 0
  if(!fn) error('algorithm:', alg, 'is not yet supported')
  return {
    update: function (data) {
      if(!Buffer.isBuffer(data)) data = new Buffer(data)
        
      bufs.push(data)
      length += data.length
      return this
    },
    digest: function (enc) {
      var buf = Buffer.concat(bufs)
      var r = key ? hmac(fn, key, buf) : fn(buf)
      bufs = null
      return enc ? r.toString(enc) : r
    }
  }
}

function error () {
  var m = [].slice.call(arguments).join(' ')
  throw new Error([
    m,
    'we accept pull requests',
    'http://github.com/dominictarr/crypto-browserify'
    ].join('\n'))
}

exports.createHash = function (alg) { return hash(alg) }
exports.createHmac = function (alg, key) { return hash(alg, key) }
exports.randomBytes = function(size, callback) {
  if (callback && callback.call) {
    try {
      callback.call(this, undefined, new Buffer(rng(size)))
    } catch (err) { callback(err) }
  } else {
    return new Buffer(rng(size))
  }
}

function each(a, f) {
  for(var i in a)
    f(a[i], i)
}

// the least I can do is make error messages for the rest of the node.js/crypto api.
each(['createCredentials'
, 'createCipher'
, 'createCipheriv'
, 'createDecipher'
, 'createDecipheriv'
, 'createSign'
, 'createVerify'
, 'createDiffieHellman'
, 'pbkdf2'], function (name) {
  exports[name] = function () {
    error('sorry,', name, 'is not implemented yet')
  }
})

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\crypto-browserify\\index.js","/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\crypto-browserify")
},{"./md5":18,"./rng":19,"./sha":20,"./sha256":21,"VCmEsw":22,"buffer":13}],18:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

var helpers = require('./helpers');

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

module.exports = function md5(buf) {
  return helpers.hash(buf, core_md5, 16);
};

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\crypto-browserify\\md5.js","/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\crypto-browserify")
},{"./helpers":16,"VCmEsw":22,"buffer":13}],19:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Original code adapted from Robert Kieffer.
// details at https://github.com/broofa/node-uuid
(function() {
  var _global = this;

  var mathRNG, whatwgRNG;

  // NOTE: Math.random() does not guarantee "cryptographic quality"
  mathRNG = function(size) {
    var bytes = new Array(size);
    var r;

    for (var i = 0, r; i < size; i++) {
      if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
      bytes[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return bytes;
  }

  if (_global.crypto && crypto.getRandomValues) {
    whatwgRNG = function(size) {
      var bytes = new Uint8Array(size);
      crypto.getRandomValues(bytes);
      return bytes;
    }
  }

  module.exports = whatwgRNG || mathRNG;

}())

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\crypto-browserify\\rng.js","/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\crypto-browserify")
},{"VCmEsw":22,"buffer":13}],20:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

var helpers = require('./helpers');

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

module.exports = function sha1(buf) {
  return helpers.hash(buf, core_sha1, 20, true);
};

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\crypto-browserify\\sha.js","/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\crypto-browserify")
},{"./helpers":16,"VCmEsw":22,"buffer":13}],21:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var helpers = require('./helpers');

var safe_add = function(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
};

var S = function(X, n) {
  return (X >>> n) | (X << (32 - n));
};

var R = function(X, n) {
  return (X >>> n);
};

var Ch = function(x, y, z) {
  return ((x & y) ^ ((~x) & z));
};

var Maj = function(x, y, z) {
  return ((x & y) ^ (x & z) ^ (y & z));
};

var Sigma0256 = function(x) {
  return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
};

var Sigma1256 = function(x) {
  return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
};

var Gamma0256 = function(x) {
  return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
};

var Gamma1256 = function(x) {
  return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
};

var core_sha256 = function(m, l) {
  var K = new Array(0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0xFC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x6CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2);
  var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;
  /* append padding */
  m[l >> 5] |= 0x80 << (24 - l % 32);
  m[((l + 64 >> 9) << 4) + 15] = l;
  for (var i = 0; i < m.length; i += 16) {
    a = HASH[0]; b = HASH[1]; c = HASH[2]; d = HASH[3]; e = HASH[4]; f = HASH[5]; g = HASH[6]; h = HASH[7];
    for (var j = 0; j < 64; j++) {
      if (j < 16) {
        W[j] = m[j + i];
      } else {
        W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
      }
      T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
      T2 = safe_add(Sigma0256(a), Maj(a, b, c));
      h = g; g = f; f = e; e = safe_add(d, T1); d = c; c = b; b = a; a = safe_add(T1, T2);
    }
    HASH[0] = safe_add(a, HASH[0]); HASH[1] = safe_add(b, HASH[1]); HASH[2] = safe_add(c, HASH[2]); HASH[3] = safe_add(d, HASH[3]);
    HASH[4] = safe_add(e, HASH[4]); HASH[5] = safe_add(f, HASH[5]); HASH[6] = safe_add(g, HASH[6]); HASH[7] = safe_add(h, HASH[7]);
  }
  return HASH;
};

module.exports = function sha256(buf) {
  return helpers.hash(buf, core_sha256, 32, true);
};

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\crypto-browserify\\sha256.js","/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\crypto-browserify")
},{"./helpers":16,"VCmEsw":22,"buffer":13}],22:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\process\\browser.js","/..\\node_modules\\gulp-browserify\\node_modules\\browserify\\node_modules\\process")
},{"VCmEsw":22,"buffer":13}],23:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

(function() {
  var _global = this;

  // Unique ID creation requires a high quality random # generator.  We feature
  // detect to determine the best RNG source, normalizing to a function that
  // returns 128-bits of randomness, since that's what's usually required
  var _rng;

  // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
  //
  // Moderately fast, high quality
  if (typeof(require) == 'function') {
    try {
      var _rb = require('crypto').randomBytes;
      _rng = _rb && function() {return _rb(16);};
    } catch(e) {}
  }

  if (!_rng && _global.crypto && crypto.getRandomValues) {
    // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
    //
    // Moderately fast, high quality
    var _rnds8 = new Uint8Array(16);
    _rng = function whatwgRNG() {
      crypto.getRandomValues(_rnds8);
      return _rnds8;
    };
  }

  if (!_rng) {
    // Math.random()-based (RNG)
    //
    // If all else fails, use Math.random().  It's fast, but is of unspecified
    // quality.
    var  _rnds = new Array(16);
    _rng = function() {
      for (var i = 0, r; i < 16; i++) {
        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
        _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
      }

      return _rnds;
    };
  }

  // Buffer class to use
  var BufferClass = typeof(Buffer) == 'function' ? Buffer : Array;

  // Maps for number <-> hex string conversion
  var _byteToHex = [];
  var _hexToByte = {};
  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  // **`parse()` - Parse a UUID into it's component bytes**
  function parse(s, buf, offset) {
    var i = (buf && offset) || 0, ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
      if (ii < 16) { // Don't overflow!
        buf[i + ii++] = _hexToByte[oct];
      }
    });

    // Zero out remaining bytes if string was short
    while (ii < 16) {
      buf[i + ii++] = 0;
    }

    return buf;
  }

  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
  function unparse(buf, offset) {
    var i = offset || 0, bth = _byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
  }

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  // random #'s we need to init node and clockseq
  var _seedBytes = _rng();

  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
  var _nodeId = [
    _seedBytes[0] | 0x01,
    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
  ];

  // Per 4.2.2, randomize (14 bit) clockseq
  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

  // Previous uuid creation time
  var _lastMSecs = 0, _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};

    var clockseq = options.clockseq != null ? options.clockseq : _clockseq;

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = options.msecs != null ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = options.nsecs != null ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq == null) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    var node = options.node || _nodeId;
    for (var n = 0; n < 6; n++) {
      b[i + n] = node[n];
    }

    return buf ? buf : unparse(b);
  }

  // **`v4()` - Generate random UUID**

  // See https://github.com/broofa/node-uuid for API details
  function v4(options, buf, offset) {
    // Deprecated - 'format' argument, as supported in v1.2
    var i = buf && offset || 0;

    if (typeof(options) == 'string') {
      buf = options == 'binary' ? new BufferClass(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || _rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ii++) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || unparse(rnds);
  }

  // Export public API
  var uuid = v4;
  uuid.v1 = v1;
  uuid.v4 = v4;
  uuid.parse = parse;
  uuid.unparse = unparse;
  uuid.BufferClass = BufferClass;

  if (typeof define === 'function' && define.amd) {
    // Publish as AMD module
    define(function() {return uuid;});
  } else if (typeof(module) != 'undefined' && module.exports) {
    // Publish as node.js module
    module.exports = uuid;
  } else {
    // Publish as global (in browsers)
    var _previousRoot = _global.uuid;

    // **`noConflict()` - (browser only) to reset global 'uuid' var**
    uuid.noConflict = function() {
      _global.uuid = _previousRoot;
      return uuid;
    };

    _global.uuid = uuid;
  }
}).call(this);

}).call(this,require("VCmEsw"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\node-uuid\\uuid.js","/..\\node_modules\\node-uuid")
},{"VCmEsw":22,"buffer":13,"crypto":17}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6XFxwcm9qZWN0c1xcY2Fwc3RvbmVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsImM6L3Byb2plY3RzL2NhcHN0b25lL2FwcC9jb21tb24vc2VydmljZXMvZmlyZWJhc2VTeW5jLmpzIiwiYzovcHJvamVjdHMvY2Fwc3RvbmUvYXBwL2NvbW1vbi9zZXJ2aWNlcy9nZXRSb29tLmpzIiwiYzovcHJvamVjdHMvY2Fwc3RvbmUvYXBwL2NyZWF0ZS9jb250cm9sbGVycy9DcmVhdGVDb250cm9sbGVyLmpzIiwiYzovcHJvamVjdHMvY2Fwc3RvbmUvYXBwL2NyZWF0ZS9pbmRleC5qcyIsImM6L3Byb2plY3RzL2NhcHN0b25lL2FwcC9mYWtlX2Y3OWVlNWNmLmpzIiwiYzovcHJvamVjdHMvY2Fwc3RvbmUvYXBwL2pvaW4vY29udHJvbGxlcnMvSm9pbkNvbnRyb2xsZXIuanMiLCJjOi9wcm9qZWN0cy9jYXBzdG9uZS9hcHAvam9pbi9pbmRleC5qcyIsImM6L3Byb2plY3RzL2NhcHN0b25lL2FwcC9yb29tL2NvbnRyb2xsZXJzL1Jvb21Db250cm9sbGVyLmpzIiwiYzovcHJvamVjdHMvY2Fwc3RvbmUvYXBwL3Jvb20vaW5kZXguanMiLCJjOi9wcm9qZWN0cy9jYXBzdG9uZS9hcHAvcm91dGVzLmpzIiwiYzovcHJvamVjdHMvY2Fwc3RvbmUvbm9kZV9tb2R1bGVzL2FuZ3VsYXItcm91dGUvYW5ndWxhci1yb3V0ZS5qcyIsImM6L3Byb2plY3RzL2NhcHN0b25lL25vZGVfbW9kdWxlcy9maXJlYmFzZS9saWIvZmlyZWJhc2Utd2ViLmpzIiwiYzovcHJvamVjdHMvY2Fwc3RvbmUvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiYzovcHJvamVjdHMvY2Fwc3RvbmUvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qcyIsImM6L3Byb2plY3RzL2NhcHN0b25lL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsImM6L3Byb2plY3RzL2NhcHN0b25lL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2NyeXB0by1icm93c2VyaWZ5L2hlbHBlcnMuanMiLCJjOi9wcm9qZWN0cy9jYXBzdG9uZS9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9jcnlwdG8tYnJvd3NlcmlmeS9pbmRleC5qcyIsImM6L3Byb2plY3RzL2NhcHN0b25lL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2NyeXB0by1icm93c2VyaWZ5L21kNS5qcyIsImM6L3Byb2plY3RzL2NhcHN0b25lL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2NyeXB0by1icm93c2VyaWZ5L3JuZy5qcyIsImM6L3Byb2plY3RzL2NhcHN0b25lL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2NyeXB0by1icm93c2VyaWZ5L3NoYS5qcyIsImM6L3Byb2plY3RzL2NhcHN0b25lL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2NyeXB0by1icm93c2VyaWZ5L3NoYTI1Ni5qcyIsImM6L3Byb2plY3RzL2NhcHN0b25lL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsImM6L3Byb2plY3RzL2NhcHN0b25lL25vZGVfbW9kdWxlcy9ub2RlLXV1aWQvdXVpZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyogZ2xvYmFscyBGaXJlYmFzZSAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkZmlyZWJhc2UpIHtcclxuXHJcbiAgLyoqXHJcbiAgICogRmFjdG9yeSB0byBjcmVhdGUgRmlyZWJhc2Ugc3luYyBvYmplY3RzLiBUaGlzIGlzIG1haW5seSBqdXN0IHRvIGdldCBhcm91bmQgdGhlIGdsb2JhbCBGaXJlYmFzZVxyXG4gICAqIG9iamVjdCBkZXBlbmRlbmN5IHRvIG1ha2UgdW5pdCB0ZXN0aW5nIGVhc2llci5cclxuICAgKi9cclxuICByZXR1cm4gZnVuY3Rpb24gKGZpcmViYXNlVXJsKSB7XHJcbiAgICB2YXIgcmVmID0gbmV3IEZpcmViYXNlKGZpcmViYXNlVXJsKTtcclxuICAgIHJldHVybiAkZmlyZWJhc2UocmVmKTtcclxuICB9O1xyXG59O1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJWQ21Fc3dcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9jb21tb25cXFxcc2VydmljZXNcXFxcZmlyZWJhc2VTeW5jLmpzXCIsXCIvY29tbW9uXFxcXHNlcnZpY2VzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZmlyZWJhc2VTeW5jKSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlcnZpY2UgdG8gZ2V0IGEgcm9vbSBieSBpZC5cclxuICAgKi9cclxuICByZXR1cm4gZnVuY3Rpb24gKHJvb21JZCkge1xyXG5cclxuICAgIHZhciB1c2VyU3luY1xyXG4gICAgICAgID0gZmlyZWJhc2VTeW5jKCdodHRwczovL2dsb3dpbmctZmlyZS01ODEwLmZpcmViYXNlaW8uY29tLycgKyByb29tSWQgKyAnL3VzZXJzJyk7XHJcblxyXG4gICAgdmFyIGF0dHJpYnV0ZXNTeW5jXHJcbiAgICAgICAgPSBmaXJlYmFzZVN5bmMoJ2h0dHBzOi8vZ2xvd2luZy1maXJlLTU4MTAuZmlyZWJhc2Vpby5jb20vJyArIHJvb21JZCArICcvYXR0cmlidXRlcycpO1xyXG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzU3luYy4kYXNPYmplY3QoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgcm9vbSdzIGlkZW50aWZpZXIuXHJcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXRJZCgpIHtcclxuICAgICAgcmV0dXJuIHJvb21JZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCByb29tIGF0dHJpYnV0ZXMuXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBhdHRyaWJ1dGVzIG9iamVjdC4gY3VycmVudGx5IG9ubHkgaGFzICdzaG93JyBwcm9wZXJ0eS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0QXR0cmlidXRlcygpIHtcclxuICAgICAgcmV0dXJuIGF0dHJpYnV0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG93IGNhcmRzLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzaG93KCkge1xyXG4gICAgICBhdHRyaWJ1dGVzLnNob3cgPSB0cnVlO1xyXG4gICAgICBhdHRyaWJ1dGVzLiRzYXZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBKb2luIHJvb20uXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXNlck5hbWVcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfSBwcm9taXNlIHRvIHBhc3MgYmFjayBjcmVhdGVkIEZpcmViYXNlIHJlZlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBqb2luKHVzZXJOYW1lKSB7XHJcbiAgICAgIHZhciB1c2VyID0ge1xyXG4gICAgICAgIG5hbWU6IHVzZXJOYW1lLFxyXG4gICAgICAgIGNhcmQ6ICcnXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gdXNlclN5bmMuJHB1c2godXNlcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdXNlcnMgYXJyYXkuXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldFVzZXJzKCkge1xyXG4gICAgICByZXR1cm4gdXNlclN5bmMuJGFzQXJyYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFZvdGUuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXNlcklkIGlkIG9mIHVzZXIgdG8gdm90ZSBhc1xyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNhcmQgY2FyZCB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB2b3RlKHVzZXJJZCwgY2FyZCkge1xyXG4gICAgICBpZihhdHRyaWJ1dGVzLnNob3cpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciB1c2VycyA9IGdldFVzZXJzKHJvb21JZCk7XHJcblxyXG4gICAgICB2YXIgb2JqID0gdXNlcnMuJGdldFJlY29yZCh1c2VySWQpO1xyXG4gICAgICBvYmouY2FyZCA9IGNhcmQ7XHJcbiAgICAgIHVzZXJzLiRzYXZlKG9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNldCByb29tIHRvIHN0YXJ0IGEgbmV3IHZvdGUuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHJlc2V0KCkge1xyXG4gICAgICB2YXIgdXNlcnMgPSBnZXRVc2VycygpO1xyXG4gICAgICB1c2Vycy5mb3JFYWNoKGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgdXNlci5jYXJkID0gJyc7XHJcbiAgICAgICAgdXNlcnMuJHNhdmUodXNlcik7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgYXR0cmlidXRlcy5zaG93ID0gZmFsc2U7XHJcbiAgICAgIGF0dHJpYnV0ZXMuJHNhdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBnZXRJZDogZ2V0SWQsXHJcbiAgICAgIGpvaW46IGpvaW4sXHJcbiAgICAgIGdldFVzZXJzOiBnZXRVc2VycyxcclxuICAgICAgdm90ZTogdm90ZSxcclxuICAgICAgcmVzZXQ6IHJlc2V0LFxyXG4gICAgICBnZXRBdHRyaWJ1dGVzOiBnZXRBdHRyaWJ1dGVzLFxyXG4gICAgICBzaG93OiBzaG93XHJcbiAgICB9O1xyXG5cclxuICB9O1xyXG59O1xyXG5cclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlZDbUVzd1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2NvbW1vblxcXFxzZXJ2aWNlc1xcXFxnZXRSb29tLmpzXCIsXCIvY29tbW9uXFxcXHNlcnZpY2VzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnZmlyZWJhc2UnKTtcclxudmFyIHV1aWQgPSByZXF1aXJlKCdub2RlLXV1aWQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGxvY2F0aW9uKSB7XHJcbiAgdGhpcy5jcmVhdGVSb29tID0gZnVuY3Rpb24oKSB7XHJcbiAgICAkbG9jYXRpb24ucGF0aCgnL3Jvb20vJyt1dWlkLnY0KCkpO1xyXG4gIH07XHJcbn07XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJWQ21Fc3dcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9jcmVhdGVcXFxcY29udHJvbGxlcnNcXFxcQ3JlYXRlQ29udHJvbGxlci5qc1wiLFwiL2NyZWF0ZVxcXFxjb250cm9sbGVyc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIGdsb2JhbHMgYW5ndWxhciAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ3BsYW5uaW5nUG9rZXIuY3JlYXRlJywgW10pO1xyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ0NyZWF0ZUNvbnRyb2xsZXInLCByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL0NyZWF0ZUNvbnRyb2xsZXInKSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFwcDtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlZDbUVzd1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2NyZWF0ZVxcXFxpbmRleC5qc1wiLFwiL2NyZWF0ZVwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIGdsb2JhbHMgYW5ndWxhciAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5yZXF1aXJlKCdhbmd1bGFyLXJvdXRlJyk7XHJcblxyXG52YXIgY3JlYXRlTW9kdWxlID0gcmVxdWlyZSgnLi9jcmVhdGUnKTtcclxudmFyIHJvb21Nb2R1bGUgPSByZXF1aXJlKCcuL3Jvb20nKTtcclxudmFyIGpvaW5Nb2R1bGUgPSByZXF1aXJlKCcuL2pvaW4nKTtcclxuXHJcbnZhciByb3V0ZXMgPSByZXF1aXJlKCcuL3JvdXRlcycpO1xyXG5cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdwbGFubmluZ1Bva2VyJywgW1xyXG4gICduZ1JvdXRlJyxcclxuICAnZmlyZWJhc2UnLFxyXG4gIGNyZWF0ZU1vZHVsZS5uYW1lLFxyXG4gIHJvb21Nb2R1bGUubmFtZSxcclxuICBqb2luTW9kdWxlLm5hbWVcclxuXSk7XHJcblxyXG5hcHAuZmFjdG9yeSgnZ2V0Um9vbScsIHJlcXVpcmUoJy4vY29tbW9uL3NlcnZpY2VzL2dldFJvb20nKSk7XHJcbmFwcC5mYWN0b3J5KCdmaXJlYmFzZVN5bmMnLCByZXF1aXJlKCcuL2NvbW1vbi9zZXJ2aWNlcy9maXJlYmFzZVN5bmMnKSk7XHJcblxyXG5hcHAuY29uZmlnKHJvdXRlcyk7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJWQ21Fc3dcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9mYWtlX2Y3OWVlNWNmLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIHJvb20pIHtcclxuXHJcbiAgdGhpcy5zdWJtaXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJvb20uam9pbigkc2NvcGUubmFtZSkudGhlbihmdW5jdGlvbihuZXdDaGlsZFJlZikge1xyXG5cclxuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9yb29tLycgKyByb29tLmdldElkKCkgKyAnLycgKyBuZXdDaGlsZFJlZi5uYW1lKCkpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxufTtcclxuXHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJWQ21Fc3dcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9qb2luXFxcXGNvbnRyb2xsZXJzXFxcXEpvaW5Db250cm9sbGVyLmpzXCIsXCIvam9pblxcXFxjb250cm9sbGVyc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8vcmVxdWlyZSgnYW5ndWxhcicpO1xyXG5cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdwbGFubmluZ1Bva2VyLmpvaW4nLCBbXSk7XHJcblxyXG5hcHAuY29udHJvbGxlcignSm9pbkNvbnRyb2xsZXInLCByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL0pvaW5Db250cm9sbGVyJykpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhcHA7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJWQ21Fc3dcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9qb2luXFxcXGluZGV4LmpzXCIsXCIvam9pblwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHJvdXRlUGFyYW1zLCAkc2NvcGUsICRsb2NhdGlvbiwgcm9vbSkge1xyXG4gIHZhciB1c2VySWQgPSAkcm91dGVQYXJhbXMudXNlcklkO1xyXG5cclxuICB0aGlzLmNhcmRzID0gWyAnPycsICcuNScsICcxJywgJzInLCAnMycsICc1JywgJzgnLCAnMTMnLCAnMjAnLCAnMTAwJywgJ+KInicgXTtcclxuXHJcbiAgdmFyIHVzZXJzID0gcm9vbS5nZXRVc2VycygpO1xyXG4gIHRoaXMudXNlcnMgPSB1c2VycztcclxuXHJcbiAgdGhpcy5hdHRyaWJ1dGVzID0gcm9vbS5nZXRBdHRyaWJ1dGVzKCk7XHJcblxyXG4gIHRoaXMuam9pblVyaSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHVyaSA9ICRsb2NhdGlvbi5hYnNVcmwoKTtcclxuXHJcbiAgICB2YXIgaW5kZXggPSB1cmkubGFzdEluZGV4T2YoJy8nKTtcclxuXHJcbiAgICByZXR1cm4gIHVyaS5zdWJzdHJpbmcoMCxpbmRleCk7XHJcbiAgfTtcclxuXHJcbiAgdXNlcnMuJHdhdGNoKGZ1bmN0aW9uKCkge1xyXG4gICAgdXNlcnMuZm9yRWFjaChmdW5jdGlvbih1c2VyKSB7XHJcbiAgICAgIGlmKHVzZXIuJGlkID09PSB1c2VySWQpIHtcclxuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRDYXJkID0gdXNlci5jYXJkO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgdGhpcy52b3RlID0gZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgcm9vbS52b3RlKHVzZXJJZCwgY2FyZCk7XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5yZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcm9vbS5yZXNldCgpO1xyXG4gIH07XHJcblxyXG4gIHRoaXMuc2hvdyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcm9vbS5zaG93KCk7XHJcbiAgfTtcclxuXHJcbn07XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJWQ21Fc3dcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9yb29tXFxcXGNvbnRyb2xsZXJzXFxcXFJvb21Db250cm9sbGVyLmpzXCIsXCIvcm9vbVxcXFxjb250cm9sbGVyc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgncGxhbm5pbmdQb2tlci5yb29tJywgW10pO1xyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ1Jvb21Db250cm9sbGVyJywgcmVxdWlyZSgnLi9jb250cm9sbGVycy9Sb29tQ29udHJvbGxlcicpKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYXBwO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiVkNtRXN3XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvcm9vbVxcXFxpbmRleC5qc1wiLFwiL3Jvb21cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4ndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbignLycsIHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9jcmVhdGUvY3JlYXRlLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogJ0NyZWF0ZUNvbnRyb2xsZXInLFxyXG4gICAgY29udHJvbGxlckFzOiAnY3JlYXRlJ1xyXG4gIH0pO1xyXG5cclxuICBmdW5jdGlvbiB2YWxpZGF0ZVJvb20oZ2V0Um9vbSwgJHJvdXRlKSB7XHJcbiAgICB2YXIgcm9vbUlkID0gJHJvdXRlLmN1cnJlbnQucGFyYW1zLnJvb21JZDtcclxuICAgIHZhciByb29tID0gZ2V0Um9vbShyb29tSWQpO1xyXG5cclxuICAgIHJldHVybiByb29tO1xyXG4gIH1cclxuXHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbignL3Jvb20vOnJvb21JZCcsIHtcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9qb2luL2pvaW4uaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiAnSm9pbkNvbnRyb2xsZXInLFxyXG4gICAgY29udHJvbGxlckFzOiAnam9pbicsXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIHJvb206IHZhbGlkYXRlUm9vbVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAkcm91dGVQcm92aWRlci53aGVuKCcvcm9vbS86cm9vbUlkLzp1c2VySWQnLCB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vcm9vbS9yb29tLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogJ1Jvb21Db250cm9sbGVyJyxcclxuICAgIGNvbnRyb2xsZXJBczogJ3Jvb20nLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICByb29tOiB2YWxpZGF0ZVJvb21cclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJHJvdXRlUHJvdmlkZXIud2hlbignL2Vycm9yJywge1xyXG4gICAgdGVtcGxhdGU6ICc8cD5FcnJvciBQYWdlIE5vdCBGb3VuZDwvcD4nXHJcbiAgfSk7XHJcblxyXG4gICRyb3V0ZVByb3ZpZGVyLm90aGVyd2lzZSh7XHJcbiAgICByZWRpcmVjdFRvOiAnL2Vycm9yJ1xyXG4gIH0pO1xyXG5cclxufTtcclxuXHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJWQ21Fc3dcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9yb3V0ZXMuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqIEBsaWNlbnNlIEFuZ3VsYXJKUyB2MS4zLjBcbiAqIChjKSAyMDEwLTIwMTQgR29vZ2xlLCBJbmMuIGh0dHA6Ly9hbmd1bGFyanMub3JnXG4gKiBMaWNlbnNlOiBNSVRcbiAqL1xuKGZ1bmN0aW9uKHdpbmRvdywgYW5ndWxhciwgdW5kZWZpbmVkKSB7J3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBuZ2RvYyBtb2R1bGVcbiAqIEBuYW1lIG5nUm91dGVcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqICMgbmdSb3V0ZVxuICpcbiAqIFRoZSBgbmdSb3V0ZWAgbW9kdWxlIHByb3ZpZGVzIHJvdXRpbmcgYW5kIGRlZXBsaW5raW5nIHNlcnZpY2VzIGFuZCBkaXJlY3RpdmVzIGZvciBhbmd1bGFyIGFwcHMuXG4gKlxuICogIyMgRXhhbXBsZVxuICogU2VlIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSNleGFtcGxlICRyb3V0ZX0gZm9yIGFuIGV4YW1wbGUgb2YgY29uZmlndXJpbmcgYW5kIHVzaW5nIGBuZ1JvdXRlYC5cbiAqXG4gKlxuICogPGRpdiBkb2MtbW9kdWxlLWNvbXBvbmVudHM9XCJuZ1JvdXRlXCI+PC9kaXY+XG4gKi9cbiAvKiBnbG9iYWwgLW5nUm91dGVNb2R1bGUgKi9cbnZhciBuZ1JvdXRlTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ25nUm91dGUnLCBbJ25nJ10pLlxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXIoJyRyb3V0ZScsICRSb3V0ZVByb3ZpZGVyKSxcbiAgICAkcm91dGVNaW5FcnIgPSBhbmd1bGFyLiQkbWluRXJyKCduZ1JvdXRlJyk7XG5cbi8qKlxuICogQG5nZG9jIHByb3ZpZGVyXG4gKiBAbmFtZSAkcm91dGVQcm92aWRlclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIFVzZWQgZm9yIGNvbmZpZ3VyaW5nIHJvdXRlcy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBTZWUge0BsaW5rIG5nUm91dGUuJHJvdXRlI2V4YW1wbGUgJHJvdXRlfSBmb3IgYW4gZXhhbXBsZSBvZiBjb25maWd1cmluZyBhbmQgdXNpbmcgYG5nUm91dGVgLlxuICpcbiAqICMjIERlcGVuZGVuY2llc1xuICogUmVxdWlyZXMgdGhlIHtAbGluayBuZ1JvdXRlIGBuZ1JvdXRlYH0gbW9kdWxlIHRvIGJlIGluc3RhbGxlZC5cbiAqL1xuZnVuY3Rpb24gJFJvdXRlUHJvdmlkZXIoKXtcbiAgZnVuY3Rpb24gaW5oZXJpdChwYXJlbnQsIGV4dHJhKSB7XG4gICAgcmV0dXJuIGFuZ3VsYXIuZXh0ZW5kKG5ldyAoYW5ndWxhci5leHRlbmQoZnVuY3Rpb24oKSB7fSwge3Byb3RvdHlwZTpwYXJlbnR9KSkoKSwgZXh0cmEpO1xuICB9XG5cbiAgdmFyIHJvdXRlcyA9IHt9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRyb3V0ZVByb3ZpZGVyI3doZW5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggUm91dGUgcGF0aCAobWF0Y2hlZCBhZ2FpbnN0IGAkbG9jYXRpb24ucGF0aGApLiBJZiBgJGxvY2F0aW9uLnBhdGhgXG4gICAqICAgIGNvbnRhaW5zIHJlZHVuZGFudCB0cmFpbGluZyBzbGFzaCBvciBpcyBtaXNzaW5nIG9uZSwgdGhlIHJvdXRlIHdpbGwgc3RpbGwgbWF0Y2ggYW5kIHRoZVxuICAgKiAgICBgJGxvY2F0aW9uLnBhdGhgIHdpbGwgYmUgdXBkYXRlZCB0byBhZGQgb3IgZHJvcCB0aGUgdHJhaWxpbmcgc2xhc2ggdG8gZXhhY3RseSBtYXRjaCB0aGVcbiAgICogICAgcm91dGUgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogICAgKiBgcGF0aGAgY2FuIGNvbnRhaW4gbmFtZWQgZ3JvdXBzIHN0YXJ0aW5nIHdpdGggYSBjb2xvbjogZS5nLiBgOm5hbWVgLiBBbGwgY2hhcmFjdGVycyB1cFxuICAgKiAgICAgICAgdG8gdGhlIG5leHQgc2xhc2ggYXJlIG1hdGNoZWQgYW5kIHN0b3JlZCBpbiBgJHJvdXRlUGFyYW1zYCB1bmRlciB0aGUgZ2l2ZW4gYG5hbWVgXG4gICAqICAgICAgICB3aGVuIHRoZSByb3V0ZSBtYXRjaGVzLlxuICAgKiAgICAqIGBwYXRoYCBjYW4gY29udGFpbiBuYW1lZCBncm91cHMgc3RhcnRpbmcgd2l0aCBhIGNvbG9uIGFuZCBlbmRpbmcgd2l0aCBhIHN0YXI6XG4gICAqICAgICAgICBlLmcuYDpuYW1lKmAuIEFsbCBjaGFyYWN0ZXJzIGFyZSBlYWdlcmx5IHN0b3JlZCBpbiBgJHJvdXRlUGFyYW1zYCB1bmRlciB0aGUgZ2l2ZW4gYG5hbWVgXG4gICAqICAgICAgICB3aGVuIHRoZSByb3V0ZSBtYXRjaGVzLlxuICAgKiAgICAqIGBwYXRoYCBjYW4gY29udGFpbiBvcHRpb25hbCBuYW1lZCBncm91cHMgd2l0aCBhIHF1ZXN0aW9uIG1hcms6IGUuZy5gOm5hbWU/YC5cbiAgICpcbiAgICogICAgRm9yIGV4YW1wbGUsIHJvdXRlcyBsaWtlIGAvY29sb3IvOmNvbG9yL2xhcmdlY29kZS86bGFyZ2Vjb2RlKlxcL2VkaXRgIHdpbGwgbWF0Y2hcbiAgICogICAgYC9jb2xvci9icm93bi9sYXJnZWNvZGUvY29kZS93aXRoL3NsYXNoZXMvZWRpdGAgYW5kIGV4dHJhY3Q6XG4gICAqXG4gICAqICAgICogYGNvbG9yOiBicm93bmBcbiAgICogICAgKiBgbGFyZ2Vjb2RlOiBjb2RlL3dpdGgvc2xhc2hlc2AuXG4gICAqXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByb3V0ZSBNYXBwaW5nIGluZm9ybWF0aW9uIHRvIGJlIGFzc2lnbmVkIHRvIGAkcm91dGUuY3VycmVudGAgb24gcm91dGVcbiAgICogICAgbWF0Y2guXG4gICAqXG4gICAqICAgIE9iamVjdCBwcm9wZXJ0aWVzOlxuICAgKlxuICAgKiAgICAtIGBjb250cm9sbGVyYCDigJMgYHsoc3RyaW5nfGZ1bmN0aW9uKCk9fWAg4oCTIENvbnRyb2xsZXIgZm4gdGhhdCBzaG91bGQgYmUgYXNzb2NpYXRlZCB3aXRoXG4gICAqICAgICAgbmV3bHkgY3JlYXRlZCBzY29wZSBvciB0aGUgbmFtZSBvZiBhIHtAbGluayBhbmd1bGFyLk1vZHVsZSNjb250cm9sbGVyIHJlZ2lzdGVyZWRcbiAgICogICAgICBjb250cm9sbGVyfSBpZiBwYXNzZWQgYXMgYSBzdHJpbmcuXG4gICAqICAgIC0gYGNvbnRyb2xsZXJBc2Ag4oCTIGB7c3RyaW5nPX1gIOKAkyBBIGNvbnRyb2xsZXIgYWxpYXMgbmFtZS4gSWYgcHJlc2VudCB0aGUgY29udHJvbGxlciB3aWxsIGJlXG4gICAqICAgICAgcHVibGlzaGVkIHRvIHNjb3BlIHVuZGVyIHRoZSBgY29udHJvbGxlckFzYCBuYW1lLlxuICAgKiAgICAtIGB0ZW1wbGF0ZWAg4oCTIGB7c3RyaW5nPXxmdW5jdGlvbigpPX1gIOKAkyBodG1sIHRlbXBsYXRlIGFzIGEgc3RyaW5nIG9yIGEgZnVuY3Rpb24gdGhhdFxuICAgKiAgICAgIHJldHVybnMgYW4gaHRtbCB0ZW1wbGF0ZSBhcyBhIHN0cmluZyB3aGljaCBzaG91bGQgYmUgdXNlZCBieSB7QGxpbmtcbiAgICogICAgICBuZ1JvdXRlLmRpcmVjdGl2ZTpuZ1ZpZXcgbmdWaWV3fSBvciB7QGxpbmsgbmcuZGlyZWN0aXZlOm5nSW5jbHVkZSBuZ0luY2x1ZGV9IGRpcmVjdGl2ZXMuXG4gICAqICAgICAgVGhpcyBwcm9wZXJ0eSB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgYHRlbXBsYXRlVXJsYC5cbiAgICpcbiAgICogICAgICBJZiBgdGVtcGxhdGVgIGlzIGEgZnVuY3Rpb24sIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgKlxuICAgKiAgICAgIC0gYHtBcnJheS48T2JqZWN0Pn1gIC0gcm91dGUgcGFyYW1ldGVycyBleHRyYWN0ZWQgZnJvbSB0aGUgY3VycmVudFxuICAgKiAgICAgICAgYCRsb2NhdGlvbi5wYXRoKClgIGJ5IGFwcGx5aW5nIHRoZSBjdXJyZW50IHJvdXRlXG4gICAqXG4gICAqICAgIC0gYHRlbXBsYXRlVXJsYCDigJMgYHtzdHJpbmc9fGZ1bmN0aW9uKCk9fWAg4oCTIHBhdGggb3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcGF0aCB0byBhbiBodG1sXG4gICAqICAgICAgdGVtcGxhdGUgdGhhdCBzaG91bGQgYmUgdXNlZCBieSB7QGxpbmsgbmdSb3V0ZS5kaXJlY3RpdmU6bmdWaWV3IG5nVmlld30uXG4gICAqXG4gICAqICAgICAgSWYgYHRlbXBsYXRlVXJsYCBpcyBhIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyczpcbiAgICpcbiAgICogICAgICAtIGB7QXJyYXkuPE9iamVjdD59YCAtIHJvdXRlIHBhcmFtZXRlcnMgZXh0cmFjdGVkIGZyb20gdGhlIGN1cnJlbnRcbiAgICogICAgICAgIGAkbG9jYXRpb24ucGF0aCgpYCBieSBhcHBseWluZyB0aGUgY3VycmVudCByb3V0ZVxuICAgKlxuICAgKiAgICAtIGByZXNvbHZlYCAtIGB7T2JqZWN0LjxzdHJpbmcsIGZ1bmN0aW9uPj19YCAtIEFuIG9wdGlvbmFsIG1hcCBvZiBkZXBlbmRlbmNpZXMgd2hpY2ggc2hvdWxkXG4gICAqICAgICAgYmUgaW5qZWN0ZWQgaW50byB0aGUgY29udHJvbGxlci4gSWYgYW55IG9mIHRoZXNlIGRlcGVuZGVuY2llcyBhcmUgcHJvbWlzZXMsIHRoZSByb3V0ZXJcbiAgICogICAgICB3aWxsIHdhaXQgZm9yIHRoZW0gYWxsIHRvIGJlIHJlc29sdmVkIG9yIG9uZSB0byBiZSByZWplY3RlZCBiZWZvcmUgdGhlIGNvbnRyb2xsZXIgaXNcbiAgICogICAgICBpbnN0YW50aWF0ZWQuXG4gICAqICAgICAgSWYgYWxsIHRoZSBwcm9taXNlcyBhcmUgcmVzb2x2ZWQgc3VjY2Vzc2Z1bGx5LCB0aGUgdmFsdWVzIG9mIHRoZSByZXNvbHZlZCBwcm9taXNlcyBhcmVcbiAgICogICAgICBpbmplY3RlZCBhbmQge0BsaW5rIG5nUm91dGUuJHJvdXRlIyRyb3V0ZUNoYW5nZVN1Y2Nlc3MgJHJvdXRlQ2hhbmdlU3VjY2Vzc30gZXZlbnQgaXNcbiAgICogICAgICBmaXJlZC4gSWYgYW55IG9mIHRoZSBwcm9taXNlcyBhcmUgcmVqZWN0ZWQgdGhlXG4gICAqICAgICAge0BsaW5rIG5nUm91dGUuJHJvdXRlIyRyb3V0ZUNoYW5nZUVycm9yICRyb3V0ZUNoYW5nZUVycm9yfSBldmVudCBpcyBmaXJlZC4gVGhlIG1hcCBvYmplY3RcbiAgICogICAgICBpczpcbiAgICpcbiAgICogICAgICAtIGBrZXlgIOKAkyBge3N0cmluZ31gOiBhIG5hbWUgb2YgYSBkZXBlbmRlbmN5IHRvIGJlIGluamVjdGVkIGludG8gdGhlIGNvbnRyb2xsZXIuXG4gICAqICAgICAgLSBgZmFjdG9yeWAgLSBge3N0cmluZ3xmdW5jdGlvbn1gOiBJZiBgc3RyaW5nYCB0aGVuIGl0IGlzIGFuIGFsaWFzIGZvciBhIHNlcnZpY2UuXG4gICAqICAgICAgICBPdGhlcndpc2UgaWYgZnVuY3Rpb24sIHRoZW4gaXQgaXMge0BsaW5rIGF1dG8uJGluamVjdG9yI2ludm9rZSBpbmplY3RlZH1cbiAgICogICAgICAgIGFuZCB0aGUgcmV0dXJuIHZhbHVlIGlzIHRyZWF0ZWQgYXMgdGhlIGRlcGVuZGVuY3kuIElmIHRoZSByZXN1bHQgaXMgYSBwcm9taXNlLCBpdCBpc1xuICAgKiAgICAgICAgcmVzb2x2ZWQgYmVmb3JlIGl0cyB2YWx1ZSBpcyBpbmplY3RlZCBpbnRvIHRoZSBjb250cm9sbGVyLiBCZSBhd2FyZSB0aGF0XG4gICAqICAgICAgICBgbmdSb3V0ZS4kcm91dGVQYXJhbXNgIHdpbGwgc3RpbGwgcmVmZXIgdG8gdGhlIHByZXZpb3VzIHJvdXRlIHdpdGhpbiB0aGVzZSByZXNvbHZlXG4gICAqICAgICAgICBmdW5jdGlvbnMuICBVc2UgYCRyb3V0ZS5jdXJyZW50LnBhcmFtc2AgdG8gYWNjZXNzIHRoZSBuZXcgcm91dGUgcGFyYW1ldGVycywgaW5zdGVhZC5cbiAgICpcbiAgICogICAgLSBgcmVkaXJlY3RUb2Ag4oCTIHsoc3RyaW5nfGZ1bmN0aW9uKCkpPX0g4oCTIHZhbHVlIHRvIHVwZGF0ZVxuICAgKiAgICAgIHtAbGluayBuZy4kbG9jYXRpb24gJGxvY2F0aW9ufSBwYXRoIHdpdGggYW5kIHRyaWdnZXIgcm91dGUgcmVkaXJlY3Rpb24uXG4gICAqXG4gICAqICAgICAgSWYgYHJlZGlyZWN0VG9gIGlzIGEgZnVuY3Rpb24sIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgKlxuICAgKiAgICAgIC0gYHtPYmplY3QuPHN0cmluZz59YCAtIHJvdXRlIHBhcmFtZXRlcnMgZXh0cmFjdGVkIGZyb20gdGhlIGN1cnJlbnRcbiAgICogICAgICAgIGAkbG9jYXRpb24ucGF0aCgpYCBieSBhcHBseWluZyB0aGUgY3VycmVudCByb3V0ZSB0ZW1wbGF0ZVVybC5cbiAgICogICAgICAtIGB7c3RyaW5nfWAgLSBjdXJyZW50IGAkbG9jYXRpb24ucGF0aCgpYFxuICAgKiAgICAgIC0gYHtPYmplY3R9YCAtIGN1cnJlbnQgYCRsb2NhdGlvbi5zZWFyY2goKWBcbiAgICpcbiAgICogICAgICBUaGUgY3VzdG9tIGByZWRpcmVjdFRvYCBmdW5jdGlvbiBpcyBleHBlY3RlZCB0byByZXR1cm4gYSBzdHJpbmcgd2hpY2ggd2lsbCBiZSB1c2VkXG4gICAqICAgICAgdG8gdXBkYXRlIGAkbG9jYXRpb24ucGF0aCgpYCBhbmQgYCRsb2NhdGlvbi5zZWFyY2goKWAuXG4gICAqXG4gICAqICAgIC0gYFtyZWxvYWRPblNlYXJjaD10cnVlXWAgLSB7Ym9vbGVhbj19IC0gcmVsb2FkIHJvdXRlIHdoZW4gb25seSBgJGxvY2F0aW9uLnNlYXJjaCgpYFxuICAgKiAgICAgIG9yIGAkbG9jYXRpb24uaGFzaCgpYCBjaGFuZ2VzLlxuICAgKlxuICAgKiAgICAgIElmIHRoZSBvcHRpb24gaXMgc2V0IHRvIGBmYWxzZWAgYW5kIHVybCBpbiB0aGUgYnJvd3NlciBjaGFuZ2VzLCB0aGVuXG4gICAqICAgICAgYCRyb3V0ZVVwZGF0ZWAgZXZlbnQgaXMgYnJvYWRjYXN0ZWQgb24gdGhlIHJvb3Qgc2NvcGUuXG4gICAqXG4gICAqICAgIC0gYFtjYXNlSW5zZW5zaXRpdmVNYXRjaD1mYWxzZV1gIC0ge2Jvb2xlYW49fSAtIG1hdGNoIHJvdXRlcyB3aXRob3V0IGJlaW5nIGNhc2Ugc2Vuc2l0aXZlXG4gICAqXG4gICAqICAgICAgSWYgdGhlIG9wdGlvbiBpcyBzZXQgdG8gYHRydWVgLCB0aGVuIHRoZSBwYXJ0aWN1bGFyIHJvdXRlIGNhbiBiZSBtYXRjaGVkIHdpdGhvdXQgYmVpbmdcbiAgICogICAgICBjYXNlIHNlbnNpdGl2ZVxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBzZWxmXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBZGRzIGEgbmV3IHJvdXRlIGRlZmluaXRpb24gdG8gdGhlIGAkcm91dGVgIHNlcnZpY2UuXG4gICAqL1xuICB0aGlzLndoZW4gPSBmdW5jdGlvbihwYXRoLCByb3V0ZSkge1xuICAgIHJvdXRlc1twYXRoXSA9IGFuZ3VsYXIuZXh0ZW5kKFxuICAgICAge3JlbG9hZE9uU2VhcmNoOiB0cnVlfSxcbiAgICAgIHJvdXRlLFxuICAgICAgcGF0aCAmJiBwYXRoUmVnRXhwKHBhdGgsIHJvdXRlKVxuICAgICk7XG5cbiAgICAvLyBjcmVhdGUgcmVkaXJlY3Rpb24gZm9yIHRyYWlsaW5nIHNsYXNoZXNcbiAgICBpZiAocGF0aCkge1xuICAgICAgdmFyIHJlZGlyZWN0UGF0aCA9IChwYXRoW3BhdGgubGVuZ3RoLTFdID09ICcvJylcbiAgICAgICAgICAgID8gcGF0aC5zdWJzdHIoMCwgcGF0aC5sZW5ndGgtMSlcbiAgICAgICAgICAgIDogcGF0aCArJy8nO1xuXG4gICAgICByb3V0ZXNbcmVkaXJlY3RQYXRoXSA9IGFuZ3VsYXIuZXh0ZW5kKFxuICAgICAgICB7cmVkaXJlY3RUbzogcGF0aH0sXG4gICAgICAgIHBhdGhSZWdFeHAocmVkaXJlY3RQYXRoLCByb3V0ZSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgIC8qKlxuICAgICogQHBhcmFtIHBhdGgge3N0cmluZ30gcGF0aFxuICAgICogQHBhcmFtIG9wdHMge09iamVjdH0gb3B0aW9uc1xuICAgICogQHJldHVybiB7P09iamVjdH1cbiAgICAqXG4gICAgKiBAZGVzY3JpcHRpb25cbiAgICAqIE5vcm1hbGl6ZXMgdGhlIGdpdmVuIHBhdGgsIHJldHVybmluZyBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuICAgICogYW5kIHRoZSBvcmlnaW5hbCBwYXRoLlxuICAgICpcbiAgICAqIEluc3BpcmVkIGJ5IHBhdGhSZXhwIGluIHZpc2lvbm1lZGlhL2V4cHJlc3MvbGliL3V0aWxzLmpzLlxuICAgICovXG4gIGZ1bmN0aW9uIHBhdGhSZWdFeHAocGF0aCwgb3B0cykge1xuICAgIHZhciBpbnNlbnNpdGl2ZSA9IG9wdHMuY2FzZUluc2Vuc2l0aXZlTWF0Y2gsXG4gICAgICAgIHJldCA9IHtcbiAgICAgICAgICBvcmlnaW5hbFBhdGg6IHBhdGgsXG4gICAgICAgICAgcmVnZXhwOiBwYXRoXG4gICAgICAgIH0sXG4gICAgICAgIGtleXMgPSByZXQua2V5cyA9IFtdO1xuXG4gICAgcGF0aCA9IHBhdGhcbiAgICAgIC5yZXBsYWNlKC8oWygpLl0pL2csICdcXFxcJDEnKVxuICAgICAgLnJlcGxhY2UoLyhcXC8pPzooXFx3KykoW1xcP1xcKl0pPy9nLCBmdW5jdGlvbihfLCBzbGFzaCwga2V5LCBvcHRpb24pe1xuICAgICAgICB2YXIgb3B0aW9uYWwgPSBvcHRpb24gPT09ICc/JyA/IG9wdGlvbiA6IG51bGw7XG4gICAgICAgIHZhciBzdGFyID0gb3B0aW9uID09PSAnKicgPyBvcHRpb24gOiBudWxsO1xuICAgICAgICBrZXlzLnB1c2goeyBuYW1lOiBrZXksIG9wdGlvbmFsOiAhIW9wdGlvbmFsIH0pO1xuICAgICAgICBzbGFzaCA9IHNsYXNoIHx8ICcnO1xuICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICArIChvcHRpb25hbCA/ICcnIDogc2xhc2gpXG4gICAgICAgICAgKyAnKD86J1xuICAgICAgICAgICsgKG9wdGlvbmFsID8gc2xhc2ggOiAnJylcbiAgICAgICAgICArIChzdGFyICYmICcoLis/KScgfHwgJyhbXi9dKyknKVxuICAgICAgICAgICsgKG9wdGlvbmFsIHx8ICcnKVxuICAgICAgICAgICsgJyknXG4gICAgICAgICAgKyAob3B0aW9uYWwgfHwgJycpO1xuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlKC8oW1xcLyRcXCpdKS9nLCAnXFxcXCQxJyk7XG5cbiAgICByZXQucmVnZXhwID0gbmV3IFJlZ0V4cCgnXicgKyBwYXRoICsgJyQnLCBpbnNlbnNpdGl2ZSA/ICdpJyA6ICcnKTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJHJvdXRlUHJvdmlkZXIjb3RoZXJ3aXNlXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBTZXRzIHJvdXRlIGRlZmluaXRpb24gdGhhdCB3aWxsIGJlIHVzZWQgb24gcm91dGUgY2hhbmdlIHdoZW4gbm8gb3RoZXIgcm91dGUgZGVmaW5pdGlvblxuICAgKiBpcyBtYXRjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IHBhcmFtcyBNYXBwaW5nIGluZm9ybWF0aW9uIHRvIGJlIGFzc2lnbmVkIHRvIGAkcm91dGUuY3VycmVudGAuXG4gICAqIElmIGNhbGxlZCB3aXRoIGEgc3RyaW5nLCB0aGUgdmFsdWUgbWFwcyB0byBgcmVkaXJlY3RUb2AuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHNlbGZcbiAgICovXG4gIHRoaXMub3RoZXJ3aXNlID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwYXJhbXMgPSB7cmVkaXJlY3RUbzogcGFyYW1zfTtcbiAgICB9XG4gICAgdGhpcy53aGVuKG51bGwsIHBhcmFtcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICB0aGlzLiRnZXQgPSBbJyRyb290U2NvcGUnLFxuICAgICAgICAgICAgICAgJyRsb2NhdGlvbicsXG4gICAgICAgICAgICAgICAnJHJvdXRlUGFyYW1zJyxcbiAgICAgICAgICAgICAgICckcScsXG4gICAgICAgICAgICAgICAnJGluamVjdG9yJyxcbiAgICAgICAgICAgICAgICckdGVtcGxhdGVSZXF1ZXN0JyxcbiAgICAgICAgICAgICAgICckc2NlJyxcbiAgICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zLCAkcSwgJGluamVjdG9yLCAkdGVtcGxhdGVSZXF1ZXN0LCAkc2NlKSB7XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2Mgc2VydmljZVxuICAgICAqIEBuYW1lICRyb3V0ZVxuICAgICAqIEByZXF1aXJlcyAkbG9jYXRpb25cbiAgICAgKiBAcmVxdWlyZXMgJHJvdXRlUGFyYW1zXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge09iamVjdH0gY3VycmVudCBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnQgcm91dGUgZGVmaW5pdGlvbi5cbiAgICAgKiBUaGUgcm91dGUgZGVmaW5pdGlvbiBjb250YWluczpcbiAgICAgKlxuICAgICAqICAgLSBgY29udHJvbGxlcmA6IFRoZSBjb250cm9sbGVyIGNvbnN0cnVjdG9yIGFzIGRlZmluZSBpbiByb3V0ZSBkZWZpbml0aW9uLlxuICAgICAqICAgLSBgbG9jYWxzYDogQSBtYXAgb2YgbG9jYWxzIHdoaWNoIGlzIHVzZWQgYnkge0BsaW5rIG5nLiRjb250cm9sbGVyICRjb250cm9sbGVyfSBzZXJ2aWNlIGZvclxuICAgICAqICAgICBjb250cm9sbGVyIGluc3RhbnRpYXRpb24uIFRoZSBgbG9jYWxzYCBjb250YWluXG4gICAgICogICAgIHRoZSByZXNvbHZlZCB2YWx1ZXMgb2YgdGhlIGByZXNvbHZlYCBtYXAuIEFkZGl0aW9uYWxseSB0aGUgYGxvY2Fsc2AgYWxzbyBjb250YWluOlxuICAgICAqXG4gICAgICogICAgIC0gYCRzY29wZWAgLSBUaGUgY3VycmVudCByb3V0ZSBzY29wZS5cbiAgICAgKiAgICAgLSBgJHRlbXBsYXRlYCAtIFRoZSBjdXJyZW50IHJvdXRlIHRlbXBsYXRlIEhUTUwuXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge09iamVjdH0gcm91dGVzIE9iamVjdCB3aXRoIGFsbCByb3V0ZSBjb25maWd1cmF0aW9uIE9iamVjdHMgYXMgaXRzIHByb3BlcnRpZXMuXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBgJHJvdXRlYCBpcyB1c2VkIGZvciBkZWVwLWxpbmtpbmcgVVJMcyB0byBjb250cm9sbGVycyBhbmQgdmlld3MgKEhUTUwgcGFydGlhbHMpLlxuICAgICAqIEl0IHdhdGNoZXMgYCRsb2NhdGlvbi51cmwoKWAgYW5kIHRyaWVzIHRvIG1hcCB0aGUgcGF0aCB0byBhbiBleGlzdGluZyByb3V0ZSBkZWZpbml0aW9uLlxuICAgICAqXG4gICAgICogUmVxdWlyZXMgdGhlIHtAbGluayBuZ1JvdXRlIGBuZ1JvdXRlYH0gbW9kdWxlIHRvIGJlIGluc3RhbGxlZC5cbiAgICAgKlxuICAgICAqIFlvdSBjYW4gZGVmaW5lIHJvdXRlcyB0aHJvdWdoIHtAbGluayBuZ1JvdXRlLiRyb3V0ZVByb3ZpZGVyICRyb3V0ZVByb3ZpZGVyfSdzIEFQSS5cbiAgICAgKlxuICAgICAqIFRoZSBgJHJvdXRlYCBzZXJ2aWNlIGlzIHR5cGljYWxseSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggdGhlXG4gICAgICoge0BsaW5rIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBgbmdWaWV3YH0gZGlyZWN0aXZlIGFuZCB0aGVcbiAgICAgKiB7QGxpbmsgbmdSb3V0ZS4kcm91dGVQYXJhbXMgYCRyb3V0ZVBhcmFtc2B9IHNlcnZpY2UuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIFRoaXMgZXhhbXBsZSBzaG93cyBob3cgY2hhbmdpbmcgdGhlIFVSTCBoYXNoIGNhdXNlcyB0aGUgYCRyb3V0ZWAgdG8gbWF0Y2ggYSByb3V0ZSBhZ2FpbnN0IHRoZVxuICAgICAqIFVSTCwgYW5kIHRoZSBgbmdWaWV3YCBwdWxscyBpbiB0aGUgcGFydGlhbC5cbiAgICAgKlxuICAgICAqIDxleGFtcGxlIG5hbWU9XCIkcm91dGUtc2VydmljZVwiIG1vZHVsZT1cIm5nUm91dGVFeGFtcGxlXCJcbiAgICAgKiAgICAgICAgICBkZXBzPVwiYW5ndWxhci1yb3V0ZS5qc1wiIGZpeEJhc2U9XCJ0cnVlXCI+XG4gICAgICogICA8ZmlsZSBuYW1lPVwiaW5kZXguaHRtbFwiPlxuICAgICAqICAgICA8ZGl2IG5nLWNvbnRyb2xsZXI9XCJNYWluQ29udHJvbGxlclwiPlxuICAgICAqICAgICAgIENob29zZTpcbiAgICAgKiAgICAgICA8YSBocmVmPVwiQm9vay9Nb2J5XCI+TW9ieTwvYT4gfFxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL01vYnkvY2gvMVwiPk1vYnk6IENoMTwvYT4gfFxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL0dhdHNieVwiPkdhdHNieTwvYT4gfFxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL0dhdHNieS9jaC80P2tleT12YWx1ZVwiPkdhdHNieTogQ2g0PC9hPiB8XG4gICAgICogICAgICAgPGEgaHJlZj1cIkJvb2svU2NhcmxldFwiPlNjYXJsZXQgTGV0dGVyPC9hPjxici8+XG4gICAgICpcbiAgICAgKiAgICAgICA8ZGl2IG5nLXZpZXc+PC9kaXY+XG4gICAgICpcbiAgICAgKiAgICAgICA8aHIgLz5cbiAgICAgKlxuICAgICAqICAgICAgIDxwcmU+JGxvY2F0aW9uLnBhdGgoKSA9IHt7JGxvY2F0aW9uLnBhdGgoKX19PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGUuY3VycmVudC50ZW1wbGF0ZVVybCA9IHt7JHJvdXRlLmN1cnJlbnQudGVtcGxhdGVVcmx9fTwvcHJlPlxuICAgICAqICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQucGFyYW1zID0ge3skcm91dGUuY3VycmVudC5wYXJhbXN9fTwvcHJlPlxuICAgICAqICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQuc2NvcGUubmFtZSA9IHt7JHJvdXRlLmN1cnJlbnQuc2NvcGUubmFtZX19PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGVQYXJhbXMgPSB7eyRyb3V0ZVBhcmFtc319PC9wcmU+XG4gICAgICogICAgIDwvZGl2PlxuICAgICAqICAgPC9maWxlPlxuICAgICAqXG4gICAgICogICA8ZmlsZSBuYW1lPVwiYm9vay5odG1sXCI+XG4gICAgICogICAgIGNvbnRyb2xsZXI6IHt7bmFtZX19PGJyIC8+XG4gICAgICogICAgIEJvb2sgSWQ6IHt7cGFyYW1zLmJvb2tJZH19PGJyIC8+XG4gICAgICogICA8L2ZpbGU+XG4gICAgICpcbiAgICAgKiAgIDxmaWxlIG5hbWU9XCJjaGFwdGVyLmh0bWxcIj5cbiAgICAgKiAgICAgY29udHJvbGxlcjoge3tuYW1lfX08YnIgLz5cbiAgICAgKiAgICAgQm9vayBJZDoge3twYXJhbXMuYm9va0lkfX08YnIgLz5cbiAgICAgKiAgICAgQ2hhcHRlciBJZDoge3twYXJhbXMuY2hhcHRlcklkfX1cbiAgICAgKiAgIDwvZmlsZT5cbiAgICAgKlxuICAgICAqICAgPGZpbGUgbmFtZT1cInNjcmlwdC5qc1wiPlxuICAgICAqICAgICBhbmd1bGFyLm1vZHVsZSgnbmdSb3V0ZUV4YW1wbGUnLCBbJ25nUm91dGUnXSlcbiAgICAgKlxuICAgICAqICAgICAgLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm91dGUsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uKSB7XG4gICAgICogICAgICAgICAgJHNjb3BlLiRyb3V0ZSA9ICRyb3V0ZTtcbiAgICAgKiAgICAgICAgICAkc2NvcGUuJGxvY2F0aW9uID0gJGxvY2F0aW9uO1xuICAgICAqICAgICAgICAgICRzY29wZS4kcm91dGVQYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICogICAgICB9KVxuICAgICAqXG4gICAgICogICAgICAuY29udHJvbGxlcignQm9va0NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZVBhcmFtcykge1xuICAgICAqICAgICAgICAgICRzY29wZS5uYW1lID0gXCJCb29rQ29udHJvbGxlclwiO1xuICAgICAqICAgICAgICAgICRzY29wZS5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICogICAgICB9KVxuICAgICAqXG4gICAgICogICAgICAuY29udHJvbGxlcignQ2hhcHRlckNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZVBhcmFtcykge1xuICAgICAqICAgICAgICAgICRzY29wZS5uYW1lID0gXCJDaGFwdGVyQ29udHJvbGxlclwiO1xuICAgICAqICAgICAgICAgICRzY29wZS5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICogICAgICB9KVxuICAgICAqXG4gICAgICogICAgIC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgICogICAgICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgKiAgICAgICAgLndoZW4oJy9Cb29rLzpib29rSWQnLCB7XG4gICAgICogICAgICAgICB0ZW1wbGF0ZVVybDogJ2Jvb2suaHRtbCcsXG4gICAgICogICAgICAgICBjb250cm9sbGVyOiAnQm9va0NvbnRyb2xsZXInLFxuICAgICAqICAgICAgICAgcmVzb2x2ZToge1xuICAgICAqICAgICAgICAgICAvLyBJIHdpbGwgY2F1c2UgYSAxIHNlY29uZCBkZWxheVxuICAgICAqICAgICAgICAgICBkZWxheTogZnVuY3Rpb24oJHEsICR0aW1lb3V0KSB7XG4gICAgICogICAgICAgICAgICAgdmFyIGRlbGF5ID0gJHEuZGVmZXIoKTtcbiAgICAgKiAgICAgICAgICAgICAkdGltZW91dChkZWxheS5yZXNvbHZlLCAxMDAwKTtcbiAgICAgKiAgICAgICAgICAgICByZXR1cm4gZGVsYXkucHJvbWlzZTtcbiAgICAgKiAgICAgICAgICAgfVxuICAgICAqICAgICAgICAgfVxuICAgICAqICAgICAgIH0pXG4gICAgICogICAgICAgLndoZW4oJy9Cb29rLzpib29rSWQvY2gvOmNoYXB0ZXJJZCcsIHtcbiAgICAgKiAgICAgICAgIHRlbXBsYXRlVXJsOiAnY2hhcHRlci5odG1sJyxcbiAgICAgKiAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGFwdGVyQ29udHJvbGxlcidcbiAgICAgKiAgICAgICB9KTtcbiAgICAgKlxuICAgICAqICAgICAgIC8vIGNvbmZpZ3VyZSBodG1sNSB0byBnZXQgbGlua3Mgd29ya2luZyBvbiBqc2ZpZGRsZVxuICAgICAqICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAgKiAgICAgfSk7XG4gICAgICpcbiAgICAgKiAgIDwvZmlsZT5cbiAgICAgKlxuICAgICAqICAgPGZpbGUgbmFtZT1cInByb3RyYWN0b3IuanNcIiB0eXBlPVwicHJvdHJhY3RvclwiPlxuICAgICAqICAgICBpdCgnc2hvdWxkIGxvYWQgYW5kIGNvbXBpbGUgY29ycmVjdCB0ZW1wbGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAqICAgICAgIGVsZW1lbnQoYnkubGlua1RleHQoJ01vYnk6IENoMScpKS5jbGljaygpO1xuICAgICAqICAgICAgIHZhciBjb250ZW50ID0gZWxlbWVudChieS5jc3MoJ1tuZy12aWV3XScpKS5nZXRUZXh0KCk7XG4gICAgICogICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL2NvbnRyb2xsZXJcXDogQ2hhcHRlckNvbnRyb2xsZXIvKTtcbiAgICAgKiAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQm9vayBJZFxcOiBNb2J5Lyk7XG4gICAgICogICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0NoYXB0ZXIgSWRcXDogMS8pO1xuICAgICAqXG4gICAgICogICAgICAgZWxlbWVudChieS5wYXJ0aWFsTGlua1RleHQoJ1NjYXJsZXQnKSkuY2xpY2soKTtcbiAgICAgKlxuICAgICAqICAgICAgIGNvbnRlbnQgPSBlbGVtZW50KGJ5LmNzcygnW25nLXZpZXddJykpLmdldFRleHQoKTtcbiAgICAgKiAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvY29udHJvbGxlclxcOiBCb29rQ29udHJvbGxlci8pO1xuICAgICAqICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9Cb29rIElkXFw6IFNjYXJsZXQvKTtcbiAgICAgKiAgICAgfSk7XG4gICAgICogICA8L2ZpbGU+XG4gICAgICogPC9leGFtcGxlPlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGV2ZW50XG4gICAgICogQG5hbWUgJHJvdXRlIyRyb3V0ZUNoYW5nZVN0YXJ0XG4gICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEJyb2FkY2FzdGVkIGJlZm9yZSBhIHJvdXRlIGNoYW5nZS4gQXQgdGhpcyAgcG9pbnQgdGhlIHJvdXRlIHNlcnZpY2VzIHN0YXJ0c1xuICAgICAqIHJlc29sdmluZyBhbGwgb2YgdGhlIGRlcGVuZGVuY2llcyBuZWVkZWQgZm9yIHRoZSByb3V0ZSBjaGFuZ2UgdG8gb2NjdXIuXG4gICAgICogVHlwaWNhbGx5IHRoaXMgaW52b2x2ZXMgZmV0Y2hpbmcgdGhlIHZpZXcgdGVtcGxhdGUgYXMgd2VsbCBhcyBhbnkgZGVwZW5kZW5jaWVzXG4gICAgICogZGVmaW5lZCBpbiBgcmVzb2x2ZWAgcm91dGUgcHJvcGVydHkuIE9uY2UgIGFsbCBvZiB0aGUgZGVwZW5kZW5jaWVzIGFyZSByZXNvbHZlZFxuICAgICAqIGAkcm91dGVDaGFuZ2VTdWNjZXNzYCBpcyBmaXJlZC5cbiAgICAgKlxuICAgICAqIFRoZSByb3V0ZSBjaGFuZ2UgKGFuZCB0aGUgYCRsb2NhdGlvbmAgY2hhbmdlIHRoYXQgdHJpZ2dlcmVkIGl0KSBjYW4gYmUgcHJldmVudGVkXG4gICAgICogYnkgY2FsbGluZyBgcHJldmVudERlZmF1bHRgIG1ldGhvZCBvZiB0aGUgZXZlbnQuIFNlZSB7QGxpbmsgbmcuJHJvb3RTY29wZS5TY29wZSMkb259XG4gICAgICogZm9yIG1vcmUgZGV0YWlscyBhYm91dCBldmVudCBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYW5ndWxhckV2ZW50IFN5bnRoZXRpYyBldmVudCBvYmplY3QuXG4gICAgICogQHBhcmFtIHtSb3V0ZX0gbmV4dCBGdXR1cmUgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtSb3V0ZX0gY3VycmVudCBDdXJyZW50IHJvdXRlIGluZm9ybWF0aW9uLlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGV2ZW50XG4gICAgICogQG5hbWUgJHJvdXRlIyRyb3V0ZUNoYW5nZVN1Y2Nlc3NcbiAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQnJvYWRjYXN0ZWQgYWZ0ZXIgYSByb3V0ZSBkZXBlbmRlbmNpZXMgYXJlIHJlc29sdmVkLlxuICAgICAqIHtAbGluayBuZ1JvdXRlLmRpcmVjdGl2ZTpuZ1ZpZXcgbmdWaWV3fSBsaXN0ZW5zIGZvciB0aGUgZGlyZWN0aXZlXG4gICAgICogdG8gaW5zdGFudGlhdGUgdGhlIGNvbnRyb2xsZXIgYW5kIHJlbmRlciB0aGUgdmlldy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhbmd1bGFyRXZlbnQgU3ludGhldGljIGV2ZW50IG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBjdXJyZW50IEN1cnJlbnQgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtSb3V0ZXxVbmRlZmluZWR9IHByZXZpb3VzIFByZXZpb3VzIHJvdXRlIGluZm9ybWF0aW9uLCBvciB1bmRlZmluZWQgaWYgY3VycmVudCBpc1xuICAgICAqIGZpcnN0IHJvdXRlIGVudGVyZWQuXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgKiBAbmFtZSAkcm91dGUjJHJvdXRlQ2hhbmdlRXJyb3JcbiAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQnJvYWRjYXN0ZWQgaWYgYW55IG9mIHRoZSByZXNvbHZlIHByb21pc2VzIGFyZSByZWplY3RlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhbmd1bGFyRXZlbnQgU3ludGhldGljIGV2ZW50IG9iamVjdFxuICAgICAqIEBwYXJhbSB7Um91dGV9IGN1cnJlbnQgQ3VycmVudCByb3V0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBwcmV2aW91cyBQcmV2aW91cyByb3V0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfSByZWplY3Rpb24gUmVqZWN0aW9uIG9mIHRoZSBwcm9taXNlLiBVc3VhbGx5IHRoZSBlcnJvciBvZiB0aGUgZmFpbGVkIHByb21pc2UuXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgKiBAbmFtZSAkcm91dGUjJHJvdXRlVXBkYXRlXG4gICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqXG4gICAgICogVGhlIGByZWxvYWRPblNlYXJjaGAgcHJvcGVydHkgaGFzIGJlZW4gc2V0IHRvIGZhbHNlLCBhbmQgd2UgYXJlIHJldXNpbmcgdGhlIHNhbWVcbiAgICAgKiBpbnN0YW5jZSBvZiB0aGUgQ29udHJvbGxlci5cbiAgICAgKi9cblxuICAgIHZhciBmb3JjZVJlbG9hZCA9IGZhbHNlLFxuICAgICAgICBwcmVwYXJlZFJvdXRlLFxuICAgICAgICBwcmVwYXJlZFJvdXRlSXNVcGRhdGVPbmx5LFxuICAgICAgICAkcm91dGUgPSB7XG4gICAgICAgICAgcm91dGVzOiByb3V0ZXMsXG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAgICogQG5hbWUgJHJvdXRlI3JlbG9hZFxuICAgICAgICAgICAqXG4gICAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAgICogQ2F1c2VzIGAkcm91dGVgIHNlcnZpY2UgdG8gcmVsb2FkIHRoZSBjdXJyZW50IHJvdXRlIGV2ZW4gaWZcbiAgICAgICAgICAgKiB7QGxpbmsgbmcuJGxvY2F0aW9uICRsb2NhdGlvbn0gaGFzbid0IGNoYW5nZWQuXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBBcyBhIHJlc3VsdCBvZiB0aGF0LCB7QGxpbmsgbmdSb3V0ZS5kaXJlY3RpdmU6bmdWaWV3IG5nVmlld31cbiAgICAgICAgICAgKiBjcmVhdGVzIG5ldyBzY29wZSwgcmVpbnN0YW50aWF0ZXMgdGhlIGNvbnRyb2xsZXIuXG4gICAgICAgICAgICovXG4gICAgICAgICAgcmVsb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvcmNlUmVsb2FkID0gdHJ1ZTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGV2YWxBc3luYyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgLy8gRG9uJ3Qgc3VwcG9ydCBjYW5jZWxsYXRpb24gb2YgYSByZWxvYWQgZm9yIG5vdy4uLlxuICAgICAgICAgICAgICBwcmVwYXJlUm91dGUoKTtcbiAgICAgICAgICAgICAgY29tbWl0Um91dGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAgICogQG5hbWUgJHJvdXRlI3VwZGF0ZVBhcmFtc1xuICAgICAgICAgICAqXG4gICAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAgICogQ2F1c2VzIGAkcm91dGVgIHNlcnZpY2UgdG8gdXBkYXRlIHRoZSBjdXJyZW50IFVSTCwgcmVwbGFjaW5nXG4gICAgICAgICAgICogY3VycmVudCByb3V0ZSBwYXJhbWV0ZXJzIHdpdGggdGhvc2Ugc3BlY2lmaWVkIGluIGBuZXdQYXJhbXNgLlxuICAgICAgICAgICAqIFByb3ZpZGVkIHByb3BlcnR5IG5hbWVzIHRoYXQgbWF0Y2ggdGhlIHJvdXRlJ3MgcGF0aCBzZWdtZW50XG4gICAgICAgICAgICogZGVmaW5pdGlvbnMgd2lsbCBiZSBpbnRlcnBvbGF0ZWQgaW50byB0aGUgbG9jYXRpb24ncyBwYXRoLCB3aGlsZVxuICAgICAgICAgICAqIHJlbWFpbmluZyBwcm9wZXJ0aWVzIHdpbGwgYmUgdHJlYXRlZCBhcyBxdWVyeSBwYXJhbXMuXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gbmV3UGFyYW1zIG1hcHBpbmcgb2YgVVJMIHBhcmFtZXRlciBuYW1lcyB0byB2YWx1ZXNcbiAgICAgICAgICAgKi9cbiAgICAgICAgICB1cGRhdGVQYXJhbXM6IGZ1bmN0aW9uKG5ld1BhcmFtcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudCAmJiB0aGlzLmN1cnJlbnQuJCRyb3V0ZSkge1xuICAgICAgICAgICAgICB2YXIgc2VhcmNoUGFyYW1zID0ge30sIHNlbGY9dGhpcztcblxuICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goT2JqZWN0LmtleXMobmV3UGFyYW1zKSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzZWxmLmN1cnJlbnQucGF0aFBhcmFtc1trZXldKSBzZWFyY2hQYXJhbXNba2V5XSA9IG5ld1BhcmFtc1trZXldO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICBuZXdQYXJhbXMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgdGhpcy5jdXJyZW50LnBhcmFtcywgbmV3UGFyYW1zKTtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoaW50ZXJwb2xhdGUodGhpcy5jdXJyZW50LiQkcm91dGUub3JpZ2luYWxQYXRoLCBuZXdQYXJhbXMpKTtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaChhbmd1bGFyLmV4dGVuZCh7fSwgJGxvY2F0aW9uLnNlYXJjaCgpLCBzZWFyY2hQYXJhbXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyAkcm91dGVNaW5FcnIoJ25vcm91dCcsICdUcmllZCB1cGRhdGluZyByb3V0ZSB3aGVuIHdpdGggbm8gY3VycmVudCByb3V0ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIHByZXBhcmVSb3V0ZSk7XG4gICAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MnLCBjb21taXRSb3V0ZSk7XG5cbiAgICByZXR1cm4gJHJvdXRlO1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBvbiB7c3RyaW5nfSBjdXJyZW50IHVybFxuICAgICAqIEBwYXJhbSByb3V0ZSB7T2JqZWN0fSByb3V0ZSByZWdleHAgdG8gbWF0Y2ggdGhlIHVybCBhZ2FpbnN0XG4gICAgICogQHJldHVybiB7P09iamVjdH1cbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIENoZWNrIGlmIHRoZSByb3V0ZSBtYXRjaGVzIHRoZSBjdXJyZW50IHVybC5cbiAgICAgKlxuICAgICAqIEluc3BpcmVkIGJ5IG1hdGNoIGluXG4gICAgICogdmlzaW9ubWVkaWEvZXhwcmVzcy9saWIvcm91dGVyL3JvdXRlci5qcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzd2l0Y2hSb3V0ZU1hdGNoZXIob24sIHJvdXRlKSB7XG4gICAgICB2YXIga2V5cyA9IHJvdXRlLmtleXMsXG4gICAgICAgICAgcGFyYW1zID0ge307XG5cbiAgICAgIGlmICghcm91dGUucmVnZXhwKSByZXR1cm4gbnVsbDtcblxuICAgICAgdmFyIG0gPSByb3V0ZS5yZWdleHAuZXhlYyhvbik7XG4gICAgICBpZiAoIW0pIHJldHVybiBudWxsO1xuXG4gICAgICBmb3IgKHZhciBpID0gMSwgbGVuID0gbS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICB2YXIga2V5ID0ga2V5c1tpIC0gMV07XG5cbiAgICAgICAgdmFyIHZhbCA9IG1baV07XG5cbiAgICAgICAgaWYgKGtleSAmJiB2YWwpIHtcbiAgICAgICAgICBwYXJhbXNba2V5Lm5hbWVdID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyYW1zO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZXBhcmVSb3V0ZSgkbG9jYXRpb25FdmVudCkge1xuICAgICAgdmFyIGxhc3RSb3V0ZSA9ICRyb3V0ZS5jdXJyZW50O1xuXG4gICAgICBwcmVwYXJlZFJvdXRlID0gcGFyc2VSb3V0ZSgpO1xuICAgICAgcHJlcGFyZWRSb3V0ZUlzVXBkYXRlT25seSA9IHByZXBhcmVkUm91dGUgJiYgbGFzdFJvdXRlICYmIHByZXBhcmVkUm91dGUuJCRyb3V0ZSA9PT0gbGFzdFJvdXRlLiQkcm91dGVcbiAgICAgICAgICAmJiBhbmd1bGFyLmVxdWFscyhwcmVwYXJlZFJvdXRlLnBhdGhQYXJhbXMsIGxhc3RSb3V0ZS5wYXRoUGFyYW1zKVxuICAgICAgICAgICYmICFwcmVwYXJlZFJvdXRlLnJlbG9hZE9uU2VhcmNoICYmICFmb3JjZVJlbG9hZDtcblxuICAgICAgaWYgKCFwcmVwYXJlZFJvdXRlSXNVcGRhdGVPbmx5ICYmIChsYXN0Um91dGUgfHwgcHJlcGFyZWRSb3V0ZSkpIHtcbiAgICAgICAgaWYgKCRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHJvdXRlQ2hhbmdlU3RhcnQnLCBwcmVwYXJlZFJvdXRlLCBsYXN0Um91dGUpLmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgICBpZiAoJGxvY2F0aW9uRXZlbnQpIHtcbiAgICAgICAgICAgICRsb2NhdGlvbkV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tbWl0Um91dGUoKSB7XG4gICAgICB2YXIgbGFzdFJvdXRlID0gJHJvdXRlLmN1cnJlbnQ7XG4gICAgICB2YXIgbmV4dFJvdXRlID0gcHJlcGFyZWRSb3V0ZTtcblxuICAgICAgaWYgKHByZXBhcmVkUm91dGVJc1VwZGF0ZU9ubHkpIHtcbiAgICAgICAgbGFzdFJvdXRlLnBhcmFtcyA9IG5leHRSb3V0ZS5wYXJhbXM7XG4gICAgICAgIGFuZ3VsYXIuY29weShsYXN0Um91dGUucGFyYW1zLCAkcm91dGVQYXJhbXMpO1xuICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRyb3V0ZVVwZGF0ZScsIGxhc3RSb3V0ZSk7XG4gICAgICB9IGVsc2UgaWYgKG5leHRSb3V0ZSB8fCBsYXN0Um91dGUpIHtcbiAgICAgICAgZm9yY2VSZWxvYWQgPSBmYWxzZTtcbiAgICAgICAgJHJvdXRlLmN1cnJlbnQgPSBuZXh0Um91dGU7XG4gICAgICAgIGlmIChuZXh0Um91dGUpIHtcbiAgICAgICAgICBpZiAobmV4dFJvdXRlLnJlZGlyZWN0VG8pIHtcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKG5leHRSb3V0ZS5yZWRpcmVjdFRvKSkge1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChpbnRlcnBvbGF0ZShuZXh0Um91dGUucmVkaXJlY3RUbywgbmV4dFJvdXRlLnBhcmFtcykpLnNlYXJjaChuZXh0Um91dGUucGFyYW1zKVxuICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnVybChuZXh0Um91dGUucmVkaXJlY3RUbyhuZXh0Um91dGUucGF0aFBhcmFtcywgJGxvY2F0aW9uLnBhdGgoKSwgJGxvY2F0aW9uLnNlYXJjaCgpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkcS53aGVuKG5leHRSb3V0ZSkuXG4gICAgICAgICAgdGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChuZXh0Um91dGUpIHtcbiAgICAgICAgICAgICAgdmFyIGxvY2FscyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCBuZXh0Um91dGUucmVzb2x2ZSksXG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSwgdGVtcGxhdGVVcmw7XG5cbiAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGxvY2FscywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgIGxvY2Fsc1trZXldID0gYW5ndWxhci5pc1N0cmluZyh2YWx1ZSkgP1xuICAgICAgICAgICAgICAgICAgICAkaW5qZWN0b3IuZ2V0KHZhbHVlKSA6ICRpbmplY3Rvci5pbnZva2UodmFsdWUsIG51bGwsIG51bGwsIGtleSk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0ZW1wbGF0ZSA9IG5leHRSb3V0ZS50ZW1wbGF0ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHRlbXBsYXRlKSkge1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZShuZXh0Um91dGUucGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc0RlZmluZWQodGVtcGxhdGVVcmwgPSBuZXh0Um91dGUudGVtcGxhdGVVcmwpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbih0ZW1wbGF0ZVVybCkpIHtcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsID0gdGVtcGxhdGVVcmwobmV4dFJvdXRlLnBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsID0gJHNjZS5nZXRUcnVzdGVkUmVzb3VyY2VVcmwodGVtcGxhdGVVcmwpO1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0ZW1wbGF0ZVVybCkpIHtcbiAgICAgICAgICAgICAgICAgIG5leHRSb3V0ZS5sb2FkZWRUZW1wbGF0ZVVybCA9IHRlbXBsYXRlVXJsO1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGUgPSAkdGVtcGxhdGVSZXF1ZXN0KHRlbXBsYXRlVXJsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRlbXBsYXRlKSkge1xuICAgICAgICAgICAgICAgIGxvY2Fsc1snJHRlbXBsYXRlJ10gPSB0ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gJHEuYWxsKGxvY2Fscyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkuXG4gICAgICAgICAgLy8gYWZ0ZXIgcm91dGUgY2hhbmdlXG4gICAgICAgICAgdGhlbihmdW5jdGlvbihsb2NhbHMpIHtcbiAgICAgICAgICAgIGlmIChuZXh0Um91dGUgPT0gJHJvdXRlLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgaWYgKG5leHRSb3V0ZSkge1xuICAgICAgICAgICAgICAgIG5leHRSb3V0ZS5sb2NhbHMgPSBsb2NhbHM7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5jb3B5KG5leHRSb3V0ZS5wYXJhbXMsICRyb3V0ZVBhcmFtcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckcm91dGVDaGFuZ2VTdWNjZXNzJywgbmV4dFJvdXRlLCBsYXN0Um91dGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAobmV4dFJvdXRlID09ICRyb3V0ZS5jdXJyZW50KSB7XG4gICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHJvdXRlQ2hhbmdlRXJyb3InLCBuZXh0Um91dGUsIGxhc3RSb3V0ZSwgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMge09iamVjdH0gdGhlIGN1cnJlbnQgYWN0aXZlIHJvdXRlLCBieSBtYXRjaGluZyBpdCBhZ2FpbnN0IHRoZSBVUkxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwYXJzZVJvdXRlKCkge1xuICAgICAgLy8gTWF0Y2ggYSByb3V0ZVxuICAgICAgdmFyIHBhcmFtcywgbWF0Y2g7XG4gICAgICBhbmd1bGFyLmZvckVhY2gocm91dGVzLCBmdW5jdGlvbihyb3V0ZSwgcGF0aCkge1xuICAgICAgICBpZiAoIW1hdGNoICYmIChwYXJhbXMgPSBzd2l0Y2hSb3V0ZU1hdGNoZXIoJGxvY2F0aW9uLnBhdGgoKSwgcm91dGUpKSkge1xuICAgICAgICAgIG1hdGNoID0gaW5oZXJpdChyb3V0ZSwge1xuICAgICAgICAgICAgcGFyYW1zOiBhbmd1bGFyLmV4dGVuZCh7fSwgJGxvY2F0aW9uLnNlYXJjaCgpLCBwYXJhbXMpLFxuICAgICAgICAgICAgcGF0aFBhcmFtczogcGFyYW1zfSk7XG4gICAgICAgICAgbWF0Y2guJCRyb3V0ZSA9IHJvdXRlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIE5vIHJvdXRlIG1hdGNoZWQ7IGZhbGxiYWNrIHRvIFwib3RoZXJ3aXNlXCIgcm91dGVcbiAgICAgIHJldHVybiBtYXRjaCB8fCByb3V0ZXNbbnVsbF0gJiYgaW5oZXJpdChyb3V0ZXNbbnVsbF0sIHtwYXJhbXM6IHt9LCBwYXRoUGFyYW1zOnt9fSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMge3N0cmluZ30gaW50ZXJwb2xhdGlvbiBvZiB0aGUgcmVkaXJlY3QgcGF0aCB3aXRoIHRoZSBwYXJhbWV0ZXJzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW50ZXJwb2xhdGUoc3RyaW5nLCBwYXJhbXMpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaCgoc3RyaW5nfHwnJykuc3BsaXQoJzonKSwgZnVuY3Rpb24oc2VnbWVudCwgaSkge1xuICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHNlZ21lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBzZWdtZW50TWF0Y2ggPSBzZWdtZW50Lm1hdGNoKC8oXFx3KykoLiopLyk7XG4gICAgICAgICAgdmFyIGtleSA9IHNlZ21lbnRNYXRjaFsxXTtcbiAgICAgICAgICByZXN1bHQucHVzaChwYXJhbXNba2V5XSk7XG4gICAgICAgICAgcmVzdWx0LnB1c2goc2VnbWVudE1hdGNoWzJdIHx8ICcnKTtcbiAgICAgICAgICBkZWxldGUgcGFyYW1zW2tleV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKTtcbiAgICB9XG4gIH1dO1xufVxuXG5uZ1JvdXRlTW9kdWxlLnByb3ZpZGVyKCckcm91dGVQYXJhbXMnLCAkUm91dGVQYXJhbXNQcm92aWRlcik7XG5cblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgJHJvdXRlUGFyYW1zXG4gKiBAcmVxdWlyZXMgJHJvdXRlXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUgYCRyb3V0ZVBhcmFtc2Agc2VydmljZSBhbGxvd3MgeW91IHRvIHJldHJpZXZlIHRoZSBjdXJyZW50IHNldCBvZiByb3V0ZSBwYXJhbWV0ZXJzLlxuICpcbiAqIFJlcXVpcmVzIHRoZSB7QGxpbmsgbmdSb3V0ZSBgbmdSb3V0ZWB9IG1vZHVsZSB0byBiZSBpbnN0YWxsZWQuXG4gKlxuICogVGhlIHJvdXRlIHBhcmFtZXRlcnMgYXJlIGEgY29tYmluYXRpb24gb2Yge0BsaW5rIG5nLiRsb2NhdGlvbiBgJGxvY2F0aW9uYH0nc1xuICoge0BsaW5rIG5nLiRsb2NhdGlvbiNzZWFyY2ggYHNlYXJjaCgpYH0gYW5kIHtAbGluayBuZy4kbG9jYXRpb24jcGF0aCBgcGF0aCgpYH0uXG4gKiBUaGUgYHBhdGhgIHBhcmFtZXRlcnMgYXJlIGV4dHJhY3RlZCB3aGVuIHRoZSB7QGxpbmsgbmdSb3V0ZS4kcm91dGUgYCRyb3V0ZWB9IHBhdGggaXMgbWF0Y2hlZC5cbiAqXG4gKiBJbiBjYXNlIG9mIHBhcmFtZXRlciBuYW1lIGNvbGxpc2lvbiwgYHBhdGhgIHBhcmFtcyB0YWtlIHByZWNlZGVuY2Ugb3ZlciBgc2VhcmNoYCBwYXJhbXMuXG4gKlxuICogVGhlIHNlcnZpY2UgZ3VhcmFudGVlcyB0aGF0IHRoZSBpZGVudGl0eSBvZiB0aGUgYCRyb3V0ZVBhcmFtc2Agb2JqZWN0IHdpbGwgcmVtYWluIHVuY2hhbmdlZFxuICogKGJ1dCBpdHMgcHJvcGVydGllcyB3aWxsIGxpa2VseSBjaGFuZ2UpIGV2ZW4gd2hlbiBhIHJvdXRlIGNoYW5nZSBvY2N1cnMuXG4gKlxuICogTm90ZSB0aGF0IHRoZSBgJHJvdXRlUGFyYW1zYCBhcmUgb25seSB1cGRhdGVkICphZnRlciogYSByb3V0ZSBjaGFuZ2UgY29tcGxldGVzIHN1Y2Nlc3NmdWxseS5cbiAqIFRoaXMgbWVhbnMgdGhhdCB5b3UgY2Fubm90IHJlbHkgb24gYCRyb3V0ZVBhcmFtc2AgYmVpbmcgY29ycmVjdCBpbiByb3V0ZSByZXNvbHZlIGZ1bmN0aW9ucy5cbiAqIEluc3RlYWQgeW91IGNhbiB1c2UgYCRyb3V0ZS5jdXJyZW50LnBhcmFtc2AgdG8gYWNjZXNzIHRoZSBuZXcgcm91dGUncyBwYXJhbWV0ZXJzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBqc1xuICogIC8vIEdpdmVuOlxuICogIC8vIFVSTDogaHR0cDovL3NlcnZlci5jb20vaW5kZXguaHRtbCMvQ2hhcHRlci8xL1NlY3Rpb24vMj9zZWFyY2g9bW9ieVxuICogIC8vIFJvdXRlOiAvQ2hhcHRlci86Y2hhcHRlcklkL1NlY3Rpb24vOnNlY3Rpb25JZFxuICogIC8vXG4gKiAgLy8gVGhlblxuICogICRyb3V0ZVBhcmFtcyA9PT4ge2NoYXB0ZXJJZDonMScsIHNlY3Rpb25JZDonMicsIHNlYXJjaDonbW9ieSd9XG4gKiBgYGBcbiAqL1xuZnVuY3Rpb24gJFJvdXRlUGFyYW1zUHJvdmlkZXIoKSB7XG4gIHRoaXMuJGdldCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4ge307IH07XG59XG5cbm5nUm91dGVNb2R1bGUuZGlyZWN0aXZlKCduZ1ZpZXcnLCBuZ1ZpZXdGYWN0b3J5KTtcbm5nUm91dGVNb2R1bGUuZGlyZWN0aXZlKCduZ1ZpZXcnLCBuZ1ZpZXdGaWxsQ29udGVudEZhY3RvcnkpO1xuXG5cbi8qKlxuICogQG5nZG9jIGRpcmVjdGl2ZVxuICogQG5hbWUgbmdWaWV3XG4gKiBAcmVzdHJpY3QgRUNBXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiAjIE92ZXJ2aWV3XG4gKiBgbmdWaWV3YCBpcyBhIGRpcmVjdGl2ZSB0aGF0IGNvbXBsZW1lbnRzIHRoZSB7QGxpbmsgbmdSb3V0ZS4kcm91dGUgJHJvdXRlfSBzZXJ2aWNlIGJ5XG4gKiBpbmNsdWRpbmcgdGhlIHJlbmRlcmVkIHRlbXBsYXRlIG9mIHRoZSBjdXJyZW50IHJvdXRlIGludG8gdGhlIG1haW4gbGF5b3V0IChgaW5kZXguaHRtbGApIGZpbGUuXG4gKiBFdmVyeSB0aW1lIHRoZSBjdXJyZW50IHJvdXRlIGNoYW5nZXMsIHRoZSBpbmNsdWRlZCB2aWV3IGNoYW5nZXMgd2l0aCBpdCBhY2NvcmRpbmcgdG8gdGhlXG4gKiBjb25maWd1cmF0aW9uIG9mIHRoZSBgJHJvdXRlYCBzZXJ2aWNlLlxuICpcbiAqIFJlcXVpcmVzIHRoZSB7QGxpbmsgbmdSb3V0ZSBgbmdSb3V0ZWB9IG1vZHVsZSB0byBiZSBpbnN0YWxsZWQuXG4gKlxuICogQGFuaW1hdGlvbnNcbiAqIGVudGVyIC0gYW5pbWF0aW9uIGlzIHVzZWQgdG8gYnJpbmcgbmV3IGNvbnRlbnQgaW50byB0aGUgYnJvd3Nlci5cbiAqIGxlYXZlIC0gYW5pbWF0aW9uIGlzIHVzZWQgdG8gYW5pbWF0ZSBleGlzdGluZyBjb250ZW50IGF3YXkuXG4gKlxuICogVGhlIGVudGVyIGFuZCBsZWF2ZSBhbmltYXRpb24gb2NjdXIgY29uY3VycmVudGx5LlxuICpcbiAqIEBzY29wZVxuICogQHByaW9yaXR5IDQwMFxuICogQHBhcmFtIHtzdHJpbmc9fSBvbmxvYWQgRXhwcmVzc2lvbiB0byBldmFsdWF0ZSB3aGVuZXZlciB0aGUgdmlldyB1cGRhdGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nPX0gYXV0b3Njcm9sbCBXaGV0aGVyIGBuZ1ZpZXdgIHNob3VsZCBjYWxsIHtAbGluayBuZy4kYW5jaG9yU2Nyb2xsXG4gKiAgICAgICAgICAgICAgICAgICRhbmNob3JTY3JvbGx9IHRvIHNjcm9sbCB0aGUgdmlld3BvcnQgYWZ0ZXIgdGhlIHZpZXcgaXMgdXBkYXRlZC5cbiAqXG4gKiAgICAgICAgICAgICAgICAgIC0gSWYgdGhlIGF0dHJpYnV0ZSBpcyBub3Qgc2V0LCBkaXNhYmxlIHNjcm9sbGluZy5cbiAqICAgICAgICAgICAgICAgICAgLSBJZiB0aGUgYXR0cmlidXRlIGlzIHNldCB3aXRob3V0IHZhbHVlLCBlbmFibGUgc2Nyb2xsaW5nLlxuICogICAgICAgICAgICAgICAgICAtIE90aGVyd2lzZSBlbmFibGUgc2Nyb2xsaW5nIG9ubHkgaWYgdGhlIGBhdXRvc2Nyb2xsYCBhdHRyaWJ1dGUgdmFsdWUgZXZhbHVhdGVkXG4gKiAgICAgICAgICAgICAgICAgICAgYXMgYW4gZXhwcmVzc2lvbiB5aWVsZHMgYSB0cnV0aHkgdmFsdWUuXG4gKiBAZXhhbXBsZVxuICAgIDxleGFtcGxlIG5hbWU9XCJuZ1ZpZXctZGlyZWN0aXZlXCIgbW9kdWxlPVwibmdWaWV3RXhhbXBsZVwiXG4gICAgICAgICAgICAgZGVwcz1cImFuZ3VsYXItcm91dGUuanM7YW5ndWxhci1hbmltYXRlLmpzXCJcbiAgICAgICAgICAgICBhbmltYXRpb25zPVwidHJ1ZVwiIGZpeEJhc2U9XCJ0cnVlXCI+XG4gICAgICA8ZmlsZSBuYW1lPVwiaW5kZXguaHRtbFwiPlxuICAgICAgICA8ZGl2IG5nLWNvbnRyb2xsZXI9XCJNYWluQ3RybCBhcyBtYWluXCI+XG4gICAgICAgICAgQ2hvb3NlOlxuICAgICAgICAgIDxhIGhyZWY9XCJCb29rL01vYnlcIj5Nb2J5PC9hPiB8XG4gICAgICAgICAgPGEgaHJlZj1cIkJvb2svTW9ieS9jaC8xXCI+TW9ieTogQ2gxPC9hPiB8XG4gICAgICAgICAgPGEgaHJlZj1cIkJvb2svR2F0c2J5XCI+R2F0c2J5PC9hPiB8XG4gICAgICAgICAgPGEgaHJlZj1cIkJvb2svR2F0c2J5L2NoLzQ/a2V5PXZhbHVlXCI+R2F0c2J5OiBDaDQ8L2E+IHxcbiAgICAgICAgICA8YSBocmVmPVwiQm9vay9TY2FybGV0XCI+U2NhcmxldCBMZXR0ZXI8L2E+PGJyLz5cblxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2aWV3LWFuaW1hdGUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IG5nLXZpZXcgY2xhc3M9XCJ2aWV3LWFuaW1hdGVcIj48L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8aHIgLz5cblxuICAgICAgICAgIDxwcmU+JGxvY2F0aW9uLnBhdGgoKSA9IHt7bWFpbi4kbG9jYXRpb24ucGF0aCgpfX08L3ByZT5cbiAgICAgICAgICA8cHJlPiRyb3V0ZS5jdXJyZW50LnRlbXBsYXRlVXJsID0ge3ttYWluLiRyb3V0ZS5jdXJyZW50LnRlbXBsYXRlVXJsfX08L3ByZT5cbiAgICAgICAgICA8cHJlPiRyb3V0ZS5jdXJyZW50LnBhcmFtcyA9IHt7bWFpbi4kcm91dGUuY3VycmVudC5wYXJhbXN9fTwvcHJlPlxuICAgICAgICAgIDxwcmU+JHJvdXRlUGFyYW1zID0ge3ttYWluLiRyb3V0ZVBhcmFtc319PC9wcmU+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9maWxlPlxuXG4gICAgICA8ZmlsZSBuYW1lPVwiYm9vay5odG1sXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgY29udHJvbGxlcjoge3tib29rLm5hbWV9fTxiciAvPlxuICAgICAgICAgIEJvb2sgSWQ6IHt7Ym9vay5wYXJhbXMuYm9va0lkfX08YnIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJjaGFwdGVyLmh0bWxcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBjb250cm9sbGVyOiB7e2NoYXB0ZXIubmFtZX19PGJyIC8+XG4gICAgICAgICAgQm9vayBJZDoge3tjaGFwdGVyLnBhcmFtcy5ib29rSWR9fTxiciAvPlxuICAgICAgICAgIENoYXB0ZXIgSWQ6IHt7Y2hhcHRlci5wYXJhbXMuY2hhcHRlcklkfX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJhbmltYXRpb25zLmNzc1wiPlxuICAgICAgICAudmlldy1hbmltYXRlLWNvbnRhaW5lciB7XG4gICAgICAgICAgcG9zaXRpb246cmVsYXRpdmU7XG4gICAgICAgICAgaGVpZ2h0OjEwMHB4IWltcG9ydGFudDtcbiAgICAgICAgICBwb3NpdGlvbjpyZWxhdGl2ZTtcbiAgICAgICAgICBiYWNrZ3JvdW5kOndoaXRlO1xuICAgICAgICAgIGJvcmRlcjoxcHggc29saWQgYmxhY2s7XG4gICAgICAgICAgaGVpZ2h0OjQwcHg7XG4gICAgICAgICAgb3ZlcmZsb3c6aGlkZGVuO1xuICAgICAgICB9XG5cbiAgICAgICAgLnZpZXctYW5pbWF0ZSB7XG4gICAgICAgICAgcGFkZGluZzoxMHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLnZpZXctYW5pbWF0ZS5uZy1lbnRlciwgLnZpZXctYW5pbWF0ZS5uZy1sZWF2ZSB7XG4gICAgICAgICAgLXdlYmtpdC10cmFuc2l0aW9uOmFsbCBjdWJpYy1iZXppZXIoMC4yNTAsIDAuNDYwLCAwLjQ1MCwgMC45NDApIDEuNXM7XG4gICAgICAgICAgdHJhbnNpdGlvbjphbGwgY3ViaWMtYmV6aWVyKDAuMjUwLCAwLjQ2MCwgMC40NTAsIDAuOTQwKSAxLjVzO1xuXG4gICAgICAgICAgZGlzcGxheTpibG9jaztcbiAgICAgICAgICB3aWR0aDoxMDAlO1xuICAgICAgICAgIGJvcmRlci1sZWZ0OjFweCBzb2xpZCBibGFjaztcblxuICAgICAgICAgIHBvc2l0aW9uOmFic29sdXRlO1xuICAgICAgICAgIHRvcDowO1xuICAgICAgICAgIGxlZnQ6MDtcbiAgICAgICAgICByaWdodDowO1xuICAgICAgICAgIGJvdHRvbTowO1xuICAgICAgICAgIHBhZGRpbmc6MTBweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC52aWV3LWFuaW1hdGUubmctZW50ZXIge1xuICAgICAgICAgIGxlZnQ6MTAwJTtcbiAgICAgICAgfVxuICAgICAgICAudmlldy1hbmltYXRlLm5nLWVudGVyLm5nLWVudGVyLWFjdGl2ZSB7XG4gICAgICAgICAgbGVmdDowO1xuICAgICAgICB9XG4gICAgICAgIC52aWV3LWFuaW1hdGUubmctbGVhdmUubmctbGVhdmUtYWN0aXZlIHtcbiAgICAgICAgICBsZWZ0Oi0xMDAlO1xuICAgICAgICB9XG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJzY3JpcHQuanNcIj5cbiAgICAgICAgYW5ndWxhci5tb2R1bGUoJ25nVmlld0V4YW1wbGUnLCBbJ25nUm91dGUnLCAnbmdBbmltYXRlJ10pXG4gICAgICAgICAgLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgICAgICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgICAgIC53aGVuKCcvQm9vay86Ym9va0lkJywge1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdib29rLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tDdHJsJyxcbiAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2snXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAud2hlbignL0Jvb2svOmJvb2tJZC9jaC86Y2hhcHRlcklkJywge1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjaGFwdGVyLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NoYXB0ZXJDdHJsJyxcbiAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2NoYXB0ZXInXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgICAgICAgIH1dKVxuICAgICAgICAgIC5jb250cm9sbGVyKCdNYWluQ3RybCcsIFsnJHJvdXRlJywgJyRyb3V0ZVBhcmFtcycsICckbG9jYXRpb24nLFxuICAgICAgICAgICAgZnVuY3Rpb24oJHJvdXRlLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbikge1xuICAgICAgICAgICAgICB0aGlzLiRyb3V0ZSA9ICRyb3V0ZTtcbiAgICAgICAgICAgICAgdGhpcy4kbG9jYXRpb24gPSAkbG9jYXRpb247XG4gICAgICAgICAgICAgIHRoaXMuJHJvdXRlUGFyYW1zID0gJHJvdXRlUGFyYW1zO1xuICAgICAgICAgIH1dKVxuICAgICAgICAgIC5jb250cm9sbGVyKCdCb29rQ3RybCcsIFsnJHJvdXRlUGFyYW1zJywgZnVuY3Rpb24oJHJvdXRlUGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBcIkJvb2tDdHJsXCI7XG4gICAgICAgICAgICB0aGlzLnBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgICAgICB9XSlcbiAgICAgICAgICAuY29udHJvbGxlcignQ2hhcHRlckN0cmwnLCBbJyRyb3V0ZVBhcmFtcycsIGZ1bmN0aW9uKCRyb3V0ZVBhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gXCJDaGFwdGVyQ3RybFwiO1xuICAgICAgICAgICAgdGhpcy5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICAgICAgfV0pO1xuXG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJwcm90cmFjdG9yLmpzXCIgdHlwZT1cInByb3RyYWN0b3JcIj5cbiAgICAgICAgaXQoJ3Nob3VsZCBsb2FkIGFuZCBjb21waWxlIGNvcnJlY3QgdGVtcGxhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBlbGVtZW50KGJ5LmxpbmtUZXh0KCdNb2J5OiBDaDEnKSkuY2xpY2soKTtcbiAgICAgICAgICB2YXIgY29udGVudCA9IGVsZW1lbnQoYnkuY3NzKCdbbmctdmlld10nKSkuZ2V0VGV4dCgpO1xuICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9jb250cm9sbGVyXFw6IENoYXB0ZXJDdHJsLyk7XG4gICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0Jvb2sgSWRcXDogTW9ieS8pO1xuICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9DaGFwdGVyIElkXFw6IDEvKTtcblxuICAgICAgICAgIGVsZW1lbnQoYnkucGFydGlhbExpbmtUZXh0KCdTY2FybGV0JykpLmNsaWNrKCk7XG5cbiAgICAgICAgICBjb250ZW50ID0gZWxlbWVudChieS5jc3MoJ1tuZy12aWV3XScpKS5nZXRUZXh0KCk7XG4gICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL2NvbnRyb2xsZXJcXDogQm9va0N0cmwvKTtcbiAgICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQm9vayBJZFxcOiBTY2FybGV0Lyk7XG4gICAgICAgIH0pO1xuICAgICAgPC9maWxlPlxuICAgIDwvZXhhbXBsZT5cbiAqL1xuXG5cbi8qKlxuICogQG5nZG9jIGV2ZW50XG4gKiBAbmFtZSBuZ1ZpZXcjJHZpZXdDb250ZW50TG9hZGVkXG4gKiBAZXZlbnRUeXBlIGVtaXQgb24gdGhlIGN1cnJlbnQgbmdWaWV3IHNjb3BlXG4gKiBAZGVzY3JpcHRpb25cbiAqIEVtaXR0ZWQgZXZlcnkgdGltZSB0aGUgbmdWaWV3IGNvbnRlbnQgaXMgcmVsb2FkZWQuXG4gKi9cbm5nVmlld0ZhY3RvcnkuJGluamVjdCA9IFsnJHJvdXRlJywgJyRhbmNob3JTY3JvbGwnLCAnJGFuaW1hdGUnXTtcbmZ1bmN0aW9uIG5nVmlld0ZhY3RvcnkoICAgJHJvdXRlLCAgICRhbmNob3JTY3JvbGwsICAgJGFuaW1hdGUpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0VDQScsXG4gICAgdGVybWluYWw6IHRydWUsXG4gICAgcHJpb3JpdHk6IDQwMCxcbiAgICB0cmFuc2NsdWRlOiAnZWxlbWVudCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsICRlbGVtZW50LCBhdHRyLCBjdHJsLCAkdHJhbnNjbHVkZSkge1xuICAgICAgICB2YXIgY3VycmVudFNjb3BlLFxuICAgICAgICAgICAgY3VycmVudEVsZW1lbnQsXG4gICAgICAgICAgICBwcmV2aW91c0xlYXZlQW5pbWF0aW9uLFxuICAgICAgICAgICAgYXV0b1Njcm9sbEV4cCA9IGF0dHIuYXV0b3Njcm9sbCxcbiAgICAgICAgICAgIG9ubG9hZEV4cCA9IGF0dHIub25sb2FkIHx8ICcnO1xuXG4gICAgICAgIHNjb3BlLiRvbignJHJvdXRlQ2hhbmdlU3VjY2VzcycsIHVwZGF0ZSk7XG4gICAgICAgIHVwZGF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNsZWFudXBMYXN0VmlldygpIHtcbiAgICAgICAgICBpZihwcmV2aW91c0xlYXZlQW5pbWF0aW9uKSB7XG4gICAgICAgICAgICAkYW5pbWF0ZS5jYW5jZWwocHJldmlvdXNMZWF2ZUFuaW1hdGlvbik7XG4gICAgICAgICAgICBwcmV2aW91c0xlYXZlQW5pbWF0aW9uID0gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZihjdXJyZW50U2NvcGUpIHtcbiAgICAgICAgICAgIGN1cnJlbnRTY29wZS4kZGVzdHJveSgpO1xuICAgICAgICAgICAgY3VycmVudFNjb3BlID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoY3VycmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHByZXZpb3VzTGVhdmVBbmltYXRpb24gPSAkYW5pbWF0ZS5sZWF2ZShjdXJyZW50RWxlbWVudCk7XG4gICAgICAgICAgICBwcmV2aW91c0xlYXZlQW5pbWF0aW9uLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHByZXZpb3VzTGVhdmVBbmltYXRpb24gPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjdXJyZW50RWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgICAgICAgIHZhciBsb2NhbHMgPSAkcm91dGUuY3VycmVudCAmJiAkcm91dGUuY3VycmVudC5sb2NhbHMsXG4gICAgICAgICAgICAgIHRlbXBsYXRlID0gbG9jYWxzICYmIGxvY2Fscy4kdGVtcGxhdGU7XG5cbiAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodGVtcGxhdGUpKSB7XG4gICAgICAgICAgICB2YXIgbmV3U2NvcGUgPSBzY29wZS4kbmV3KCk7XG4gICAgICAgICAgICB2YXIgY3VycmVudCA9ICRyb3V0ZS5jdXJyZW50O1xuXG4gICAgICAgICAgICAvLyBOb3RlOiBUaGlzIHdpbGwgYWxzbyBsaW5rIGFsbCBjaGlsZHJlbiBvZiBuZy12aWV3IHRoYXQgd2VyZSBjb250YWluZWQgaW4gdGhlIG9yaWdpbmFsXG4gICAgICAgICAgICAvLyBodG1sLiBJZiB0aGF0IGNvbnRlbnQgY29udGFpbnMgY29udHJvbGxlcnMsIC4uLiB0aGV5IGNvdWxkIHBvbGx1dGUvY2hhbmdlIHRoZSBzY29wZS5cbiAgICAgICAgICAgIC8vIEhvd2V2ZXIsIHVzaW5nIG5nLXZpZXcgb24gYW4gZWxlbWVudCB3aXRoIGFkZGl0aW9uYWwgY29udGVudCBkb2VzIG5vdCBtYWtlIHNlbnNlLi4uXG4gICAgICAgICAgICAvLyBOb3RlOiBXZSBjYW4ndCByZW1vdmUgdGhlbSBpbiB0aGUgY2xvbmVBdHRjaEZuIG9mICR0cmFuc2NsdWRlIGFzIHRoYXRcbiAgICAgICAgICAgIC8vIGZ1bmN0aW9uIGlzIGNhbGxlZCBiZWZvcmUgbGlua2luZyB0aGUgY29udGVudCwgd2hpY2ggd291bGQgYXBwbHkgY2hpbGRcbiAgICAgICAgICAgIC8vIGRpcmVjdGl2ZXMgdG8gbm9uIGV4aXN0aW5nIGVsZW1lbnRzLlxuICAgICAgICAgICAgdmFyIGNsb25lID0gJHRyYW5zY2x1ZGUobmV3U2NvcGUsIGZ1bmN0aW9uKGNsb25lKSB7XG4gICAgICAgICAgICAgICRhbmltYXRlLmVudGVyKGNsb25lLCBudWxsLCBjdXJyZW50RWxlbWVudCB8fCAkZWxlbWVudCkudGhlbihmdW5jdGlvbiBvbk5nVmlld0VudGVyICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoYXV0b1Njcm9sbEV4cClcbiAgICAgICAgICAgICAgICAgICYmICghYXV0b1Njcm9sbEV4cCB8fCBzY29wZS4kZXZhbChhdXRvU2Nyb2xsRXhwKSkpIHtcbiAgICAgICAgICAgICAgICAgICRhbmNob3JTY3JvbGwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBjbGVhbnVwTGFzdFZpZXcoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjdXJyZW50RWxlbWVudCA9IGNsb25lO1xuICAgICAgICAgICAgY3VycmVudFNjb3BlID0gY3VycmVudC5zY29wZSA9IG5ld1Njb3BlO1xuICAgICAgICAgICAgY3VycmVudFNjb3BlLiRlbWl0KCckdmlld0NvbnRlbnRMb2FkZWQnKTtcbiAgICAgICAgICAgIGN1cnJlbnRTY29wZS4kZXZhbChvbmxvYWRFeHApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbGVhbnVwTGFzdFZpZXcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbi8vIFRoaXMgZGlyZWN0aXZlIGlzIGNhbGxlZCBkdXJpbmcgdGhlICR0cmFuc2NsdWRlIGNhbGwgb2YgdGhlIGZpcnN0IGBuZ1ZpZXdgIGRpcmVjdGl2ZS5cbi8vIEl0IHdpbGwgcmVwbGFjZSBhbmQgY29tcGlsZSB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aXRoIHRoZSBsb2FkZWQgdGVtcGxhdGUuXG4vLyBXZSBuZWVkIHRoaXMgZGlyZWN0aXZlIHNvIHRoYXQgdGhlIGVsZW1lbnQgY29udGVudCBpcyBhbHJlYWR5IGZpbGxlZCB3aGVuXG4vLyB0aGUgbGluayBmdW5jdGlvbiBvZiBhbm90aGVyIGRpcmVjdGl2ZSBvbiB0aGUgc2FtZSBlbGVtZW50IGFzIG5nVmlld1xuLy8gaXMgY2FsbGVkLlxubmdWaWV3RmlsbENvbnRlbnRGYWN0b3J5LiRpbmplY3QgPSBbJyRjb21waWxlJywgJyRjb250cm9sbGVyJywgJyRyb3V0ZSddO1xuZnVuY3Rpb24gbmdWaWV3RmlsbENvbnRlbnRGYWN0b3J5KCRjb21waWxlLCAkY29udHJvbGxlciwgJHJvdXRlKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFQ0EnLFxuICAgIHByaW9yaXR5OiAtNDAwLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCAkZWxlbWVudCkge1xuICAgICAgdmFyIGN1cnJlbnQgPSAkcm91dGUuY3VycmVudCxcbiAgICAgICAgICBsb2NhbHMgPSBjdXJyZW50LmxvY2FscztcblxuICAgICAgJGVsZW1lbnQuaHRtbChsb2NhbHMuJHRlbXBsYXRlKTtcblxuICAgICAgdmFyIGxpbmsgPSAkY29tcGlsZSgkZWxlbWVudC5jb250ZW50cygpKTtcblxuICAgICAgaWYgKGN1cnJlbnQuY29udHJvbGxlcikge1xuICAgICAgICBsb2NhbHMuJHNjb3BlID0gc2NvcGU7XG4gICAgICAgIHZhciBjb250cm9sbGVyID0gJGNvbnRyb2xsZXIoY3VycmVudC5jb250cm9sbGVyLCBsb2NhbHMpO1xuICAgICAgICBpZiAoY3VycmVudC5jb250cm9sbGVyQXMpIHtcbiAgICAgICAgICBzY29wZVtjdXJyZW50LmNvbnRyb2xsZXJBc10gPSBjb250cm9sbGVyO1xuICAgICAgICB9XG4gICAgICAgICRlbGVtZW50LmRhdGEoJyRuZ0NvbnRyb2xsZXJDb250cm9sbGVyJywgY29udHJvbGxlcik7XG4gICAgICAgICRlbGVtZW50LmNoaWxkcmVuKCkuZGF0YSgnJG5nQ29udHJvbGxlckNvbnRyb2xsZXInLCBjb250cm9sbGVyKTtcbiAgICAgIH1cblxuICAgICAgbGluayhzY29wZSk7XG4gICAgfVxuICB9O1xufVxuXG5cbn0pKHdpbmRvdywgd2luZG93LmFuZ3VsYXIpO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlZDbUVzd1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxhbmd1bGFyLXJvdXRlXFxcXGFuZ3VsYXItcm91dGUuanNcIixcIi8uLlxcXFxub2RlX21vZHVsZXNcXFxcYW5ndWxhci1yb3V0ZVwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qISBAbGljZW5zZSBGaXJlYmFzZSB2MS4xLjMgLSBMaWNlbnNlOiBodHRwczovL3d3dy5maXJlYmFzZS5jb20vdGVybXMvdGVybXMtb2Ytc2VydmljZS5odG1sICovIChmdW5jdGlvbigpIHt2YXIgayxiYT10aGlzO2Z1bmN0aW9uIGwoYSl7cmV0dXJuIHZvaWQgMCE9PWF9ZnVuY3Rpb24gY2EoKXt9ZnVuY3Rpb24gZGEoYSl7YS5pYj1mdW5jdGlvbigpe3JldHVybiBhLkxkP2EuTGQ6YS5MZD1uZXcgYX19XG5mdW5jdGlvbiBlYShhKXt2YXIgYj10eXBlb2YgYTtpZihcIm9iamVjdFwiPT1iKWlmKGEpe2lmKGEgaW5zdGFuY2VvZiBBcnJheSlyZXR1cm5cImFycmF5XCI7aWYoYSBpbnN0YW5jZW9mIE9iamVjdClyZXR1cm4gYjt2YXIgYz1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSk7aWYoXCJbb2JqZWN0IFdpbmRvd11cIj09YylyZXR1cm5cIm9iamVjdFwiO2lmKFwiW29iamVjdCBBcnJheV1cIj09Y3x8XCJudW1iZXJcIj09dHlwZW9mIGEubGVuZ3RoJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgYS5zcGxpY2UmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBhLnByb3BlcnR5SXNFbnVtZXJhYmxlJiYhYS5wcm9wZXJ0eUlzRW51bWVyYWJsZShcInNwbGljZVwiKSlyZXR1cm5cImFycmF5XCI7aWYoXCJbb2JqZWN0IEZ1bmN0aW9uXVwiPT1jfHxcInVuZGVmaW5lZFwiIT10eXBlb2YgYS5jYWxsJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgYS5wcm9wZXJ0eUlzRW51bWVyYWJsZSYmIWEucHJvcGVydHlJc0VudW1lcmFibGUoXCJjYWxsXCIpKXJldHVyblwiZnVuY3Rpb25cIn1lbHNlIHJldHVyblwibnVsbFwiO1xuZWxzZSBpZihcImZ1bmN0aW9uXCI9PWImJlwidW5kZWZpbmVkXCI9PXR5cGVvZiBhLmNhbGwpcmV0dXJuXCJvYmplY3RcIjtyZXR1cm4gYn1mdW5jdGlvbiBmYShhKXtyZXR1cm5cImFycmF5XCI9PWVhKGEpfWZ1bmN0aW9uIGdhKGEpe3ZhciBiPWVhKGEpO3JldHVyblwiYXJyYXlcIj09Ynx8XCJvYmplY3RcIj09YiYmXCJudW1iZXJcIj09dHlwZW9mIGEubGVuZ3RofWZ1bmN0aW9uIHAoYSl7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGF9ZnVuY3Rpb24gaGEoYSl7cmV0dXJuXCJudW1iZXJcIj09dHlwZW9mIGF9ZnVuY3Rpb24gaWEoYSl7cmV0dXJuXCJmdW5jdGlvblwiPT1lYShhKX1mdW5jdGlvbiBqYShhKXt2YXIgYj10eXBlb2YgYTtyZXR1cm5cIm9iamVjdFwiPT1iJiZudWxsIT1hfHxcImZ1bmN0aW9uXCI9PWJ9ZnVuY3Rpb24ga2EoYSxiLGMpe3JldHVybiBhLmNhbGwuYXBwbHkoYS5iaW5kLGFyZ3VtZW50cyl9XG5mdW5jdGlvbiBsYShhLGIsYyl7aWYoIWEpdGhyb3cgRXJyb3IoKTtpZigyPGFyZ3VtZW50cy5sZW5ndGgpe3ZhciBkPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywyKTtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYz1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO0FycmF5LnByb3RvdHlwZS51bnNoaWZ0LmFwcGx5KGMsZCk7cmV0dXJuIGEuYXBwbHkoYixjKX19cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGEuYXBwbHkoYixhcmd1bWVudHMpfX1mdW5jdGlvbiByKGEsYixjKXtyPUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kJiYtMSE9RnVuY3Rpb24ucHJvdG90eXBlLmJpbmQudG9TdHJpbmcoKS5pbmRleE9mKFwibmF0aXZlIGNvZGVcIik/a2E6bGE7cmV0dXJuIHIuYXBwbHkobnVsbCxhcmd1bWVudHMpfXZhciBtYT1EYXRlLm5vd3x8ZnVuY3Rpb24oKXtyZXR1cm4rbmV3IERhdGV9O1xuZnVuY3Rpb24gbmEoYSxiKXtmdW5jdGlvbiBjKCl7fWMucHJvdG90eXBlPWIucHJvdG90eXBlO2EuY2Y9Yi5wcm90b3R5cGU7YS5wcm90b3R5cGU9bmV3IGM7YS4kZT1mdW5jdGlvbihhLGMsZil7cmV0dXJuIGIucHJvdG90eXBlW2NdLmFwcGx5KGEsQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDIpKX19O2Z1bmN0aW9uIG9hKGEpe2E9U3RyaW5nKGEpO2lmKC9eXFxzKiQvLnRlc3QoYSk/MDovXltcXF0sOnt9XFxzXFx1MjAyOFxcdTIwMjldKiQvLnRlc3QoYS5yZXBsYWNlKC9cXFxcW1wiXFxcXFxcL2JmbnJ0dV0vZyxcIkBcIikucmVwbGFjZSgvXCJbXlwiXFxcXFxcblxcclxcdTIwMjhcXHUyMDI5XFx4MDAtXFx4MDhcXHgwYS1cXHgxZl0qXCJ8dHJ1ZXxmYWxzZXxudWxsfC0/XFxkKyg/OlxcLlxcZCopPyg/OltlRV1bK1xcLV0/XFxkKyk/L2csXCJdXCIpLnJlcGxhY2UoLyg/Ol58OnwsKSg/OltcXHNcXHUyMDI4XFx1MjAyOV0qXFxbKSsvZyxcIlwiKSkpdHJ5e3JldHVybiBldmFsKFwiKFwiK2ErXCIpXCIpfWNhdGNoKGIpe310aHJvdyBFcnJvcihcIkludmFsaWQgSlNPTiBzdHJpbmc6IFwiK2EpO31mdW5jdGlvbiBwYSgpe3RoaXMuRWM9dm9pZCAwfVxuZnVuY3Rpb24gcWEoYSxiLGMpe3N3aXRjaCh0eXBlb2YgYil7Y2FzZSBcInN0cmluZ1wiOnJhKGIsYyk7YnJlYWs7Y2FzZSBcIm51bWJlclwiOmMucHVzaChpc0Zpbml0ZShiKSYmIWlzTmFOKGIpP2I6XCJudWxsXCIpO2JyZWFrO2Nhc2UgXCJib29sZWFuXCI6Yy5wdXNoKGIpO2JyZWFrO2Nhc2UgXCJ1bmRlZmluZWRcIjpjLnB1c2goXCJudWxsXCIpO2JyZWFrO2Nhc2UgXCJvYmplY3RcIjppZihudWxsPT1iKXtjLnB1c2goXCJudWxsXCIpO2JyZWFrfWlmKGZhKGIpKXt2YXIgZD1iLmxlbmd0aDtjLnB1c2goXCJbXCIpO2Zvcih2YXIgZT1cIlwiLGY9MDtmPGQ7ZisrKWMucHVzaChlKSxlPWJbZl0scWEoYSxhLkVjP2EuRWMuY2FsbChiLFN0cmluZyhmKSxlKTplLGMpLGU9XCIsXCI7Yy5wdXNoKFwiXVwiKTticmVha31jLnB1c2goXCJ7XCIpO2Q9XCJcIjtmb3IoZiBpbiBiKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLGYpJiYoZT1iW2ZdLFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUmJihjLnB1c2goZCkscmEoZixjKSxcbmMucHVzaChcIjpcIikscWEoYSxhLkVjP2EuRWMuY2FsbChiLGYsZSk6ZSxjKSxkPVwiLFwiKSk7Yy5wdXNoKFwifVwiKTticmVhaztjYXNlIFwiZnVuY3Rpb25cIjpicmVhaztkZWZhdWx0OnRocm93IEVycm9yKFwiVW5rbm93biB0eXBlOiBcIit0eXBlb2YgYik7fX12YXIgc2E9eydcIic6J1xcXFxcIicsXCJcXFxcXCI6XCJcXFxcXFxcXFwiLFwiL1wiOlwiXFxcXC9cIixcIlxcYlwiOlwiXFxcXGJcIixcIlxcZlwiOlwiXFxcXGZcIixcIlxcblwiOlwiXFxcXG5cIixcIlxcclwiOlwiXFxcXHJcIixcIlxcdFwiOlwiXFxcXHRcIixcIlxceDBCXCI6XCJcXFxcdTAwMGJcIn0sdGE9L1xcdWZmZmYvLnRlc3QoXCJcXHVmZmZmXCIpPy9bXFxcXFxcXCJcXHgwMC1cXHgxZlxceDdmLVxcdWZmZmZdL2c6L1tcXFxcXFxcIlxceDAwLVxceDFmXFx4N2YtXFx4ZmZdL2c7XG5mdW5jdGlvbiByYShhLGIpe2IucHVzaCgnXCInLGEucmVwbGFjZSh0YSxmdW5jdGlvbihhKXtpZihhIGluIHNhKXJldHVybiBzYVthXTt2YXIgYj1hLmNoYXJDb2RlQXQoMCksZT1cIlxcXFx1XCI7MTY+Yj9lKz1cIjAwMFwiOjI1Nj5iP2UrPVwiMDBcIjo0MDk2PmImJihlKz1cIjBcIik7cmV0dXJuIHNhW2FdPWUrYi50b1N0cmluZygxNil9KSwnXCInKX07ZnVuY3Rpb24gdWEoYSl7cmV0dXJuXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBKU09OJiZsKEpTT04ucGFyc2UpP0pTT04ucGFyc2UoYSk6b2EoYSl9ZnVuY3Rpb24gdShhKXtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIEpTT04mJmwoSlNPTi5zdHJpbmdpZnkpKWE9SlNPTi5zdHJpbmdpZnkoYSk7ZWxzZXt2YXIgYj1bXTtxYShuZXcgcGEsYSxiKTthPWIuam9pbihcIlwiKX1yZXR1cm4gYX07ZnVuY3Rpb24gdmEoYSl7Zm9yKHZhciBiPVtdLGM9MCxkPTA7ZDxhLmxlbmd0aDtkKyspe3ZhciBlPWEuY2hhckNvZGVBdChkKTs1NTI5Njw9ZSYmNTYzMTk+PWUmJihlLT01NTI5NixkKyssdihkPGEubGVuZ3RoLFwiU3Vycm9nYXRlIHBhaXIgbWlzc2luZyB0cmFpbCBzdXJyb2dhdGUuXCIpLGU9NjU1MzYrKGU8PDEwKSsoYS5jaGFyQ29kZUF0KGQpLTU2MzIwKSk7MTI4PmU/YltjKytdPWU6KDIwNDg+ZT9iW2MrK109ZT4+NnwxOTI6KDY1NTM2PmU/YltjKytdPWU+PjEyfDIyNDooYltjKytdPWU+PjE4fDI0MCxiW2MrK109ZT4+MTImNjN8MTI4KSxiW2MrK109ZT4+NiY2M3wxMjgpLGJbYysrXT1lJjYzfDEyOCl9cmV0dXJuIGJ9O3ZhciB3YT17fTtmdW5jdGlvbiB4KGEsYixjLGQpe3ZhciBlO2Q8Yj9lPVwiYXQgbGVhc3QgXCIrYjpkPmMmJihlPTA9PT1jP1wibm9uZVwiOlwibm8gbW9yZSB0aGFuIFwiK2MpO2lmKGUpdGhyb3cgRXJyb3IoYStcIiBmYWlsZWQ6IFdhcyBjYWxsZWQgd2l0aCBcIitkKygxPT09ZD9cIiBhcmd1bWVudC5cIjpcIiBhcmd1bWVudHMuXCIpK1wiIEV4cGVjdHMgXCIrZStcIi5cIik7fVxuZnVuY3Rpb24geShhLGIsYyl7dmFyIGQ9XCJcIjtzd2l0Y2goYil7Y2FzZSAxOmQ9Yz9cImZpcnN0XCI6XCJGaXJzdFwiO2JyZWFrO2Nhc2UgMjpkPWM/XCJzZWNvbmRcIjpcIlNlY29uZFwiO2JyZWFrO2Nhc2UgMzpkPWM/XCJ0aGlyZFwiOlwiVGhpcmRcIjticmVhaztjYXNlIDQ6ZD1jP1wiZm91cnRoXCI6XCJGb3VydGhcIjticmVhaztkZWZhdWx0OnhhLmFzc2VydCghMSxcImVycm9yUHJlZml4XyBjYWxsZWQgd2l0aCBhcmd1bWVudE51bWJlciA+IDQuICBOZWVkIHRvIHVwZGF0ZSBpdD9cIil9cmV0dXJuIGE9YStcIiBmYWlsZWQ6IFwiKyhkK1wiIGFyZ3VtZW50IFwiKX1mdW5jdGlvbiB6KGEsYixjLGQpe2lmKCghZHx8bChjKSkmJiFpYShjKSl0aHJvdyBFcnJvcih5KGEsYixkKStcIm11c3QgYmUgYSB2YWxpZCBmdW5jdGlvbi5cIik7fWZ1bmN0aW9uIHlhKGEsYixjKXtpZihsKGMpJiYoIWphKGMpfHxudWxsPT09YykpdGhyb3cgRXJyb3IoeShhLGIsITApK1wibXVzdCBiZSBhIHZhbGlkIGNvbnRleHQgb2JqZWN0LlwiKTt9O2Z1bmN0aW9uIEEoYSxiKXtyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGEsYil9ZnVuY3Rpb24gQihhLGIpe2lmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhLGIpKXJldHVybiBhW2JdfWZ1bmN0aW9uIHphKGEsYil7Zm9yKHZhciBjIGluIGEpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGEsYykmJmIoYyxhW2NdKX1mdW5jdGlvbiBBYShhKXt2YXIgYj17fTt6YShhLGZ1bmN0aW9uKGEsZCl7YlthXT1kfSk7cmV0dXJuIGJ9O3ZhciB4YT17fSxCYT0vW1xcW1xcXS4jJFxcL1xcdTAwMDAtXFx1MDAxRlxcdTAwN0ZdLyxDYT0vW1xcW1xcXS4jJFxcdTAwMDAtXFx1MDAxRlxcdTAwN0ZdLztmdW5jdGlvbiBEYShhKXtyZXR1cm4gcChhKSYmMCE9PWEubGVuZ3RoJiYhQmEudGVzdChhKX1mdW5jdGlvbiBFYShhLGIsYyl7YyYmIWwoYil8fEZhKHkoYSwxLGMpLGIpfVxuZnVuY3Rpb24gRmEoYSxiLGMsZCl7Y3x8KGM9MCk7ZD1kfHxbXTtpZighbChiKSl0aHJvdyBFcnJvcihhK1wiY29udGFpbnMgdW5kZWZpbmVkXCIrR2EoZCkpO2lmKGlhKGIpKXRocm93IEVycm9yKGErXCJjb250YWlucyBhIGZ1bmN0aW9uXCIrR2EoZCkrXCIgd2l0aCBjb250ZW50czogXCIrYi50b1N0cmluZygpKTtpZihIYShiKSl0aHJvdyBFcnJvcihhK1wiY29udGFpbnMgXCIrYi50b1N0cmluZygpK0dhKGQpKTtpZigxRTM8Yyl0aHJvdyBuZXcgVHlwZUVycm9yKGErXCJjb250YWlucyBhIGN5Y2xpYyBvYmplY3QgdmFsdWUgKFwiK2Quc2xpY2UoMCwxMDApLmpvaW4oXCIuXCIpK1wiLi4uKVwiKTtpZihwKGIpJiZiLmxlbmd0aD4xMDQ4NTc2MC8zJiYxMDQ4NTc2MDx2YShiKS5sZW5ndGgpdGhyb3cgRXJyb3IoYStcImNvbnRhaW5zIGEgc3RyaW5nIGdyZWF0ZXIgdGhhbiAxMDQ4NTc2MCB1dGY4IGJ5dGVzXCIrR2EoZCkrXCIgKCdcIitiLnN1YnN0cmluZygwLDUwKStcIi4uLicpXCIpO2lmKGphKGIpKWZvcih2YXIgZSBpbiBiKWlmKEEoYixcbmUpKXt2YXIgZj1iW2VdO2lmKFwiLnByaW9yaXR5XCIhPT1lJiZcIi52YWx1ZVwiIT09ZSYmXCIuc3ZcIiE9PWUmJiFEYShlKSl0aHJvdyBFcnJvcihhK1wiIGNvbnRhaW5zIGFuIGludmFsaWQga2V5IChcIitlK1wiKVwiK0dhKGQpKycuICBLZXlzIG11c3QgYmUgbm9uLWVtcHR5IHN0cmluZ3MgYW5kIGNhblxcJ3QgY29udGFpbiBcIi5cIiwgXCIjXCIsIFwiJFwiLCBcIi9cIiwgXCJbXCIsIG9yIFwiXVwiJyk7ZC5wdXNoKGUpO0ZhKGEsZixjKzEsZCk7ZC5wb3AoKX19ZnVuY3Rpb24gR2EoYSl7cmV0dXJuIDA9PWEubGVuZ3RoP1wiXCI6XCIgaW4gcHJvcGVydHkgJ1wiK2Euam9pbihcIi5cIikrXCInXCJ9ZnVuY3Rpb24gSWEoYSxiKXtpZighamEoYil8fGZhKGIpKXRocm93IEVycm9yKHkoYSwxLCExKStcIiBtdXN0IGJlIGFuIE9iamVjdCBjb250YWluaW5nIHRoZSBjaGlsZHJlbiB0byByZXBsYWNlLlwiKTtFYShhLGIsITEpfVxuZnVuY3Rpb24gSmEoYSxiLGMsZCl7aWYoIWR8fGwoYykpe2lmKEhhKGMpKXRocm93IEVycm9yKHkoYSxiLGQpK1wiaXMgXCIrYy50b1N0cmluZygpK1wiLCBidXQgbXVzdCBiZSBhIHZhbGlkIEZpcmViYXNlIHByaW9yaXR5IChhIHN0cmluZywgZmluaXRlIG51bWJlciwgb3IgbnVsbCkuXCIpO2lmKCEobnVsbD09PWN8fGhhKGMpfHxwKGMpfHxqYShjKSYmQShjLFwiLnN2XCIpKSl0aHJvdyBFcnJvcih5KGEsYixkKStcIm11c3QgYmUgYSB2YWxpZCBGaXJlYmFzZSBwcmlvcml0eSAoYSBzdHJpbmcsIGZpbml0ZSBudW1iZXIsIG9yIG51bGwpLlwiKTt9fVxuZnVuY3Rpb24gS2EoYSxiLGMpe2lmKCFjfHxsKGIpKXN3aXRjaChiKXtjYXNlIFwidmFsdWVcIjpjYXNlIFwiY2hpbGRfYWRkZWRcIjpjYXNlIFwiY2hpbGRfcmVtb3ZlZFwiOmNhc2UgXCJjaGlsZF9jaGFuZ2VkXCI6Y2FzZSBcImNoaWxkX21vdmVkXCI6YnJlYWs7ZGVmYXVsdDp0aHJvdyBFcnJvcih5KGEsMSxjKSsnbXVzdCBiZSBhIHZhbGlkIGV2ZW50IHR5cGU6IFwidmFsdWVcIiwgXCJjaGlsZF9hZGRlZFwiLCBcImNoaWxkX3JlbW92ZWRcIiwgXCJjaGlsZF9jaGFuZ2VkXCIsIG9yIFwiY2hpbGRfbW92ZWRcIi4nKTt9fWZ1bmN0aW9uIExhKGEsYil7aWYobChiKSYmIURhKGIpKXRocm93IEVycm9yKHkoYSwyLCEwKSsnd2FzIGFuIGludmFsaWQga2V5OiBcIicrYisnXCIuICBGaXJlYmFzZSBrZXlzIG11c3QgYmUgbm9uLWVtcHR5IHN0cmluZ3MgYW5kIGNhblxcJ3QgY29udGFpbiBcIi5cIiwgXCIjXCIsIFwiJFwiLCBcIi9cIiwgXCJbXCIsIG9yIFwiXVwiKS4nKTt9XG5mdW5jdGlvbiBNYShhLGIpe2lmKCFwKGIpfHwwPT09Yi5sZW5ndGh8fENhLnRlc3QoYikpdGhyb3cgRXJyb3IoeShhLDEsITEpKyd3YXMgYW4gaW52YWxpZCBwYXRoOiBcIicrYisnXCIuIFBhdGhzIG11c3QgYmUgbm9uLWVtcHR5IHN0cmluZ3MgYW5kIGNhblxcJ3QgY29udGFpbiBcIi5cIiwgXCIjXCIsIFwiJFwiLCBcIltcIiwgb3IgXCJdXCInKTt9ZnVuY3Rpb24gQyhhLGIpe2lmKFwiLmluZm9cIj09PUQoYikpdGhyb3cgRXJyb3IoYStcIiBmYWlsZWQ6IENhbid0IG1vZGlmeSBkYXRhIHVuZGVyIC8uaW5mby9cIik7fWZ1bmN0aW9uIE5hKGEsYil7aWYoIXAoYikpdGhyb3cgRXJyb3IoeShhLDEsITEpK1wibXVzdCBiZSBhIHZhbGlkIGNyZWRlbnRpYWwgKGEgc3RyaW5nKS5cIik7fWZ1bmN0aW9uIE9hKGEsYixjKXtpZighcChjKSl0aHJvdyBFcnJvcih5KGEsYiwhMSkrXCJtdXN0IGJlIGEgdmFsaWQgc3RyaW5nLlwiKTt9XG5mdW5jdGlvbiBFKGEsYixjLGQpe2lmKCFkfHxsKGMpKWlmKCFqYShjKXx8bnVsbD09PWMpdGhyb3cgRXJyb3IoeShhLGIsZCkrXCJtdXN0IGJlIGEgdmFsaWQgb2JqZWN0LlwiKTt9ZnVuY3Rpb24gUGEoYSxiLGMpe2lmKCFqYShiKXx8bnVsbD09PWJ8fCFBKGIsYykpdGhyb3cgRXJyb3IoeShhLDEsITEpKydtdXN0IGNvbnRhaW4gdGhlIGtleSBcIicrYysnXCInKTtpZighcChCKGIsYykpKXRocm93IEVycm9yKHkoYSwxLCExKSsnbXVzdCBjb250YWluIHRoZSBrZXkgXCInK2MrJ1wiIHdpdGggdHlwZSBcInN0cmluZ1wiJyk7fTtmdW5jdGlvbiBGKGEsYixjLGQsZSxmLGcpe3RoaXMuaT1hO3RoaXMucGF0aD1iO3RoaXMuR2E9Yzt0aGlzLmZhPWQ7dGhpcy56YT1lO3RoaXMuRWE9Zjt0aGlzLmZiPWc7aWYobCh0aGlzLmZhKSYmbCh0aGlzLkVhKSYmbCh0aGlzLkdhKSl0aHJvd1wiUXVlcnk6IENhbid0IGNvbWJpbmUgc3RhcnRBdCgpLCBlbmRBdCgpLCBhbmQgbGltaXQoKS5cIjt9Ri5wcm90b3R5cGUucmQ9ZnVuY3Rpb24oKXt4KFwiUXVlcnkucmVmXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiBuZXcgRyh0aGlzLmksdGhpcy5wYXRoKX07Ri5wcm90b3R5cGUucmVmPUYucHJvdG90eXBlLnJkO1xuRi5wcm90b3R5cGUuVWE9ZnVuY3Rpb24oYSxiKXt4KFwiUXVlcnkub25cIiwyLDQsYXJndW1lbnRzLmxlbmd0aCk7S2EoXCJRdWVyeS5vblwiLGEsITEpO3ooXCJRdWVyeS5vblwiLDIsYiwhMSk7dmFyIGM9UWEoXCJRdWVyeS5vblwiLGFyZ3VtZW50c1syXSxhcmd1bWVudHNbM10pO3RoaXMuaS5lYyh0aGlzLGEsYixjLmNhbmNlbCxjLiQpO3JldHVybiBifTtGLnByb3RvdHlwZS5vbj1GLnByb3RvdHlwZS5VYTtGLnByb3RvdHlwZS5uYj1mdW5jdGlvbihhLGIsYyl7eChcIlF1ZXJ5Lm9mZlwiLDAsMyxhcmd1bWVudHMubGVuZ3RoKTtLYShcIlF1ZXJ5Lm9mZlwiLGEsITApO3ooXCJRdWVyeS5vZmZcIiwyLGIsITApO3lhKFwiUXVlcnkub2ZmXCIsMyxjKTt0aGlzLmkuRGModGhpcyxhLGIsYyl9O0YucHJvdG90eXBlLm9mZj1GLnByb3RvdHlwZS5uYjtcbkYucHJvdG90eXBlLktlPWZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gYyhnKXtmJiYoZj0hMSxlLm5iKGEsYyksYi5jYWxsKGQuJCxnKSl9eChcIlF1ZXJ5Lm9uY2VcIiwyLDQsYXJndW1lbnRzLmxlbmd0aCk7S2EoXCJRdWVyeS5vbmNlXCIsYSwhMSk7eihcIlF1ZXJ5Lm9uY2VcIiwyLGIsITEpO3ZhciBkPVFhKFwiUXVlcnkub25jZVwiLGFyZ3VtZW50c1syXSxhcmd1bWVudHNbM10pLGU9dGhpcyxmPSEwO3RoaXMuVWEoYSxjLGZ1bmN0aW9uKGIpe2UubmIoYSxjKTtkLmNhbmNlbCYmZC5jYW5jZWwuY2FsbChkLiQsYil9KX07Ri5wcm90b3R5cGUub25jZT1GLnByb3RvdHlwZS5LZTtcbkYucHJvdG90eXBlLnplPWZ1bmN0aW9uKGEpe3goXCJRdWVyeS5saW1pdFwiLDEsMSxhcmd1bWVudHMubGVuZ3RoKTtpZighaGEoYSl8fE1hdGguZmxvb3IoYSkhPT1hfHwwPj1hKXRocm93XCJRdWVyeS5saW1pdDogRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIuXCI7cmV0dXJuIG5ldyBGKHRoaXMuaSx0aGlzLnBhdGgsYSx0aGlzLmZhLHRoaXMuemEsdGhpcy5FYSx0aGlzLmZiKX07Ri5wcm90b3R5cGUubGltaXQ9Ri5wcm90b3R5cGUuemU7Ri5wcm90b3R5cGUuYWU9ZnVuY3Rpb24oYSxiKXt4KFwiUXVlcnkuc3RhcnRBdFwiLDAsMixhcmd1bWVudHMubGVuZ3RoKTtKYShcIlF1ZXJ5LnN0YXJ0QXRcIiwxLGEsITApO0xhKFwiUXVlcnkuc3RhcnRBdFwiLGIpO2woYSl8fChiPWE9bnVsbCk7cmV0dXJuIG5ldyBGKHRoaXMuaSx0aGlzLnBhdGgsdGhpcy5HYSxhLGIsdGhpcy5FYSx0aGlzLmZiKX07Ri5wcm90b3R5cGUuc3RhcnRBdD1GLnByb3RvdHlwZS5hZTtcbkYucHJvdG90eXBlLkhkPWZ1bmN0aW9uKGEsYil7eChcIlF1ZXJ5LmVuZEF0XCIsMCwyLGFyZ3VtZW50cy5sZW5ndGgpO0phKFwiUXVlcnkuZW5kQXRcIiwxLGEsITApO0xhKFwiUXVlcnkuZW5kQXRcIixiKTtyZXR1cm4gbmV3IEYodGhpcy5pLHRoaXMucGF0aCx0aGlzLkdhLHRoaXMuZmEsdGhpcy56YSxhLGIpfTtGLnByb3RvdHlwZS5lbmRBdD1GLnByb3RvdHlwZS5IZDtGLnByb3RvdHlwZS5zZT1mdW5jdGlvbihhLGIpe3goXCJRdWVyeS5lcXVhbFRvXCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO0phKFwiUXVlcnkuZXF1YWxUb1wiLDEsYSwhMSk7TGEoXCJRdWVyeS5lcXVhbFRvXCIsYik7cmV0dXJuIHRoaXMuYWUoYSxiKS5IZChhLGIpfTtGLnByb3RvdHlwZS5lcXVhbFRvPUYucHJvdG90eXBlLnNlO1xuZnVuY3Rpb24gUmEoYSl7dmFyIGI9e307bChhLmZhKSYmKGIuc3A9YS5mYSk7bChhLnphKSYmKGIuc249YS56YSk7bChhLkVhKSYmKGIuZXA9YS5FYSk7bChhLmZiKSYmKGIuZW49YS5mYik7bChhLkdhKSYmKGIubD1hLkdhKTtsKGEuZmEpJiZsKGEuemEpJiZudWxsPT09YS5mYSYmbnVsbD09PWEuemEmJihiLnZmPVwibFwiKTtyZXR1cm4gYn1GLnByb3RvdHlwZS5XYT1mdW5jdGlvbigpe3ZhciBhPVNhKFJhKHRoaXMpKTtyZXR1cm5cInt9XCI9PT1hP1wiZGVmYXVsdFwiOmF9O1xuZnVuY3Rpb24gUWEoYSxiLGMpe3ZhciBkPXt9O2lmKGImJmMpZC5jYW5jZWw9Yix6KGEsMyxkLmNhbmNlbCwhMCksZC4kPWMseWEoYSw0LGQuJCk7ZWxzZSBpZihiKWlmKFwib2JqZWN0XCI9PT10eXBlb2YgYiYmbnVsbCE9PWIpZC4kPWI7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgYilkLmNhbmNlbD1iO2Vsc2UgdGhyb3cgRXJyb3Iod2EuYWYoYSwzLCEwKStcIm11c3QgZWl0aGVyIGJlIGEgY2FuY2VsIGNhbGxiYWNrIG9yIGEgY29udGV4dCBvYmplY3QuXCIpO3JldHVybiBkfTtmdW5jdGlvbiBIKGEsYil7aWYoMT09YXJndW1lbnRzLmxlbmd0aCl7dGhpcy51PWEuc3BsaXQoXCIvXCIpO2Zvcih2YXIgYz0wLGQ9MDtkPHRoaXMudS5sZW5ndGg7ZCsrKTA8dGhpcy51W2RdLmxlbmd0aCYmKHRoaXMudVtjXT10aGlzLnVbZF0sYysrKTt0aGlzLnUubGVuZ3RoPWM7dGhpcy5XPTB9ZWxzZSB0aGlzLnU9YSx0aGlzLlc9Yn1mdW5jdGlvbiBEKGEpe3JldHVybiBhLlc+PWEudS5sZW5ndGg/bnVsbDphLnVbYS5XXX1mdW5jdGlvbiBUYShhKXt2YXIgYj1hLlc7YjxhLnUubGVuZ3RoJiZiKys7cmV0dXJuIG5ldyBIKGEudSxiKX1mdW5jdGlvbiBVYShhKXtyZXR1cm4gYS5XPGEudS5sZW5ndGg/YS51W2EudS5sZW5ndGgtMV06bnVsbH1rPUgucHJvdG90eXBlO2sudG9TdHJpbmc9ZnVuY3Rpb24oKXtmb3IodmFyIGE9XCJcIixiPXRoaXMuVztiPHRoaXMudS5sZW5ndGg7YisrKVwiXCIhPT10aGlzLnVbYl0mJihhKz1cIi9cIit0aGlzLnVbYl0pO3JldHVybiBhfHxcIi9cIn07XG5rLnBhcmVudD1mdW5jdGlvbigpe2lmKHRoaXMuVz49dGhpcy51Lmxlbmd0aClyZXR1cm4gbnVsbDtmb3IodmFyIGE9W10sYj10aGlzLlc7Yjx0aGlzLnUubGVuZ3RoLTE7YisrKWEucHVzaCh0aGlzLnVbYl0pO3JldHVybiBuZXcgSChhLDApfTtrLko9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPVtdLGM9dGhpcy5XO2M8dGhpcy51Lmxlbmd0aDtjKyspYi5wdXNoKHRoaXMudVtjXSk7aWYoYSBpbnN0YW5jZW9mIEgpZm9yKGM9YS5XO2M8YS51Lmxlbmd0aDtjKyspYi5wdXNoKGEudVtjXSk7ZWxzZSBmb3IoYT1hLnNwbGl0KFwiL1wiKSxjPTA7YzxhLmxlbmd0aDtjKyspMDxhW2NdLmxlbmd0aCYmYi5wdXNoKGFbY10pO3JldHVybiBuZXcgSChiLDApfTtrLmY9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5XPj10aGlzLnUubGVuZ3RofTtrLmxlbmd0aD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnUubGVuZ3RoLXRoaXMuV307XG5mdW5jdGlvbiBWYShhLGIpe3ZhciBjPUQoYSk7aWYobnVsbD09PWMpcmV0dXJuIGI7aWYoYz09PUQoYikpcmV0dXJuIFZhKFRhKGEpLFRhKGIpKTt0aHJvd1wiSU5URVJOQUwgRVJST1I6IGlubmVyUGF0aCAoXCIrYitcIikgaXMgbm90IHdpdGhpbiBvdXRlclBhdGggKFwiK2ErXCIpXCI7fWsuY29udGFpbnM9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5XLGM9YS5XO2lmKHRoaXMubGVuZ3RoKCk+YS5sZW5ndGgoKSlyZXR1cm4hMTtmb3IoO2I8dGhpcy51Lmxlbmd0aDspe2lmKHRoaXMudVtiXSE9PWEudVtjXSlyZXR1cm4hMTsrK2I7KytjfXJldHVybiEwfTtmdW5jdGlvbiBXYSgpe3RoaXMuY2hpbGRyZW49e307dGhpcy5nYz0wO3RoaXMudmFsdWU9bnVsbH1mdW5jdGlvbiBYYShhLGIsYyl7dGhpcy5IYT1hP2E6XCJcIjt0aGlzLlFiPWI/YjpudWxsO3RoaXMuQT1jP2M6bmV3IFdhfWZ1bmN0aW9uIEkoYSxiKXtmb3IodmFyIGM9YiBpbnN0YW5jZW9mIEg/YjpuZXcgSChiKSxkPWEsZTtudWxsIT09KGU9RChjKSk7KWQ9bmV3IFhhKGUsZCxCKGQuQS5jaGlsZHJlbixlKXx8bmV3IFdhKSxjPVRhKGMpO3JldHVybiBkfWs9WGEucHJvdG90eXBlO2suaz1mdW5jdGlvbigpe3JldHVybiB0aGlzLkEudmFsdWV9O2Z1bmN0aW9uIFlhKGEsYil7dihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGIsXCJDYW5ub3Qgc2V0IHZhbHVlIHRvIHVuZGVmaW5lZFwiKTthLkEudmFsdWU9YjtaYShhKX1rLmNsZWFyPWZ1bmN0aW9uKCl7dGhpcy5BLnZhbHVlPW51bGw7dGhpcy5BLmNoaWxkcmVuPXt9O3RoaXMuQS5nYz0wO1phKHRoaXMpfTtcbmsuRmI9ZnVuY3Rpb24oKXtyZXR1cm4gMDx0aGlzLkEuZ2N9O2suZj1mdW5jdGlvbigpe3JldHVybiBudWxsPT09dGhpcy5rKCkmJiF0aGlzLkZiKCl9O2suQj1mdW5jdGlvbihhKXtmb3IodmFyIGIgaW4gdGhpcy5BLmNoaWxkcmVuKWEobmV3IFhhKGIsdGhpcyx0aGlzLkEuY2hpbGRyZW5bYl0pKX07ZnVuY3Rpb24gJGEoYSxiLGMsZCl7YyYmIWQmJmIoYSk7YS5CKGZ1bmN0aW9uKGEpeyRhKGEsYiwhMCxkKX0pO2MmJmQmJmIoYSl9ZnVuY3Rpb24gYWIoYSxiLGMpe2ZvcihhPWM/YTphLnBhcmVudCgpO251bGwhPT1hOyl7aWYoYihhKSlyZXR1cm4hMDthPWEucGFyZW50KCl9cmV0dXJuITF9ay5wYXRoPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBIKG51bGw9PT10aGlzLlFiP3RoaXMuSGE6dGhpcy5RYi5wYXRoKCkrXCIvXCIrdGhpcy5IYSl9O2submFtZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLkhhfTtrLnBhcmVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLlFifTtcbmZ1bmN0aW9uIFphKGEpe2lmKG51bGwhPT1hLlFiKXt2YXIgYj1hLlFiLGM9YS5IYSxkPWEuZigpLGU9QShiLkEuY2hpbGRyZW4sYyk7ZCYmZT8oZGVsZXRlIGIuQS5jaGlsZHJlbltjXSxiLkEuZ2MtLSxaYShiKSk6ZHx8ZXx8KGIuQS5jaGlsZHJlbltjXT1hLkEsYi5BLmdjKyssWmEoYikpfX07ZnVuY3Rpb24gYmIoYSxiKXt0aGlzLmFiPWE/YTpjYjt0aGlzLmVhPWI/YjpkYn1mdW5jdGlvbiBjYihhLGIpe3JldHVybiBhPGI/LTE6YT5iPzE6MH1rPWJiLnByb3RvdHlwZTtrLnRhPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBiYih0aGlzLmFiLHRoaXMuZWEudGEoYSxiLHRoaXMuYWIpLk0obnVsbCxudWxsLCExLG51bGwsbnVsbCkpfTtrLnJlbW92ZT1mdW5jdGlvbihhKXtyZXR1cm4gbmV3IGJiKHRoaXMuYWIsdGhpcy5lYS5yZW1vdmUoYSx0aGlzLmFiKS5NKG51bGwsbnVsbCwhMSxudWxsLG51bGwpKX07ay5nZXQ9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiLGM9dGhpcy5lYTshYy5mKCk7KXtiPXRoaXMuYWIoYSxjLmtleSk7aWYoMD09PWIpcmV0dXJuIGMudmFsdWU7MD5iP2M9Yy5sZWZ0OjA8YiYmKGM9Yy5yaWdodCl9cmV0dXJuIG51bGx9O1xuZnVuY3Rpb24gZWIoYSxiKXtmb3IodmFyIGMsZD1hLmVhLGU9bnVsbDshZC5mKCk7KXtjPWEuYWIoYixkLmtleSk7aWYoMD09PWMpe2lmKGQubGVmdC5mKCkpcmV0dXJuIGU/ZS5rZXk6bnVsbDtmb3IoZD1kLmxlZnQ7IWQucmlnaHQuZigpOylkPWQucmlnaHQ7cmV0dXJuIGQua2V5fTA+Yz9kPWQubGVmdDowPGMmJihlPWQsZD1kLnJpZ2h0KX10aHJvdyBFcnJvcihcIkF0dGVtcHRlZCB0byBmaW5kIHByZWRlY2Vzc29yIGtleSBmb3IgYSBub25leGlzdGVudCBrZXkuICBXaGF0IGdpdmVzP1wiKTt9ay5mPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZWEuZigpfTtrLmNvdW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZWEuY291bnQoKX07ay5MYj1mdW5jdGlvbigpe3JldHVybiB0aGlzLmVhLkxiKCl9O2subGI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lYS5sYigpfTtrLkZhPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmVhLkZhKGEpfTtrLlhhPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmVhLlhhKGEpfTtcbmsuamI9ZnVuY3Rpb24oYSl7cmV0dXJuIG5ldyBmYih0aGlzLmVhLGEpfTtmdW5jdGlvbiBmYihhLGIpe3RoaXMuV2Q9Yjtmb3IodGhpcy5wYz1bXTshYS5mKCk7KXRoaXMucGMucHVzaChhKSxhPWEubGVmdH1mdW5jdGlvbiBnYihhKXtpZigwPT09YS5wYy5sZW5ndGgpcmV0dXJuIG51bGw7dmFyIGI9YS5wYy5wb3AoKSxjO2M9YS5XZD9hLldkKGIua2V5LGIudmFsdWUpOntrZXk6Yi5rZXksdmFsdWU6Yi52YWx1ZX07Zm9yKGI9Yi5yaWdodDshYi5mKCk7KWEucGMucHVzaChiKSxiPWIubGVmdDtyZXR1cm4gY31mdW5jdGlvbiBoYihhLGIsYyxkLGUpe3RoaXMua2V5PWE7dGhpcy52YWx1ZT1iO3RoaXMuY29sb3I9bnVsbCE9Yz9jOiEwO3RoaXMubGVmdD1udWxsIT1kP2Q6ZGI7dGhpcy5yaWdodD1udWxsIT1lP2U6ZGJ9az1oYi5wcm90b3R5cGU7XG5rLk09ZnVuY3Rpb24oYSxiLGMsZCxlKXtyZXR1cm4gbmV3IGhiKG51bGwhPWE/YTp0aGlzLmtleSxudWxsIT1iP2I6dGhpcy52YWx1ZSxudWxsIT1jP2M6dGhpcy5jb2xvcixudWxsIT1kP2Q6dGhpcy5sZWZ0LG51bGwhPWU/ZTp0aGlzLnJpZ2h0KX07ay5jb3VudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmxlZnQuY291bnQoKSsxK3RoaXMucmlnaHQuY291bnQoKX07ay5mPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2suRmE9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMubGVmdC5GYShhKXx8YSh0aGlzLmtleSx0aGlzLnZhbHVlKXx8dGhpcy5yaWdodC5GYShhKX07ay5YYT1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5yaWdodC5YYShhKXx8YSh0aGlzLmtleSx0aGlzLnZhbHVlKXx8dGhpcy5sZWZ0LlhhKGEpfTtmdW5jdGlvbiBpYihhKXtyZXR1cm4gYS5sZWZ0LmYoKT9hOmliKGEubGVmdCl9ay5MYj1mdW5jdGlvbigpe3JldHVybiBpYih0aGlzKS5rZXl9O1xuay5sYj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnJpZ2h0LmYoKT90aGlzLmtleTp0aGlzLnJpZ2h0LmxiKCl9O2sudGE9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGU7ZT10aGlzO2Q9YyhhLGUua2V5KTtlPTA+ZD9lLk0obnVsbCxudWxsLG51bGwsZS5sZWZ0LnRhKGEsYixjKSxudWxsKTowPT09ZD9lLk0obnVsbCxiLG51bGwsbnVsbCxudWxsKTplLk0obnVsbCxudWxsLG51bGwsbnVsbCxlLnJpZ2h0LnRhKGEsYixjKSk7cmV0dXJuIGpiKGUpfTtmdW5jdGlvbiBrYihhKXtpZihhLmxlZnQuZigpKXJldHVybiBkYjthLmxlZnQuUigpfHxhLmxlZnQubGVmdC5SKCl8fChhPWxiKGEpKTthPWEuTShudWxsLG51bGwsbnVsbCxrYihhLmxlZnQpLG51bGwpO3JldHVybiBqYihhKX1cbmsucmVtb3ZlPWZ1bmN0aW9uKGEsYil7dmFyIGMsZDtjPXRoaXM7aWYoMD5iKGEsYy5rZXkpKWMubGVmdC5mKCl8fGMubGVmdC5SKCl8fGMubGVmdC5sZWZ0LlIoKXx8KGM9bGIoYykpLGM9Yy5NKG51bGwsbnVsbCxudWxsLGMubGVmdC5yZW1vdmUoYSxiKSxudWxsKTtlbHNle2MubGVmdC5SKCkmJihjPW1iKGMpKTtjLnJpZ2h0LmYoKXx8Yy5yaWdodC5SKCl8fGMucmlnaHQubGVmdC5SKCl8fChjPW5iKGMpLGMubGVmdC5sZWZ0LlIoKSYmKGM9bWIoYyksYz1uYihjKSkpO2lmKDA9PT1iKGEsYy5rZXkpKXtpZihjLnJpZ2h0LmYoKSlyZXR1cm4gZGI7ZD1pYihjLnJpZ2h0KTtjPWMuTShkLmtleSxkLnZhbHVlLG51bGwsbnVsbCxrYihjLnJpZ2h0KSl9Yz1jLk0obnVsbCxudWxsLG51bGwsbnVsbCxjLnJpZ2h0LnJlbW92ZShhLGIpKX1yZXR1cm4gamIoYyl9O2suUj1mdW5jdGlvbigpe3JldHVybiB0aGlzLmNvbG9yfTtcbmZ1bmN0aW9uIGpiKGEpe2EucmlnaHQuUigpJiYhYS5sZWZ0LlIoKSYmKGE9b2IoYSkpO2EubGVmdC5SKCkmJmEubGVmdC5sZWZ0LlIoKSYmKGE9bWIoYSkpO2EubGVmdC5SKCkmJmEucmlnaHQuUigpJiYoYT1uYihhKSk7cmV0dXJuIGF9ZnVuY3Rpb24gbGIoYSl7YT1uYihhKTthLnJpZ2h0LmxlZnQuUigpJiYoYT1hLk0obnVsbCxudWxsLG51bGwsbnVsbCxtYihhLnJpZ2h0KSksYT1vYihhKSxhPW5iKGEpKTtyZXR1cm4gYX1mdW5jdGlvbiBvYihhKXtyZXR1cm4gYS5yaWdodC5NKG51bGwsbnVsbCxhLmNvbG9yLGEuTShudWxsLG51bGwsITAsbnVsbCxhLnJpZ2h0LmxlZnQpLG51bGwpfWZ1bmN0aW9uIG1iKGEpe3JldHVybiBhLmxlZnQuTShudWxsLG51bGwsYS5jb2xvcixudWxsLGEuTShudWxsLG51bGwsITAsYS5sZWZ0LnJpZ2h0LG51bGwpKX1cbmZ1bmN0aW9uIG5iKGEpe3JldHVybiBhLk0obnVsbCxudWxsLCFhLmNvbG9yLGEubGVmdC5NKG51bGwsbnVsbCwhYS5sZWZ0LmNvbG9yLG51bGwsbnVsbCksYS5yaWdodC5NKG51bGwsbnVsbCwhYS5yaWdodC5jb2xvcixudWxsLG51bGwpKX1mdW5jdGlvbiBwYigpe31rPXBiLnByb3RvdHlwZTtrLk09ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc307ay50YT1mdW5jdGlvbihhLGIpe3JldHVybiBuZXcgaGIoYSxiLG51bGwpfTtrLnJlbW92ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzfTtrLmNvdW50PWZ1bmN0aW9uKCl7cmV0dXJuIDB9O2suZj1mdW5jdGlvbigpe3JldHVybiEwfTtrLkZhPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2suWGE9ZnVuY3Rpb24oKXtyZXR1cm4hMX07ay5MYj1mdW5jdGlvbigpe3JldHVybiBudWxsfTtrLmxiPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9O2suUj1mdW5jdGlvbigpe3JldHVybiExfTt2YXIgZGI9bmV3IHBiO2Z1bmN0aW9uIHFiKGEpe3RoaXMuQ2I9YTt0aGlzLnpjPVwiZmlyZWJhc2U6XCJ9az1xYi5wcm90b3R5cGU7ay5zZXQ9ZnVuY3Rpb24oYSxiKXtudWxsPT1iP3RoaXMuQ2IucmVtb3ZlSXRlbSh0aGlzLnpjK2EpOnRoaXMuQ2Iuc2V0SXRlbSh0aGlzLnpjK2EsdShiKSl9O2suZ2V0PWZ1bmN0aW9uKGEpe2E9dGhpcy5DYi5nZXRJdGVtKHRoaXMuemMrYSk7cmV0dXJuIG51bGw9PWE/bnVsbDp1YShhKX07ay5yZW1vdmU9ZnVuY3Rpb24oYSl7dGhpcy5DYi5yZW1vdmVJdGVtKHRoaXMuemMrYSl9O2suTmQ9ITE7ay50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLkNiLnRvU3RyaW5nKCl9O2Z1bmN0aW9uIHRiKCl7dGhpcy55Yj17fX10Yi5wcm90b3R5cGUuc2V0PWZ1bmN0aW9uKGEsYil7bnVsbD09Yj9kZWxldGUgdGhpcy55YlthXTp0aGlzLnliW2FdPWJ9O3RiLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oYSl7cmV0dXJuIEEodGhpcy55YixhKT90aGlzLnliW2FdOm51bGx9O3RiLnByb3RvdHlwZS5yZW1vdmU9ZnVuY3Rpb24oYSl7ZGVsZXRlIHRoaXMueWJbYV19O3RiLnByb3RvdHlwZS5OZD0hMDtmdW5jdGlvbiB1YihhKXt0cnl7aWYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiB3aW5kb3cmJlwidW5kZWZpbmVkXCIhPT10eXBlb2Ygd2luZG93W2FdKXt2YXIgYj13aW5kb3dbYV07Yi5zZXRJdGVtKFwiZmlyZWJhc2U6c2VudGluZWxcIixcImNhY2hlXCIpO2IucmVtb3ZlSXRlbShcImZpcmViYXNlOnNlbnRpbmVsXCIpO3JldHVybiBuZXcgcWIoYil9fWNhdGNoKGMpe31yZXR1cm4gbmV3IHRifXZhciB2Yj11YihcImxvY2FsU3RvcmFnZVwiKSxKPXViKFwic2Vzc2lvblN0b3JhZ2VcIik7ZnVuY3Rpb24gd2IoYSxiLGMsZCxlKXt0aGlzLmhvc3Q9YS50b0xvd2VyQ2FzZSgpO3RoaXMuZG9tYWluPXRoaXMuaG9zdC5zdWJzdHIodGhpcy5ob3N0LmluZGV4T2YoXCIuXCIpKzEpO3RoaXMuWWE9Yjt0aGlzLlRhPWM7dGhpcy5ZZT1kO3RoaXMueWM9ZXx8XCJcIjt0aGlzLmlhPXZiLmdldChcImhvc3Q6XCIrYSl8fHRoaXMuaG9zdH1mdW5jdGlvbiB4YihhLGIpe2IhPT1hLmlhJiYoYS5pYT1iLFwicy1cIj09PWEuaWEuc3Vic3RyKDAsMikmJnZiLnNldChcImhvc3Q6XCIrYS5ob3N0LGEuaWEpKX13Yi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXt2YXIgYT0odGhpcy5ZYT9cImh0dHBzOi8vXCI6XCJodHRwOi8vXCIpK3RoaXMuaG9zdDt0aGlzLnljJiYoYSs9XCI8XCIrdGhpcy55YytcIj5cIik7cmV0dXJuIGF9O2Z1bmN0aW9uIHliKCl7dGhpcy5yYT0tMX07ZnVuY3Rpb24gemIoKXt0aGlzLnJhPS0xO3RoaXMucmE9NjQ7dGhpcy5GPVtdO3RoaXMuU2M9W107dGhpcy5nZT1bXTt0aGlzLnZjPVtdO3RoaXMudmNbMF09MTI4O2Zvcih2YXIgYT0xO2E8dGhpcy5yYTsrK2EpdGhpcy52Y1thXT0wO3RoaXMuS2M9dGhpcy5rYj0wO3RoaXMucmVzZXQoKX1uYSh6Yix5Yik7emIucHJvdG90eXBlLnJlc2V0PWZ1bmN0aW9uKCl7dGhpcy5GWzBdPTE3MzI1ODQxOTM7dGhpcy5GWzFdPTQwMjMyMzM0MTc7dGhpcy5GWzJdPTI1NjIzODMxMDI7dGhpcy5GWzNdPTI3MTczMzg3ODt0aGlzLkZbNF09MzI4NTM3NzUyMDt0aGlzLktjPXRoaXMua2I9MH07XG5mdW5jdGlvbiBBYihhLGIsYyl7Y3x8KGM9MCk7dmFyIGQ9YS5nZTtpZihwKGIpKWZvcih2YXIgZT0wOzE2PmU7ZSsrKWRbZV09Yi5jaGFyQ29kZUF0KGMpPDwyNHxiLmNoYXJDb2RlQXQoYysxKTw8MTZ8Yi5jaGFyQ29kZUF0KGMrMik8PDh8Yi5jaGFyQ29kZUF0KGMrMyksYys9NDtlbHNlIGZvcihlPTA7MTY+ZTtlKyspZFtlXT1iW2NdPDwyNHxiW2MrMV08PDE2fGJbYysyXTw8OHxiW2MrM10sYys9NDtmb3IoZT0xNjs4MD5lO2UrKyl7dmFyIGY9ZFtlLTNdXmRbZS04XV5kW2UtMTRdXmRbZS0xNl07ZFtlXT0oZjw8MXxmPj4+MzEpJjQyOTQ5NjcyOTV9Yj1hLkZbMF07Yz1hLkZbMV07Zm9yKHZhciBnPWEuRlsyXSxoPWEuRlszXSxtPWEuRls0XSxuLGU9MDs4MD5lO2UrKyk0MD5lPzIwPmU/KGY9aF5jJihnXmgpLG49MTUxODUwMDI0OSk6KGY9Y15nXmgsbj0xODU5Nzc1MzkzKTo2MD5lPyhmPWMmZ3xoJihjfGcpLG49MjQwMDk1OTcwOCk6KGY9Y15nXmgsbj0zMzk1NDY5NzgyKSxmPShiPDxcbjV8Yj4+PjI3KStmK20rbitkW2VdJjQyOTQ5NjcyOTUsbT1oLGg9ZyxnPShjPDwzMHxjPj4+MikmNDI5NDk2NzI5NSxjPWIsYj1mO2EuRlswXT1hLkZbMF0rYiY0Mjk0OTY3Mjk1O2EuRlsxXT1hLkZbMV0rYyY0Mjk0OTY3Mjk1O2EuRlsyXT1hLkZbMl0rZyY0Mjk0OTY3Mjk1O2EuRlszXT1hLkZbM10raCY0Mjk0OTY3Mjk1O2EuRls0XT1hLkZbNF0rbSY0Mjk0OTY3Mjk1fVxuemIucHJvdG90eXBlLnVwZGF0ZT1mdW5jdGlvbihhLGIpe2woYil8fChiPWEubGVuZ3RoKTtmb3IodmFyIGM9Yi10aGlzLnJhLGQ9MCxlPXRoaXMuU2MsZj10aGlzLmtiO2Q8Yjspe2lmKDA9PWYpZm9yKDtkPD1jOylBYih0aGlzLGEsZCksZCs9dGhpcy5yYTtpZihwKGEpKWZvcig7ZDxiOyl7aWYoZVtmXT1hLmNoYXJDb2RlQXQoZCksKytmLCsrZCxmPT10aGlzLnJhKXtBYih0aGlzLGUpO2Y9MDticmVha319ZWxzZSBmb3IoO2Q8YjspaWYoZVtmXT1hW2RdLCsrZiwrK2QsZj09dGhpcy5yYSl7QWIodGhpcyxlKTtmPTA7YnJlYWt9fXRoaXMua2I9Zjt0aGlzLktjKz1ifTtmdW5jdGlvbiBCYigpe3JldHVybiBNYXRoLmZsb29yKDIxNDc0ODM2NDgqTWF0aC5yYW5kb20oKSkudG9TdHJpbmcoMzYpK01hdGguYWJzKE1hdGguZmxvb3IoMjE0NzQ4MzY0OCpNYXRoLnJhbmRvbSgpKV5tYSgpKS50b1N0cmluZygzNil9O3ZhciBMPUFycmF5LnByb3RvdHlwZSxDYj1MLmluZGV4T2Y/ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBMLmluZGV4T2YuY2FsbChhLGIsYyl9OmZ1bmN0aW9uKGEsYixjKXtjPW51bGw9PWM/MDowPmM/TWF0aC5tYXgoMCxhLmxlbmd0aCtjKTpjO2lmKHAoYSkpcmV0dXJuIHAoYikmJjE9PWIubGVuZ3RoP2EuaW5kZXhPZihiLGMpOi0xO2Zvcig7YzxhLmxlbmd0aDtjKyspaWYoYyBpbiBhJiZhW2NdPT09YilyZXR1cm4gYztyZXR1cm4tMX0sRGI9TC5mb3JFYWNoP2Z1bmN0aW9uKGEsYixjKXtMLmZvckVhY2guY2FsbChhLGIsYyl9OmZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGQ9YS5sZW5ndGgsZT1wKGEpP2Euc3BsaXQoXCJcIik6YSxmPTA7ZjxkO2YrKylmIGluIGUmJmIuY2FsbChjLGVbZl0sZixhKX0sRWI9TC5maWx0ZXI/ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBMLmZpbHRlci5jYWxsKGEsYixjKX06ZnVuY3Rpb24oYSxiLGMpe2Zvcih2YXIgZD1hLmxlbmd0aCxlPVtdLGY9MCxnPXAoYSk/XG5hLnNwbGl0KFwiXCIpOmEsaD0wO2g8ZDtoKyspaWYoaCBpbiBnKXt2YXIgbT1nW2hdO2IuY2FsbChjLG0saCxhKSYmKGVbZisrXT1tKX1yZXR1cm4gZX0sRmI9TC5tYXA/ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBMLm1hcC5jYWxsKGEsYixjKX06ZnVuY3Rpb24oYSxiLGMpe2Zvcih2YXIgZD1hLmxlbmd0aCxlPUFycmF5KGQpLGY9cChhKT9hLnNwbGl0KFwiXCIpOmEsZz0wO2c8ZDtnKyspZyBpbiBmJiYoZVtnXT1iLmNhbGwoYyxmW2ddLGcsYSkpO3JldHVybiBlfSxHYj1MLnJlZHVjZT9mdW5jdGlvbihhLGIsYyxkKXtkJiYoYj1yKGIsZCkpO3JldHVybiBMLnJlZHVjZS5jYWxsKGEsYixjKX06ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9YztEYihhLGZ1bmN0aW9uKGMsZyl7ZT1iLmNhbGwoZCxlLGMsZyxhKX0pO3JldHVybiBlfSxIYj1MLmV2ZXJ5P2Z1bmN0aW9uKGEsYixjKXtyZXR1cm4gTC5ldmVyeS5jYWxsKGEsYixjKX06ZnVuY3Rpb24oYSxiLGMpe2Zvcih2YXIgZD1hLmxlbmd0aCxlPVxucChhKT9hLnNwbGl0KFwiXCIpOmEsZj0wO2Y8ZDtmKyspaWYoZiBpbiBlJiYhYi5jYWxsKGMsZVtmXSxmLGEpKXJldHVybiExO3JldHVybiEwfTtmdW5jdGlvbiBJYihhLGIpe3ZhciBjO2E6e2M9YS5sZW5ndGg7Zm9yKHZhciBkPXAoYSk/YS5zcGxpdChcIlwiKTphLGU9MDtlPGM7ZSsrKWlmKGUgaW4gZCYmYi5jYWxsKHZvaWQgMCxkW2VdLGUsYSkpe2M9ZTticmVhayBhfWM9LTF9cmV0dXJuIDA+Yz9udWxsOnAoYSk/YS5jaGFyQXQoYyk6YVtjXX1mdW5jdGlvbiBKYihhLGIpe2Euc29ydChifHxLYil9ZnVuY3Rpb24gS2IoYSxiKXtyZXR1cm4gYT5iPzE6YTxiPy0xOjB9O3ZhciBMYjthOnt2YXIgTWI9YmEubmF2aWdhdG9yO2lmKE1iKXt2YXIgTmI9TWIudXNlckFnZW50O2lmKE5iKXtMYj1OYjticmVhayBhfX1MYj1cIlwifWZ1bmN0aW9uIE9iKGEpe3JldHVybi0xIT1MYi5pbmRleE9mKGEpfTt2YXIgUGI9T2IoXCJPcGVyYVwiKXx8T2IoXCJPUFJcIiksUWI9T2IoXCJUcmlkZW50XCIpfHxPYihcIk1TSUVcIiksUmI9T2IoXCJHZWNrb1wiKSYmLTE9PUxiLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcIndlYmtpdFwiKSYmIShPYihcIlRyaWRlbnRcIil8fE9iKFwiTVNJRVwiKSksU2I9LTEhPUxiLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcIndlYmtpdFwiKTsoZnVuY3Rpb24oKXt2YXIgYT1cIlwiLGI7aWYoUGImJmJhLm9wZXJhKXJldHVybiBhPWJhLm9wZXJhLnZlcnNpb24saWEoYSk/YSgpOmE7UmI/Yj0vcnZcXDooW15cXCk7XSspKFxcKXw7KS86UWI/Yj0vXFxiKD86TVNJRXxydilbOiBdKFteXFwpO10rKShcXCl8OykvOlNiJiYoYj0vV2ViS2l0XFwvKFxcUyspLyk7YiYmKGE9KGE9Yi5leGVjKExiKSk/YVsxXTpcIlwiKTtyZXR1cm4gUWImJihiPShiPWJhLmRvY3VtZW50KT9iLmRvY3VtZW50TW9kZTp2b2lkIDAsYj5wYXJzZUZsb2F0KGEpKT9TdHJpbmcoYik6YX0pKCk7dmFyIFRiPW51bGwsVWI9bnVsbDtcbmZ1bmN0aW9uIFZiKGEsYil7aWYoIWdhKGEpKXRocm93IEVycm9yKFwiZW5jb2RlQnl0ZUFycmF5IHRha2VzIGFuIGFycmF5IGFzIGEgcGFyYW1ldGVyXCIpO2lmKCFUYil7VGI9e307VWI9e307Zm9yKHZhciBjPTA7NjU+YztjKyspVGJbY109XCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPVwiLmNoYXJBdChjKSxVYltjXT1cIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5LV8uXCIuY2hhckF0KGMpfWZvcih2YXIgYz1iP1ViOlRiLGQ9W10sZT0wO2U8YS5sZW5ndGg7ZSs9Myl7dmFyIGY9YVtlXSxnPWUrMTxhLmxlbmd0aCxoPWc/YVtlKzFdOjAsbT1lKzI8YS5sZW5ndGgsbj1tP2FbZSsyXTowLHE9Zj4+MixmPShmJjMpPDw0fGg+PjQsaD0oaCYxNSk8PDJ8bj4+NixuPW4mNjM7bXx8KG49NjQsZ3x8KGg9NjQpKTtkLnB1c2goY1txXSxjW2ZdLGNbaF0sY1tuXSl9cmV0dXJuIGQuam9pbihcIlwiKX1cbjt2YXIgV2I9ZnVuY3Rpb24oKXt2YXIgYT0xO3JldHVybiBmdW5jdGlvbigpe3JldHVybiBhKyt9fSgpO2Z1bmN0aW9uIHYoYSxiKXtpZighYSl0aHJvdyBFcnJvcihcIkZpcmViYXNlIElOVEVSTkFMIEFTU0VSVCBGQUlMRUQ6XCIrYik7fWZ1bmN0aW9uIFhiKGEpe3RyeXtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGF0b2IpcmV0dXJuIGF0b2IoYSl9Y2F0Y2goYil7TShcImJhc2U2NERlY29kZUlmTmF0aXZlU3VwcG9ydCBmYWlsZWQ6IFwiLGIpfXJldHVybiBudWxsfVxuZnVuY3Rpb24gWWIoYSl7dmFyIGI9dmEoYSk7YT1uZXcgemI7YS51cGRhdGUoYik7dmFyIGI9W10sYz04KmEuS2M7NTY+YS5rYj9hLnVwZGF0ZShhLnZjLDU2LWEua2IpOmEudXBkYXRlKGEudmMsYS5yYS0oYS5rYi01NikpO2Zvcih2YXIgZD1hLnJhLTE7NTY8PWQ7ZC0tKWEuU2NbZF09YyYyNTUsYy89MjU2O0FiKGEsYS5TYyk7Zm9yKGQ9Yz0wOzU+ZDtkKyspZm9yKHZhciBlPTI0OzA8PWU7ZS09OCliW2NdPWEuRltkXT4+ZSYyNTUsKytjO3JldHVybiBWYihiKX1mdW5jdGlvbiBaYihhKXtmb3IodmFyIGI9XCJcIixjPTA7Yzxhcmd1bWVudHMubGVuZ3RoO2MrKyliPWdhKGFyZ3VtZW50c1tjXSk/YitaYi5hcHBseShudWxsLGFyZ3VtZW50c1tjXSk6XCJvYmplY3RcIj09PXR5cGVvZiBhcmd1bWVudHNbY10/Yit1KGFyZ3VtZW50c1tjXSk6Yithcmd1bWVudHNbY10sYis9XCIgXCI7cmV0dXJuIGJ9dmFyICRiPW51bGwsYWM9ITA7XG5mdW5jdGlvbiBNKGEpeyEwPT09YWMmJihhYz0hMSxudWxsPT09JGImJiEwPT09Si5nZXQoXCJsb2dnaW5nX2VuYWJsZWRcIikmJmJjKCEwKSk7aWYoJGIpe3ZhciBiPVpiLmFwcGx5KG51bGwsYXJndW1lbnRzKTskYihiKX19ZnVuY3Rpb24gY2MoYSl7cmV0dXJuIGZ1bmN0aW9uKCl7TShhLGFyZ3VtZW50cyl9fWZ1bmN0aW9uIGRjKGEpe2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZSl7dmFyIGI9XCJGSVJFQkFTRSBJTlRFUk5BTCBFUlJPUjogXCIrWmIuYXBwbHkobnVsbCxhcmd1bWVudHMpO1widW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZS5lcnJvcj9jb25zb2xlLmVycm9yKGIpOmNvbnNvbGUubG9nKGIpfX1mdW5jdGlvbiBlYyhhKXt2YXIgYj1aYi5hcHBseShudWxsLGFyZ3VtZW50cyk7dGhyb3cgRXJyb3IoXCJGSVJFQkFTRSBGQVRBTCBFUlJPUjogXCIrYik7fVxuZnVuY3Rpb24gTyhhKXtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGNvbnNvbGUpe3ZhciBiPVwiRklSRUJBU0UgV0FSTklORzogXCIrWmIuYXBwbHkobnVsbCxhcmd1bWVudHMpO1widW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZS53YXJuP2NvbnNvbGUud2FybihiKTpjb25zb2xlLmxvZyhiKX19XG5mdW5jdGlvbiBmYyhhKXt2YXIgYj1cIlwiLGM9XCJcIixkPVwiXCIsZT0hMCxmPVwiaHR0cHNcIixnPVwiXCI7aWYocChhKSl7dmFyIGg9YS5pbmRleE9mKFwiLy9cIik7MDw9aCYmKGY9YS5zdWJzdHJpbmcoMCxoLTEpLGE9YS5zdWJzdHJpbmcoaCsyKSk7aD1hLmluZGV4T2YoXCIvXCIpOy0xPT09aCYmKGg9YS5sZW5ndGgpO2I9YS5zdWJzdHJpbmcoMCxoKTthPWEuc3Vic3RyaW5nKGgrMSk7dmFyIG09Yi5zcGxpdChcIi5cIik7aWYoMz09PW0ubGVuZ3RoKXtoPW1bMl0uaW5kZXhPZihcIjpcIik7ZT0wPD1oP1wiaHR0cHNcIj09PWZ8fFwid3NzXCI9PT1mOiEwO2M9bVsxXTtkPW1bMF07Zz1cIlwiO2E9KFwiL1wiK2EpLnNwbGl0KFwiL1wiKTtmb3IoaD0wO2g8YS5sZW5ndGg7aCsrKWlmKDA8YVtoXS5sZW5ndGgpe209YVtoXTt0cnl7bT1kZWNvZGVVUklDb21wb25lbnQobS5yZXBsYWNlKC9cXCsvZyxcIiBcIikpfWNhdGNoKG4pe31nKz1cIi9cIittfWQ9ZC50b0xvd2VyQ2FzZSgpfWVsc2UgMj09PW0ubGVuZ3RoJiYoYz1tWzBdKX1yZXR1cm57aG9zdDpiLFxuZG9tYWluOmMsVmU6ZCxZYTplLHNjaGVtZTpmLFJiOmd9fWZ1bmN0aW9uIEhhKGEpe3JldHVybiBoYShhKSYmKGEhPWF8fGE9PU51bWJlci5QT1NJVElWRV9JTkZJTklUWXx8YT09TnVtYmVyLk5FR0FUSVZFX0lORklOSVRZKX1cbmZ1bmN0aW9uIGdjKGEpe2lmKFwiY29tcGxldGVcIj09PWRvY3VtZW50LnJlYWR5U3RhdGUpYSgpO2Vsc2V7dmFyIGI9ITEsYz1mdW5jdGlvbigpe2RvY3VtZW50LmJvZHk/Ynx8KGI9ITAsYSgpKTpzZXRUaW1lb3V0KGMsTWF0aC5mbG9vcigxMCkpfTtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyPyhkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGMsITEpLHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLGMsITEpKTpkb2N1bWVudC5hdHRhY2hFdmVudCYmKGRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsZnVuY3Rpb24oKXtcImNvbXBsZXRlXCI9PT1kb2N1bWVudC5yZWFkeVN0YXRlJiZjKCl9KSx3aW5kb3cuYXR0YWNoRXZlbnQoXCJvbmxvYWRcIixjKSl9fVxuZnVuY3Rpb24gaGMoYSxiKXtyZXR1cm4gYSE9PWI/bnVsbD09PWE/LTE6bnVsbD09PWI/MTp0eXBlb2YgYSE9PXR5cGVvZiBiP1wibnVtYmVyXCI9PT10eXBlb2YgYT8tMToxOmE+Yj8xOi0xOjB9ZnVuY3Rpb24gaWMoYSxiKXtpZihhPT09YilyZXR1cm4gMDt2YXIgYz1qYyhhKSxkPWpjKGIpO3JldHVybiBudWxsIT09Yz9udWxsIT09ZD8wPT1jLWQ/YS5sZW5ndGgtYi5sZW5ndGg6Yy1kOi0xOm51bGwhPT1kPzE6YTxiPy0xOjF9ZnVuY3Rpb24ga2MoYSxiKXtpZihiJiZhIGluIGIpcmV0dXJuIGJbYV07dGhyb3cgRXJyb3IoXCJNaXNzaW5nIHJlcXVpcmVkIGtleSAoXCIrYStcIikgaW4gb2JqZWN0OiBcIit1KGIpKTt9XG5mdW5jdGlvbiBTYShhKXtpZihcIm9iamVjdFwiIT09dHlwZW9mIGF8fG51bGw9PT1hKXJldHVybiB1KGEpO3ZhciBiPVtdLGM7Zm9yKGMgaW4gYSliLnB1c2goYyk7Yi5zb3J0KCk7Yz1cIntcIjtmb3IodmFyIGQ9MDtkPGIubGVuZ3RoO2QrKykwIT09ZCYmKGMrPVwiLFwiKSxjKz11KGJbZF0pLGMrPVwiOlwiLGMrPVNhKGFbYltkXV0pO3JldHVybiBjK1wifVwifWZ1bmN0aW9uIGxjKGEsYil7aWYoYS5sZW5ndGg8PWIpcmV0dXJuW2FdO2Zvcih2YXIgYz1bXSxkPTA7ZDxhLmxlbmd0aDtkKz1iKWQrYj5hP2MucHVzaChhLnN1YnN0cmluZyhkLGEubGVuZ3RoKSk6Yy5wdXNoKGEuc3Vic3RyaW5nKGQsZCtiKSk7cmV0dXJuIGN9ZnVuY3Rpb24gbWMoYSxiKXtpZihmYShhKSlmb3IodmFyIGM9MDtjPGEubGVuZ3RoOysrYyliKGMsYVtjXSk7ZWxzZSBuYyhhLGIpfWZ1bmN0aW9uIG9jKGEsYil7cmV0dXJuIGI/cihhLGIpOmF9XG5mdW5jdGlvbiBwYyhhKXt2KCFIYShhKSxcIkludmFsaWQgSlNPTiBudW1iZXJcIik7dmFyIGIsYyxkLGU7MD09PWE/KGQ9Yz0wLGI9LUluZmluaXR5PT09MS9hPzE6MCk6KGI9MD5hLGE9TWF0aC5hYnMoYSksYT49TWF0aC5wb3coMiwtMTAyMik/KGQ9TWF0aC5taW4oTWF0aC5mbG9vcihNYXRoLmxvZyhhKS9NYXRoLkxOMiksMTAyMyksYz1kKzEwMjMsZD1NYXRoLnJvdW5kKGEqTWF0aC5wb3coMiw1Mi1kKS1NYXRoLnBvdygyLDUyKSkpOihjPTAsZD1NYXRoLnJvdW5kKGEvTWF0aC5wb3coMiwtMTA3NCkpKSk7ZT1bXTtmb3IoYT01MjthO2EtPTEpZS5wdXNoKGQlMj8xOjApLGQ9TWF0aC5mbG9vcihkLzIpO2ZvcihhPTExO2E7YS09MSllLnB1c2goYyUyPzE6MCksYz1NYXRoLmZsb29yKGMvMik7ZS5wdXNoKGI/MTowKTtlLnJldmVyc2UoKTtiPWUuam9pbihcIlwiKTtjPVwiXCI7Zm9yKGE9MDs2ND5hO2ErPTgpZD1wYXJzZUludChiLnN1YnN0cihhLDgpLDIpLnRvU3RyaW5nKDE2KSwxPT09ZC5sZW5ndGgmJlxuKGQ9XCIwXCIrZCksYys9ZDtyZXR1cm4gYy50b0xvd2VyQ2FzZSgpfWZ1bmN0aW9uIHFjKGEpe3ZhciBiPVwiVW5rbm93biBFcnJvclwiO1widG9vX2JpZ1wiPT09YT9iPVwiVGhlIGRhdGEgcmVxdWVzdGVkIGV4Y2VlZHMgdGhlIG1heGltdW0gc2l6ZSB0aGF0IGNhbiBiZSBhY2Nlc3NlZCB3aXRoIGEgc2luZ2xlIHJlcXVlc3QuXCI6XCJwZXJtaXNzaW9uX2RlbmllZFwiPT1hP2I9XCJDbGllbnQgZG9lc24ndCBoYXZlIHBlcm1pc3Npb24gdG8gYWNjZXNzIHRoZSBkZXNpcmVkIGRhdGEuXCI6XCJ1bmF2YWlsYWJsZVwiPT1hJiYoYj1cIlRoZSBzZXJ2aWNlIGlzIHVuYXZhaWxhYmxlXCIpO2I9RXJyb3IoYStcIjogXCIrYik7Yi5jb2RlPWEudG9VcHBlckNhc2UoKTtyZXR1cm4gYn12YXIgcmM9L14tP1xcZHsxLDEwfSQvO2Z1bmN0aW9uIGpjKGEpe3JldHVybiByYy50ZXN0KGEpJiYoYT1OdW1iZXIoYSksLTIxNDc0ODM2NDg8PWEmJjIxNDc0ODM2NDc+PWEpP2E6bnVsbH1cbmZ1bmN0aW9uIHNjKGEpe3RyeXthKCl9Y2F0Y2goYil7c2V0VGltZW91dChmdW5jdGlvbigpe3Rocm93IGI7fSxNYXRoLmZsb29yKDApKX19ZnVuY3Rpb24gUChhLGIpe2lmKGlhKGEpKXt2YXIgYz1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSkuc2xpY2UoKTtzYyhmdW5jdGlvbigpe2EuYXBwbHkobnVsbCxjKX0pfX07ZnVuY3Rpb24gdGMoYSxiKXt0aGlzLkg9YTt2KG51bGwhPT10aGlzLkgsXCJMZWFmTm9kZSBzaG91bGRuJ3QgYmUgY3JlYXRlZCB3aXRoIG51bGwgdmFsdWUuXCIpO3RoaXMucGI9XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBiP2I6bnVsbH1rPXRjLnByb3RvdHlwZTtrLlE9ZnVuY3Rpb24oKXtyZXR1cm4hMH07ay5tPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGJ9O2suTGE9ZnVuY3Rpb24oYSl7cmV0dXJuIG5ldyB0Yyh0aGlzLkgsYSl9O2suUD1mdW5jdGlvbigpe3JldHVybiBRfTtrLk49ZnVuY3Rpb24oYSl7cmV0dXJuIG51bGw9PT1EKGEpP3RoaXM6UX07ay5oYT1mdW5jdGlvbigpe3JldHVybiBudWxsfTtrLks9ZnVuY3Rpb24oYSxiKXtyZXR1cm4obmV3IFIpLksoYSxiKS5MYSh0aGlzLnBiKX07ay5CYT1mdW5jdGlvbihhLGIpe3ZhciBjPUQoYSk7cmV0dXJuIG51bGw9PT1jP2I6dGhpcy5LKGMsUS5CYShUYShhKSxiKSl9O2suZj1mdW5jdGlvbigpe3JldHVybiExfTtrLnFjPWZ1bmN0aW9uKCl7cmV0dXJuIDB9O1xuay5YPWZ1bmN0aW9uKGEpe3JldHVybiBhJiZudWxsIT09dGhpcy5tKCk/e1wiLnZhbHVlXCI6dGhpcy5rKCksXCIucHJpb3JpdHlcIjp0aGlzLm0oKX06dGhpcy5rKCl9O2suaGFzaD1mdW5jdGlvbigpe3ZhciBhPVwiXCI7bnVsbCE9PXRoaXMubSgpJiYoYSs9XCJwcmlvcml0eTpcIit1Yyh0aGlzLm0oKSkrXCI6XCIpO3ZhciBiPXR5cGVvZiB0aGlzLkgsYT1hKyhiK1wiOlwiKSxhPVwibnVtYmVyXCI9PT1iP2ErcGModGhpcy5IKTphK3RoaXMuSDtyZXR1cm4gWWIoYSl9O2suaz1mdW5jdGlvbigpe3JldHVybiB0aGlzLkh9O2sudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cInN0cmluZ1wiPT09dHlwZW9mIHRoaXMuSD90aGlzLkg6J1wiJyt0aGlzLkgrJ1wiJ307ZnVuY3Rpb24gdmMoYSxiKXtyZXR1cm4gaGMoYS5sYSxiLmxhKXx8aWMoYS5uYW1lLGIubmFtZSl9ZnVuY3Rpb24gd2MoYSxiKXtyZXR1cm4gaWMoYS5uYW1lLGIubmFtZSl9ZnVuY3Rpb24geGMoYSxiKXtyZXR1cm4gaWMoYSxiKX07ZnVuY3Rpb24gUihhLGIpe3RoaXMubz1hfHxuZXcgYmIoeGMpO3RoaXMucGI9XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBiP2I6bnVsbH1rPVIucHJvdG90eXBlO2suUT1mdW5jdGlvbigpe3JldHVybiExfTtrLm09ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYn07ay5MYT1mdW5jdGlvbihhKXtyZXR1cm4gbmV3IFIodGhpcy5vLGEpfTtrLks9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLm8ucmVtb3ZlKGEpO2ImJmIuZigpJiYoYj1udWxsKTtudWxsIT09YiYmKGM9Yy50YShhLGIpKTtyZXR1cm4gYiYmbnVsbCE9PWIubSgpP25ldyB5YyhjLG51bGwsdGhpcy5wYik6bmV3IFIoYyx0aGlzLnBiKX07ay5CYT1mdW5jdGlvbihhLGIpe3ZhciBjPUQoYSk7aWYobnVsbD09PWMpcmV0dXJuIGI7dmFyIGQ9dGhpcy5QKGMpLkJhKFRhKGEpLGIpO3JldHVybiB0aGlzLksoYyxkKX07ay5mPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuby5mKCl9O2sucWM9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5vLmNvdW50KCl9O1xudmFyIHpjPS9eKDB8WzEtOV1cXGQqKSQvO2s9Ui5wcm90b3R5cGU7ay5YPWZ1bmN0aW9uKGEpe2lmKHRoaXMuZigpKXJldHVybiBudWxsO3ZhciBiPXt9LGM9MCxkPTAsZT0hMDt0aGlzLkIoZnVuY3Rpb24oZixnKXtiW2ZdPWcuWChhKTtjKys7ZSYmemMudGVzdChmKT9kPU1hdGgubWF4KGQsTnVtYmVyKGYpKTplPSExfSk7aWYoIWEmJmUmJmQ8MipjKXt2YXIgZj1bXSxnO2ZvcihnIGluIGIpZltnXT1iW2ddO3JldHVybiBmfWEmJm51bGwhPT10aGlzLm0oKSYmKGJbXCIucHJpb3JpdHlcIl09dGhpcy5tKCkpO3JldHVybiBifTtrLmhhc2g9ZnVuY3Rpb24oKXt2YXIgYT1cIlwiO251bGwhPT10aGlzLm0oKSYmKGErPVwicHJpb3JpdHk6XCIrdWModGhpcy5tKCkpK1wiOlwiKTt0aGlzLkIoZnVuY3Rpb24oYixjKXt2YXIgZD1jLmhhc2goKTtcIlwiIT09ZCYmKGErPVwiOlwiK2IrXCI6XCIrZCl9KTtyZXR1cm5cIlwiPT09YT9cIlwiOlliKGEpfTtcbmsuUD1mdW5jdGlvbihhKXthPXRoaXMuby5nZXQoYSk7cmV0dXJuIG51bGw9PT1hP1E6YX07ay5OPWZ1bmN0aW9uKGEpe3ZhciBiPUQoYSk7cmV0dXJuIG51bGw9PT1iP3RoaXM6dGhpcy5QKGIpLk4oVGEoYSkpfTtrLmhhPWZ1bmN0aW9uKGEpe3JldHVybiBlYih0aGlzLm8sYSl9O2suSmQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5vLkxiKCl9O2suS2Q9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5vLmxiKCl9O2suQj1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5vLkZhKGEpfTtrLiRjPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLm8uWGEoYSl9O2suamI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5vLmpiKCl9O2sudG9TdHJpbmc9ZnVuY3Rpb24oKXt2YXIgYT1cIntcIixiPSEwO3RoaXMuQihmdW5jdGlvbihjLGQpe2I/Yj0hMTphKz1cIiwgXCI7YSs9J1wiJytjKydcIiA6ICcrZC50b1N0cmluZygpfSk7cmV0dXJuIGErPVwifVwifTt2YXIgUT1uZXcgUjtmdW5jdGlvbiB5YyhhLGIsYyl7Ui5jYWxsKHRoaXMsYSxjKTtudWxsPT09YiYmKGI9bmV3IGJiKHZjKSxhLkZhKGZ1bmN0aW9uKGEsYyl7Yj1iLnRhKHtuYW1lOmEsbGE6Yy5tKCl9LGMpfSkpO3RoaXMueWE9Yn1uYSh5YyxSKTtrPXljLnByb3RvdHlwZTtrLks9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLlAoYSksZD10aGlzLm8sZT10aGlzLnlhO251bGwhPT1jJiYoZD1kLnJlbW92ZShhKSxlPWUucmVtb3ZlKHtuYW1lOmEsbGE6Yy5tKCl9KSk7YiYmYi5mKCkmJihiPW51bGwpO251bGwhPT1iJiYoZD1kLnRhKGEsYiksZT1lLnRhKHtuYW1lOmEsbGE6Yi5tKCl9LGIpKTtyZXR1cm4gbmV3IHljKGQsZSx0aGlzLm0oKSl9O2suaGE9ZnVuY3Rpb24oYSxiKXt2YXIgYz1lYih0aGlzLnlhLHtuYW1lOmEsbGE6Yi5tKCl9KTtyZXR1cm4gYz9jLm5hbWU6bnVsbH07ay5CPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnlhLkZhKGZ1bmN0aW9uKGIsYyl7cmV0dXJuIGEoYi5uYW1lLGMpfSl9O1xuay4kYz1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy55YS5YYShmdW5jdGlvbihiLGMpe3JldHVybiBhKGIubmFtZSxjKX0pfTtrLmpiPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMueWEuamIoZnVuY3Rpb24oYSxiKXtyZXR1cm57a2V5OmEubmFtZSx2YWx1ZTpifX0pfTtrLkpkPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMueWEuZigpP251bGw6dGhpcy55YS5MYigpLm5hbWV9O2suS2Q9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy55YS5mKCk/bnVsbDp0aGlzLnlhLmxiKCkubmFtZX07ZnVuY3Rpb24gUyhhLGIpe2lmKG51bGw9PT1hKXJldHVybiBRO3ZhciBjPW51bGw7XCJvYmplY3RcIj09PXR5cGVvZiBhJiZcIi5wcmlvcml0eVwiaW4gYT9jPWFbXCIucHJpb3JpdHlcIl06XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBiJiYoYz1iKTt2KG51bGw9PT1jfHxcInN0cmluZ1wiPT09dHlwZW9mIGN8fFwibnVtYmVyXCI9PT10eXBlb2YgY3x8XCJvYmplY3RcIj09PXR5cGVvZiBjJiZcIi5zdlwiaW4gYyxcIkludmFsaWQgcHJpb3JpdHkgdHlwZSBmb3VuZDogXCIrdHlwZW9mIGMpO1wib2JqZWN0XCI9PT10eXBlb2YgYSYmXCIudmFsdWVcImluIGEmJm51bGwhPT1hW1wiLnZhbHVlXCJdJiYoYT1hW1wiLnZhbHVlXCJdKTtpZihcIm9iamVjdFwiIT09dHlwZW9mIGF8fFwiLnN2XCJpbiBhKXJldHVybiBuZXcgdGMoYSxjKTtpZihhIGluc3RhbmNlb2YgQXJyYXkpe3ZhciBkPVEsZT1hO25jKGUsZnVuY3Rpb24oYSxiKXtpZihBKGUsYikmJlwiLlwiIT09Yi5zdWJzdHJpbmcoMCwxKSl7dmFyIGM9UyhhKTtpZihjLlEoKXx8IWMuZigpKWQ9XG5kLksoYixjKX19KTtyZXR1cm4gZC5MYShjKX12YXIgZj1bXSxnPXt9LGg9ITEsbT1hO21jKG0sZnVuY3Rpb24oYSxiKXtpZihcInN0cmluZ1wiIT09dHlwZW9mIGJ8fFwiLlwiIT09Yi5zdWJzdHJpbmcoMCwxKSl7dmFyIGM9UyhtW2JdKTtjLmYoKXx8KGg9aHx8bnVsbCE9PWMubSgpLGYucHVzaCh7bmFtZTpiLGxhOmMubSgpfSksZ1tiXT1jKX19KTt2YXIgbj1BYyhmLGcsITEpO2lmKGgpe3ZhciBxPUFjKGYsZywhMCk7cmV0dXJuIG5ldyB5YyhuLHEsYyl9cmV0dXJuIG5ldyBSKG4sYyl9dmFyIEJjPU1hdGgubG9nKDIpO2Z1bmN0aW9uIENjKGEpe3RoaXMuY291bnQ9cGFyc2VJbnQoTWF0aC5sb2coYSsxKS9CYywxMCk7dGhpcy5GZD10aGlzLmNvdW50LTE7dGhpcy5wZT1hKzEmcGFyc2VJbnQoQXJyYXkodGhpcy5jb3VudCsxKS5qb2luKFwiMVwiKSwyKX1mdW5jdGlvbiBEYyhhKXt2YXIgYj0hKGEucGUmMTw8YS5GZCk7YS5GZC0tO3JldHVybiBifVxuZnVuY3Rpb24gQWMoYSxiLGMpe2Z1bmN0aW9uIGQoZSxmKXt2YXIgbT1mLWU7aWYoMD09bSlyZXR1cm4gbnVsbDtpZigxPT1tKXt2YXIgbT1hW2VdLm5hbWUsbj1jP2FbZV06bTtyZXR1cm4gbmV3IGhiKG4sYlttXSwhMSxudWxsLG51bGwpfXZhciBuPXBhcnNlSW50KG0vMiwxMCkrZSxxPWQoZSxuKSxzPWQobisxLGYpLG09YVtuXS5uYW1lLG49Yz9hW25dOm07cmV0dXJuIG5ldyBoYihuLGJbbV0sITEscSxzKX12YXIgZT1jP3ZjOndjO2Euc29ydChlKTt2YXIgZj1mdW5jdGlvbihlKXtmdW5jdGlvbiBmKGUsZyl7dmFyIGg9cS1lLHM9cTtxLT1lO3ZhciB0PWFbaF0ubmFtZSxoPW5ldyBoYihjP2FbaF06dCxiW3RdLGcsbnVsbCxkKGgrMSxzKSk7bT9tLmxlZnQ9aDpuPWg7bT1ofWZvcih2YXIgbT1udWxsLG49bnVsbCxxPWEubGVuZ3RoLHM9MDtzPGUuY291bnQ7KytzKXt2YXIgdD1EYyhlKSx3PU1hdGgucG93KDIsZS5jb3VudC0ocysxKSk7dD9mKHcsITEpOihmKHcsITEpLGYodywhMCkpfXJldHVybiBufShuZXcgQ2MoYS5sZW5ndGgpKSxcbmU9Yz92Yzp4YztyZXR1cm4gbnVsbCE9PWY/bmV3IGJiKGUsZik6bmV3IGJiKGUpfWZ1bmN0aW9uIHVjKGEpe3JldHVyblwibnVtYmVyXCI9PT10eXBlb2YgYT9cIm51bWJlcjpcIitwYyhhKTpcInN0cmluZzpcIithfTtmdW5jdGlvbiBUKGEsYil7dGhpcy5BPWE7dGhpcy5DYz1ifVQucHJvdG90eXBlLlg9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LnZhbFwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5BLlgoKX07VC5wcm90b3R5cGUudmFsPVQucHJvdG90eXBlLlg7VC5wcm90b3R5cGUudGU9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmV4cG9ydFZhbFwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5BLlgoITApfTtULnByb3RvdHlwZS5leHBvcnRWYWw9VC5wcm90b3R5cGUudGU7VC5wcm90b3R5cGUuSj1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmNoaWxkXCIsMCwxLGFyZ3VtZW50cy5sZW5ndGgpO2hhKGEpJiYoYT1TdHJpbmcoYSkpO01hKFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmNoaWxkXCIsYSk7dmFyIGI9bmV3IEgoYSksYz10aGlzLkNjLkooYik7cmV0dXJuIG5ldyBUKHRoaXMuQS5OKGIpLGMpfTtcblQucHJvdG90eXBlLmNoaWxkPVQucHJvdG90eXBlLko7VC5wcm90b3R5cGUuZWQ9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5oYXNDaGlsZFwiLDEsMSxhcmd1bWVudHMubGVuZ3RoKTtNYShcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5oYXNDaGlsZFwiLGEpO3ZhciBiPW5ldyBIKGEpO3JldHVybiF0aGlzLkEuTihiKS5mKCl9O1QucHJvdG90eXBlLmhhc0NoaWxkPVQucHJvdG90eXBlLmVkO1QucHJvdG90eXBlLm09ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmdldFByaW9yaXR5XCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLkEubSgpfTtULnByb3RvdHlwZS5nZXRQcmlvcml0eT1ULnByb3RvdHlwZS5tO1xuVC5wcm90b3R5cGUuZm9yRWFjaD1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmZvckVhY2hcIiwxLDEsYXJndW1lbnRzLmxlbmd0aCk7eihcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5mb3JFYWNoXCIsMSxhLCExKTtpZih0aGlzLkEuUSgpKXJldHVybiExO3ZhciBiPXRoaXM7cmV0dXJuIHRoaXMuQS5CKGZ1bmN0aW9uKGMsZCl7cmV0dXJuIGEobmV3IFQoZCxiLkNjLkooYykpKX0pfTtULnByb3RvdHlwZS5mb3JFYWNoPVQucHJvdG90eXBlLmZvckVhY2g7VC5wcm90b3R5cGUuRmI9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90Lmhhc0NoaWxkcmVuXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLkEuUSgpPyExOiF0aGlzLkEuZigpfTtULnByb3RvdHlwZS5oYXNDaGlsZHJlbj1ULnByb3RvdHlwZS5GYjtcblQucHJvdG90eXBlLm5hbWU9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90Lm5hbWVcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMuQ2MubmFtZSgpfTtULnByb3RvdHlwZS5uYW1lPVQucHJvdG90eXBlLm5hbWU7VC5wcm90b3R5cGUucWM9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90Lm51bUNoaWxkcmVuXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLkEucWMoKX07VC5wcm90b3R5cGUubnVtQ2hpbGRyZW49VC5wcm90b3R5cGUucWM7VC5wcm90b3R5cGUucmQ9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LnJlZlwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5DY307VC5wcm90b3R5cGUucmVmPVQucHJvdG90eXBlLnJkO2Z1bmN0aW9uIEVjKGEpe3YoZmEoYSkmJjA8YS5sZW5ndGgsXCJSZXF1aXJlcyBhIG5vbi1lbXB0eSBhcnJheVwiKTt0aGlzLmhlPWE7dGhpcy5KYj17fX1FYy5wcm90b3R5cGUuTWM9ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9dGhpcy5KYlthXXx8W10sZD0wO2Q8Yy5sZW5ndGg7ZCsrKWNbZF0uY2EuYXBwbHkoY1tkXS4kLEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKSl9O0VjLnByb3RvdHlwZS5VYT1mdW5jdGlvbihhLGIsYyl7RmModGhpcyxhKTt0aGlzLkpiW2FdPXRoaXMuSmJbYV18fFtdO3RoaXMuSmJbYV0ucHVzaCh7Y2E6YiwkOmN9KTsoYT10aGlzLmNkKGEpKSYmYi5hcHBseShjLGEpfTtFYy5wcm90b3R5cGUubmI9ZnVuY3Rpb24oYSxiLGMpe0ZjKHRoaXMsYSk7YT10aGlzLkpiW2FdfHxbXTtmb3IodmFyIGQ9MDtkPGEubGVuZ3RoO2QrKylpZihhW2RdLmNhPT09YiYmKCFjfHxjPT09YVtkXS4kKSl7YS5zcGxpY2UoZCwxKTticmVha319O1xuZnVuY3Rpb24gRmMoYSxiKXt2KEliKGEuaGUsZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT1ifSksXCJVbmtub3duIGV2ZW50OiBcIitiKX07ZnVuY3Rpb24gR2MoKXtFYy5jYWxsKHRoaXMsW1widmlzaWJsZVwiXSk7dmFyIGEsYjtcInVuZGVmaW5lZFwiIT09dHlwZW9mIGRvY3VtZW50JiZcInVuZGVmaW5lZFwiIT09dHlwZW9mIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXImJihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGRvY3VtZW50LmhpZGRlbj8oYj1cInZpc2liaWxpdHljaGFuZ2VcIixhPVwiaGlkZGVuXCIpOlwidW5kZWZpbmVkXCIhPT10eXBlb2YgZG9jdW1lbnQubW96SGlkZGVuPyhiPVwibW96dmlzaWJpbGl0eWNoYW5nZVwiLGE9XCJtb3pIaWRkZW5cIik6XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBkb2N1bWVudC5tc0hpZGRlbj8oYj1cIm1zdmlzaWJpbGl0eWNoYW5nZVwiLGE9XCJtc0hpZGRlblwiKTpcInVuZGVmaW5lZFwiIT09dHlwZW9mIGRvY3VtZW50LndlYmtpdEhpZGRlbiYmKGI9XCJ3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlXCIsYT1cIndlYmtpdEhpZGRlblwiKSk7dGhpcy54Yj0hMDtpZihiKXt2YXIgYz10aGlzO2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoYixcbmZ1bmN0aW9uKCl7dmFyIGI9IWRvY3VtZW50W2FdO2IhPT1jLnhiJiYoYy54Yj1iLGMuTWMoXCJ2aXNpYmxlXCIsYikpfSwhMSl9fW5hKEdjLEVjKTtkYShHYyk7R2MucHJvdG90eXBlLmNkPWZ1bmN0aW9uKGEpe3YoXCJ2aXNpYmxlXCI9PT1hLFwiVW5rbm93biBldmVudCB0eXBlOiBcIithKTtyZXR1cm5bdGhpcy54Yl19O2Z1bmN0aW9uIEhjKCl7RWMuY2FsbCh0aGlzLFtcIm9ubGluZVwiXSk7dGhpcy5PYj0hMDtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdyYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcil7dmFyIGE9dGhpczt3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9ubGluZVwiLGZ1bmN0aW9uKCl7YS5PYnx8YS5NYyhcIm9ubGluZVwiLCEwKTthLk9iPSEwfSwhMSk7d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvZmZsaW5lXCIsZnVuY3Rpb24oKXthLk9iJiZhLk1jKFwib25saW5lXCIsITEpO2EuT2I9ITF9LCExKX19bmEoSGMsRWMpO2RhKEhjKTtIYy5wcm90b3R5cGUuY2Q9ZnVuY3Rpb24oYSl7dihcIm9ubGluZVwiPT09YSxcIlVua25vd24gZXZlbnQgdHlwZTogXCIrYSk7cmV0dXJuW3RoaXMuT2JdfTtmdW5jdGlvbiBuYyhhLGIpe2Zvcih2YXIgYyBpbiBhKWIuY2FsbCh2b2lkIDAsYVtjXSxjLGEpfWZ1bmN0aW9uIEljKGEpe3ZhciBiPVtdLGM9MCxkO2ZvcihkIGluIGEpYltjKytdPWQ7cmV0dXJuIGJ9ZnVuY3Rpb24gSmMoYSl7Zm9yKHZhciBiIGluIGEpcmV0dXJuITE7cmV0dXJuITB9ZnVuY3Rpb24gS2MoYSl7dmFyIGI9e30sYztmb3IoYyBpbiBhKWJbY109YVtjXTtyZXR1cm4gYn12YXIgTGM9XCJjb25zdHJ1Y3RvciBoYXNPd25Qcm9wZXJ0eSBpc1Byb3RvdHlwZU9mIHByb3BlcnR5SXNFbnVtZXJhYmxlIHRvTG9jYWxlU3RyaW5nIHRvU3RyaW5nIHZhbHVlT2ZcIi5zcGxpdChcIiBcIik7XG5mdW5jdGlvbiBNYyhhLGIpe2Zvcih2YXIgYyxkLGU9MTtlPGFyZ3VtZW50cy5sZW5ndGg7ZSsrKXtkPWFyZ3VtZW50c1tlXTtmb3IoYyBpbiBkKWFbY109ZFtjXTtmb3IodmFyIGY9MDtmPExjLmxlbmd0aDtmKyspYz1MY1tmXSxPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZCxjKSYmKGFbY109ZFtjXSl9fTtmdW5jdGlvbiBOYygpe3RoaXMuQmI9e319ZnVuY3Rpb24gT2MoYSxiLGMpe2woYyl8fChjPTEpO0EoYS5CYixiKXx8KGEuQmJbYl09MCk7YS5CYltiXSs9Y31OYy5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIEtjKHRoaXMuQmIpfTtmdW5jdGlvbiBRYyhhKXt0aGlzLnFlPWE7dGhpcy5tYz1udWxsfVFjLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLnFlLmdldCgpLGI9S2MoYSk7aWYodGhpcy5tYylmb3IodmFyIGMgaW4gdGhpcy5tYyliW2NdLT10aGlzLm1jW2NdO3RoaXMubWM9YTtyZXR1cm4gYn07ZnVuY3Rpb24gUmMoYSxiKXt0aGlzLnlkPXt9O3RoaXMuSGM9bmV3IFFjKGEpO3RoaXMubj1iO3ZhciBjPTFFNCsyRTQqTWF0aC5yYW5kb20oKTtzZXRUaW1lb3V0KHIodGhpcy5VZCx0aGlzKSxNYXRoLmZsb29yKGMpKX1SYy5wcm90b3R5cGUuVWQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLkhjLmdldCgpLGI9e30sYz0hMSxkO2ZvcihkIGluIGEpMDxhW2RdJiZBKHRoaXMueWQsZCkmJihiW2RdPWFbZF0sYz0hMCk7YyYmKGE9dGhpcy5uLGEuVCYmKGI9e2M6Yn0sYS5lKFwicmVwb3J0U3RhdHNcIixiKSxhLkphKFwic1wiLGIpKSk7c2V0VGltZW91dChyKHRoaXMuVWQsdGhpcyksTWF0aC5mbG9vcig2RTUqTWF0aC5yYW5kb20oKSkpfTt2YXIgU2M9e30sVGM9e307ZnVuY3Rpb24gVWMoYSl7YT1hLnRvU3RyaW5nKCk7U2NbYV18fChTY1thXT1uZXcgTmMpO3JldHVybiBTY1thXX1mdW5jdGlvbiBWYyhhLGIpe3ZhciBjPWEudG9TdHJpbmcoKTtUY1tjXXx8KFRjW2NdPWIoKSk7cmV0dXJuIFRjW2NdfTt2YXIgV2M9bnVsbDtcInVuZGVmaW5lZFwiIT09dHlwZW9mIE1veldlYlNvY2tldD9XYz1Nb3pXZWJTb2NrZXQ6XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBXZWJTb2NrZXQmJihXYz1XZWJTb2NrZXQpO2Z1bmN0aW9uIFhjKGEsYixjKXt0aGlzLldjPWE7dGhpcy5lPWNjKHRoaXMuV2MpO3RoaXMuZnJhbWVzPXRoaXMuSGI9bnVsbDt0aGlzLk5hPXRoaXMuT2E9dGhpcy5BZD0wO3RoaXMuZ2E9VWMoYik7dGhpcy5DYT0oYi5ZYT9cIndzczovL1wiOlwid3M6Ly9cIikrYi5pYStcIi8ud3M/dj01XCI7XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBsb2NhdGlvbiYmbG9jYXRpb24uaHJlZiYmLTEhPT1sb2NhdGlvbi5ocmVmLmluZGV4T2YoXCJmaXJlYmFzZWlvLmNvbVwiKSYmKHRoaXMuQ2ErPVwiJnI9ZlwiKTtiLmhvc3QhPT1iLmlhJiYodGhpcy5DYT10aGlzLkNhK1wiJm5zPVwiK2IuVGEpO2MmJih0aGlzLkNhPXRoaXMuQ2ErXCImcz1cIitjKX12YXIgWWM7XG5YYy5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIpe3RoaXMua2E9Yjt0aGlzLkdlPWE7dGhpcy5lKFwiV2Vic29ja2V0IGNvbm5lY3RpbmcgdG8gXCIrdGhpcy5DYSk7dGhpcy5EYj0hMTt2Yi5zZXQoXCJwcmV2aW91c193ZWJzb2NrZXRfZmFpbHVyZVwiLCEwKTt0cnl7dGhpcy5ZPW5ldyBXYyh0aGlzLkNhKX1jYXRjaChjKXt0aGlzLmUoXCJFcnJvciBpbnN0YW50aWF0aW5nIFdlYlNvY2tldC5cIik7dmFyIGQ9Yy5tZXNzYWdlfHxjLmRhdGE7ZCYmdGhpcy5lKGQpO3RoaXMuSWEoKTtyZXR1cm59dmFyIGU9dGhpczt0aGlzLlkub25vcGVuPWZ1bmN0aW9uKCl7ZS5lKFwiV2Vic29ja2V0IGNvbm5lY3RlZC5cIik7ZS5EYj0hMH07dGhpcy5ZLm9uY2xvc2U9ZnVuY3Rpb24oKXtlLmUoXCJXZWJzb2NrZXQgY29ubmVjdGlvbiB3YXMgZGlzY29ubmVjdGVkLlwiKTtlLlk9bnVsbDtlLklhKCl9O3RoaXMuWS5vbm1lc3NhZ2U9ZnVuY3Rpb24oYSl7aWYobnVsbCE9PWUuWSlpZihhPWEuZGF0YSxlLk5hKz1hLmxlbmd0aCxcbk9jKGUuZ2EsXCJieXRlc19yZWNlaXZlZFwiLGEubGVuZ3RoKSxaYyhlKSxudWxsIT09ZS5mcmFtZXMpJGMoZSxhKTtlbHNle2E6e3YobnVsbD09PWUuZnJhbWVzLFwiV2UgYWxyZWFkeSBoYXZlIGEgZnJhbWUgYnVmZmVyXCIpO2lmKDY+PWEubGVuZ3RoKXt2YXIgYj1OdW1iZXIoYSk7aWYoIWlzTmFOKGIpKXtlLkFkPWI7ZS5mcmFtZXM9W107YT1udWxsO2JyZWFrIGF9fWUuQWQ9MTtlLmZyYW1lcz1bXX1udWxsIT09YSYmJGMoZSxhKX19O3RoaXMuWS5vbmVycm9yPWZ1bmN0aW9uKGEpe2UuZShcIldlYlNvY2tldCBlcnJvci4gIENsb3NpbmcgY29ubmVjdGlvbi5cIik7KGE9YS5tZXNzYWdlfHxhLmRhdGEpJiZlLmUoYSk7ZS5JYSgpfX07WGMucHJvdG90eXBlLnN0YXJ0PWZ1bmN0aW9uKCl7fTtcblhjLmlzQXZhaWxhYmxlPWZ1bmN0aW9uKCl7dmFyIGE9ITE7aWYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBuYXZpZ2F0b3ImJm5hdmlnYXRvci51c2VyQWdlbnQpe3ZhciBiPW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWQgKFswLTldezAsfVxcLlswLTldezAsfSkvKTtiJiYxPGIubGVuZ3RoJiY0LjQ+cGFyc2VGbG9hdChiWzFdKSYmKGE9ITApfXJldHVybiFhJiZudWxsIT09V2MmJiFZY307WGMucmVzcG9uc2VzUmVxdWlyZWRUb0JlSGVhbHRoeT0yO1hjLmhlYWx0aHlUaW1lb3V0PTNFNDtrPVhjLnByb3RvdHlwZTtrLm5jPWZ1bmN0aW9uKCl7dmIucmVtb3ZlKFwicHJldmlvdXNfd2Vic29ja2V0X2ZhaWx1cmVcIil9O2Z1bmN0aW9uICRjKGEsYil7YS5mcmFtZXMucHVzaChiKTtpZihhLmZyYW1lcy5sZW5ndGg9PWEuQWQpe3ZhciBjPWEuZnJhbWVzLmpvaW4oXCJcIik7YS5mcmFtZXM9bnVsbDtjPXVhKGMpO2EuR2UoYyl9fVxuay5zZW5kPWZ1bmN0aW9uKGEpe1pjKHRoaXMpO2E9dShhKTt0aGlzLk9hKz1hLmxlbmd0aDtPYyh0aGlzLmdhLFwiYnl0ZXNfc2VudFwiLGEubGVuZ3RoKTthPWxjKGEsMTYzODQpOzE8YS5sZW5ndGgmJnRoaXMuWS5zZW5kKFN0cmluZyhhLmxlbmd0aCkpO2Zvcih2YXIgYj0wO2I8YS5sZW5ndGg7YisrKXRoaXMuWS5zZW5kKGFbYl0pfTtrLmFjPWZ1bmN0aW9uKCl7dGhpcy5SYT0hMDt0aGlzLkhiJiYoY2xlYXJJbnRlcnZhbCh0aGlzLkhiKSx0aGlzLkhiPW51bGwpO3RoaXMuWSYmKHRoaXMuWS5jbG9zZSgpLHRoaXMuWT1udWxsKX07ay5JYT1mdW5jdGlvbigpe3RoaXMuUmF8fCh0aGlzLmUoXCJXZWJTb2NrZXQgaXMgY2xvc2luZyBpdHNlbGZcIiksdGhpcy5hYygpLHRoaXMua2EmJih0aGlzLmthKHRoaXMuRGIpLHRoaXMua2E9bnVsbCkpfTtrLmNsb3NlPWZ1bmN0aW9uKCl7dGhpcy5SYXx8KHRoaXMuZShcIldlYlNvY2tldCBpcyBiZWluZyBjbG9zZWRcIiksdGhpcy5hYygpKX07XG5mdW5jdGlvbiBaYyhhKXtjbGVhckludGVydmFsKGEuSGIpO2EuSGI9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXthLlkmJmEuWS5zZW5kKFwiMFwiKTtaYyhhKX0sTWF0aC5mbG9vcig0NUUzKSl9O2Z1bmN0aW9uIGFkKGEpe3RoaXMub2I9YTt0aGlzLnhjPVtdO3RoaXMuZWI9MDt0aGlzLlZjPS0xO3RoaXMuVmE9bnVsbH1mdW5jdGlvbiBiZChhLGIsYyl7YS5WYz1iO2EuVmE9YzthLlZjPGEuZWImJihhLlZhKCksYS5WYT1udWxsKX1mdW5jdGlvbiBjZChhLGIsYyl7Zm9yKGEueGNbYl09YzthLnhjW2EuZWJdOyl7dmFyIGQ9YS54Y1thLmViXTtkZWxldGUgYS54Y1thLmViXTtmb3IodmFyIGU9MDtlPGQubGVuZ3RoOysrZSlpZihkW2VdKXt2YXIgZj1hO3NjKGZ1bmN0aW9uKCl7Zi5vYihkW2VdKX0pfWlmKGEuZWI9PT1hLlZjKXthLlZhJiYoY2xlYXJUaW1lb3V0KGEuVmEpLGEuVmEoKSxhLlZhPW51bGwpO2JyZWFrfWEuZWIrK319O2Z1bmN0aW9uIGRkKCl7dGhpcy5zZXQ9e319az1kZC5wcm90b3R5cGU7ay5hZGQ9ZnVuY3Rpb24oYSxiKXt0aGlzLnNldFthXT1udWxsIT09Yj9iOiEwfTtrLmNvbnRhaW5zPWZ1bmN0aW9uKGEpe3JldHVybiBBKHRoaXMuc2V0LGEpfTtrLmdldD1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5jb250YWlucyhhKT90aGlzLnNldFthXTp2b2lkIDB9O2sucmVtb3ZlPWZ1bmN0aW9uKGEpe2RlbGV0ZSB0aGlzLnNldFthXX07ay5jbGVhcj1mdW5jdGlvbigpe3RoaXMuc2V0PXt9fTtrLmY9ZnVuY3Rpb24oKXtyZXR1cm4gSmModGhpcy5zZXQpfTtrLmNvdW50PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5zZXQsYj0wLGM7Zm9yKGMgaW4gYSliKys7cmV0dXJuIGJ9O2Z1bmN0aW9uIGVkKGEsYil7bmMoYS5zZXQsZnVuY3Rpb24oYSxkKXtiKGQsYSl9KX1rLmtleXM9ZnVuY3Rpb24oKXt2YXIgYT1bXTtuYyh0aGlzLnNldCxmdW5jdGlvbihiLGMpe2EucHVzaChjKX0pO3JldHVybiBhfTtmdW5jdGlvbiBmZChhLGIsYyl7dGhpcy5XYz1hO3RoaXMuZT1jYyhhKTt0aGlzLk5hPXRoaXMuT2E9MDt0aGlzLmdhPVVjKGIpO3RoaXMuR2M9Yzt0aGlzLkRiPSExO3RoaXMuZGM9ZnVuY3Rpb24oYSl7Yi5ob3N0IT09Yi5pYSYmKGEubnM9Yi5UYSk7dmFyIGM9W10sZjtmb3IoZiBpbiBhKWEuaGFzT3duUHJvcGVydHkoZikmJmMucHVzaChmK1wiPVwiK2FbZl0pO3JldHVybihiLllhP1wiaHR0cHM6Ly9cIjpcImh0dHA6Ly9cIikrYi5pYStcIi8ubHA/XCIrYy5qb2luKFwiJlwiKX19dmFyIGdkLGhkO1xuZmQucHJvdG90eXBlLm9wZW49ZnVuY3Rpb24oYSxiKXt0aGlzLkVkPTA7dGhpcy5VPWI7dGhpcy5PZD1uZXcgYWQoYSk7dGhpcy5SYT0hMTt2YXIgYz10aGlzO3RoaXMuUGE9c2V0VGltZW91dChmdW5jdGlvbigpe2MuZShcIlRpbWVkIG91dCB0cnlpbmcgdG8gY29ubmVjdC5cIik7Yy5JYSgpO2MuUGE9bnVsbH0sTWF0aC5mbG9vcigzRTQpKTtnYyhmdW5jdGlvbigpe2lmKCFjLlJhKXtjLm5hPW5ldyBpZChmdW5jdGlvbihhLGIsZCxoLG0pe2pkKGMsYXJndW1lbnRzKTtpZihjLm5hKWlmKGMuUGEmJihjbGVhclRpbWVvdXQoYy5QYSksYy5QYT1udWxsKSxjLkRiPSEwLFwic3RhcnRcIj09YSljLmlkPWIsYy5UZD1kO2Vsc2UgaWYoXCJjbG9zZVwiPT09YSliPyhjLm5hLkZjPSExLGJkKGMuT2QsYixmdW5jdGlvbigpe2MuSWEoKX0pKTpjLklhKCk7ZWxzZSB0aHJvdyBFcnJvcihcIlVucmVjb2duaXplZCBjb21tYW5kIHJlY2VpdmVkOiBcIithKTt9LGZ1bmN0aW9uKGEsYil7amQoYyxhcmd1bWVudHMpO1xuY2QoYy5PZCxhLGIpfSxmdW5jdGlvbigpe2MuSWEoKX0sYy5kYyk7dmFyIGE9e3N0YXJ0OlwidFwifTthLnNlcj1NYXRoLmZsb29yKDFFOCpNYXRoLnJhbmRvbSgpKTtjLm5hLk5jJiYoYS5jYj1jLm5hLk5jKTthLnY9XCI1XCI7Yy5HYyYmKGEucz1jLkdjKTtcInVuZGVmaW5lZFwiIT09dHlwZW9mIGxvY2F0aW9uJiZsb2NhdGlvbi5ocmVmJiYtMSE9PWxvY2F0aW9uLmhyZWYuaW5kZXhPZihcImZpcmViYXNlaW8uY29tXCIpJiYoYS5yPVwiZlwiKTthPWMuZGMoYSk7Yy5lKFwiQ29ubmVjdGluZyB2aWEgbG9uZy1wb2xsIHRvIFwiK2EpO2tkKGMubmEsYSxmdW5jdGlvbigpe30pfX0pfTtcbmZkLnByb3RvdHlwZS5zdGFydD1mdW5jdGlvbigpe3ZhciBhPXRoaXMubmEsYj10aGlzLlRkO2EuQmU9dGhpcy5pZDthLkNlPWI7Zm9yKGEuUWM9ITA7bGQoYSk7KTthPXRoaXMuaWQ7Yj10aGlzLlRkO3RoaXMubWI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTt2YXIgYz17ZGZyYW1lOlwidFwifTtjLmlkPWE7Yy5wdz1iO3RoaXMubWIuc3JjPXRoaXMuZGMoYyk7dGhpcy5tYi5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5tYil9O2ZkLmlzQXZhaWxhYmxlPWZ1bmN0aW9uKCl7cmV0dXJuIWhkJiYhKFwib2JqZWN0XCI9PT10eXBlb2Ygd2luZG93JiZ3aW5kb3cuY2hyb21lJiZ3aW5kb3cuY2hyb21lLmV4dGVuc2lvbiYmIS9eY2hyb21lLy50ZXN0KHdpbmRvdy5sb2NhdGlvbi5ocmVmKSkmJiEoXCJvYmplY3RcIj09PXR5cGVvZiBXaW5kb3dzJiZcIm9iamVjdFwiPT09dHlwZW9mIFdpbmRvd3MuWmUpJiYoZ2R8fCEwKX07az1mZC5wcm90b3R5cGU7XG5rLm5jPWZ1bmN0aW9uKCl7fTtrLmFjPWZ1bmN0aW9uKCl7dGhpcy5SYT0hMDt0aGlzLm5hJiYodGhpcy5uYS5jbG9zZSgpLHRoaXMubmE9bnVsbCk7dGhpcy5tYiYmKGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5tYiksdGhpcy5tYj1udWxsKTt0aGlzLlBhJiYoY2xlYXJUaW1lb3V0KHRoaXMuUGEpLHRoaXMuUGE9bnVsbCl9O2suSWE9ZnVuY3Rpb24oKXt0aGlzLlJhfHwodGhpcy5lKFwiTG9uZ3BvbGwgaXMgY2xvc2luZyBpdHNlbGZcIiksdGhpcy5hYygpLHRoaXMuVSYmKHRoaXMuVSh0aGlzLkRiKSx0aGlzLlU9bnVsbCkpfTtrLmNsb3NlPWZ1bmN0aW9uKCl7dGhpcy5SYXx8KHRoaXMuZShcIkxvbmdwb2xsIGlzIGJlaW5nIGNsb3NlZC5cIiksdGhpcy5hYygpKX07XG5rLnNlbmQ9ZnVuY3Rpb24oYSl7YT11KGEpO3RoaXMuT2ErPWEubGVuZ3RoO09jKHRoaXMuZ2EsXCJieXRlc19zZW50XCIsYS5sZW5ndGgpO2E9dmEoYSk7YT1WYihhLCEwKTthPWxjKGEsMTg0MCk7Zm9yKHZhciBiPTA7YjxhLmxlbmd0aDtiKyspe3ZhciBjPXRoaXMubmE7Yy5UYi5wdXNoKHtQZTp0aGlzLkVkLFdlOmEubGVuZ3RoLEdkOmFbYl19KTtjLlFjJiZsZChjKTt0aGlzLkVkKyt9fTtmdW5jdGlvbiBqZChhLGIpe3ZhciBjPXUoYikubGVuZ3RoO2EuTmErPWM7T2MoYS5nYSxcImJ5dGVzX3JlY2VpdmVkXCIsYyl9XG5mdW5jdGlvbiBpZChhLGIsYyxkKXt0aGlzLmRjPWQ7dGhpcy5rYT1jO3RoaXMub2Q9bmV3IGRkO3RoaXMuVGI9W107dGhpcy5ZYz1NYXRoLmZsb29yKDFFOCpNYXRoLnJhbmRvbSgpKTt0aGlzLkZjPSEwO3RoaXMuTmM9V2IoKTt3aW5kb3dbXCJwTFBDb21tYW5kXCIrdGhpcy5OY109YTt3aW5kb3dbXCJwUlRMUENCXCIrdGhpcy5OY109YjthPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7YS5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO2lmKGRvY3VtZW50LmJvZHkpe2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7dHJ5e2EuY29udGVudFdpbmRvdy5kb2N1bWVudHx8TShcIk5vIElFIGRvbWFpbiBzZXR0aW5nIHJlcXVpcmVkXCIpfWNhdGNoKGUpe2Euc3JjPVwiamF2YXNjcmlwdDp2b2lkKChmdW5jdGlvbigpe2RvY3VtZW50Lm9wZW4oKTtkb2N1bWVudC5kb21haW49J1wiK2RvY3VtZW50LmRvbWFpbitcIic7ZG9jdW1lbnQuY2xvc2UoKTt9KSgpKVwifX1lbHNlIHRocm93XCJEb2N1bWVudCBib2R5IGhhcyBub3QgaW5pdGlhbGl6ZWQuIFdhaXQgdG8gaW5pdGlhbGl6ZSBGaXJlYmFzZSB1bnRpbCBhZnRlciB0aGUgZG9jdW1lbnQgaXMgcmVhZHkuXCI7XG5hLmNvbnRlbnREb2N1bWVudD9hLkRhPWEuY29udGVudERvY3VtZW50OmEuY29udGVudFdpbmRvdz9hLkRhPWEuY29udGVudFdpbmRvdy5kb2N1bWVudDphLmRvY3VtZW50JiYoYS5EYT1hLmRvY3VtZW50KTt0aGlzLmFhPWE7YT1cIlwiO3RoaXMuYWEuc3JjJiZcImphdmFzY3JpcHQ6XCI9PT10aGlzLmFhLnNyYy5zdWJzdHIoMCwxMSkmJihhPSc8c2NyaXB0PmRvY3VtZW50LmRvbWFpbj1cIicrZG9jdW1lbnQuZG9tYWluKydcIjtcXHgzYy9zY3JpcHQ+Jyk7YT1cIjxodG1sPjxib2R5PlwiK2ErXCI8L2JvZHk+PC9odG1sPlwiO3RyeXt0aGlzLmFhLkRhLm9wZW4oKSx0aGlzLmFhLkRhLndyaXRlKGEpLHRoaXMuYWEuRGEuY2xvc2UoKX1jYXRjaChmKXtNKFwiZnJhbWUgd3JpdGluZyBleGNlcHRpb25cIiksZi5zdGFjayYmTShmLnN0YWNrKSxNKGYpfX1cbmlkLnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbigpe3RoaXMuUWM9ITE7aWYodGhpcy5hYSl7dGhpcy5hYS5EYS5ib2R5LmlubmVySFRNTD1cIlwiO3ZhciBhPXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe251bGwhPT1hLmFhJiYoZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhLmFhKSxhLmFhPW51bGwpfSxNYXRoLmZsb29yKDApKX12YXIgYj10aGlzLmthO2ImJih0aGlzLmthPW51bGwsYigpKX07XG5mdW5jdGlvbiBsZChhKXtpZihhLlFjJiZhLkZjJiZhLm9kLmNvdW50KCk8KDA8YS5UYi5sZW5ndGg/MjoxKSl7YS5ZYysrO3ZhciBiPXt9O2IuaWQ9YS5CZTtiLnB3PWEuQ2U7Yi5zZXI9YS5ZYztmb3IodmFyIGI9YS5kYyhiKSxjPVwiXCIsZD0wOzA8YS5UYi5sZW5ndGg7KWlmKDE4NzA+PWEuVGJbMF0uR2QubGVuZ3RoKzMwK2MubGVuZ3RoKXt2YXIgZT1hLlRiLnNoaWZ0KCksYz1jK1wiJnNlZ1wiK2QrXCI9XCIrZS5QZStcIiZ0c1wiK2QrXCI9XCIrZS5XZStcIiZkXCIrZCtcIj1cIitlLkdkO2QrK31lbHNlIGJyZWFrO21kKGEsYitjLGEuWWMpO3JldHVybiEwfXJldHVybiExfWZ1bmN0aW9uIG1kKGEsYixjKXtmdW5jdGlvbiBkKCl7YS5vZC5yZW1vdmUoYyk7bGQoYSl9YS5vZC5hZGQoYyk7dmFyIGU9c2V0VGltZW91dChkLE1hdGguZmxvb3IoMjVFMykpO2tkKGEsYixmdW5jdGlvbigpe2NsZWFyVGltZW91dChlKTtkKCl9KX1cbmZ1bmN0aW9uIGtkKGEsYixjKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dHJ5e2lmKGEuRmMpe3ZhciBkPWEuYWEuRGEuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtkLnR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIjtkLmFzeW5jPSEwO2Quc3JjPWI7ZC5vbmxvYWQ9ZC5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXt2YXIgYT1kLnJlYWR5U3RhdGU7YSYmXCJsb2FkZWRcIiE9PWEmJlwiY29tcGxldGVcIiE9PWF8fChkLm9ubG9hZD1kLm9ucmVhZHlzdGF0ZWNoYW5nZT1udWxsLGQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGMoKSl9O2Qub25lcnJvcj1mdW5jdGlvbigpe00oXCJMb25nLXBvbGwgc2NyaXB0IGZhaWxlZCB0byBsb2FkOiBcIitiKTthLkZjPSExO2EuY2xvc2UoKX07YS5hYS5EYS5ib2R5LmFwcGVuZENoaWxkKGQpfX1jYXRjaChlKXt9fSxNYXRoLmZsb29yKDEpKX07ZnVuY3Rpb24gbmQoYSl7b2QodGhpcyxhKX12YXIgcGQ9W2ZkLFhjXTtmdW5jdGlvbiBvZChhLGIpe3ZhciBjPVhjJiZYYy5pc0F2YWlsYWJsZSgpLGQ9YyYmISh2Yi5OZHx8ITA9PT12Yi5nZXQoXCJwcmV2aW91c193ZWJzb2NrZXRfZmFpbHVyZVwiKSk7Yi5ZZSYmKGN8fE8oXCJ3c3M6Ly8gVVJMIHVzZWQsIGJ1dCBicm93c2VyIGlzbid0IGtub3duIHRvIHN1cHBvcnQgd2Vic29ja2V0cy4gIFRyeWluZyBhbnl3YXkuXCIpLGQ9ITApO2lmKGQpYS5iYz1bWGNdO2Vsc2V7dmFyIGU9YS5iYz1bXTttYyhwZCxmdW5jdGlvbihhLGIpe2ImJmIuaXNBdmFpbGFibGUoKSYmZS5wdXNoKGIpfSl9fWZ1bmN0aW9uIHFkKGEpe2lmKDA8YS5iYy5sZW5ndGgpcmV0dXJuIGEuYmNbMF07dGhyb3cgRXJyb3IoXCJObyB0cmFuc3BvcnRzIGF2YWlsYWJsZVwiKTt9O2Z1bmN0aW9uIHJkKGEsYixjLGQsZSxmKXt0aGlzLmlkPWE7dGhpcy5lPWNjKFwiYzpcIit0aGlzLmlkK1wiOlwiKTt0aGlzLm9iPWM7dGhpcy5OYj1kO3RoaXMuVT1lO3RoaXMubWQ9Zjt0aGlzLkQ9Yjt0aGlzLndjPVtdO3RoaXMuRGQ9MDt0aGlzLmNlPW5ldyBuZChiKTt0aGlzLm9hPTA7dGhpcy5lKFwiQ29ubmVjdGlvbiBjcmVhdGVkXCIpO3NkKHRoaXMpfVxuZnVuY3Rpb24gc2QoYSl7dmFyIGI9cWQoYS5jZSk7YS5DPW5ldyBiKFwiYzpcIithLmlkK1wiOlwiK2EuRGQrKyxhLkQpO2EucWQ9Yi5yZXNwb25zZXNSZXF1aXJlZFRvQmVIZWFsdGh5fHwwO3ZhciBjPXRkKGEsYS5DKSxkPXVkKGEsYS5DKTthLmNjPWEuQzthLiRiPWEuQzthLnc9bnVsbDthLlNhPSExO3NldFRpbWVvdXQoZnVuY3Rpb24oKXthLkMmJmEuQy5vcGVuKGMsZCl9LE1hdGguZmxvb3IoMCkpO2I9Yi5oZWFsdGh5VGltZW91dHx8MDswPGImJihhLmtjPXNldFRpbWVvdXQoZnVuY3Rpb24oKXthLmtjPW51bGw7YS5TYXx8KGEuQyYmMTAyNDAwPGEuQy5OYT8oYS5lKFwiQ29ubmVjdGlvbiBleGNlZWRlZCBoZWFsdGh5IHRpbWVvdXQgYnV0IGhhcyByZWNlaXZlZCBcIithLkMuTmErXCIgYnl0ZXMuICBNYXJraW5nIGNvbm5lY3Rpb24gaGVhbHRoeS5cIiksYS5TYT0hMCxhLkMubmMoKSk6YS5DJiYxMDI0MDxhLkMuT2E/YS5lKFwiQ29ubmVjdGlvbiBleGNlZWRlZCBoZWFsdGh5IHRpbWVvdXQgYnV0IGhhcyBzZW50IFwiK1xuYS5DLk9hK1wiIGJ5dGVzLiAgTGVhdmluZyBjb25uZWN0aW9uIGFsaXZlLlwiKTooYS5lKFwiQ2xvc2luZyB1bmhlYWx0aHkgY29ubmVjdGlvbiBhZnRlciB0aW1lb3V0LlwiKSxhLmNsb3NlKCkpKX0sTWF0aC5mbG9vcihiKSkpfWZ1bmN0aW9uIHVkKGEsYil7cmV0dXJuIGZ1bmN0aW9uKGMpe2I9PT1hLkM/KGEuQz1udWxsLGN8fDAhPT1hLm9hPzE9PT1hLm9hJiZhLmUoXCJSZWFsdGltZSBjb25uZWN0aW9uIGxvc3QuXCIpOihhLmUoXCJSZWFsdGltZSBjb25uZWN0aW9uIGZhaWxlZC5cIiksXCJzLVwiPT09YS5ELmlhLnN1YnN0cigwLDIpJiYodmIucmVtb3ZlKFwiaG9zdDpcIithLkQuaG9zdCksYS5ELmlhPWEuRC5ob3N0KSksYS5jbG9zZSgpKTpiPT09YS53PyhhLmUoXCJTZWNvbmRhcnkgY29ubmVjdGlvbiBsb3N0LlwiKSxjPWEudyxhLnc9bnVsbCxhLmNjIT09YyYmYS4kYiE9PWN8fGEuY2xvc2UoKSk6YS5lKFwiY2xvc2luZyBhbiBvbGQgY29ubmVjdGlvblwiKX19XG5mdW5jdGlvbiB0ZChhLGIpe3JldHVybiBmdW5jdGlvbihjKXtpZigyIT1hLm9hKWlmKGI9PT1hLiRiKXt2YXIgZD1rYyhcInRcIixjKTtjPWtjKFwiZFwiLGMpO2lmKFwiY1wiPT1kKXtpZihkPWtjKFwidFwiLGMpLFwiZFwiaW4gYylpZihjPWMuZCxcImhcIj09PWQpe3ZhciBkPWMudHMsZT1jLnYsZj1jLmg7YS5HYz1jLnM7eGIoYS5ELGYpOzA9PWEub2EmJihhLkMuc3RhcnQoKSx2ZChhLGEuQyxkKSxcIjVcIiE9PWUmJk8oXCJQcm90b2NvbCB2ZXJzaW9uIG1pc21hdGNoIGRldGVjdGVkXCIpLGM9YS5jZSwoYz0xPGMuYmMubGVuZ3RoP2MuYmNbMV06bnVsbCkmJndkKGEsYykpfWVsc2UgaWYoXCJuXCI9PT1kKXthLmUoXCJyZWN2ZCBlbmQgdHJhbnNtaXNzaW9uIG9uIHByaW1hcnlcIik7YS4kYj1hLnc7Zm9yKGM9MDtjPGEud2MubGVuZ3RoOysrYylhLnRjKGEud2NbY10pO2Eud2M9W107eGQoYSl9ZWxzZVwic1wiPT09ZD8oYS5lKFwiQ29ubmVjdGlvbiBzaHV0ZG93biBjb21tYW5kIHJlY2VpdmVkLiBTaHV0dGluZyBkb3duLi4uXCIpLFxuYS5tZCYmKGEubWQoYyksYS5tZD1udWxsKSxhLlU9bnVsbCxhLmNsb3NlKCkpOlwiclwiPT09ZD8oYS5lKFwiUmVzZXQgcGFja2V0IHJlY2VpdmVkLiAgTmV3IGhvc3Q6IFwiK2MpLHhiKGEuRCxjKSwxPT09YS5vYT9hLmNsb3NlKCk6KHlkKGEpLHNkKGEpKSk6XCJlXCI9PT1kP2RjKFwiU2VydmVyIEVycm9yOiBcIitjKTpcIm9cIj09PWQ/KGEuZShcImdvdCBwb25nIG9uIHByaW1hcnkuXCIpLHpkKGEpLEFkKGEpKTpkYyhcIlVua25vd24gY29udHJvbCBwYWNrZXQgY29tbWFuZDogXCIrZCl9ZWxzZVwiZFwiPT1kJiZhLnRjKGMpfWVsc2UgaWYoYj09PWEudylpZihkPWtjKFwidFwiLGMpLGM9a2MoXCJkXCIsYyksXCJjXCI9PWQpXCJ0XCJpbiBjJiYoYz1jLnQsXCJhXCI9PT1jP0JkKGEpOlwiclwiPT09Yz8oYS5lKFwiR290IGEgcmVzZXQgb24gc2Vjb25kYXJ5LCBjbG9zaW5nIGl0XCIpLGEudy5jbG9zZSgpLGEuY2MhPT1hLncmJmEuJGIhPT1hLnd8fGEuY2xvc2UoKSk6XCJvXCI9PT1jJiYoYS5lKFwiZ290IHBvbmcgb24gc2Vjb25kYXJ5LlwiKSxcbmEuWWQtLSxCZChhKSkpO2Vsc2UgaWYoXCJkXCI9PWQpYS53Yy5wdXNoKGMpO2Vsc2UgdGhyb3cgRXJyb3IoXCJVbmtub3duIHByb3RvY29sIGxheWVyOiBcIitkKTtlbHNlIGEuZShcIm1lc3NhZ2Ugb24gb2xkIGNvbm5lY3Rpb25cIil9fXJkLnByb3RvdHlwZS5aZD1mdW5jdGlvbihhKXtFZCh0aGlzLHt0OlwiZFwiLGQ6YX0pfTtmdW5jdGlvbiB4ZChhKXthLmNjPT09YS53JiZhLiRiPT09YS53JiYoYS5lKFwiY2xlYW5pbmcgdXAgYW5kIHByb21vdGluZyBhIGNvbm5lY3Rpb246IFwiK2Eudy5XYyksYS5DPWEudyxhLnc9bnVsbCl9XG5mdW5jdGlvbiBCZChhKXswPj1hLllkPyhhLmUoXCJTZWNvbmRhcnkgY29ubmVjdGlvbiBpcyBoZWFsdGh5LlwiKSxhLlNhPSEwLGEudy5uYygpLGEudy5zdGFydCgpLGEuZShcInNlbmRpbmcgY2xpZW50IGFjayBvbiBzZWNvbmRhcnlcIiksYS53LnNlbmQoe3Q6XCJjXCIsZDp7dDpcImFcIixkOnt9fX0pLGEuZShcIkVuZGluZyB0cmFuc21pc3Npb24gb24gcHJpbWFyeVwiKSxhLkMuc2VuZCh7dDpcImNcIixkOnt0OlwiblwiLGQ6e319fSksYS5jYz1hLncseGQoYSkpOihhLmUoXCJzZW5kaW5nIHBpbmcgb24gc2Vjb25kYXJ5LlwiKSxhLncuc2VuZCh7dDpcImNcIixkOnt0OlwicFwiLGQ6e319fSkpfXJkLnByb3RvdHlwZS50Yz1mdW5jdGlvbihhKXt6ZCh0aGlzKTt0aGlzLm9iKGEpfTtmdW5jdGlvbiB6ZChhKXthLlNhfHwoYS5xZC0tLDA+PWEucWQmJihhLmUoXCJQcmltYXJ5IGNvbm5lY3Rpb24gaXMgaGVhbHRoeS5cIiksYS5TYT0hMCxhLkMubmMoKSkpfVxuZnVuY3Rpb24gd2QoYSxiKXthLnc9bmV3IGIoXCJjOlwiK2EuaWQrXCI6XCIrYS5EZCsrLGEuRCxhLkdjKTthLllkPWIucmVzcG9uc2VzUmVxdWlyZWRUb0JlSGVhbHRoeXx8MDthLncub3Blbih0ZChhLGEudyksdWQoYSxhLncpKTtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YS53JiYoYS5lKFwiVGltZWQgb3V0IHRyeWluZyB0byB1cGdyYWRlLlwiKSxhLncuY2xvc2UoKSl9LE1hdGguZmxvb3IoNkU0KSl9ZnVuY3Rpb24gdmQoYSxiLGMpe2EuZShcIlJlYWx0aW1lIGNvbm5lY3Rpb24gZXN0YWJsaXNoZWQuXCIpO2EuQz1iO2Eub2E9MTthLk5iJiYoYS5OYihjKSxhLk5iPW51bGwpOzA9PT1hLnFkPyhhLmUoXCJQcmltYXJ5IGNvbm5lY3Rpb24gaXMgaGVhbHRoeS5cIiksYS5TYT0hMCk6c2V0VGltZW91dChmdW5jdGlvbigpe0FkKGEpfSxNYXRoLmZsb29yKDVFMykpfVxuZnVuY3Rpb24gQWQoYSl7YS5TYXx8MSE9PWEub2F8fChhLmUoXCJzZW5kaW5nIHBpbmcgb24gcHJpbWFyeS5cIiksRWQoYSx7dDpcImNcIixkOnt0OlwicFwiLGQ6e319fSkpfWZ1bmN0aW9uIEVkKGEsYil7aWYoMSE9PWEub2EpdGhyb3dcIkNvbm5lY3Rpb24gaXMgbm90IGNvbm5lY3RlZFwiO2EuY2Muc2VuZChiKX1yZC5wcm90b3R5cGUuY2xvc2U9ZnVuY3Rpb24oKXsyIT09dGhpcy5vYSYmKHRoaXMuZShcIkNsb3NpbmcgcmVhbHRpbWUgY29ubmVjdGlvbi5cIiksdGhpcy5vYT0yLHlkKHRoaXMpLHRoaXMuVSYmKHRoaXMuVSgpLHRoaXMuVT1udWxsKSl9O2Z1bmN0aW9uIHlkKGEpe2EuZShcIlNodXR0aW5nIGRvd24gYWxsIGNvbm5lY3Rpb25zXCIpO2EuQyYmKGEuQy5jbG9zZSgpLGEuQz1udWxsKTthLncmJihhLncuY2xvc2UoKSxhLnc9bnVsbCk7YS5rYyYmKGNsZWFyVGltZW91dChhLmtjKSxhLmtjPW51bGwpfTtmdW5jdGlvbiBGZChhKXt2YXIgYj17fSxjPXt9LGQ9e30sZT1cIlwiO3RyeXt2YXIgZj1hLnNwbGl0KFwiLlwiKSxiPXVhKFhiKGZbMF0pfHxcIlwiKSxjPXVhKFhiKGZbMV0pfHxcIlwiKSxlPWZbMl0sZD1jLmR8fHt9O2RlbGV0ZSBjLmR9Y2F0Y2goZyl7fXJldHVybntiZjpiLFVjOmMsZGF0YTpkLFVlOmV9fWZ1bmN0aW9uIEdkKGEpe2E9RmQoYSkuVWM7cmV0dXJuXCJvYmplY3RcIj09PXR5cGVvZiBhJiZhLmhhc093blByb3BlcnR5KFwiaWF0XCIpP0IoYSxcImlhdFwiKTpudWxsfWZ1bmN0aW9uIEhkKGEpe2E9RmQoYSk7dmFyIGI9YS5VYztyZXR1cm4hIWEuVWUmJiEhYiYmXCJvYmplY3RcIj09PXR5cGVvZiBiJiZiLmhhc093blByb3BlcnR5KFwiaWF0XCIpfTtmdW5jdGlvbiBJZChhLGIsYyxkLGUpe3RoaXMuaWQ9SmQrKzt0aGlzLmU9Y2MoXCJwOlwiK3RoaXMuaWQrXCI6XCIpO3RoaXMuWmE9ITA7dGhpcy5qYT17fTt0aGlzLlY9W107dGhpcy5QYj0wO3RoaXMuTWI9W107dGhpcy5UPSExO3RoaXMudmE9MUUzO3RoaXMub2M9M0U1O3RoaXMudWM9Ynx8Y2E7dGhpcy5zYz1jfHxjYTt0aGlzLm5kPWR8fGNhO3RoaXMuZGQ9ZXx8Y2E7dGhpcy5EPWE7dGhpcy51ZD1udWxsO3RoaXMuWGI9e307dGhpcy5PZT0wO3RoaXMuSWI9dGhpcy5oZD1udWxsO0tkKHRoaXMsMCk7R2MuaWIoKS5VYShcInZpc2libGVcIix0aGlzLkplLHRoaXMpOy0xPT09YS5ob3N0LmluZGV4T2YoXCJmYmxvY2FsXCIpJiZIYy5pYigpLlVhKFwib25saW5lXCIsdGhpcy5IZSx0aGlzKX12YXIgSmQ9MCxMZD0wO2s9SWQucHJvdG90eXBlO1xuay5KYT1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9Kyt0aGlzLk9lO2E9e3I6ZCxhOmEsYjpifTt0aGlzLmUodShhKSk7dih0aGlzLlQsXCJzZW5kUmVxdWVzdF8gY2FsbCB3aGVuIHdlJ3JlIG5vdCBjb25uZWN0ZWQgbm90IGFsbG93ZWQuXCIpO3RoaXMubWEuWmQoYSk7YyYmKHRoaXMuWGJbZF09Yyl9O2Z1bmN0aW9uIE1kKGEsYixjKXt2YXIgZD1iLnRvU3RyaW5nKCksZT1iLnBhdGgoKS50b1N0cmluZygpO2EuamFbZV09YS5qYVtlXXx8e307dighYS5qYVtlXVtkXSxcImxpc3RlbigpIGNhbGxlZCB0d2ljZSBmb3Igc2FtZSBwYXRoL3F1ZXJ5SWQuXCIpO2EuamFbZV1bZF09e3FiOmIucWIoKSxHOmN9O2EuVCYmTmQoYSxlLGQsYi5xYigpLGMpfVxuZnVuY3Rpb24gTmQoYSxiLGMsZCxlKXthLmUoXCJMaXN0ZW4gb24gXCIrYitcIiBmb3IgXCIrYyk7dmFyIGY9e3A6Yn07ZD1GYihkLGZ1bmN0aW9uKGEpe3JldHVybiBSYShhKX0pO1wie31cIiE9PWMmJihmLnE9ZCk7Zi5oPWEuZGQoYik7YS5KYShcImxcIixmLGZ1bmN0aW9uKGQpe2EuZShcImxpc3RlbiByZXNwb25zZVwiLGQpO2Q9ZC5zO1wib2tcIiE9PWQmJk9kKGEsYixjKTtlJiZlKGQpfSl9ay5JPWZ1bmN0aW9uKGEsYixjKXt0aGlzLmJiPXtyZTphLElkOiExLGNhOmIsZmM6Y307dGhpcy5lKFwiQXV0aGVudGljYXRpbmcgdXNpbmcgY3JlZGVudGlhbDogXCIrYSk7UGQodGhpcyk7KGI9NDA9PWEubGVuZ3RoKXx8KGE9RmQoYSkuVWMsYj1cIm9iamVjdFwiPT09dHlwZW9mIGEmJiEwPT09QihhLFwiYWRtaW5cIikpO2ImJih0aGlzLmUoXCJBZG1pbiBhdXRoIGNyZWRlbnRpYWwgZGV0ZWN0ZWQuICBSZWR1Y2luZyBtYXggcmVjb25uZWN0IHRpbWUuXCIpLHRoaXMub2M9M0U0KX07XG5rLkJkPWZ1bmN0aW9uKGEpe2RlbGV0ZSB0aGlzLmJiO3RoaXMuVCYmdGhpcy5KYShcInVuYXV0aFwiLHt9LGZ1bmN0aW9uKGIpe2EoYi5zLGIuZCl9KX07ZnVuY3Rpb24gUGQoYSl7dmFyIGI9YS5iYjthLlQmJmImJmEuSmEoXCJhdXRoXCIse2NyZWQ6Yi5yZX0sZnVuY3Rpb24oYyl7dmFyIGQ9Yy5zO2M9Yy5kfHxcImVycm9yXCI7XCJva1wiIT09ZCYmYS5iYj09PWImJmRlbGV0ZSBhLmJiO2IuSWQ/XCJva1wiIT09ZCYmYi5mYyYmYi5mYyhkLGMpOihiLklkPSEwLGIuY2EmJmIuY2EoZCxjKSl9KX1mdW5jdGlvbiBRZChhLGIsYyxkKXtiPWIudG9TdHJpbmcoKTtPZChhLGIsYykmJmEuVCYmUmQoYSxiLGMsZCl9ZnVuY3Rpb24gUmQoYSxiLGMsZCl7YS5lKFwiVW5saXN0ZW4gb24gXCIrYitcIiBmb3IgXCIrYyk7Yj17cDpifTtkPUZiKGQsZnVuY3Rpb24oYSl7cmV0dXJuIFJhKGEpfSk7XCJ7fVwiIT09YyYmKGIucT1kKTthLkphKFwidVwiLGIpfVxuZnVuY3Rpb24gU2QoYSxiLGMsZCl7YS5UP1RkKGEsXCJvXCIsYixjLGQpOmEuTWIucHVzaCh7UmI6YixhY3Rpb246XCJvXCIsZGF0YTpjLEc6ZH0pfWZ1bmN0aW9uIFVkKGEsYixjLGQpe2EuVD9UZChhLFwib21cIixiLGMsZCk6YS5NYi5wdXNoKHtSYjpiLGFjdGlvbjpcIm9tXCIsZGF0YTpjLEc6ZH0pfWsubGQ9ZnVuY3Rpb24oYSxiKXt0aGlzLlQ/VGQodGhpcyxcIm9jXCIsYSxudWxsLGIpOnRoaXMuTWIucHVzaCh7UmI6YSxhY3Rpb246XCJvY1wiLGRhdGE6bnVsbCxHOmJ9KX07ZnVuY3Rpb24gVGQoYSxiLGMsZCxlKXtjPXtwOmMsZDpkfTthLmUoXCJvbkRpc2Nvbm5lY3QgXCIrYixjKTthLkphKGIsYyxmdW5jdGlvbihhKXtlJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZShhLnMsYS5kKX0sTWF0aC5mbG9vcigwKSl9KX1rLnB1dD1mdW5jdGlvbihhLGIsYyxkKXtWZCh0aGlzLFwicFwiLGEsYixjLGQpfTtmdW5jdGlvbiBXZChhLGIsYyxkKXtWZChhLFwibVwiLGIsYyxkLHZvaWQgMCl9XG5mdW5jdGlvbiBWZChhLGIsYyxkLGUsZil7Yz17cDpjLGQ6ZH07bChmKSYmKGMuaD1mKTthLlYucHVzaCh7YWN0aW9uOmIsVmQ6YyxHOmV9KTthLlBiKys7Yj1hLlYubGVuZ3RoLTE7YS5UJiZYZChhLGIpfWZ1bmN0aW9uIFhkKGEsYil7dmFyIGM9YS5WW2JdLmFjdGlvbixkPWEuVltiXS5WZCxlPWEuVltiXS5HO2EuVltiXS5MZT1hLlQ7YS5KYShjLGQsZnVuY3Rpb24oZCl7YS5lKGMrXCIgcmVzcG9uc2VcIixkKTtkZWxldGUgYS5WW2JdO2EuUGItLTswPT09YS5QYiYmKGEuVj1bXSk7ZSYmZShkLnMsZC5kKX0pfVxuay50Yz1mdW5jdGlvbihhKXtpZihcInJcImluIGEpe3RoaXMuZShcImZyb20gc2VydmVyOiBcIit1KGEpKTt2YXIgYj1hLnIsYz10aGlzLlhiW2JdO2MmJihkZWxldGUgdGhpcy5YYltiXSxjKGEuYikpfWVsc2V7aWYoXCJlcnJvclwiaW4gYSl0aHJvd1wiQSBzZXJ2ZXItc2lkZSBlcnJvciBoYXMgb2NjdXJyZWQ6IFwiK2EuZXJyb3I7XCJhXCJpbiBhJiYoYj1hLmEsYz1hLmIsdGhpcy5lKFwiaGFuZGxlU2VydmVyTWVzc2FnZVwiLGIsYyksXCJkXCI9PT1iP3RoaXMudWMoYy5wLGMuZCwhMSk6XCJtXCI9PT1iP3RoaXMudWMoYy5wLGMuZCwhMCk6XCJjXCI9PT1iP1lkKHRoaXMsYy5wLGMucSk6XCJhY1wiPT09Yj8oYT1jLnMsYj1jLmQsYz10aGlzLmJiLGRlbGV0ZSB0aGlzLmJiLGMmJmMuZmMmJmMuZmMoYSxiKSk6XCJzZFwiPT09Yj90aGlzLnVkP3RoaXMudWQoYyk6XCJtc2dcImluIGMmJlwidW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZSYmY29uc29sZS5sb2coXCJGSVJFQkFTRTogXCIrYy5tc2cucmVwbGFjZShcIlxcblwiLFwiXFxuRklSRUJBU0U6IFwiKSk6XG5kYyhcIlVucmVjb2duaXplZCBhY3Rpb24gcmVjZWl2ZWQgZnJvbSBzZXJ2ZXI6IFwiK3UoYikrXCJcXG5BcmUgeW91IHVzaW5nIHRoZSBsYXRlc3QgY2xpZW50P1wiKSl9fTtrLk5iPWZ1bmN0aW9uKGEpe3RoaXMuZShcImNvbm5lY3Rpb24gcmVhZHlcIik7dGhpcy5UPSEwO3RoaXMuSWI9KG5ldyBEYXRlKS5nZXRUaW1lKCk7dGhpcy5uZCh7c2VydmVyVGltZU9mZnNldDphLShuZXcgRGF0ZSkuZ2V0VGltZSgpfSk7UGQodGhpcyk7Zm9yKHZhciBiIGluIHRoaXMuamEpZm9yKHZhciBjIGluIHRoaXMuamFbYl0pYT10aGlzLmphW2JdW2NdLE5kKHRoaXMsYixjLGEucWIsYS5HKTtmb3IoYj0wO2I8dGhpcy5WLmxlbmd0aDtiKyspdGhpcy5WW2JdJiZYZCh0aGlzLGIpO2Zvcig7dGhpcy5NYi5sZW5ndGg7KWI9dGhpcy5NYi5zaGlmdCgpLFRkKHRoaXMsYi5hY3Rpb24sYi5SYixiLmRhdGEsYi5HKTt0aGlzLnNjKCEwKX07XG5mdW5jdGlvbiBLZChhLGIpe3YoIWEubWEsXCJTY2hlZHVsaW5nIGEgY29ubmVjdCB3aGVuIHdlJ3JlIGFscmVhZHkgY29ubmVjdGVkL2luZz9cIik7YS5nYiYmY2xlYXJUaW1lb3V0KGEuZ2IpO2EuZ2I9c2V0VGltZW91dChmdW5jdGlvbigpe2EuZ2I9bnVsbDtaZChhKX0sTWF0aC5mbG9vcihiKSl9ay5KZT1mdW5jdGlvbihhKXthJiYhdGhpcy54YiYmdGhpcy52YT09PXRoaXMub2MmJih0aGlzLmUoXCJXaW5kb3cgYmVjYW1lIHZpc2libGUuICBSZWR1Y2luZyBkZWxheS5cIiksdGhpcy52YT0xRTMsdGhpcy5tYXx8S2QodGhpcywwKSk7dGhpcy54Yj1hfTtcbmsuSGU9ZnVuY3Rpb24oYSl7YT8odGhpcy5lKFwiQnJvd3NlciB3ZW50IG9ubGluZS4gIFJlY29ubmVjdGluZy5cIiksdGhpcy52YT0xRTMsdGhpcy5aYT0hMCx0aGlzLm1hfHxLZCh0aGlzLDApKToodGhpcy5lKFwiQnJvd3NlciB3ZW50IG9mZmxpbmUuICBLaWxsaW5nIGNvbm5lY3Rpb247IGRvbid0IHJlY29ubmVjdC5cIiksdGhpcy5aYT0hMSx0aGlzLm1hJiZ0aGlzLm1hLmNsb3NlKCkpfTtcbmsuUWQ9ZnVuY3Rpb24oKXt0aGlzLmUoXCJkYXRhIGNsaWVudCBkaXNjb25uZWN0ZWRcIik7dGhpcy5UPSExO3RoaXMubWE9bnVsbDtmb3IodmFyIGE9MDthPHRoaXMuVi5sZW5ndGg7YSsrKXt2YXIgYj10aGlzLlZbYV07YiYmXCJoXCJpbiBiLlZkJiZiLkxlJiYoYi5HJiZiLkcoXCJkaXNjb25uZWN0XCIpLGRlbGV0ZSB0aGlzLlZbYV0sdGhpcy5QYi0tKX0wPT09dGhpcy5QYiYmKHRoaXMuVj1bXSk7aWYodGhpcy5aYSl0aGlzLnhiP3RoaXMuSWImJigzRTQ8KG5ldyBEYXRlKS5nZXRUaW1lKCktdGhpcy5JYiYmKHRoaXMudmE9MUUzKSx0aGlzLkliPW51bGwpOih0aGlzLmUoXCJXaW5kb3cgaXNuJ3QgdmlzaWJsZS4gIERlbGF5aW5nIHJlY29ubmVjdC5cIiksdGhpcy52YT10aGlzLm9jLHRoaXMuaGQ9KG5ldyBEYXRlKS5nZXRUaW1lKCkpLGE9TWF0aC5tYXgoMCx0aGlzLnZhLSgobmV3IERhdGUpLmdldFRpbWUoKS10aGlzLmhkKSksYSo9TWF0aC5yYW5kb20oKSx0aGlzLmUoXCJUcnlpbmcgdG8gcmVjb25uZWN0IGluIFwiK1xuYStcIm1zXCIpLEtkKHRoaXMsYSksdGhpcy52YT1NYXRoLm1pbih0aGlzLm9jLDEuMyp0aGlzLnZhKTtlbHNlIGZvcih2YXIgYyBpbiB0aGlzLlhiKWRlbGV0ZSB0aGlzLlhiW2NdO3RoaXMuc2MoITEpfTtmdW5jdGlvbiBaZChhKXtpZihhLlphKXthLmUoXCJNYWtpbmcgYSBjb25uZWN0aW9uIGF0dGVtcHRcIik7YS5oZD0obmV3IERhdGUpLmdldFRpbWUoKTthLkliPW51bGw7dmFyIGI9cihhLnRjLGEpLGM9cihhLk5iLGEpLGQ9cihhLlFkLGEpLGU9YS5pZCtcIjpcIitMZCsrO2EubWE9bmV3IHJkKGUsYS5ELGIsYyxkLGZ1bmN0aW9uKGIpe08oYitcIiAoXCIrYS5ELnRvU3RyaW5nKCkrXCIpXCIpO2EuWmE9ITF9KX19ay5RYT1mdW5jdGlvbigpe3RoaXMuWmE9ITE7dGhpcy5tYT90aGlzLm1hLmNsb3NlKCk6KHRoaXMuZ2ImJihjbGVhclRpbWVvdXQodGhpcy5nYiksdGhpcy5nYj1udWxsKSx0aGlzLlQmJnRoaXMuUWQoKSl9O1xuay50Yj1mdW5jdGlvbigpe3RoaXMuWmE9ITA7dGhpcy52YT0xRTM7dGhpcy5UfHxLZCh0aGlzLDApfTtmdW5jdGlvbiBZZChhLGIsYyl7Yz1jP0ZiKGMsZnVuY3Rpb24oYSl7cmV0dXJuIFNhKGEpfSkuam9pbihcIiRcIik6XCJ7fVwiOyhhPU9kKGEsYixjKSkmJmEuRyYmYS5HKFwicGVybWlzc2lvbl9kZW5pZWRcIil9ZnVuY3Rpb24gT2QoYSxiLGMpe2I9KG5ldyBIKGIpKS50b1N0cmluZygpO2N8fChjPVwie31cIik7dmFyIGQ9YS5qYVtiXVtjXTtkZWxldGUgYS5qYVtiXVtjXTtyZXR1cm4gZH07ZnVuY3Rpb24gJGQoKXt0aGlzLm89dGhpcy5IPW51bGx9JGQucHJvdG90eXBlLnJiPWZ1bmN0aW9uKGEsYil7aWYoYS5mKCkpdGhpcy5IPWIsdGhpcy5vPW51bGw7ZWxzZSBpZihudWxsIT09dGhpcy5IKXRoaXMuSD10aGlzLkguQmEoYSxiKTtlbHNle251bGw9PXRoaXMubyYmKHRoaXMubz1uZXcgZGQpO3ZhciBjPUQoYSk7dGhpcy5vLmNvbnRhaW5zKGMpfHx0aGlzLm8uYWRkKGMsbmV3ICRkKTtjPXRoaXMuby5nZXQoYyk7YT1UYShhKTtjLnJiKGEsYil9fTtcbmZ1bmN0aW9uIGFlKGEsYil7aWYoYi5mKCkpcmV0dXJuIGEuSD1udWxsLGEubz1udWxsLCEwO2lmKG51bGwhPT1hLkgpe2lmKGEuSC5RKCkpcmV0dXJuITE7dmFyIGM9YS5IO2EuSD1udWxsO2MuQihmdW5jdGlvbihiLGMpe2EucmIobmV3IEgoYiksYyl9KTtyZXR1cm4gYWUoYSxiKX1yZXR1cm4gbnVsbCE9PWEubz8oYz1EKGIpLGI9VGEoYiksYS5vLmNvbnRhaW5zKGMpJiZhZShhLm8uZ2V0KGMpLGIpJiZhLm8ucmVtb3ZlKGMpLGEuby5mKCk/KGEubz1udWxsLCEwKTohMSk6ITB9ZnVuY3Rpb24gYmUoYSxiLGMpe251bGwhPT1hLkg/YyhiLGEuSCk6YS5CKGZ1bmN0aW9uKGEsZSl7dmFyIGY9bmV3IEgoYi50b1N0cmluZygpK1wiL1wiK2EpO2JlKGUsZixjKX0pfSRkLnByb3RvdHlwZS5CPWZ1bmN0aW9uKGEpe251bGwhPT10aGlzLm8mJmVkKHRoaXMubyxmdW5jdGlvbihiLGMpe2EoYixjKX0pfTtmdW5jdGlvbiBjZSgpe3RoaXMuYmE9UX1mdW5jdGlvbiBVKGEsYil7cmV0dXJuIGEuYmEuTihiKX1mdW5jdGlvbiBWKGEsYixjKXthLmJhPWEuYmEuQmEoYixjKX1jZS5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5iYS50b1N0cmluZygpfTtmdW5jdGlvbiBkZSgpe3RoaXMud2E9bmV3IGNlO3RoaXMuTz1uZXcgY2U7dGhpcy5xYT1uZXcgY2U7dGhpcy5TYj1uZXcgWGF9ZnVuY3Rpb24gZWUoYSxiLGMpe1YoYS53YSxiLGMpO3JldHVybiBmZShhLGIpfWZ1bmN0aW9uIGZlKGEsYil7Zm9yKHZhciBjPVUoYS53YSxiKSxkPVUoYS5PLGIpLGU9SShhLlNiLGIpLGY9ITEsZz1lO251bGwhPT1nOyl7aWYobnVsbCE9PWcuaygpKXtmPSEwO2JyZWFrfWc9Zy5wYXJlbnQoKX1pZihmKXJldHVybiExO2M9Z2UoYyxkLGUpO3JldHVybiBjIT09ZD8oVihhLk8sYixjKSwhMCk6ITF9ZnVuY3Rpb24gZ2UoYSxiLGMpe2lmKGMuZigpKXJldHVybiBhO2lmKG51bGwhPT1jLmsoKSlyZXR1cm4gYjthPWF8fFE7Yy5CKGZ1bmN0aW9uKGQpe2Q9ZC5uYW1lKCk7dmFyIGU9YS5QKGQpLGY9Yi5QKGQpLGc9SShjLGQpLGU9Z2UoZSxmLGcpO2E9YS5LKGQsZSl9KTtyZXR1cm4gYX1cbmRlLnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLGQ9W107RGIoYixmdW5jdGlvbihhKXt2YXIgYj1hLnBhdGg7YT1hLnVhO3ZhciBnPVdiKCk7WWEoSShjLlNiLGIpLGcpO1YoYy5PLGIsYSk7ZC5wdXNoKHtwYXRoOmIsUmU6Z30pfSk7cmV0dXJuIGR9O2Z1bmN0aW9uIGhlKGEsYil7RGIoYixmdW5jdGlvbihiKXt2YXIgZD1iLlJlO2I9SShhLlNiLGIucGF0aCk7dmFyIGU9Yi5rKCk7dihudWxsIT09ZSxcInBlbmRpbmdQdXQgc2hvdWxkIG5vdCBiZSBudWxsLlwiKTtlPT09ZCYmWWEoYixudWxsKX0pfTtmdW5jdGlvbiBpZShhLGIpe3JldHVybiBhJiZcIm9iamVjdFwiPT09dHlwZW9mIGE/KHYoXCIuc3ZcImluIGEsXCJVbmV4cGVjdGVkIGxlYWYgbm9kZSBvciBwcmlvcml0eSBjb250ZW50c1wiKSxiW2FbXCIuc3ZcIl1dKTphfWZ1bmN0aW9uIGplKGEsYil7dmFyIGM9bmV3ICRkO2JlKGEsbmV3IEgoXCJcIiksZnVuY3Rpb24oYSxlKXtjLnJiKGEsa2UoZSxiKSl9KTtyZXR1cm4gY31mdW5jdGlvbiBrZShhLGIpe3ZhciBjPWllKGEubSgpLGIpLGQ7aWYoYS5RKCkpe3ZhciBlPWllKGEuaygpLGIpO3JldHVybiBlIT09YS5rKCl8fGMhPT1hLm0oKT9uZXcgdGMoZSxjKTphfWQ9YTtjIT09YS5tKCkmJihkPWQuTGEoYykpO2EuQihmdW5jdGlvbihhLGMpe3ZhciBlPWtlKGMsYik7ZSE9PWMmJihkPWQuSyhhLGUpKX0pO3JldHVybiBkfTt2YXIgbGU9XCJhdXRoLmZpcmViYXNlLmNvbVwiO2Z1bmN0aW9uIG1lKGEsYixjKXt0aGlzLmhjPWF8fHt9O3RoaXMuTGM9Ynx8e307dGhpcy51Yj1jfHx7fTt0aGlzLmhjLnJlbWVtYmVyfHwodGhpcy5oYy5yZW1lbWJlcj1cImRlZmF1bHRcIil9dmFyIG5lPVtcInJlbWVtYmVyXCIsXCJyZWRpcmVjdFRvXCJdO2Z1bmN0aW9uIG9lKGEpe3ZhciBiPXt9LGM9e307emEoYXx8e30sZnVuY3Rpb24oYSxlKXswPD1DYihuZSxhKT9iW2FdPWU6Y1thXT1lfSk7cmV0dXJuIG5ldyBtZShiLHt9LGMpfTt2YXIgcGU9e05FVFdPUktfRVJST1I6XCJVbmFibGUgdG8gY29udGFjdCB0aGUgRmlyZWJhc2Ugc2VydmVyLlwiLFNFUlZFUl9FUlJPUjpcIkFuIHVua25vd24gc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLFRSQU5TUE9SVF9VTkFWQUlMQUJMRTpcIlRoZXJlIGFyZSBubyBsb2dpbiB0cmFuc3BvcnRzIGF2YWlsYWJsZSBmb3IgdGhlIHJlcXVlc3RlZCBtZXRob2QuXCIsUkVRVUVTVF9JTlRFUlJVUFRFRDpcIlRoZSBicm93c2VyIHJlZGlyZWN0ZWQgdGhlIHBhZ2UgYmVmb3JlIHRoZSBsb2dpbiByZXF1ZXN0IGNvdWxkIGNvbXBsZXRlLlwiLFVTRVJfQ0FOQ0VMTEVEOlwiVGhlIHVzZXIgY2FuY2VsbGVkIGF1dGhlbnRpY2F0aW9uLlwifTtmdW5jdGlvbiBXKGEpe3ZhciBiPUVycm9yKEIocGUsYSksYSk7Yi5jb2RlPWE7cmV0dXJuIGJ9O2Z1bmN0aW9uIHFlKCl7dmFyIGE9d2luZG93Lm9wZW5lci5mcmFtZXMsYjtmb3IoYj1hLmxlbmd0aC0xOzA8PWI7Yi0tKXRyeXtpZihhW2JdLmxvY2F0aW9uLnByb3RvY29sPT09d2luZG93LmxvY2F0aW9uLnByb3RvY29sJiZhW2JdLmxvY2F0aW9uLmhvc3Q9PT13aW5kb3cubG9jYXRpb24uaG9zdCYmXCJfX3dpbmNoYW5fcmVsYXlfZnJhbWVcIj09PWFbYl0ubmFtZSlyZXR1cm4gYVtiXX1jYXRjaChjKXt9cmV0dXJuIG51bGx9ZnVuY3Rpb24gcmUoYSxiLGMpe2EuYXR0YWNoRXZlbnQ/YS5hdHRhY2hFdmVudChcIm9uXCIrYixjKTphLmFkZEV2ZW50TGlzdGVuZXImJmEuYWRkRXZlbnRMaXN0ZW5lcihiLGMsITEpfWZ1bmN0aW9uIHNlKGEsYixjKXthLmRldGFjaEV2ZW50P2EuZGV0YWNoRXZlbnQoXCJvblwiK2IsYyk6YS5yZW1vdmVFdmVudExpc3RlbmVyJiZhLnJlbW92ZUV2ZW50TGlzdGVuZXIoYixjLCExKX1cbmZ1bmN0aW9uIHRlKGEpey9eaHR0cHM/OlxcL1xcLy8udGVzdChhKXx8KGE9d2luZG93LmxvY2F0aW9uLmhyZWYpO3ZhciBiPS9eKGh0dHBzPzpcXC9cXC9bXFwtX2EtekEtWlxcLjAtOTpdKykvLmV4ZWMoYSk7cmV0dXJuIGI/YlsxXTphfWZ1bmN0aW9uIHVlKGEpe3ZhciBiPVwiXCI7dHJ5e2E9YS5yZXBsYWNlKFwiI1wiLFwiXCIpO3ZhciBjPXt9LGQ9YS5yZXBsYWNlKC9eXFw/LyxcIlwiKS5zcGxpdChcIiZcIik7Zm9yKGE9MDthPGQubGVuZ3RoO2ErKylpZihkW2FdKXt2YXIgZT1kW2FdLnNwbGl0KFwiPVwiKTtjW2VbMF1dPWVbMV19YyYmQShjLFwiX19maXJlYmFzZV9yZXF1ZXN0X2tleVwiKSYmKGI9QihjLFwiX19maXJlYmFzZV9yZXF1ZXN0X2tleVwiKSl9Y2F0Y2goZil7fXJldHVybiBifVxuZnVuY3Rpb24gdmUoYSl7dmFyIGI9W10sYztmb3IoYyBpbiBhKWlmKEEoYSxjKSl7dmFyIGQ9QihhLGMpO2lmKGZhKGQpKWZvcih2YXIgZT0wO2U8ZC5sZW5ndGg7ZSsrKWIucHVzaChlbmNvZGVVUklDb21wb25lbnQoYykrXCI9XCIrZW5jb2RlVVJJQ29tcG9uZW50KGRbZV0pKTtlbHNlIGIucHVzaChlbmNvZGVVUklDb21wb25lbnQoYykrXCI9XCIrZW5jb2RlVVJJQ29tcG9uZW50KEIoYSxjKSkpfXJldHVybiBiLmpvaW4oXCImXCIpfWZ1bmN0aW9uIHdlKCl7dmFyIGE9ZmMobGUpO3JldHVybiBhLnNjaGVtZStcIjovL1wiK2EuaG9zdCtcIi92MlwifTtmdW5jdGlvbiB4ZSgpe3JldHVybiEhKHdpbmRvdy5jb3Jkb3ZhfHx3aW5kb3cucGhvbmVnYXB8fHdpbmRvdy5QaG9uZUdhcCkmJi9pb3N8aXBob25lfGlwb2R8aXBhZHxhbmRyb2lkfGJsYWNrYmVycnl8aWVtb2JpbGUvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpfWZ1bmN0aW9uIHllKCl7dmFyIGE9bmF2aWdhdG9yLnVzZXJBZ2VudDtpZihcIk1pY3Jvc29mdCBJbnRlcm5ldCBFeHBsb3JlclwiPT09bmF2aWdhdG9yLmFwcE5hbWUpe2lmKChhPWEubWF0Y2goL01TSUUgKFswLTldezEsfVtcXC4wLTldezAsfSkvKSkmJjE8YS5sZW5ndGgpcmV0dXJuIDg8PXBhcnNlRmxvYXQoYVsxXSl9ZWxzZSBpZigtMTxhLmluZGV4T2YoXCJUcmlkZW50XCIpJiYoYT1hLm1hdGNoKC9ydjooWzAtOV17MiwyfVtcXC4wLTldezAsfSkvKSkmJjE8YS5sZW5ndGgpcmV0dXJuIDg8PXBhcnNlRmxvYXQoYVsxXSk7cmV0dXJuITF9O2Z1bmN0aW9uIHplKGEpe2E9YXx8e307YS5tZXRob2R8fChhLm1ldGhvZD1cIkdFVFwiKTthLmhlYWRlcnN8fChhLmhlYWRlcnM9e30pO2EuaGVhZGVycy5jb250ZW50X3R5cGV8fChhLmhlYWRlcnMuY29udGVudF90eXBlPVwiYXBwbGljYXRpb24vanNvblwiKTthLmhlYWRlcnMuY29udGVudF90eXBlPWEuaGVhZGVycy5jb250ZW50X3R5cGUudG9Mb3dlckNhc2UoKTt0aGlzLm9wdGlvbnM9YX1cbnplLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKGEsYixjKXtmdW5jdGlvbiBkKCl7YyYmKGMoVyhcIlJFUVVFU1RfSU5URVJSVVBURURcIikpLGM9bnVsbCl9dmFyIGU9bmV3IFhNTEh0dHBSZXF1ZXN0LGY9dGhpcy5vcHRpb25zLm1ldGhvZC50b1VwcGVyQ2FzZSgpLGc7cmUod2luZG93LFwiYmVmb3JldW5sb2FkXCIsZCk7ZS5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXtpZihjJiY0PT09ZS5yZWFkeVN0YXRlKXt2YXIgYTtpZigyMDA8PWUuc3RhdHVzJiYzMDA+ZS5zdGF0dXMpe3RyeXthPXVhKGUucmVzcG9uc2VUZXh0KX1jYXRjaChiKXt9YyhudWxsLGEpfWVsc2UgNTAwPD1lLnN0YXR1cyYmNjAwPmUuc3RhdHVzP2MoVyhcIlNFUlZFUl9FUlJPUlwiKSk6YyhXKFwiTkVUV09SS19FUlJPUlwiKSk7Yz1udWxsO3NlKHdpbmRvdyxcImJlZm9yZXVubG9hZFwiLGQpfX07aWYoXCJHRVRcIj09PWYpYSs9KC9cXD8vLnRlc3QoYSk/XCJcIjpcIj9cIikrdmUoYiksZz1udWxsO2Vsc2V7dmFyIGg9dGhpcy5vcHRpb25zLmhlYWRlcnMuY29udGVudF90eXBlO1xuXCJhcHBsaWNhdGlvbi9qc29uXCI9PT1oJiYoZz11KGIpKTtcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiPT09aCYmKGc9dmUoYikpfWUub3BlbihmLGEsITApO2E9e1wiWC1SZXF1ZXN0ZWQtV2l0aFwiOlwiWE1MSHR0cFJlcXVlc3RcIixBY2NlcHQ6XCJhcHBsaWNhdGlvbi9qc29uO3RleHQvcGxhaW5cIn07TWMoYSx0aGlzLm9wdGlvbnMuaGVhZGVycyk7Zm9yKHZhciBtIGluIGEpZS5zZXRSZXF1ZXN0SGVhZGVyKG0sYVttXSk7ZS5zZW5kKGcpfTt6ZS5pc0F2YWlsYWJsZT1mdW5jdGlvbigpe3JldHVybiEhd2luZG93LlhNTEh0dHBSZXF1ZXN0JiZcInN0cmluZ1wiPT09dHlwZW9mKG5ldyBYTUxIdHRwUmVxdWVzdCkucmVzcG9uc2VUeXBlJiYoIShuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9NU0lFLyl8fG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1RyaWRlbnQvKSl8fHllKCkpfTt6ZS5wcm90b3R5cGUuQWI9ZnVuY3Rpb24oKXtyZXR1cm5cImpzb25cIn07ZnVuY3Rpb24gQWUoYSl7YT1hfHx7fTt0aGlzLlliPUJiKCkrQmIoKStCYigpO3RoaXMuUmQ9YXx8e319XG5BZS5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZCgpe2MmJihjKFcoXCJVU0VSX0NBTkNFTExFRFwiKSksYz1udWxsKX12YXIgZT10aGlzLGY9ZmMobGUpLGc7Yi5yZXF1ZXN0SWQ9dGhpcy5ZYjtiLnJlZGlyZWN0VG89Zi5zY2hlbWUrXCI6Ly9cIitmLmhvc3QrXCIvYmxhbmsvcGFnZS5odG1sXCI7YSs9L1xcPy8udGVzdChhKT9cIlwiOlwiP1wiO2ErPXZlKGIpOyhnPXdpbmRvdy5vcGVuKGEsXCJfYmxhbmtcIixcImxvY2F0aW9uPW5vXCIpKSYmaWEoZy5hZGRFdmVudExpc3RlbmVyKT8oZy5hZGRFdmVudExpc3RlbmVyKFwibG9hZHN0YXJ0XCIsZnVuY3Rpb24oYSl7dmFyIGI7aWYoYj1hJiZhLnVybClhOnt2YXIgZj1hLnVybDt0cnl7dmFyIHE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7cS5ocmVmPWY7Yj1xLmhvc3Q9PT1mYyhsZSkuaG9zdCYmXCIvYmxhbmsvcGFnZS5odG1sXCI9PT1xLnBhdGhuYW1lO2JyZWFrIGF9Y2F0Y2gocyl7fWI9ITF9YiYmKGE9dWUoYS51cmwpLGcucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImV4aXRcIixcbmQpLGcuY2xvc2UoKSxhPW5ldyBtZShudWxsLG51bGwse3JlcXVlc3RJZDplLlliLHJlcXVlc3RLZXk6YX0pLGUuUmQucmVxdWVzdFdpdGhDcmVkZW50aWFsKFwiL2F1dGgvc2Vzc2lvblwiLGEsYyksYz1udWxsKX0pLGcuYWRkRXZlbnRMaXN0ZW5lcihcImV4aXRcIixkKSk6YyhXKFwiVFJBTlNQT1JUX1VOQVZBSUxBQkxFXCIpKX07QWUuaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXtyZXR1cm4geGUoKX07QWUucHJvdG90eXBlLkFiPWZ1bmN0aW9uKCl7cmV0dXJuXCJyZWRpcmVjdFwifTtmdW5jdGlvbiBCZShhKXthPWF8fHt9O2lmKCFhLndpbmRvd19mZWF0dXJlc3x8LTEhPT1uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJGZW5uZWMvXCIpfHwtMSE9PW5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkZpcmVmb3gvXCIpJiYtMSE9PW5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkFuZHJvaWRcIikpYS53aW5kb3dfZmVhdHVyZXM9dm9pZCAwO2Eud2luZG93X25hbWV8fChhLndpbmRvd19uYW1lPVwiX2JsYW5rXCIpO2EucmVsYXlfdXJsfHwoYS5yZWxheV91cmw9d2UoKStcIi9hdXRoL2NoYW5uZWxcIik7dGhpcy5vcHRpb25zPWF9XG5CZS5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZChhKXtnJiYoZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChnKSxnPXZvaWQgMCk7cSYmKHE9Y2xlYXJJbnRlcnZhbChxKSk7c2Uod2luZG93LFwibWVzc2FnZVwiLGUpO3NlKHdpbmRvdyxcInVubG9hZFwiLGQpO2lmKG4mJiFhKXRyeXtuLmNsb3NlKCl9Y2F0Y2goYil7aC5wb3N0TWVzc2FnZShcImRpZVwiLG0pfW49aD12b2lkIDB9ZnVuY3Rpb24gZShhKXtpZihhLm9yaWdpbj09PW0pdHJ5e3ZhciBiPXVhKGEuZGF0YSk7XCJyZWFkeVwiPT09Yi5hP2gucG9zdE1lc3NhZ2UocyxtKTpcImVycm9yXCI9PT1iLmE/KGQoITEpLGMmJihjKGIuZCksYz1udWxsKSk6XCJyZXNwb25zZVwiPT09Yi5hJiYoZChiLmZvcmNlS2VlcFdpbmRvd09wZW4pLGMmJihjKG51bGwsYi5kKSxjPW51bGwpKX1jYXRjaChlKXt9fXZhciBmPXllKCksZyxoLG09dGUoYSk7aWYobSE9PXRlKHRoaXMub3B0aW9ucy5yZWxheV91cmwpKWMmJnNldFRpbWVvdXQoZnVuY3Rpb24oKXtjKEVycm9yKFwiaW52YWxpZCBhcmd1bWVudHM6IG9yaWdpbiBvZiB1cmwgYW5kIHJlbGF5X3VybCBtdXN0IG1hdGNoXCIpKX0sXG4wKTtlbHNle2YmJihnPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIiksZy5zZXRBdHRyaWJ1dGUoXCJzcmNcIix0aGlzLm9wdGlvbnMucmVsYXlfdXJsKSxnLnN0eWxlLmRpc3BsYXk9XCJub25lXCIsZy5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsXCJfX3dpbmNoYW5fcmVsYXlfZnJhbWVcIiksZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChnKSxoPWcuY29udGVudFdpbmRvdyk7YSs9KC9cXD8vLnRlc3QoYSk/XCJcIjpcIj9cIikrdmUoYik7dmFyIG49d2luZG93Lm9wZW4oYSx0aGlzLm9wdGlvbnMud2luZG93X25hbWUsdGhpcy5vcHRpb25zLndpbmRvd19mZWF0dXJlcyk7aHx8KGg9bik7dmFyIHE9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtuJiZuLmNsb3NlZCYmKGQoITEpLGMmJihjKFcoXCJVU0VSX0NBTkNFTExFRFwiKSksYz1udWxsKSl9LDUwMCkscz11KHthOlwicmVxdWVzdFwiLGQ6Yn0pO3JlKHdpbmRvdyxcInVubG9hZFwiLGQpO3JlKHdpbmRvdyxcIm1lc3NhZ2VcIixlKX19O1xuQmUuaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXtyZXR1cm5cInBvc3RNZXNzYWdlXCJpbiB3aW5kb3cmJiEvXmZpbGU6XFwvLy50ZXN0KGxvY2F0aW9uLmhyZWYpJiYhKHhlKCl8fG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1dpbmRvd3MgUGhvbmUvKXx8d2luZG93LldpbmRvd3MmJi9ebXMtYXBweDovLnRlc3QobG9jYXRpb24uaHJlZil8fG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goLyhpUGhvbmV8aVBvZHxpUGFkKS4qQXBwbGVXZWJLaXQoPyEuKlNhZmFyaSkvaSl8fG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0NyaU9TLyl8fG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1R3aXR0ZXIgZm9yIGlQaG9uZS8pfHxuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9GQkFOXFwvRkJJT1MvKXx8d2luZG93Lm5hdmlnYXRvci5zdGFuZGFsb25lKSYmIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1BoYW50b21KUy8pfTtCZS5wcm90b3R5cGUuQWI9ZnVuY3Rpb24oKXtyZXR1cm5cInBvcHVwXCJ9O2Z1bmN0aW9uIENlKGEpe2E9YXx8e307YS5jYWxsYmFja19wYXJhbWV0ZXJ8fChhLmNhbGxiYWNrX3BhcmFtZXRlcj1cImNhbGxiYWNrXCIpO3RoaXMub3B0aW9ucz1hO3dpbmRvdy5fX2ZpcmViYXNlX2F1dGhfanNvbnA9d2luZG93Ll9fZmlyZWJhc2VfYXV0aF9qc29ucHx8e319XG5DZS5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZCgpe2MmJihjKFcoXCJSRVFVRVNUX0lOVEVSUlVQVEVEXCIpKSxjPW51bGwpfWZ1bmN0aW9uIGUoKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZGVsZXRlIHdpbmRvdy5fX2ZpcmViYXNlX2F1dGhfanNvbnBbZl07SmMod2luZG93Ll9fZmlyZWJhc2VfYXV0aF9qc29ucCkmJmRlbGV0ZSB3aW5kb3cuX19maXJlYmFzZV9hdXRoX2pzb25wO3RyeXt2YXIgYT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChmKTthJiZhLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYSl9Y2F0Y2goYil7fX0sMSk7c2Uod2luZG93LFwiYmVmb3JldW5sb2FkXCIsZCl9dmFyIGY9XCJmblwiKyhuZXcgRGF0ZSkuZ2V0VGltZSgpK01hdGguZmxvb3IoOTk5OTkqTWF0aC5yYW5kb20oKSk7Ylt0aGlzLm9wdGlvbnMuY2FsbGJhY2tfcGFyYW1ldGVyXT1cIl9fZmlyZWJhc2VfYXV0aF9qc29ucC5cIitmO2ErPSgvXFw/Ly50ZXN0KGEpP1wiXCI6XCI/XCIpK3ZlKGIpO3JlKHdpbmRvdyxcblwiYmVmb3JldW5sb2FkXCIsZCk7d2luZG93Ll9fZmlyZWJhc2VfYXV0aF9qc29ucFtmXT1mdW5jdGlvbihhKXtjJiYoYyhudWxsLGEpLGM9bnVsbCk7ZSgpfTtEZShmLGEsYyl9O2Z1bmN0aW9uIERlKGEsYixjKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dHJ5e3ZhciBkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7ZC50eXBlPVwidGV4dC9qYXZhc2NyaXB0XCI7ZC5pZD1hO2QuYXN5bmM9ITA7ZC5zcmM9YjtkLm9uZXJyb3I9ZnVuY3Rpb24oKXt2YXIgYj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChhKTtudWxsIT09YiYmYi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGIpO2MmJmMoVyhcIk5FVFdPUktfRVJST1JcIikpfTt2YXIgZT1kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIik7KGUmJjAhPWUubGVuZ3RoP2VbMF06ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5hcHBlbmRDaGlsZChkKX1jYXRjaChmKXtjJiZjKFcoXCJORVRXT1JLX0VSUk9SXCIpKX19LDApfVxuQ2UuaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXtyZXR1cm4heGUoKX07Q2UucHJvdG90eXBlLkFiPWZ1bmN0aW9uKCl7cmV0dXJuXCJqc29uXCJ9O2Z1bmN0aW9uIEVlKGEsYil7dGhpcy5wZD1bXCJzZXNzaW9uXCIsYS55YyxhLlRhXS5qb2luKFwiOlwiKTt0aGlzLkljPWJ9RWUucHJvdG90eXBlLnNldD1mdW5jdGlvbihhLGIpe2lmKCFiKWlmKHRoaXMuSWMubGVuZ3RoKWI9dGhpcy5JY1swXTtlbHNlIHRocm93IEVycm9yKFwiZmIubG9naW4uU2Vzc2lvbk1hbmFnZXIgOiBObyBzdG9yYWdlIG9wdGlvbnMgYXZhaWxhYmxlIVwiKTtiLnNldCh0aGlzLnBkLGEpfTtFZS5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKCl7dmFyIGE9RmIodGhpcy5JYyxyKHRoaXMud2UsdGhpcykpLGE9RWIoYSxmdW5jdGlvbihhKXtyZXR1cm4gbnVsbCE9PWF9KTtKYihhLGZ1bmN0aW9uKGEsYyl7cmV0dXJuIEdkKGMudG9rZW4pLUdkKGEudG9rZW4pfSk7cmV0dXJuIDA8YS5sZW5ndGg/YS5zaGlmdCgpOm51bGx9O0VlLnByb3RvdHlwZS53ZT1mdW5jdGlvbihhKXt0cnl7dmFyIGI9YS5nZXQodGhpcy5wZCk7aWYoYiYmYi50b2tlbilyZXR1cm4gYn1jYXRjaChjKXt9cmV0dXJuIG51bGx9O1xuRWUucHJvdG90eXBlLmNsZWFyPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcztEYih0aGlzLkljLGZ1bmN0aW9uKGIpe2IucmVtb3ZlKGEucGQpfSl9O2Z1bmN0aW9uIEZlKGEpe2E9YXx8e307dGhpcy5ZYj1CYigpK0JiKCkrQmIoKTt0aGlzLlJkPWF8fHt9fUZlLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKGEsYil7Si5zZXQoXCJyZWRpcmVjdF9yZXF1ZXN0X2lkXCIsdGhpcy5ZYik7Yi5yZXF1ZXN0SWQ9dGhpcy5ZYjtiLnJlZGlyZWN0VG89Yi5yZWRpcmVjdFRvfHx3aW5kb3cubG9jYXRpb24uaHJlZjthKz0oL1xcPy8udGVzdChhKT9cIlwiOlwiP1wiKSt2ZShiKTt3aW5kb3cubG9jYXRpb249YX07RmUuaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXtyZXR1cm4hL15maWxlOlxcLy8udGVzdChsb2NhdGlvbi5ocmVmKSYmIXhlKCl9O0ZlLnByb3RvdHlwZS5BYj1mdW5jdGlvbigpe3JldHVyblwicmVkaXJlY3RcIn07ZnVuY3Rpb24gR2UoYSxiLGMsZCl7RWMuY2FsbCh0aGlzLFtcImF1dGhfc3RhdHVzXCJdKTt0aGlzLkQ9YTt0aGlzLkNkPWI7dGhpcy5YZT1jO3RoaXMuamQ9ZDt0aGlzLnZiPW5ldyBFZShhLFt2YixKXSk7dGhpcy5NYT1udWxsO0hlKHRoaXMpfW5hKEdlLEVjKTtrPUdlLnByb3RvdHlwZTtrLmJkPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuTWF8fG51bGx9O2Z1bmN0aW9uIEhlKGEpe0ouZ2V0KFwicmVkaXJlY3RfcmVxdWVzdF9pZFwiKSYmSWUoYSk7dmFyIGI9YS52Yi5nZXQoKTtiJiZiLnRva2VuPyhKZShhLGIpLGEuQ2QoYi50b2tlbixmdW5jdGlvbihjLGQpe0tlKGEsYyxkLCExLGIudG9rZW4sYil9LGZ1bmN0aW9uKGIsZCl7TGUoYSxcInJlc3VtZVNlc3Npb24oKVwiLGIsZCl9KSk6SmUoYSxudWxsKX1cbmZ1bmN0aW9uIE1lKGEsYixjLGQsZSxmKXtcImZpcmViYXNlaW8tZGVtby5jb21cIj09PWEuRC5kb21haW4mJk8oXCJGaXJlYmFzZVJlZi5hdXRoKCkgbm90IHN1cHBvcnRlZCBvbiBkZW1vIEZpcmViYXNlcyAoKi5maXJlYmFzZWlvLWRlbW8uY29tKS4gUGxlYXNlIHVzZSBvbiBwcm9kdWN0aW9uIEZpcmViYXNlcyBvbmx5ICgqLmZpcmViYXNlaW8uY29tKS5cIik7YS5DZChiLGZ1bmN0aW9uKGYsaCl7S2UoYSxmLGgsITAsYixjLGR8fHt9LGUpfSxmdW5jdGlvbihiLGMpe0xlKGEsXCJhdXRoKClcIixiLGMsZil9KX1mdW5jdGlvbiBOZShhLGIpe2EudmIuY2xlYXIoKTtKZShhLG51bGwpO2EuWGUoZnVuY3Rpb24oYSxkKXtpZihcIm9rXCI9PT1hKVAoYik7ZWxzZXt2YXIgZT0oYXx8XCJlcnJvclwiKS50b1VwcGVyQ2FzZSgpLGY9ZTtkJiYoZis9XCI6IFwiK2QpO2Y9RXJyb3IoZik7Zi5jb2RlPWU7UChiLGYpfX0pfVxuZnVuY3Rpb24gS2UoYSxiLGMsZCxlLGYsZyxoKXtcIm9rXCI9PT1iPyhkJiYoYj1jLmF1dGgsZi5hdXRoPWIsZi5leHBpcmVzPWMuZXhwaXJlcyxmLnRva2VuPUhkKGUpP2U6XCJcIixjPW51bGwsYiYmQShiLFwidWlkXCIpP2M9QihiLFwidWlkXCIpOkEoZixcInVpZFwiKSYmKGM9QihmLFwidWlkXCIpKSxmLnVpZD1jLGM9XCJjdXN0b21cIixiJiZBKGIsXCJwcm92aWRlclwiKT9jPUIoYixcInByb3ZpZGVyXCIpOkEoZixcInByb3ZpZGVyXCIpJiYoYz1CKGYsXCJwcm92aWRlclwiKSksZi5wcm92aWRlcj1jLGEudmIuY2xlYXIoKSxIZChlKSYmKGc9Z3x8e30sYz12YixcInNlc3Npb25Pbmx5XCI9PT1nLnJlbWVtYmVyJiYoYz1KKSxcIm5vbmVcIiE9PWcucmVtZW1iZXImJmEudmIuc2V0KGYsYykpLEplKGEsZikpLFAoaCxudWxsLGYpKTooYS52Yi5jbGVhcigpLEplKGEsbnVsbCksZj1hPShifHxcImVycm9yXCIpLnRvVXBwZXJDYXNlKCksYyYmKGYrPVwiOiBcIitjKSxmPUVycm9yKGYpLGYuY29kZT1hLFAoaCxmKSl9XG5mdW5jdGlvbiBMZShhLGIsYyxkLGUpe08oYitcIiB3YXMgY2FuY2VsZWQ6IFwiK2QpO2EudmIuY2xlYXIoKTtKZShhLG51bGwpO2E9RXJyb3IoZCk7YS5jb2RlPWMudG9VcHBlckNhc2UoKTtQKGUsYSl9ZnVuY3Rpb24gT2UoYSxiLGMsZCxlKXtQZShhKTt2YXIgZj1bemUsQ2VdO2M9bmV3IG1lKGQse30sYyk7UWUoYSxmLFwiL2F1dGgvXCIrYixjLGUpfVxuZnVuY3Rpb24gUmUoYSxiLGMsZCl7UGUoYSk7dmFyIGU9W0JlLEFlXTtjPW9lKGMpO1wiYW5vbnltb3VzXCI9PT1ifHxcInBhc3N3b3JkXCI9PT1iP3NldFRpbWVvdXQoZnVuY3Rpb24oKXtQKGQsVyhcIlRSQU5TUE9SVF9VTkFWQUlMQUJMRVwiKSl9LDApOihjLkxjLndpbmRvd19mZWF0dXJlcz1cIm1lbnViYXI9eWVzLG1vZGFsPXllcyxhbHdheXNSYWlzZWQ9eWVzbG9jYXRpb249eWVzLHJlc2l6YWJsZT15ZXMsc2Nyb2xsYmFycz15ZXMsc3RhdHVzPXllcyxoZWlnaHQ9NjI1LHdpZHRoPTYyNSx0b3A9XCIrKFwib2JqZWN0XCI9PT10eXBlb2Ygc2NyZWVuPy41KihzY3JlZW4uaGVpZ2h0LTYyNSk6MCkrXCIsbGVmdD1cIisoXCJvYmplY3RcIj09PXR5cGVvZiBzY3JlZW4/LjUqKHNjcmVlbi53aWR0aC02MjUpOjApLGMuTGMucmVsYXlfdXJsPXdlKCkrXCIvXCIrYS5ELlRhK1wiL2F1dGgvY2hhbm5lbFwiLGMuTGMucmVxdWVzdFdpdGhDcmVkZW50aWFsPXIoYS5aYixhKSxRZShhLGUsXCIvYXV0aC9cIitiLGMsZCkpfVxuZnVuY3Rpb24gSWUoYSl7dmFyIGI9Si5nZXQoXCJyZWRpcmVjdF9yZXF1ZXN0X2lkXCIpO2lmKGIpe3ZhciBjPUouZ2V0KFwicmVkaXJlY3RfY2xpZW50X29wdGlvbnNcIik7Si5yZW1vdmUoXCJyZWRpcmVjdF9yZXF1ZXN0X2lkXCIpO0oucmVtb3ZlKFwicmVkaXJlY3RfY2xpZW50X29wdGlvbnNcIik7dmFyIGQ9W3plLENlXSxiPXtyZXF1ZXN0SWQ6YixyZXF1ZXN0S2V5OnVlKGRvY3VtZW50LmxvY2F0aW9uLmhhc2gpfSxjPW5ldyBtZShjLHt9LGIpO3RyeXtkb2N1bWVudC5sb2NhdGlvbi5oYXNoPWRvY3VtZW50LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgvJl9fZmlyZWJhc2VfcmVxdWVzdF9rZXk9KFthLXpBLXowLTldKikvLFwiXCIpfWNhdGNoKGUpe31RZShhLGQsXCIvYXV0aC9zZXNzaW9uXCIsYyl9fWsuWGM9ZnVuY3Rpb24oYSxiKXtQZSh0aGlzKTt2YXIgYz1vZShhKTtjLnViLl9tZXRob2Q9XCJQT1NUXCI7dGhpcy5aYihcIi91c2Vyc1wiLGMsZnVuY3Rpb24oYSl7UChiLGEpfSl9O1xuay5zZD1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXM7UGUodGhpcyk7dmFyIGQ9XCIvdXNlcnMvXCIrZW5jb2RlVVJJQ29tcG9uZW50KGEuZW1haWwpLGU9b2UoYSk7ZS51Yi5fbWV0aG9kPVwiREVMRVRFXCI7dGhpcy5aYihkLGUsZnVuY3Rpb24oYSxkKXshYSYmZCYmZC51aWQmJmMuTWEmJmMuTWEudWlkJiZjLk1hLnVpZD09PWQudWlkJiZOZShjKTtQKGIsYSl9KX07ay5UYz1mdW5jdGlvbihhLGIpe1BlKHRoaXMpO3ZhciBjPVwiL3VzZXJzL1wiK2VuY29kZVVSSUNvbXBvbmVudChhLmVtYWlsKStcIi9wYXNzd29yZFwiLGQ9b2UoYSk7ZC51Yi5fbWV0aG9kPVwiUFVUXCI7ZC51Yi5wYXNzd29yZD1hLm5ld1Bhc3N3b3JkO3RoaXMuWmIoYyxkLGZ1bmN0aW9uKGEpe1AoYixhKX0pfTtcbmsudGQ9ZnVuY3Rpb24oYSxiKXtQZSh0aGlzKTt2YXIgYz1cIi91c2Vycy9cIitlbmNvZGVVUklDb21wb25lbnQoYS5lbWFpbCkrXCIvcGFzc3dvcmRcIixkPW9lKGEpO2QudWIuX21ldGhvZD1cIlBPU1RcIjt0aGlzLlpiKGMsZCxmdW5jdGlvbihhKXtQKGIsYSl9KX07ay5aYj1mdW5jdGlvbihhLGIsYyl7U2UodGhpcyxbemUsQ2VdLGEsYixjKX07ZnVuY3Rpb24gUWUoYSxiLGMsZCxlKXtTZShhLGIsYyxkLGZ1bmN0aW9uKGIsYyl7IWImJmMmJmMudG9rZW4mJmMudWlkP01lKGEsYy50b2tlbixjLGQuaGMsZnVuY3Rpb24oYSxiKXthP1AoZSxhKTpQKGUsbnVsbCxiKX0pOlAoZSxifHxXKFwiVU5LTk9XTl9FUlJPUlwiKSl9KX1cbmZ1bmN0aW9uIFNlKGEsYixjLGQsZSl7Yj1FYihiLGZ1bmN0aW9uKGEpe3JldHVyblwiZnVuY3Rpb25cIj09PXR5cGVvZiBhLmlzQXZhaWxhYmxlJiZhLmlzQXZhaWxhYmxlKCl9KTswPT09Yi5sZW5ndGg/c2V0VGltZW91dChmdW5jdGlvbigpe1AoZSxXKFwiVFJBTlNQT1JUX1VOQVZBSUxBQkxFXCIpKX0sMCk6KGI9bmV3IChiLnNoaWZ0KCkpKGQuTGMpLGQ9QWEoZC51YiksZC52PVwianMtMS4xLjNcIixkLnRyYW5zcG9ydD1iLkFiKCksZC5zdXBwcmVzc19zdGF0dXNfY29kZXM9ITAsYT13ZSgpK1wiL1wiK2EuRC5UYStjLGIub3BlbihhLGQsZnVuY3Rpb24oYSxiKXtpZihhKVAoZSxhKTtlbHNlIGlmKGImJmIuZXJyb3Ipe3ZhciBjPUVycm9yKGIuZXJyb3IubWVzc2FnZSk7Yy5jb2RlPWIuZXJyb3IuY29kZTtjLmRldGFpbHM9Yi5lcnJvci5kZXRhaWxzO1AoZSxjKX1lbHNlIFAoZSxudWxsLGIpfSkpfVxuZnVuY3Rpb24gSmUoYSxiKXt2YXIgYz1udWxsIT09YS5NYXx8bnVsbCE9PWI7YS5NYT1iO2MmJmEuTWMoXCJhdXRoX3N0YXR1c1wiLGIpO2EuamQobnVsbCE9PWIpfWsuY2Q9ZnVuY3Rpb24oYSl7dihcImF1dGhfc3RhdHVzXCI9PT1hLCdpbml0aWFsIGV2ZW50IG11c3QgYmUgb2YgdHlwZSBcImF1dGhfc3RhdHVzXCInKTtyZXR1cm5bdGhpcy5NYV19O2Z1bmN0aW9uIFBlKGEpe3ZhciBiPWEuRDtpZihcImZpcmViYXNlaW8uY29tXCIhPT1iLmRvbWFpbiYmXCJmaXJlYmFzZWlvLWRlbW8uY29tXCIhPT1iLmRvbWFpbiYmXCJhdXRoLmZpcmViYXNlLmNvbVwiPT09bGUpdGhyb3cgRXJyb3IoXCJUaGlzIGN1c3RvbSBGaXJlYmFzZSBzZXJ2ZXIgKCdcIithLkQuZG9tYWluK1wiJykgZG9lcyBub3Qgc3VwcG9ydCBkZWxlZ2F0ZWQgbG9naW4uXCIpO307ZnVuY3Rpb24gVGUoKXt0aGlzLmhiPVtdfWZ1bmN0aW9uIFVlKGEsYil7aWYoMCE9PWIubGVuZ3RoKWZvcih2YXIgYz0wO2M8Yi5sZW5ndGg7YysrKWEuaGIucHVzaChiW2NdKX1UZS5wcm90b3R5cGUuVmI9ZnVuY3Rpb24oKXtmb3IodmFyIGE9MDthPHRoaXMuaGIubGVuZ3RoO2ErKylpZih0aGlzLmhiW2FdKXt2YXIgYj10aGlzLmhiW2FdO3RoaXMuaGJbYV09bnVsbDtWZShiKX10aGlzLmhiPVtdfTtmdW5jdGlvbiBWZShhKXt2YXIgYj1hLmNhLGM9YS4kZCxkPWEuVWI7c2MoZnVuY3Rpb24oKXtiKGMsZCl9KX07ZnVuY3Rpb24gWChhLGIsYyxkKXt0aGlzLnR5cGU9YTt0aGlzLnhhPWI7dGhpcy5kYT1jO3RoaXMuVWI9ZH07ZnVuY3Rpb24gV2UoYSl7dGhpcy5TPWE7dGhpcy5zYT1bXTt0aGlzLlpjPW5ldyBUZX1mdW5jdGlvbiBYZShhLGIsYyxkLGUpe2Euc2EucHVzaCh7dHlwZTpiLGNhOmMsY2FuY2VsOmQsJDplfSk7ZD1bXTt2YXIgZj1ZZShhLmopO2EuR2ImJmYucHVzaChuZXcgWChcInZhbHVlXCIsYS5qKSk7Zm9yKHZhciBnPTA7ZzxmLmxlbmd0aDtnKyspaWYoZltnXS50eXBlPT09Yil7dmFyIGg9bmV3IEcoYS5TLmksYS5TLnBhdGgpO2ZbZ10uZGEmJihoPWguSihmW2ddLmRhKSk7ZC5wdXNoKHtjYTpvYyhjLGUpLCRkOm5ldyBUKGZbZ10ueGEsaCksVWI6ZltnXS5VYn0pfVVlKGEuWmMsZCl9V2UucHJvdG90eXBlLkFjPWZ1bmN0aW9uKGEsYil7Yj10aGlzLkJjKGEsYik7bnVsbCE9YiYmWmUodGhpcyxiKX07XG5mdW5jdGlvbiBaZShhLGIpe2Zvcih2YXIgYz1bXSxkPTA7ZDxiLmxlbmd0aDtkKyspe3ZhciBlPWJbZF0sZj1lLnR5cGUsZz1uZXcgRyhhLlMuaSxhLlMucGF0aCk7YltkXS5kYSYmKGc9Zy5KKGJbZF0uZGEpKTtnPW5ldyBUKGJbZF0ueGEsZyk7XCJ2YWx1ZVwiIT09ZS50eXBlfHxnLkZiKCk/XCJ2YWx1ZVwiIT09ZS50eXBlJiYoZis9XCIgXCIrZy5uYW1lKCkpOmYrPVwiKFwiK2cuWCgpK1wiKVwiO00oYS5TLmkubi5pZCtcIjogZXZlbnQ6XCIrYS5TLnBhdGgrXCI6XCIrYS5TLldhKCkrXCI6XCIrZik7Zm9yKGY9MDtmPGEuc2EubGVuZ3RoO2YrKyl7dmFyIGg9YS5zYVtmXTtiW2RdLnR5cGU9PT1oLnR5cGUmJmMucHVzaCh7Y2E6b2MoaC5jYSxoLiQpLCRkOmcsVWI6ZS5VYn0pfX1VZShhLlpjLGMpfVdlLnByb3RvdHlwZS5WYj1mdW5jdGlvbigpe3RoaXMuWmMuVmIoKX07XG5mdW5jdGlvbiBZZShhKXt2YXIgYj1bXTtpZighYS5RKCkpe3ZhciBjPW51bGw7YS5CKGZ1bmN0aW9uKGEsZSl7Yi5wdXNoKG5ldyBYKFwiY2hpbGRfYWRkZWRcIixlLGEsYykpO2M9YX0pfXJldHVybiBifWZ1bmN0aW9uICRlKGEpe2EuR2J8fChhLkdiPSEwLFplKGEsW25ldyBYKFwidmFsdWVcIixhLmopXSkpfTtmdW5jdGlvbiBhZihhLGIpe1dlLmNhbGwodGhpcyxhKTt0aGlzLmo9Yn1uYShhZixXZSk7YWYucHJvdG90eXBlLkJjPWZ1bmN0aW9uKGEsYil7dGhpcy5qPWE7dGhpcy5HYiYmbnVsbCE9YiYmYi5wdXNoKG5ldyBYKFwidmFsdWVcIix0aGlzLmopKTtyZXR1cm4gYn07YWYucHJvdG90eXBlLkViPWZ1bmN0aW9uKCl7cmV0dXJue319O2Z1bmN0aW9uIGJmKGEsYil7dGhpcy5qYz1hO3RoaXMua2Q9Yn1mdW5jdGlvbiBjZihhLGIsYyxkLGUpe3ZhciBmPWEuTihjKSxnPWIuTihjKTtkPW5ldyBiZihkLGUpO2U9ZGYoZCxjLGYsZyk7Zz0hZi5mKCkmJiFnLmYoKSYmZi5tKCkhPT1nLm0oKTtpZihlfHxnKWZvcihmPWMsYz1lO251bGwhPT1mLnBhcmVudCgpOyl7dmFyIGg9YS5OKGYpO2U9Yi5OKGYpO3ZhciBtPWYucGFyZW50KCk7aWYoIWQuamN8fEkoZC5qYyxtKS5rKCkpe3ZhciBuPWIuTihtKSxxPVtdLGY9VWEoZik7aC5mKCk/KGg9bi5oYShmLGUpLHEucHVzaChuZXcgWChcImNoaWxkX2FkZGVkXCIsZSxmLGgpKSk6ZS5mKCk/cS5wdXNoKG5ldyBYKFwiY2hpbGRfcmVtb3ZlZFwiLGgsZikpOihoPW4uaGEoZixlKSxnJiZxLnB1c2gobmV3IFgoXCJjaGlsZF9tb3ZlZFwiLGUsZixoKSksYyYmcS5wdXNoKG5ldyBYKFwiY2hpbGRfY2hhbmdlZFwiLGUsZixoKSkpO2Qua2QobSxuLHEpfWcmJihnPSExLGM9ITApO2Y9bX19XG5mdW5jdGlvbiBkZihhLGIsYyxkKXt2YXIgZSxmPVtdO2M9PT1kP2U9ITE6Yy5RKCkmJmQuUSgpP2U9Yy5rKCkhPT1kLmsoKTpjLlEoKT8oZWYoYSxiLFEsZCxmKSxlPSEwKTpkLlEoKT8oZWYoYSxiLGMsUSxmKSxlPSEwKTplPWVmKGEsYixjLGQsZik7ZT9hLmtkKGIsZCxmKTpjLm0oKSE9PWQubSgpJiZhLmtkKGIsZCxudWxsKTtyZXR1cm4gZX1cbmZ1bmN0aW9uIGVmKGEsYixjLGQsZSl7dmFyIGY9ITEsZz0hYS5qY3x8IUkoYS5qYyxiKS5mKCksaD1bXSxtPVtdLG49W10scT1bXSxzPXt9LHQ9e30sdyxhYSxLLE47dz1jLmpiKCk7Sz1nYih3KTthYT1kLmpiKCk7Zm9yKE49Z2IoYWEpO251bGwhPT1LfHxudWxsIT09Tjspe2M9TjtjPW51bGw9PT1LPzE6bnVsbD09PWM/LTE6Sy5rZXk9PT1jLmtleT8wOnZjKHtuYW1lOksua2V5LGxhOksudmFsdWUubSgpfSx7bmFtZTpjLmtleSxsYTpjLnZhbHVlLm0oKX0pO2lmKDA+YylmPUIocyxLLmtleSksbChmKT8obi5wdXNoKHthZDpLLHpkOmhbZl19KSxoW2ZdPW51bGwpOih0W0sua2V5XT1tLmxlbmd0aCxtLnB1c2goSykpLGY9ITAsSz1nYih3KTtlbHNle2lmKDA8YylmPUIodCxOLmtleSksbChmKT8obi5wdXNoKHthZDptW2ZdLHpkOk59KSxtW2ZdPW51bGwpOihzW04ua2V5XT1oLmxlbmd0aCxoLnB1c2goTikpLGY9ITA7ZWxzZXtjPWIuSihOLmtleSk7aWYoYz1kZihhLGMsSy52YWx1ZSxcbk4udmFsdWUpKXEucHVzaChOKSxmPSEwO0sudmFsdWUubSgpIT09Ti52YWx1ZS5tKCkmJihuLnB1c2goe2FkOkssemQ6Tn0pLGY9ITApO0s9Z2Iodyl9Tj1nYihhYSl9aWYoIWcmJmYpcmV0dXJuITB9Zm9yKGc9MDtnPG0ubGVuZ3RoO2crKylpZihzPW1bZ10pYz1iLkoocy5rZXkpLGRmKGEsYyxzLnZhbHVlLFEpLGUucHVzaChuZXcgWChcImNoaWxkX3JlbW92ZWRcIixzLnZhbHVlLHMua2V5KSk7Zm9yKGc9MDtnPGgubGVuZ3RoO2crKylpZihzPWhbZ10pYz1iLkoocy5rZXkpLG09ZC5oYShzLmtleSxzLnZhbHVlKSxkZihhLGMsUSxzLnZhbHVlKSxlLnB1c2gobmV3IFgoXCJjaGlsZF9hZGRlZFwiLHMudmFsdWUscy5rZXksbSkpO2ZvcihnPTA7ZzxuLmxlbmd0aDtnKyspcz1uW2ddLmFkLGg9bltnXS56ZCxjPWIuSihoLmtleSksbT1kLmhhKGgua2V5LGgudmFsdWUpLGUucHVzaChuZXcgWChcImNoaWxkX21vdmVkXCIsaC52YWx1ZSxoLmtleSxtKSksKGM9ZGYoYSxjLHMudmFsdWUsaC52YWx1ZSkpJiZcbnEucHVzaChoKTtmb3IoZz0wO2c8cS5sZW5ndGg7ZysrKWE9cVtnXSxtPWQuaGEoYS5rZXksYS52YWx1ZSksZS5wdXNoKG5ldyBYKFwiY2hpbGRfY2hhbmdlZFwiLGEudmFsdWUsYS5rZXksbSkpO3JldHVybiBmfTtmdW5jdGlvbiBmZigpe3RoaXMuWj10aGlzLkFhPW51bGw7dGhpcy5zZXQ9e319bmEoZmYsZGQpO2s9ZmYucHJvdG90eXBlO2suc2V0QWN0aXZlPWZ1bmN0aW9uKGEpe3RoaXMuQWE9YX07ZnVuY3Rpb24gZ2YoYSxiLGMpe2EuYWRkKGIsYyk7YS5afHwoYS5aPWMuUy5wYXRoKX1mdW5jdGlvbiBoZihhKXt2YXIgYj1hLkFhO2EuQWE9bnVsbDtyZXR1cm4gYn1mdW5jdGlvbiBqZihhKXtyZXR1cm4gYS5jb250YWlucyhcImRlZmF1bHRcIil9ZnVuY3Rpb24ga2YoYSl7cmV0dXJuIG51bGwhPWEuQWEmJmpmKGEpfWsuZGVmYXVsdFZpZXc9ZnVuY3Rpb24oKXtyZXR1cm4gamYodGhpcyk/dGhpcy5nZXQoXCJkZWZhdWx0XCIpOm51bGx9O2sucGF0aD1mdW5jdGlvbigpe3JldHVybiB0aGlzLlp9O2sudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gRmIodGhpcy5rZXlzKCksZnVuY3Rpb24oYSl7cmV0dXJuXCJkZWZhdWx0XCI9PT1hP1wie31cIjphfSkuam9pbihcIiRcIil9O1xuay5xYj1mdW5jdGlvbigpe3ZhciBhPVtdO2VkKHRoaXMsZnVuY3Rpb24oYixjKXthLnB1c2goYy5TKX0pO3JldHVybiBhfTtmdW5jdGlvbiBsZihhLGIpe1dlLmNhbGwodGhpcyxhKTt0aGlzLmo9UTt0aGlzLkJjKGIsWWUoYikpfW5hKGxmLFdlKTtcbmxmLnByb3RvdHlwZS5CYz1mdW5jdGlvbihhLGIpe2lmKG51bGw9PT1iKXJldHVybiBiO3ZhciBjPVtdLGQ9dGhpcy5TO2woZC5mYSkmJihsKGQuemEpJiZudWxsIT1kLnphP2MucHVzaChmdW5jdGlvbihhLGIpe3ZhciBjPWhjKGIsZC5mYSk7cmV0dXJuIDA8Y3x8MD09PWMmJjA8PWljKGEsZC56YSl9KTpjLnB1c2goZnVuY3Rpb24oYSxiKXtyZXR1cm4gMDw9aGMoYixkLmZhKX0pKTtsKGQuRWEpJiYobChkLmZiKT9jLnB1c2goZnVuY3Rpb24oYSxiKXt2YXIgYz1oYyhiLGQuRWEpO3JldHVybiAwPmN8fDA9PT1jJiYwPj1pYyhhLGQuZmIpfSk6Yy5wdXNoKGZ1bmN0aW9uKGEsYil7cmV0dXJuIDA+PWhjKGIsZC5FYSl9KSk7dmFyIGU9bnVsbCxmPW51bGw7aWYobCh0aGlzLlMuR2EpKWlmKGwodGhpcy5TLmZhKSl7aWYoZT1tZihhLGMsdGhpcy5TLkdhLCExKSl7dmFyIGc9YS5QKGUpLm0oKTtjLnB1c2goZnVuY3Rpb24oYSxiKXt2YXIgYz1oYyhiLGcpO3JldHVybiAwPmN8fDA9PT1jJiZcbjA+PWljKGEsZSl9KX19ZWxzZSBpZihmPW1mKGEsYyx0aGlzLlMuR2EsITApKXt2YXIgaD1hLlAoZikubSgpO2MucHVzaChmdW5jdGlvbihhLGIpe3ZhciBjPWhjKGIsaCk7cmV0dXJuIDA8Y3x8MD09PWMmJjA8PWljKGEsZil9KX1mb3IodmFyIG09W10sbj1bXSxxPVtdLHM9W10sdD0wO3Q8Yi5sZW5ndGg7dCsrKXt2YXIgdz1iW3RdLmRhLGFhPWJbdF0ueGE7c3dpdGNoKGJbdF0udHlwZSl7Y2FzZSBcImNoaWxkX2FkZGVkXCI6bmYoYyx3LGFhKSYmKHRoaXMuaj10aGlzLmouSyh3LGFhKSxuLnB1c2goYlt0XSkpO2JyZWFrO2Nhc2UgXCJjaGlsZF9yZW1vdmVkXCI6dGhpcy5qLlAodykuZigpfHwodGhpcy5qPXRoaXMuai5LKHcsbnVsbCksbS5wdXNoKGJbdF0pKTticmVhaztjYXNlIFwiY2hpbGRfY2hhbmdlZFwiOiF0aGlzLmouUCh3KS5mKCkmJm5mKGMsdyxhYSkmJih0aGlzLmo9dGhpcy5qLksodyxhYSkscy5wdXNoKGJbdF0pKTticmVhaztjYXNlIFwiY2hpbGRfbW92ZWRcIjp2YXIgSz0hdGhpcy5qLlAodykuZigpLFxuTj1uZihjLHcsYWEpO0s/Tj8odGhpcy5qPXRoaXMuai5LKHcsYWEpLHEucHVzaChiW3RdKSk6KG0ucHVzaChuZXcgWChcImNoaWxkX3JlbW92ZWRcIix0aGlzLmouUCh3KSx3KSksdGhpcy5qPXRoaXMuai5LKHcsbnVsbCkpOk4mJih0aGlzLmo9dGhpcy5qLksodyxhYSksbi5wdXNoKGJbdF0pKX19dmFyIENkPWV8fGY7aWYoQ2Qpe3ZhciBEZD0odD1udWxsIT09Zik/dGhpcy5qLkpkKCk6dGhpcy5qLktkKCksUGM9ITEscmI9ITEsc2I9dGhpczsodD9hLiRjOmEuQikuY2FsbChhLGZ1bmN0aW9uKGEsYil7cmJ8fG51bGwhPT1EZHx8KHJiPSEwKTtpZihyYiYmUGMpcmV0dXJuITA7UGM/KG0ucHVzaChuZXcgWChcImNoaWxkX3JlbW92ZWRcIixzYi5qLlAoYSksYSkpLHNiLmo9c2Iuai5LKGEsbnVsbCkpOnJiJiYobi5wdXNoKG5ldyBYKFwiY2hpbGRfYWRkZWRcIixiLGEpKSxzYi5qPXNiLmouSyhhLGIpKTtEZD09PWEmJihyYj0hMCk7YT09PUNkJiYoUGM9ITApfSl9Zm9yKHQ9MDt0PG4ubGVuZ3RoO3QrKyljPVxublt0XSx3PXRoaXMuai5oYShjLmRhLGMueGEpLG0ucHVzaChuZXcgWChcImNoaWxkX2FkZGVkXCIsYy54YSxjLmRhLHcpKTtmb3IodD0wO3Q8cS5sZW5ndGg7dCsrKWM9cVt0XSx3PXRoaXMuai5oYShjLmRhLGMueGEpLG0ucHVzaChuZXcgWChcImNoaWxkX21vdmVkXCIsYy54YSxjLmRhLHcpKTtmb3IodD0wO3Q8cy5sZW5ndGg7dCsrKWM9c1t0XSx3PXRoaXMuai5oYShjLmRhLGMueGEpLG0ucHVzaChuZXcgWChcImNoaWxkX2NoYW5nZWRcIixjLnhhLGMuZGEsdykpO3RoaXMuR2ImJjA8bS5sZW5ndGgmJm0ucHVzaChuZXcgWChcInZhbHVlXCIsdGhpcy5qKSk7cmV0dXJuIG19O2Z1bmN0aW9uIG1mKGEsYixjLGQpe2lmKGEuUSgpKXJldHVybiBudWxsO3ZhciBlPW51bGw7KGQ/YS4kYzphLkIpLmNhbGwoYSxmdW5jdGlvbihhLGQpe2lmKG5mKGIsYSxkKSYmKGU9YSxjLS0sMD09PWMpKXJldHVybiEwfSk7cmV0dXJuIGV9XG5mdW5jdGlvbiBuZihhLGIsYyl7Zm9yKHZhciBkPTA7ZDxhLmxlbmd0aDtkKyspaWYoIWFbZF0oYixjLm0oKSkpcmV0dXJuITE7cmV0dXJuITB9bGYucHJvdG90eXBlLmVkPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmouUChhKSE9PVF9O1xubGYucHJvdG90eXBlLkViPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD17fTt0aGlzLmouUSgpfHx0aGlzLmouQihmdW5jdGlvbihhKXtkW2FdPTN9KTt2YXIgZT10aGlzLmo7Yz1VKGMsbmV3IEgoXCJcIikpO3ZhciBmPW5ldyBYYTtZYShJKGYsdGhpcy5TLnBhdGgpLCEwKTtiPVEuQmEoYSxiKTt2YXIgZz10aGlzO2NmKGMsYixhLGYsZnVuY3Rpb24oYSxiLGMpe251bGwhPT1jJiZhLnRvU3RyaW5nKCk9PT1nLlMucGF0aC50b1N0cmluZygpJiZnLkJjKGIsYyl9KTt0aGlzLmouUSgpP25jKGQsZnVuY3Rpb24oYSxiKXtkW2JdPTJ9KToodGhpcy5qLkIoZnVuY3Rpb24oYSl7QShkLGEpfHwoZFthXT0xKX0pLG5jKGQsZnVuY3Rpb24oYSxiKXtnLmouUChiKS5mKCkmJihkW2JdPTIpfSkpO3RoaXMuaj1lO3JldHVybiBkfTtmdW5jdGlvbiBvZihhLGIpe3RoaXMubj1hO3RoaXMuZz1iO3RoaXMucmM9Yi5iYTt0aGlzLnBhPW5ldyBYYX1vZi5wcm90b3R5cGUuZWM9ZnVuY3Rpb24oYSxiLGMsZCxlKXt2YXIgZj1hLnBhdGgsZz1JKHRoaXMucGEsZiksaD1nLmsoKTtudWxsPT09aD8oaD1uZXcgZmYsWWEoZyxoKSk6dighaC5mKCksXCJXZSBzaG91bGRuJ3QgYmUgc3RvcmluZyBlbXB0eSBRdWVyeU1hcHNcIik7dmFyIG09YS5XYSgpO2lmKGguY29udGFpbnMobSkpYT1oLmdldChtKSxYZShhLGIsYyxkLGUpO2Vsc2V7dmFyIG49dGhpcy5nLmJhLk4oZik7YT1wZihhLG4pO3FmKHRoaXMsZyxoLG0sYSk7WGUoYSxiLGMsZCxlKTsoYj0oYj1hYihJKHRoaXMucGEsZiksZnVuY3Rpb24oYSl7dmFyIGI7aWYoYj1hLmsoKSYmYS5rKCkuZGVmYXVsdFZpZXcoKSliPWEuaygpLmRlZmF1bHRWaWV3KCkuR2I7aWYoYilyZXR1cm4hMH0sITApKXx8bnVsbD09PXRoaXMubiYmIVUodGhpcy5nLGYpLmYoKSkmJiRlKGEpfWEuVmIoKX07XG5mdW5jdGlvbiByZihhLGIsYyxkLGUpe3ZhciBmPWEuZ2V0KGIpLGc7aWYoZz1mKXtnPSExO2Zvcih2YXIgaD1mLnNhLmxlbmd0aC0xOzA8PWg7aC0tKXt2YXIgbT1mLnNhW2hdO2lmKCEoYyYmbS50eXBlIT09Y3x8ZCYmbS5jYSE9PWR8fGUmJm0uJCE9PWUpJiYoZi5zYS5zcGxpY2UoaCwxKSxnPSEwLGMmJmQpKWJyZWFrfX0oYz1nJiYhKDA8Zi5zYS5sZW5ndGgpKSYmYS5yZW1vdmUoYik7cmV0dXJuIGN9ZnVuY3Rpb24gc2YoYSxiLGMsZCxlKXtiPWI/Yi5XYSgpOm51bGw7dmFyIGY9W107YiYmXCJkZWZhdWx0XCIhPT1iP3JmKGEsYixjLGQsZSkmJmYucHVzaChiKTpEYihhLmtleXMoKSxmdW5jdGlvbihiKXtyZihhLGIsYyxkLGUpJiZmLnB1c2goYil9KTtyZXR1cm4gZn1vZi5wcm90b3R5cGUuRGM9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9SSh0aGlzLnBhLGEucGF0aCkuaygpO3JldHVybiBudWxsPT09ZT9udWxsOnRmKHRoaXMsZSxhLGIsYyxkKX07XG5mdW5jdGlvbiB0ZihhLGIsYyxkLGUsZil7dmFyIGc9Yi5wYXRoKCksZz1JKGEucGEsZyk7Yz1zZihiLGMsZCxlLGYpO2IuZigpJiZZYShnLG51bGwpO2Q9dWYoZyk7aWYoMDxjLmxlbmd0aCYmIWQpe2Q9ZztlPWcucGFyZW50KCk7Zm9yKGM9ITE7IWMmJmU7KXtpZihmPWUuaygpKXt2KCFrZihmKSk7dmFyIGg9ZC5uYW1lKCksbT0hMTtlZChmLGZ1bmN0aW9uKGEsYil7bT1iLmVkKGgpfHxtfSk7bSYmKGM9ITApfWQ9ZTtlPWUucGFyZW50KCl9ZD1udWxsO2tmKGIpfHwoYj1oZihiKSxkPXZmKGEsZyksYiYmYigpKTtyZXR1cm4gYz9udWxsOmR9cmV0dXJuIG51bGx9ZnVuY3Rpb24gd2YoYSxiLGMpeyRhKEkoYS5wYSxiKSxmdW5jdGlvbihhKXsoYT1hLmsoKSkmJmVkKGEsZnVuY3Rpb24oYSxiKXskZShiKX0pfSxjLCEwKX1cbmZ1bmN0aW9uIHhmKGEsYixjKXtmdW5jdGlvbiBkKGEpe2Rve2lmKGdbYS50b1N0cmluZygpXSlyZXR1cm4hMDthPWEucGFyZW50KCl9d2hpbGUobnVsbCE9PWEpO3JldHVybiExfXZhciBlPWEucmMsZj1hLmcuYmE7YS5yYz1mO2Zvcih2YXIgZz17fSxoPTA7aDxjLmxlbmd0aDtoKyspZ1tjW2hdLnRvU3RyaW5nKCldPSEwO2NmKGUsZixiLGEucGEsZnVuY3Rpb24oYyxlLGYpe2lmKGIuY29udGFpbnMoYykpe3ZhciBnPWQoYyk7ZyYmd2YoYSxjLCExKTthLkFjKGMsZSxmKTtnJiZ3ZihhLGMsITApfWVsc2UgYS5BYyhjLGUsZil9KTtkKGIpJiZ3ZihhLGIsITApO3lmKGEsYil9ZnVuY3Rpb24geWYoYSxiKXt2YXIgYz1JKGEucGEsYik7JGEoYyxmdW5jdGlvbihhKXsoYT1hLmsoKSkmJmVkKGEsZnVuY3Rpb24oYSxiKXtiLlZiKCl9KX0sITAsITApO2FiKGMsZnVuY3Rpb24oYSl7KGE9YS5rKCkpJiZlZChhLGZ1bmN0aW9uKGEsYil7Yi5WYigpfSl9LCExKX1cbm9mLnByb3RvdHlwZS5BYz1mdW5jdGlvbihhLGIsYyl7YT1JKHRoaXMucGEsYSkuaygpO251bGwhPT1hJiZlZChhLGZ1bmN0aW9uKGEsZSl7ZS5BYyhiLGMpfSl9O2Z1bmN0aW9uIHVmKGEpe3JldHVybiBhYihhLGZ1bmN0aW9uKGEpe3JldHVybiBhLmsoKSYma2YoYS5rKCkpfSl9ZnVuY3Rpb24gcWYoYSxiLGMsZCxlKXtpZihrZihjKXx8dWYoYikpZ2YoYyxkLGUpO2Vsc2V7dmFyIGYsZztjLmYoKXx8KGY9Yy50b1N0cmluZygpLGc9Yy5xYigpKTtnZihjLGQsZSk7Yy5zZXRBY3RpdmUoemYoYSxjKSk7ZiYmZyYmUWQoYS5uLGMucGF0aCgpLGYsZyl9a2YoYykmJiRhKGIsZnVuY3Rpb24oYSl7aWYoYT1hLmsoKSlhLkFhJiZhLkFhKCksYS5BYT1udWxsfSl9XG5mdW5jdGlvbiB2ZihhLGIpe2Z1bmN0aW9uIGMoYil7dmFyIGY9Yi5rKCk7aWYoZiYmamYoZikpZC5wdXNoKGYucGF0aCgpKSxudWxsPT1mLkFhJiZmLnNldEFjdGl2ZSh6ZihhLGYpKTtlbHNle2lmKGYpe251bGwhPWYuQWF8fGYuc2V0QWN0aXZlKHpmKGEsZikpO3ZhciBnPXt9O2VkKGYsZnVuY3Rpb24oYSxiKXtiLmouQihmdW5jdGlvbihhKXtBKGcsYSl8fChnW2FdPSEwLGE9Zi5wYXRoKCkuSihhKSxkLnB1c2goYSkpfSl9KX1iLkIoYyl9fXZhciBkPVtdO2MoYik7cmV0dXJuIGR9XG5mdW5jdGlvbiB6ZihhLGIpe2lmKGEubil7dmFyIGM9YS5uLGQ9Yi5wYXRoKCksZT1iLnRvU3RyaW5nKCksZj1iLnFiKCksZyxoPWIua2V5cygpLG09amYoYik7TWQoYS5uLGIsZnVuY3Rpb24oYyl7XCJva1wiIT09Yz8oYz1xYyhjKSxPKFwib24oKSBvciBvbmNlKCkgZm9yIFwiK2IucGF0aCgpLnRvU3RyaW5nKCkrXCIgZmFpbGVkOiBcIitjLnRvU3RyaW5nKCkpLEFmKGEsYixjKSk6Z3x8KG0/d2YoYSxiLnBhdGgoKSwhMCk6RGIoaCxmdW5jdGlvbihhKXsoYT1iLmdldChhKSkmJiRlKGEpfSkseWYoYSxiLnBhdGgoKSkpfSk7cmV0dXJuIGZ1bmN0aW9uKCl7Zz0hMDtRZChjLGQsZSxmKX19cmV0dXJuIGNhfWZ1bmN0aW9uIEFmKGEsYixjKXtiJiYoZWQoYixmdW5jdGlvbihhLGIpe2Zvcih2YXIgZj0wO2Y8Yi5zYS5sZW5ndGg7ZisrKXt2YXIgZz1iLnNhW2ZdO2cuY2FuY2VsJiZvYyhnLmNhbmNlbCxnLiQpKGMpfX0pLHRmKGEsYikpfVxuZnVuY3Rpb24gcGYoYSxiKXtyZXR1cm5cImRlZmF1bHRcIj09PWEuV2EoKT9uZXcgYWYoYSxiKTpuZXcgbGYoYSxiKX1vZi5wcm90b3R5cGUuRWI9ZnVuY3Rpb24oYSxiLGMsZCl7ZnVuY3Rpb24gZShhKXtuYyhhLGZ1bmN0aW9uKGEsYil7ZltiXT0zPT09YT8zOihCKGYsYil8fGEpPT09YT9hOjN9KX12YXIgZj17fTtlZChiLGZ1bmN0aW9uKGIsZil7ZShmLkViKGEsYyxkKSl9KTtjLlEoKXx8Yy5CKGZ1bmN0aW9uKGEpe0EoZixhKXx8KGZbYV09NCl9KTtyZXR1cm4gZn07ZnVuY3Rpb24gQmYoYSxiLGMsZCxlKXt2YXIgZj1iLnBhdGgoKTtiPWEuRWIoZixiLGQsZSk7dmFyIGc9USxoPVtdO25jKGIsZnVuY3Rpb24oYixuKXt2YXIgcT1uZXcgSChuKTszPT09Ynx8MT09PWI/Zz1nLksobixkLk4ocSkpOigyPT09YiYmaC5wdXNoKHtwYXRoOmYuSihuKSx1YTpRfSksaD1oLmNvbmNhdChDZihhLGQuTihxKSxJKGMscSksZSkpKX0pO3JldHVyblt7cGF0aDpmLHVhOmd9XS5jb25jYXQoaCl9XG5mdW5jdGlvbiBEZihhLGIsYyxkKXt2YXIgZTthOnt2YXIgZj1JKGEucGEsYik7ZT1mLnBhcmVudCgpO2Zvcih2YXIgZz1bXTtudWxsIT09ZTspe3ZhciBoPWUuaygpO2lmKG51bGwhPT1oKXtpZihqZihoKSl7ZT1be3BhdGg6Yix1YTpjfV07YnJlYWsgYX1oPWEuRWIoYixoLGMsZCk7Zj1CKGgsZi5uYW1lKCkpO2lmKDM9PT1mfHwxPT09Zil7ZT1be3BhdGg6Yix1YTpjfV07YnJlYWsgYX0yPT09ZiYmZy5wdXNoKHtwYXRoOmIsdWE6UX0pfWY9ZTtlPWUucGFyZW50KCl9ZT1nfWlmKDE9PWUubGVuZ3RoJiYoIWVbMF0udWEuZigpfHxjLmYoKSkpcmV0dXJuIGU7Zz1JKGEucGEsYik7Zj1nLmsoKTtudWxsIT09Zj9qZihmKT9lLnB1c2goe3BhdGg6Yix1YTpjfSk6ZT1lLmNvbmNhdChCZihhLGYsZyxjLGQpKTplPWUuY29uY2F0KENmKGEsYyxnLGQpKTtyZXR1cm4gZX1cbmZ1bmN0aW9uIENmKGEsYixjLGQpe3ZhciBlPWMuaygpO2lmKG51bGwhPT1lKXJldHVybiBqZihlKT9be3BhdGg6Yy5wYXRoKCksdWE6Yn1dOkJmKGEsZSxjLGIsZCk7dmFyIGY9W107Yy5CKGZ1bmN0aW9uKGMpe3ZhciBlPWIuUSgpP1E6Yi5QKGMubmFtZSgpKTtjPUNmKGEsZSxjLGQpO2Y9Zi5jb25jYXQoYyl9KTtyZXR1cm4gZn07ZnVuY3Rpb24gRWYoYSl7dGhpcy5EPWE7dGhpcy5nYT1VYyhhKTt0aGlzLm49bmV3IElkKHRoaXMuRCxyKHRoaXMudWMsdGhpcykscih0aGlzLnNjLHRoaXMpLHIodGhpcy5uZCx0aGlzKSxyKHRoaXMuZGQsdGhpcykpO3RoaXMuYmU9VmMoYSxyKGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBSYyh0aGlzLmdhLHRoaXMubil9LHRoaXMpKTt0aGlzLiRhPW5ldyBYYTt0aGlzLkthPW5ldyBjZTt0aGlzLmc9bmV3IGRlO3RoaXMuTD1uZXcgb2YodGhpcy5uLHRoaXMuZy5xYSk7dGhpcy5mZD1uZXcgY2U7dGhpcy5nZD1uZXcgb2YobnVsbCx0aGlzLmZkKTtGZih0aGlzLFwiY29ubmVjdGVkXCIsITEpO3RoaXMuVT1uZXcgJGQ7dGhpcy5JPW5ldyBHZShhLHIodGhpcy5uLkksdGhpcy5uKSxyKHRoaXMubi5CZCx0aGlzLm4pLHIodGhpcy5qZCx0aGlzKSk7dGhpcy5pYz0wfWs9RWYucHJvdG90eXBlO1xuay50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybih0aGlzLkQuWWE/XCJodHRwczovL1wiOlwiaHR0cDovL1wiKSt0aGlzLkQuaG9zdH07ay5uYW1lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuRC5UYX07ZnVuY3Rpb24gR2YoYSl7YT1VKGEuZmQsbmV3IEgoXCIuaW5mby9zZXJ2ZXJUaW1lT2Zmc2V0XCIpKS5YKCl8fDA7cmV0dXJuKG5ldyBEYXRlKS5nZXRUaW1lKCkrYX1mdW5jdGlvbiBIZihhKXthPWE9e3RpbWVzdGFtcDpHZihhKX07YS50aW1lc3RhbXA9YS50aW1lc3RhbXB8fChuZXcgRGF0ZSkuZ2V0VGltZSgpO3JldHVybiBhfVxuay51Yz1mdW5jdGlvbihhLGIsYyl7dGhpcy5pYysrO3RoaXMuTWQmJihiPXRoaXMuTWQoYSxiKSk7dmFyIGQsZSxmPVtdOzk8PWEubGVuZ3RoJiZhLmxhc3RJbmRleE9mKFwiLnByaW9yaXR5XCIpPT09YS5sZW5ndGgtOT8oZD1uZXcgSChhLnN1YnN0cmluZygwLGEubGVuZ3RoLTkpKSxlPVUodGhpcy5nLndhLGQpLkxhKGIpLGYucHVzaChkKSk6Yz8oZD1uZXcgSChhKSxlPVUodGhpcy5nLndhLGQpLG5jKGIsZnVuY3Rpb24oYSxiKXt2YXIgYz1uZXcgSChiKTtcIi5wcmlvcml0eVwiPT09Yj9lPWUuTGEoYSk6KGU9ZS5CYShjLFMoYSkpLGYucHVzaChkLkooYikpKX0pKTooZD1uZXcgSChhKSxlPVMoYiksZi5wdXNoKGQpKTthPURmKHRoaXMuTCxkLGUsdGhpcy5nLk8pO2I9ITE7Zm9yKGM9MDtjPGEubGVuZ3RoOysrYyl7dmFyIGc9YVtjXTtiPWVlKHRoaXMuZyxnLnBhdGgsZy51YSl8fGJ9YiYmKGQ9SWYodGhpcyxkKSk7eGYodGhpcy5MLGQsZil9O1xuay5zYz1mdW5jdGlvbihhKXtGZih0aGlzLFwiY29ubmVjdGVkXCIsYSk7ITE9PT1hJiZKZih0aGlzKX07ay5uZD1mdW5jdGlvbihhKXt2YXIgYj10aGlzO21jKGEsZnVuY3Rpb24oYSxkKXtGZihiLGQsYSl9KX07ay5kZD1mdW5jdGlvbihhKXthPW5ldyBIKGEpO3JldHVybiBVKHRoaXMuZy53YSxhKS5oYXNoKCl9O2suamQ9ZnVuY3Rpb24oYSl7RmYodGhpcyxcImF1dGhlbnRpY2F0ZWRcIixhKX07ZnVuY3Rpb24gRmYoYSxiLGMpe2I9bmV3IEgoXCIvLmluZm8vXCIrYik7VihhLmZkLGIsUyhjKSk7eGYoYS5nZCxiLFtiXSl9XG5rLndiPWZ1bmN0aW9uKGEsYixjLGQpe3RoaXMuZShcInNldFwiLHtwYXRoOmEudG9TdHJpbmcoKSx2YWx1ZTpiLGxhOmN9KTt2YXIgZT1IZih0aGlzKTtiPVMoYixjKTt2YXIgZT1rZShiLGUpLGU9RGYodGhpcy5MLGEsZSx0aGlzLmcuTyksZj10aGlzLmcuc2V0KGEsZSksZz10aGlzO3RoaXMubi5wdXQoYS50b1N0cmluZygpLGIuWCghMCksZnVuY3Rpb24oYixjKXtcIm9rXCIhPT1iJiZPKFwic2V0IGF0IFwiK2ErXCIgZmFpbGVkOiBcIitiKTtoZShnLmcsZik7ZmUoZy5nLGEpO3ZhciBlPUlmKGcsYSk7eGYoZy5MLGUsW10pO0tmKGQsYixjKX0pO2U9TGYodGhpcyxhKTtJZih0aGlzLGUpO3hmKHRoaXMuTCxlLFthXSl9O1xuay51cGRhdGU9ZnVuY3Rpb24oYSxiLGMpe3RoaXMuZShcInVwZGF0ZVwiLHtwYXRoOmEudG9TdHJpbmcoKSx2YWx1ZTpifSk7dmFyIGQ9VSh0aGlzLmcucWEsYSksZT0hMCxmPVtdLGc9SGYodGhpcyksaD1bXSxtO2ZvcihtIGluIGIpe3ZhciBlPSExLG49UyhiW21dKSxuPWtlKG4sZyksZD1kLksobSxuKSxxPWEuSihtKTtmLnB1c2gocSk7bj1EZih0aGlzLkwscSxuLHRoaXMuZy5PKTtoPWguY29uY2F0KHRoaXMuZy5zZXQoYSxuKSl9aWYoZSlNKFwidXBkYXRlKCkgY2FsbGVkIHdpdGggZW1wdHkgZGF0YS4gIERvbid0IGRvIGFueXRoaW5nLlwiKSxLZihjLFwib2tcIik7ZWxzZXt2YXIgcz10aGlzO1dkKHRoaXMubixhLnRvU3RyaW5nKCksYixmdW5jdGlvbihiLGQpe1wib2tcIiE9PWImJk8oXCJ1cGRhdGUgYXQgXCIrYStcIiBmYWlsZWQ6IFwiK2IpO2hlKHMuZyxoKTtmZShzLmcsYSk7dmFyIGU9SWYocyxhKTt4ZihzLkwsZSxbXSk7S2YoYyxiLGQpfSk7Yj1MZih0aGlzLGEpO0lmKHRoaXMsYik7eGYocy5MLFxuYixmKX19O2sudmQ9ZnVuY3Rpb24oYSxiLGMpe3RoaXMuZShcInNldFByaW9yaXR5XCIse3BhdGg6YS50b1N0cmluZygpLGxhOmJ9KTt2YXIgZD1IZih0aGlzKSxkPWllKGIsZCksZD1VKHRoaXMuZy5PLGEpLkxhKGQpLGQ9RGYodGhpcy5MLGEsZCx0aGlzLmcuTyksZT10aGlzLmcuc2V0KGEsZCksZj10aGlzO3RoaXMubi5wdXQoYS50b1N0cmluZygpK1wiLy5wcmlvcml0eVwiLGIsZnVuY3Rpb24oYixkKXtcInBlcm1pc3Npb25fZGVuaWVkXCI9PT1iJiZPKFwic2V0UHJpb3JpdHkgYXQgXCIrYStcIiBmYWlsZWQ6IFwiK2IpO2hlKGYuZyxlKTtmZShmLmcsYSk7dmFyIG09SWYoZixhKTt4ZihmLkwsbSxbXSk7S2YoYyxiLGQpfSk7Yj1JZih0aGlzLGEpO3hmKGYuTCxiLFtdKX07XG5mdW5jdGlvbiBKZihhKXthLmUoXCJvbkRpc2Nvbm5lY3RFdmVudHNcIik7dmFyIGI9W10sYz1IZihhKTtiZShqZShhLlUsYyksbmV3IEgoXCJcIiksZnVuY3Rpb24oYyxlKXt2YXIgZj1EZihhLkwsYyxlLGEuZy5PKTtiLnB1c2guYXBwbHkoYixhLmcuc2V0KGMsZikpO2Y9TGYoYSxjKTtJZihhLGYpO3hmKGEuTCxmLFtjXSl9KTtoZShhLmcsYik7YS5VPW5ldyAkZH1rLmxkPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpczt0aGlzLm4ubGQoYS50b1N0cmluZygpLGZ1bmN0aW9uKGQsZSl7XCJva1wiPT09ZCYmYWUoYy5VLGEpO0tmKGIsZCxlKX0pfTtmdW5jdGlvbiBNZihhLGIsYyxkKXt2YXIgZT1TKGMpO1NkKGEubixiLnRvU3RyaW5nKCksZS5YKCEwKSxmdW5jdGlvbihjLGcpe1wib2tcIj09PWMmJmEuVS5yYihiLGUpO0tmKGQsYyxnKX0pfVxuZnVuY3Rpb24gTmYoYSxiLGMsZCxlKXt2YXIgZj1TKGMsZCk7U2QoYS5uLGIudG9TdHJpbmcoKSxmLlgoITApLGZ1bmN0aW9uKGMsZCl7XCJva1wiPT09YyYmYS5VLnJiKGIsZik7S2YoZSxjLGQpfSl9ZnVuY3Rpb24gT2YoYSxiLGMsZCl7dmFyIGU9ITAsZjtmb3IoZiBpbiBjKWU9ITE7ZT8oTShcIm9uRGlzY29ubmVjdCgpLnVwZGF0ZSgpIGNhbGxlZCB3aXRoIGVtcHR5IGRhdGEuICBEb24ndCBkbyBhbnl0aGluZy5cIiksS2YoZCxcIm9rXCIpKTpVZChhLm4sYi50b1N0cmluZygpLGMsZnVuY3Rpb24oZSxmKXtpZihcIm9rXCI9PT1lKWZvcih2YXIgbSBpbiBjKXt2YXIgbj1TKGNbbV0pO2EuVS5yYihiLkoobSksbil9S2YoZCxlLGYpfSl9ZnVuY3Rpb24gUGYoYSl7T2MoYS5nYSxcImRlcHJlY2F0ZWRfb25fZGlzY29ubmVjdFwiKTthLmJlLnlkLmRlcHJlY2F0ZWRfb25fZGlzY29ubmVjdD0hMH1cbmsuZWM9ZnVuY3Rpb24oYSxiLGMsZCxlKXtcIi5pbmZvXCI9PT1EKGEucGF0aCk/dGhpcy5nZC5lYyhhLGIsYyxkLGUpOnRoaXMuTC5lYyhhLGIsYyxkLGUpfTtrLkRjPWZ1bmN0aW9uKGEsYixjLGQpe2lmKFwiLmluZm9cIj09PUQoYS5wYXRoKSl0aGlzLmdkLkRjKGEsYixjLGQpO2Vsc2V7Yj10aGlzLkwuRGMoYSxiLGMsZCk7aWYoYz1udWxsIT09Yil7Yz10aGlzLmc7ZD1hLnBhdGg7Zm9yKHZhciBlPVtdLGY9MDtmPGIubGVuZ3RoOysrZillW2ZdPVUoYy53YSxiW2ZdKTtWKGMud2EsZCxRKTtmb3IoZj0wO2Y8Yi5sZW5ndGg7KytmKVYoYy53YSxiW2ZdLGVbZl0pO2M9ZmUoYyxkKX1jJiYodih0aGlzLmcucWEuYmE9PT10aGlzLkwucmMsXCJXZSBzaG91bGQgaGF2ZSByYWlzZWQgYW55IG91dHN0YW5kaW5nIGV2ZW50cyBieSBub3cuICBFbHNlLCB3ZSdsbCBibG93IHRoZW0gYXdheS5cIiksVih0aGlzLmcucWEsYS5wYXRoLFUodGhpcy5nLk8sYS5wYXRoKSksdGhpcy5MLnJjPXRoaXMuZy5xYS5iYSl9fTtcbmsuUWE9ZnVuY3Rpb24oKXt0aGlzLm4uUWEoKX07ay50Yj1mdW5jdGlvbigpe3RoaXMubi50YigpfTtrLndkPWZ1bmN0aW9uKGEpe2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZSl7YT8odGhpcy5IY3x8KHRoaXMuSGM9bmV3IFFjKHRoaXMuZ2EpKSxhPXRoaXMuSGMuZ2V0KCkpOmE9dGhpcy5nYS5nZXQoKTt2YXIgYj1HYihJYyhhKSxmdW5jdGlvbihhLGIpe3JldHVybiBNYXRoLm1heChiLmxlbmd0aCxhKX0sMCksYztmb3IoYyBpbiBhKXtmb3IodmFyIGQ9YVtjXSxlPWMubGVuZ3RoO2U8YisyO2UrKyljKz1cIiBcIjtjb25zb2xlLmxvZyhjK2QpfX19O2sueGQ9ZnVuY3Rpb24oYSl7T2ModGhpcy5nYSxhKTt0aGlzLmJlLnlkW2FdPSEwfTtrLmU9ZnVuY3Rpb24oKXtNKFwicjpcIit0aGlzLm4uaWQrXCI6XCIsYXJndW1lbnRzKX07XG5mdW5jdGlvbiBLZihhLGIsYyl7YSYmc2MoZnVuY3Rpb24oKXtpZihcIm9rXCI9PWIpYShudWxsLGMpO2Vsc2V7dmFyIGQ9KGJ8fFwiZXJyb3JcIikudG9VcHBlckNhc2UoKSxlPWQ7YyYmKGUrPVwiOiBcIitjKTtlPUVycm9yKGUpO2UuY29kZT1kO2EoZSl9fSl9O2Z1bmN0aW9uIFFmKGEsYixjLGQsZSl7ZnVuY3Rpb24gZigpe31hLmUoXCJ0cmFuc2FjdGlvbiBvbiBcIitiKTt2YXIgZz1uZXcgRyhhLGIpO2cuVWEoXCJ2YWx1ZVwiLGYpO2M9e3BhdGg6Yix1cGRhdGU6YyxHOmQsc3RhdHVzOm51bGwsU2Q6V2IoKSxSYzplLFhkOjAsT2M6ZnVuY3Rpb24oKXtnLm5iKFwidmFsdWVcIixmKX0sUGM6bnVsbH07YS5LYS5iYT1SZihhLGEuS2EuYmEsYS5nLk8uYmEsYS4kYSk7ZD1jLnVwZGF0ZShVKGEuS2EsYikuWCgpKTtpZihsKGQpKXtGYShcInRyYW5zYWN0aW9uIGZhaWxlZDogRGF0YSByZXR1cm5lZCBcIixkKTtjLnN0YXR1cz0xO2U9SShhLiRhLGIpO3ZhciBoPWUuaygpfHxbXTtoLnB1c2goYyk7WWEoZSxoKTtoPVwib2JqZWN0XCI9PT10eXBlb2YgZCYmbnVsbCE9PWQmJkEoZCxcIi5wcmlvcml0eVwiKT9kW1wiLnByaW9yaXR5XCJdOlUoYS5nLk8sYikubSgpO2U9SGYoYSk7ZD1TKGQsaCk7ZD1rZShkLGUpO1YoYS5LYSxiLGQpO2MuUmMmJihWKGEuZy5xYSxiLGQpLHhmKGEuTCxcbmIsW2JdKSk7U2YoYSl9ZWxzZSBjLk9jKCksYy5HJiYoYT1UZihhLGIpLGMuRyhudWxsLCExLGEpKX1mdW5jdGlvbiBTZihhLGIpe3ZhciBjPWJ8fGEuJGE7Ynx8VWYoYSxjKTtpZihudWxsIT09Yy5rKCkpe3ZhciBkPVZmKGEsYyk7digwPGQubGVuZ3RoKTtIYihkLGZ1bmN0aW9uKGEpe3JldHVybiAxPT09YS5zdGF0dXN9KSYmV2YoYSxjLnBhdGgoKSxkKX1lbHNlIGMuRmIoKSYmYy5CKGZ1bmN0aW9uKGIpe1NmKGEsYil9KX1cbmZ1bmN0aW9uIFdmKGEsYixjKXtmb3IodmFyIGQ9MDtkPGMubGVuZ3RoO2QrKyl2KDE9PT1jW2RdLnN0YXR1cyxcInRyeVRvU2VuZFRyYW5zYWN0aW9uUXVldWVfOiBpdGVtcyBpbiBxdWV1ZSBzaG91bGQgYWxsIGJlIHJ1bi5cIiksY1tkXS5zdGF0dXM9MixjW2RdLlhkKys7dmFyIGU9VShhLmcuTyxiKS5oYXNoKCk7VihhLmcuTyxiLFUoYS5nLnFhLGIpKTtmb3IodmFyIGY9VShhLkthLGIpLlgoITApLGc9V2IoKSxoPVhmKGMpLGQ9MDtkPGgubGVuZ3RoO2QrKylZYShJKGEuZy5TYixoW2RdKSxnKTthLm4ucHV0KGIudG9TdHJpbmcoKSxmLGZ1bmN0aW9uKGUpe2EuZShcInRyYW5zYWN0aW9uIHB1dCByZXNwb25zZVwiLHtwYXRoOmIudG9TdHJpbmcoKSxzdGF0dXM6ZX0pO2ZvcihkPTA7ZDxoLmxlbmd0aDtkKyspe3ZhciBmPUkoYS5nLlNiLGhbZF0pLHE9Zi5rKCk7dihudWxsIT09cSxcInNlbmRUcmFuc2FjdGlvblF1ZXVlXzogcGVuZGluZ1B1dCBzaG91bGQgbm90IGJlIG51bGwuXCIpO3E9PT1cbmcmJihZYShmLG51bGwpLFYoYS5nLk8saFtkXSxVKGEuZy53YSxoW2RdKSkpfWlmKFwib2tcIj09PWUpe2U9W107Zm9yKGQ9MDtkPGMubGVuZ3RoO2QrKyljW2RdLnN0YXR1cz0zLGNbZF0uRyYmKGY9VGYoYSxjW2RdLnBhdGgpLGUucHVzaChyKGNbZF0uRyxudWxsLG51bGwsITAsZikpKSxjW2RdLk9jKCk7VWYoYSxJKGEuJGEsYikpO1NmKGEpO2ZvcihkPTA7ZDxlLmxlbmd0aDtkKyspc2MoZVtkXSl9ZWxzZXtpZihcImRhdGFzdGFsZVwiPT09ZSlmb3IoZD0wO2Q8Yy5sZW5ndGg7ZCsrKWNbZF0uc3RhdHVzPTQ9PT1jW2RdLnN0YXR1cz81OjE7ZWxzZSBmb3IoTyhcInRyYW5zYWN0aW9uIGF0IFwiK2IrXCIgZmFpbGVkOiBcIitlKSxkPTA7ZDxjLmxlbmd0aDtkKyspY1tkXS5zdGF0dXM9NSxjW2RdLlBjPWU7ZT1JZihhLGIpO3hmKGEuTCxlLFtiXSl9fSxlKX1cbmZ1bmN0aW9uIFhmKGEpe2Zvcih2YXIgYj17fSxjPTA7YzxhLmxlbmd0aDtjKyspYVtjXS5SYyYmKGJbYVtjXS5wYXRoLnRvU3RyaW5nKCldPWFbY10ucGF0aCk7YT1bXTtmb3IodmFyIGQgaW4gYilhLnB1c2goYltkXSk7cmV0dXJuIGF9XG5mdW5jdGlvbiBJZihhLGIpe3ZhciBjPVlmKGEsYiksZD1jLnBhdGgoKSxjPVZmKGEsYyk7VihhLmcucWEsZCxVKGEuZy5PLGQpKTtWKGEuS2EsZCxVKGEuZy5PLGQpKTtpZigwIT09Yy5sZW5ndGgpe2Zvcih2YXIgZT1VKGEuZy5xYSxkKSxmPWUsZz1bXSxoPTA7aDxjLmxlbmd0aDtoKyspe3ZhciBtPVZhKGQsY1toXS5wYXRoKSxuPSExLHE7dihudWxsIT09bSxcInJlcnVuVHJhbnNhY3Rpb25zVW5kZXJOb2RlXzogcmVsYXRpdmVQYXRoIHNob3VsZCBub3QgYmUgbnVsbC5cIik7aWYoNT09PWNbaF0uc3RhdHVzKW49ITAscT1jW2hdLlBjO2Vsc2UgaWYoMT09PWNbaF0uc3RhdHVzKWlmKDI1PD1jW2hdLlhkKW49ITAscT1cIm1heHJldHJ5XCI7ZWxzZXt2YXIgcz1lLk4obSksdD1jW2hdLnVwZGF0ZShzLlgoKSk7aWYobCh0KSl7RmEoXCJ0cmFuc2FjdGlvbiBmYWlsZWQ6IERhdGEgcmV0dXJuZWQgXCIsdCk7dmFyIHc9Uyh0KTtcIm9iamVjdFwiPT09dHlwZW9mIHQmJm51bGwhPXQmJkEodCxcIi5wcmlvcml0eVwiKXx8XG4odz13LkxhKHMubSgpKSk7ZT1lLkJhKG0sdyk7Y1toXS5SYyYmKGY9Zi5CYShtLHcpKX1lbHNlIG49ITAscT1cIm5vZGF0YVwifW4mJihjW2hdLnN0YXR1cz0zLHNldFRpbWVvdXQoY1toXS5PYyxNYXRoLmZsb29yKDApKSxjW2hdLkcmJihuPW5ldyBHKGEsY1toXS5wYXRoKSxtPW5ldyBUKGUuTihtKSxuKSxcIm5vZGF0YVwiPT09cT9nLnB1c2gocihjW2hdLkcsbnVsbCxudWxsLCExLG0pKTpnLnB1c2gocihjW2hdLkcsbnVsbCxFcnJvcihxKSwhMSxtKSkpKX1WKGEuS2EsZCxlKTtWKGEuZy5xYSxkLGYpO1VmKGEsYS4kYSk7Zm9yKGg9MDtoPGcubGVuZ3RoO2grKylzYyhnW2hdKTtTZihhKX1yZXR1cm4gZH1mdW5jdGlvbiBZZihhLGIpe2Zvcih2YXIgYyxkPWEuJGE7bnVsbCE9PShjPUQoYikpJiZudWxsPT09ZC5rKCk7KWQ9SShkLGMpLGI9VGEoYik7cmV0dXJuIGR9XG5mdW5jdGlvbiBWZihhLGIpe3ZhciBjPVtdO1pmKGEsYixjKTtjLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5TZC1iLlNkfSk7cmV0dXJuIGN9ZnVuY3Rpb24gWmYoYSxiLGMpe3ZhciBkPWIuaygpO2lmKG51bGwhPT1kKWZvcih2YXIgZT0wO2U8ZC5sZW5ndGg7ZSsrKWMucHVzaChkW2VdKTtiLkIoZnVuY3Rpb24oYil7WmYoYSxiLGMpfSl9ZnVuY3Rpb24gVWYoYSxiKXt2YXIgYz1iLmsoKTtpZihjKXtmb3IodmFyIGQ9MCxlPTA7ZTxjLmxlbmd0aDtlKyspMyE9PWNbZV0uc3RhdHVzJiYoY1tkXT1jW2VdLGQrKyk7Yy5sZW5ndGg9ZDtZYShiLDA8Yy5sZW5ndGg/YzpudWxsKX1iLkIoZnVuY3Rpb24oYil7VWYoYSxiKX0pfWZ1bmN0aW9uIExmKGEsYil7dmFyIGM9WWYoYSxiKS5wYXRoKCksZD1JKGEuJGEsYik7YWIoZCxmdW5jdGlvbihhKXskZihhKX0pOyRmKGQpOyRhKGQsZnVuY3Rpb24oYSl7JGYoYSl9KTtyZXR1cm4gY31cbmZ1bmN0aW9uICRmKGEpe3ZhciBiPWEuaygpO2lmKG51bGwhPT1iKXtmb3IodmFyIGM9W10sZD0tMSxlPTA7ZTxiLmxlbmd0aDtlKyspNCE9PWJbZV0uc3RhdHVzJiYoMj09PWJbZV0uc3RhdHVzPyh2KGQ9PT1lLTEsXCJBbGwgU0VOVCBpdGVtcyBzaG91bGQgYmUgYXQgYmVnaW5uaW5nIG9mIHF1ZXVlLlwiKSxkPWUsYltlXS5zdGF0dXM9NCxiW2VdLlBjPVwic2V0XCIpOih2KDE9PT1iW2VdLnN0YXR1cyksYltlXS5PYygpLGJbZV0uRyYmYy5wdXNoKHIoYltlXS5HLG51bGwsRXJyb3IoXCJzZXRcIiksITEsbnVsbCkpKSk7LTE9PT1kP1lhKGEsbnVsbCk6Yi5sZW5ndGg9ZCsxO2ZvcihlPTA7ZTxjLmxlbmd0aDtlKyspc2MoY1tlXSl9fWZ1bmN0aW9uIFRmKGEsYil7dmFyIGM9bmV3IEcoYSxiKTtyZXR1cm4gbmV3IFQoVShhLkthLGIpLGMpfVxuZnVuY3Rpb24gUmYoYSxiLGMsZCl7aWYoZC5mKCkpcmV0dXJuIGM7aWYobnVsbCE9ZC5rKCkpcmV0dXJuIGI7dmFyIGU9YztkLkIoZnVuY3Rpb24oZCl7dmFyIGc9ZC5uYW1lKCksaD1uZXcgSChnKTtkPVJmKGEsYi5OKGgpLGMuTihoKSxkKTtlPWUuSyhnLGQpfSk7cmV0dXJuIGV9O2Z1bmN0aW9uIFkoKXt0aGlzLnNiPXt9fWRhKFkpO1kucHJvdG90eXBlLlFhPWZ1bmN0aW9uKCl7Zm9yKHZhciBhIGluIHRoaXMuc2IpdGhpcy5zYlthXS5RYSgpfTtZLnByb3RvdHlwZS5pbnRlcnJ1cHQ9WS5wcm90b3R5cGUuUWE7WS5wcm90b3R5cGUudGI9ZnVuY3Rpb24oKXtmb3IodmFyIGEgaW4gdGhpcy5zYil0aGlzLnNiW2FdLnRiKCl9O1kucHJvdG90eXBlLnJlc3VtZT1ZLnByb3RvdHlwZS50YjtmdW5jdGlvbiBhZyhhKXt2YXIgYj10aGlzO3RoaXMuemI9YTt0aGlzLkpjPVwiKlwiO3llKCk/dGhpcy5LYj10aGlzLmxjPXFlKCk6KHRoaXMuS2I9d2luZG93Lm9wZW5lcix0aGlzLmxjPXdpbmRvdyk7aWYoIWIuS2IpdGhyb3dcIlVuYWJsZSB0byBmaW5kIHJlbGF5IGZyYW1lXCI7cmUodGhpcy5sYyxcIm1lc3NhZ2VcIixyKHRoaXMub2IsdGhpcykpO3JlKHRoaXMubGMsXCJtZXNzYWdlXCIscih0aGlzLlBkLHRoaXMpKTt0cnl7YmcodGhpcyx7YTpcInJlYWR5XCJ9KX1jYXRjaChjKXtyZSh0aGlzLktiLFwibG9hZFwiLGZ1bmN0aW9uKCl7YmcoYix7YTpcInJlYWR5XCJ9KX0pfXJlKHdpbmRvdyxcInVubG9hZFwiLHIodGhpcy5JZSx0aGlzKSl9ZnVuY3Rpb24gYmcoYSxiKXtiPXUoYik7eWUoKT9hLktiLmRvUG9zdChiLGEuSmMpOmEuS2IucG9zdE1lc3NhZ2UoYixhLkpjKX1cbmFnLnByb3RvdHlwZS5vYj1mdW5jdGlvbihhKXt2YXIgYj10aGlzLGM7dHJ5e2M9dWEoYS5kYXRhKX1jYXRjaChkKXt9YyYmXCJyZXF1ZXN0XCI9PT1jLmEmJihzZSh3aW5kb3csXCJtZXNzYWdlXCIsdGhpcy5vYiksdGhpcy5KYz1hLm9yaWdpbix0aGlzLnpiJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Yi56YihiLkpjLGMuZCxmdW5jdGlvbihhLGMpe2Iub2U9IWM7Yi56Yj12b2lkIDA7YmcoYix7YTpcInJlc3BvbnNlXCIsZDphLGZvcmNlS2VlcFdpbmRvd09wZW46Y30pfSl9LDApKX07YWcucHJvdG90eXBlLkllPWZ1bmN0aW9uKCl7dHJ5e3NlKHRoaXMubGMsXCJtZXNzYWdlXCIsdGhpcy5QZCl9Y2F0Y2goYSl7fXRoaXMuemImJihiZyh0aGlzLHthOlwiZXJyb3JcIixkOlwidW5rbm93biBjbG9zZWQgd2luZG93XCJ9KSx0aGlzLnpiPXZvaWQgMCk7dHJ5e3dpbmRvdy5jbG9zZSgpfWNhdGNoKGIpe319O2FnLnByb3RvdHlwZS5QZD1mdW5jdGlvbihhKXtpZih0aGlzLm9lJiZcImRpZVwiPT09YS5kYXRhKXRyeXt3aW5kb3cuY2xvc2UoKX1jYXRjaChiKXt9fTt2YXIgWj17eGU6ZnVuY3Rpb24oYSl7dmFyIGI9Ui5wcm90b3R5cGUuaGFzaDtSLnByb3RvdHlwZS5oYXNoPWE7dmFyIGM9dGMucHJvdG90eXBlLmhhc2g7dGMucHJvdG90eXBlLmhhc2g9YTtyZXR1cm4gZnVuY3Rpb24oKXtSLnByb3RvdHlwZS5oYXNoPWI7dGMucHJvdG90eXBlLmhhc2g9Y319fTtaLmhpamFja0hhc2g9Wi54ZTtaLldhPWZ1bmN0aW9uKGEpe3JldHVybiBhLldhKCl9O1oucXVlcnlJZGVudGlmaWVyPVouV2E7Wi5BZT1mdW5jdGlvbihhKXtyZXR1cm4gYS5pLm4uamF9O1oubGlzdGVucz1aLkFlO1ouTWU9ZnVuY3Rpb24oYSl7cmV0dXJuIGEuaS5uLm1hfTtaLnJlZkNvbm5lY3Rpb249Wi5NZTtaLmVlPUlkO1ouRGF0YUNvbm5lY3Rpb249Wi5lZTtJZC5wcm90b3R5cGUuc2VuZFJlcXVlc3Q9SWQucHJvdG90eXBlLkphO0lkLnByb3RvdHlwZS5pbnRlcnJ1cHQ9SWQucHJvdG90eXBlLlFhO1ouZmU9cmQ7Wi5SZWFsVGltZUNvbm5lY3Rpb249Wi5mZTtcbnJkLnByb3RvdHlwZS5zZW5kUmVxdWVzdD1yZC5wcm90b3R5cGUuWmQ7cmQucHJvdG90eXBlLmNsb3NlPXJkLnByb3RvdHlwZS5jbG9zZTtaLmRlPXdiO1ouQ29ubmVjdGlvblRhcmdldD1aLmRlO1oudWU9ZnVuY3Rpb24oKXtnZD1ZYz0hMH07Wi5mb3JjZUxvbmdQb2xsaW5nPVoudWU7Wi52ZT1mdW5jdGlvbigpe2hkPSEwfTtaLmZvcmNlV2ViU29ja2V0cz1aLnZlO1ouVGU9ZnVuY3Rpb24oYSxiKXthLmkubi51ZD1ifTtaLnNldFNlY3VyaXR5RGVidWdDYWxsYmFjaz1aLlRlO1oud2Q9ZnVuY3Rpb24oYSxiKXthLmkud2QoYil9O1ouc3RhdHM9Wi53ZDtaLnhkPWZ1bmN0aW9uKGEsYil7YS5pLnhkKGIpfTtaLnN0YXRzSW5jcmVtZW50Q291bnRlcj1aLnhkO1ouaWM9ZnVuY3Rpb24oYSl7cmV0dXJuIGEuaS5pY307Wi5kYXRhVXBkYXRlQ291bnQ9Wi5pYztaLnllPWZ1bmN0aW9uKGEsYil7YS5pLk1kPWJ9O1ouaW50ZXJjZXB0U2VydmVyRGF0YT1aLnllO1ouRmU9ZnVuY3Rpb24oYSl7bmV3IGFnKGEpfTtcbloub25Qb3B1cE9wZW49Wi5GZTtaLlFlPWZ1bmN0aW9uKGEpe2xlPWF9O1ouc2V0QXV0aGVudGljYXRpb25TZXJ2ZXI9Wi5RZTtmdW5jdGlvbiAkKGEsYixjKXt0aGlzLldiPWE7dGhpcy5aPWI7dGhpcy5IYT1jfSQucHJvdG90eXBlLmNhbmNlbD1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuY2FuY2VsXCIsMCwxLGFyZ3VtZW50cy5sZW5ndGgpO3ooXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5jYW5jZWxcIiwxLGEsITApO3RoaXMuV2IubGQodGhpcy5aLGEpfTskLnByb3RvdHlwZS5jYW5jZWw9JC5wcm90b3R5cGUuY2FuY2VsOyQucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkucmVtb3ZlXCIsMCwxLGFyZ3VtZW50cy5sZW5ndGgpO0MoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5yZW1vdmVcIix0aGlzLlopO3ooXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5yZW1vdmVcIiwxLGEsITApO01mKHRoaXMuV2IsdGhpcy5aLG51bGwsYSl9OyQucHJvdG90eXBlLnJlbW92ZT0kLnByb3RvdHlwZS5yZW1vdmU7XG4kLnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0XCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO0MoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRcIix0aGlzLlopO0VhKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0XCIsYSwhMSk7eihcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFwiLDIsYiwhMCk7TWYodGhpcy5XYix0aGlzLlosYSxiKX07JC5wcm90b3R5cGUuc2V0PSQucHJvdG90eXBlLnNldDtcbiQucHJvdG90eXBlLndiPWZ1bmN0aW9uKGEsYixjKXt4KFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0V2l0aFByaW9yaXR5XCIsMiwzLGFyZ3VtZW50cy5sZW5ndGgpO0MoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRXaXRoUHJpb3JpdHlcIix0aGlzLlopO0VhKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0V2l0aFByaW9yaXR5XCIsYSwhMSk7SmEoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRXaXRoUHJpb3JpdHlcIiwyLGIsITEpO3ooXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRXaXRoUHJpb3JpdHlcIiwzLGMsITApO2lmKFwiLmxlbmd0aFwiPT09dGhpcy5IYXx8XCIua2V5c1wiPT09dGhpcy5IYSl0aHJvd1wiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0V2l0aFByaW9yaXR5IGZhaWxlZDogXCIrdGhpcy5IYStcIiBpcyBhIHJlYWQtb25seSBvYmplY3QuXCI7TmYodGhpcy5XYix0aGlzLlosYSxiLGMpfTskLnByb3RvdHlwZS5zZXRXaXRoUHJpb3JpdHk9JC5wcm90b3R5cGUud2I7XG4kLnByb3RvdHlwZS51cGRhdGU9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkudXBkYXRlXCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO0MoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS51cGRhdGVcIix0aGlzLlopO2lmKGZhKGEpKXtmb3IodmFyIGM9e30sZD0wO2Q8YS5sZW5ndGg7KytkKWNbXCJcIitkXT1hW2RdO2E9YztPKFwiUGFzc2luZyBhbiBBcnJheSB0byBGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS51cGRhdGUoKSBpcyBkZXByZWNhdGVkLiBVc2Ugc2V0KCkgaWYgeW91IHdhbnQgdG8gb3ZlcndyaXRlIHRoZSBleGlzdGluZyBkYXRhLCBvciBhbiBPYmplY3Qgd2l0aCBpbnRlZ2VyIGtleXMgaWYgeW91IHJlYWxseSBkbyB3YW50IHRvIG9ubHkgdXBkYXRlIHNvbWUgb2YgdGhlIGNoaWxkcmVuLlwiKX1JYShcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnVwZGF0ZVwiLGEpO3ooXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS51cGRhdGVcIiwyLGIsITApO09mKHRoaXMuV2IsXG50aGlzLlosYSxiKX07JC5wcm90b3R5cGUudXBkYXRlPSQucHJvdG90eXBlLnVwZGF0ZTt2YXIgY2c9ZnVuY3Rpb24oKXt2YXIgYT0wLGI9W107cmV0dXJuIGZ1bmN0aW9uKGMpe3ZhciBkPWM9PT1hO2E9Yztmb3IodmFyIGU9QXJyYXkoOCksZj03OzA8PWY7Zi0tKWVbZl09XCItMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaX2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCIuY2hhckF0KGMlNjQpLGM9TWF0aC5mbG9vcihjLzY0KTt2KDA9PT1jLFwiQ2Fubm90IHB1c2ggYXQgdGltZSA9PSAwXCIpO2M9ZS5qb2luKFwiXCIpO2lmKGQpe2ZvcihmPTExOzA8PWYmJjYzPT09YltmXTtmLS0pYltmXT0wO2JbZl0rK31lbHNlIGZvcihmPTA7MTI+ZjtmKyspYltmXT1NYXRoLmZsb29yKDY0Kk1hdGgucmFuZG9tKCkpO2ZvcihmPTA7MTI+ZjtmKyspYys9XCItMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaX2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCIuY2hhckF0KGJbZl0pO3YoMjA9PT1jLmxlbmd0aCxcIk5leHRQdXNoSWQ6IExlbmd0aCBzaG91bGQgYmUgMjAuXCIpO1xucmV0dXJuIGN9fSgpO2Z1bmN0aW9uIEcoYSxiKXt2YXIgYyxkLGU7aWYoYSBpbnN0YW5jZW9mIEVmKWM9YSxkPWI7ZWxzZXt4KFwibmV3IEZpcmViYXNlXCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO2Q9ZmMoYXJndW1lbnRzWzBdKTtjPWQuVmU7XCJmaXJlYmFzZVwiPT09ZC5kb21haW4mJmVjKGQuaG9zdCtcIiBpcyBubyBsb25nZXIgc3VwcG9ydGVkLiBQbGVhc2UgdXNlIDxZT1VSIEZJUkVCQVNFPi5maXJlYmFzZWlvLmNvbSBpbnN0ZWFkXCIpO2N8fGVjKFwiQ2Fubm90IHBhcnNlIEZpcmViYXNlIHVybC4gUGxlYXNlIHVzZSBodHRwczovLzxZT1VSIEZJUkVCQVNFPi5maXJlYmFzZWlvLmNvbVwiKTtkLllhfHxcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdyYmd2luZG93LmxvY2F0aW9uJiZ3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wmJi0xIT09d2luZG93LmxvY2F0aW9uLnByb3RvY29sLmluZGV4T2YoXCJodHRwczpcIikmJk8oXCJJbnNlY3VyZSBGaXJlYmFzZSBhY2Nlc3MgZnJvbSBhIHNlY3VyZSBwYWdlLiBQbGVhc2UgdXNlIGh0dHBzIGluIGNhbGxzIHRvIG5ldyBGaXJlYmFzZSgpLlwiKTtcbmM9bmV3IHdiKGQuaG9zdCxkLllhLGMsXCJ3c1wiPT09ZC5zY2hlbWV8fFwid3NzXCI9PT1kLnNjaGVtZSk7ZD1uZXcgSChkLlJiKTtlPWQudG9TdHJpbmcoKTt2YXIgZjshKGY9IXAoYy5ob3N0KXx8MD09PWMuaG9zdC5sZW5ndGh8fCFEYShjLlRhKSkmJihmPTAhPT1lLmxlbmd0aCkmJihlJiYoZT1lLnJlcGxhY2UoL15cXC8qXFwuaW5mbyhcXC98JCkvLFwiL1wiKSksZj0hKHAoZSkmJjAhPT1lLmxlbmd0aCYmIUNhLnRlc3QoZSkpKTtpZihmKXRocm93IEVycm9yKHkoXCJuZXcgRmlyZWJhc2VcIiwxLCExKSsnbXVzdCBiZSBhIHZhbGlkIGZpcmViYXNlIFVSTCBhbmQgdGhlIHBhdGggY2FuXFwndCBjb250YWluIFwiLlwiLCBcIiNcIiwgXCIkXCIsIFwiW1wiLCBvciBcIl1cIi4nKTtpZihiKWlmKGIgaW5zdGFuY2VvZiBZKWU9YjtlbHNlIGlmKHAoYikpZT1ZLmliKCksYy55Yz1iO2Vsc2UgdGhyb3cgRXJyb3IoXCJFeHBlY3RlZCBhIHZhbGlkIEZpcmViYXNlLkNvbnRleHQgZm9yIHNlY29uZCBhcmd1bWVudCB0byBuZXcgRmlyZWJhc2UoKVwiKTtcbmVsc2UgZT1ZLmliKCk7Zj1jLnRvU3RyaW5nKCk7dmFyIGc9QihlLnNiLGYpO2d8fChnPW5ldyBFZihjKSxlLnNiW2ZdPWcpO2M9Z31GLmNhbGwodGhpcyxjLGQpfW5hKEcsRik7dmFyIGRnPUcsZWc9W1wiRmlyZWJhc2VcIl0sZmc9YmE7ZWdbMF1pbiBmZ3x8IWZnLmV4ZWNTY3JpcHR8fGZnLmV4ZWNTY3JpcHQoXCJ2YXIgXCIrZWdbMF0pO2Zvcih2YXIgZ2c7ZWcubGVuZ3RoJiYoZ2c9ZWcuc2hpZnQoKSk7KSFlZy5sZW5ndGgmJmwoZGcpP2ZnW2dnXT1kZzpmZz1mZ1tnZ10/ZmdbZ2ddOmZnW2dnXT17fTtHLnByb3RvdHlwZS5uYW1lPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLm5hbWVcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMucGF0aC5mKCk/bnVsbDpVYSh0aGlzLnBhdGgpfTtHLnByb3RvdHlwZS5uYW1lPUcucHJvdG90eXBlLm5hbWU7XG5HLnByb3RvdHlwZS5KPWZ1bmN0aW9uKGEpe3goXCJGaXJlYmFzZS5jaGlsZFwiLDEsMSxhcmd1bWVudHMubGVuZ3RoKTtpZihoYShhKSlhPVN0cmluZyhhKTtlbHNlIGlmKCEoYSBpbnN0YW5jZW9mIEgpKWlmKG51bGw9PT1EKHRoaXMucGF0aCkpe3ZhciBiPWE7YiYmKGI9Yi5yZXBsYWNlKC9eXFwvKlxcLmluZm8oXFwvfCQpLyxcIi9cIikpO01hKFwiRmlyZWJhc2UuY2hpbGRcIixiKX1lbHNlIE1hKFwiRmlyZWJhc2UuY2hpbGRcIixhKTtyZXR1cm4gbmV3IEcodGhpcy5pLHRoaXMucGF0aC5KKGEpKX07Ry5wcm90b3R5cGUuY2hpbGQ9Ry5wcm90b3R5cGUuSjtHLnByb3RvdHlwZS5wYXJlbnQ9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UucGFyZW50XCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3ZhciBhPXRoaXMucGF0aC5wYXJlbnQoKTtyZXR1cm4gbnVsbD09PWE/bnVsbDpuZXcgRyh0aGlzLmksYSl9O0cucHJvdG90eXBlLnBhcmVudD1HLnByb3RvdHlwZS5wYXJlbnQ7XG5HLnByb3RvdHlwZS5yb290PWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLnJlZlwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtmb3IodmFyIGE9dGhpcztudWxsIT09YS5wYXJlbnQoKTspYT1hLnBhcmVudCgpO3JldHVybiBhfTtHLnByb3RvdHlwZS5yb290PUcucHJvdG90eXBlLnJvb3Q7Ry5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UudG9TdHJpbmdcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7dmFyIGE7aWYobnVsbD09PXRoaXMucGFyZW50KCkpYT10aGlzLmkudG9TdHJpbmcoKTtlbHNle2E9dGhpcy5wYXJlbnQoKS50b1N0cmluZygpK1wiL1wiO3ZhciBiPXRoaXMubmFtZSgpO2ErPWVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcoYikpfXJldHVybiBhfTtHLnByb3RvdHlwZS50b1N0cmluZz1HLnByb3RvdHlwZS50b1N0cmluZztcbkcucHJvdG90eXBlLnNldD1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5zZXRcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7QyhcIkZpcmViYXNlLnNldFwiLHRoaXMucGF0aCk7RWEoXCJGaXJlYmFzZS5zZXRcIixhLCExKTt6KFwiRmlyZWJhc2Uuc2V0XCIsMixiLCEwKTt0aGlzLmkud2IodGhpcy5wYXRoLGEsbnVsbCxiKX07Ry5wcm90b3R5cGUuc2V0PUcucHJvdG90eXBlLnNldDtcbkcucHJvdG90eXBlLnVwZGF0ZT1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS51cGRhdGVcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7QyhcIkZpcmViYXNlLnVwZGF0ZVwiLHRoaXMucGF0aCk7aWYoZmEoYSkpe2Zvcih2YXIgYz17fSxkPTA7ZDxhLmxlbmd0aDsrK2QpY1tcIlwiK2RdPWFbZF07YT1jO08oXCJQYXNzaW5nIGFuIEFycmF5IHRvIEZpcmViYXNlLnVwZGF0ZSgpIGlzIGRlcHJlY2F0ZWQuIFVzZSBzZXQoKSBpZiB5b3Ugd2FudCB0byBvdmVyd3JpdGUgdGhlIGV4aXN0aW5nIGRhdGEsIG9yIGFuIE9iamVjdCB3aXRoIGludGVnZXIga2V5cyBpZiB5b3UgcmVhbGx5IGRvIHdhbnQgdG8gb25seSB1cGRhdGUgc29tZSBvZiB0aGUgY2hpbGRyZW4uXCIpfUlhKFwiRmlyZWJhc2UudXBkYXRlXCIsYSk7eihcIkZpcmViYXNlLnVwZGF0ZVwiLDIsYiwhMCk7aWYoQShhLFwiLnByaW9yaXR5XCIpKXRocm93IEVycm9yKFwidXBkYXRlKCkgZG9lcyBub3QgY3VycmVudGx5IHN1cHBvcnQgdXBkYXRpbmcgLnByaW9yaXR5LlwiKTtcbnRoaXMuaS51cGRhdGUodGhpcy5wYXRoLGEsYil9O0cucHJvdG90eXBlLnVwZGF0ZT1HLnByb3RvdHlwZS51cGRhdGU7Ry5wcm90b3R5cGUud2I9ZnVuY3Rpb24oYSxiLGMpe3goXCJGaXJlYmFzZS5zZXRXaXRoUHJpb3JpdHlcIiwyLDMsYXJndW1lbnRzLmxlbmd0aCk7QyhcIkZpcmViYXNlLnNldFdpdGhQcmlvcml0eVwiLHRoaXMucGF0aCk7RWEoXCJGaXJlYmFzZS5zZXRXaXRoUHJpb3JpdHlcIixhLCExKTtKYShcIkZpcmViYXNlLnNldFdpdGhQcmlvcml0eVwiLDIsYiwhMSk7eihcIkZpcmViYXNlLnNldFdpdGhQcmlvcml0eVwiLDMsYywhMCk7aWYoXCIubGVuZ3RoXCI9PT10aGlzLm5hbWUoKXx8XCIua2V5c1wiPT09dGhpcy5uYW1lKCkpdGhyb3dcIkZpcmViYXNlLnNldFdpdGhQcmlvcml0eSBmYWlsZWQ6IFwiK3RoaXMubmFtZSgpK1wiIGlzIGEgcmVhZC1vbmx5IG9iamVjdC5cIjt0aGlzLmkud2IodGhpcy5wYXRoLGEsYixjKX07Ry5wcm90b3R5cGUuc2V0V2l0aFByaW9yaXR5PUcucHJvdG90eXBlLndiO1xuRy5wcm90b3R5cGUucmVtb3ZlPWZ1bmN0aW9uKGEpe3goXCJGaXJlYmFzZS5yZW1vdmVcIiwwLDEsYXJndW1lbnRzLmxlbmd0aCk7QyhcIkZpcmViYXNlLnJlbW92ZVwiLHRoaXMucGF0aCk7eihcIkZpcmViYXNlLnJlbW92ZVwiLDEsYSwhMCk7dGhpcy5zZXQobnVsbCxhKX07Ry5wcm90b3R5cGUucmVtb3ZlPUcucHJvdG90eXBlLnJlbW92ZTtcbkcucHJvdG90eXBlLnRyYW5zYWN0aW9uPWZ1bmN0aW9uKGEsYixjKXt4KFwiRmlyZWJhc2UudHJhbnNhY3Rpb25cIiwxLDMsYXJndW1lbnRzLmxlbmd0aCk7QyhcIkZpcmViYXNlLnRyYW5zYWN0aW9uXCIsdGhpcy5wYXRoKTt6KFwiRmlyZWJhc2UudHJhbnNhY3Rpb25cIiwxLGEsITEpO3ooXCJGaXJlYmFzZS50cmFuc2FjdGlvblwiLDIsYiwhMCk7aWYobChjKSYmXCJib29sZWFuXCIhPXR5cGVvZiBjKXRocm93IEVycm9yKHkoXCJGaXJlYmFzZS50cmFuc2FjdGlvblwiLDMsITApK1wibXVzdCBiZSBhIGJvb2xlYW4uXCIpO2lmKFwiLmxlbmd0aFwiPT09dGhpcy5uYW1lKCl8fFwiLmtleXNcIj09PXRoaXMubmFtZSgpKXRocm93XCJGaXJlYmFzZS50cmFuc2FjdGlvbiBmYWlsZWQ6IFwiK3RoaXMubmFtZSgpK1wiIGlzIGEgcmVhZC1vbmx5IG9iamVjdC5cIjtcInVuZGVmaW5lZFwiPT09dHlwZW9mIGMmJihjPSEwKTtRZih0aGlzLmksdGhpcy5wYXRoLGEsYixjKX07Ry5wcm90b3R5cGUudHJhbnNhY3Rpb249Ry5wcm90b3R5cGUudHJhbnNhY3Rpb247XG5HLnByb3RvdHlwZS52ZD1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5zZXRQcmlvcml0eVwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtDKFwiRmlyZWJhc2Uuc2V0UHJpb3JpdHlcIix0aGlzLnBhdGgpO0phKFwiRmlyZWJhc2Uuc2V0UHJpb3JpdHlcIiwxLGEsITEpO3ooXCJGaXJlYmFzZS5zZXRQcmlvcml0eVwiLDIsYiwhMCk7dGhpcy5pLnZkKHRoaXMucGF0aCxhLGIpfTtHLnByb3RvdHlwZS5zZXRQcmlvcml0eT1HLnByb3RvdHlwZS52ZDtHLnByb3RvdHlwZS5wdXNoPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLnB1c2hcIiwwLDIsYXJndW1lbnRzLmxlbmd0aCk7QyhcIkZpcmViYXNlLnB1c2hcIix0aGlzLnBhdGgpO0VhKFwiRmlyZWJhc2UucHVzaFwiLGEsITApO3ooXCJGaXJlYmFzZS5wdXNoXCIsMixiLCEwKTt2YXIgYz1HZih0aGlzLmkpLGM9Y2coYyksYz10aGlzLkooYyk7XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBhJiZudWxsIT09YSYmYy5zZXQoYSxiKTtyZXR1cm4gY307XG5HLnByb3RvdHlwZS5wdXNoPUcucHJvdG90eXBlLnB1c2g7Ry5wcm90b3R5cGUua2E9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3ICQodGhpcy5pLHRoaXMucGF0aCx0aGlzLm5hbWUoKSl9O0cucHJvdG90eXBlLm9uRGlzY29ubmVjdD1HLnByb3RvdHlwZS5rYTtHLnByb3RvdHlwZS5OZT1mdW5jdGlvbigpe08oXCJGaXJlYmFzZVJlZi5yZW1vdmVPbkRpc2Nvbm5lY3QoKSBiZWluZyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIEZpcmViYXNlUmVmLm9uRGlzY29ubmVjdCgpLnJlbW92ZSgpIGluc3RlYWQuXCIpO3RoaXMua2EoKS5yZW1vdmUoKTtQZih0aGlzLmkpfTtHLnByb3RvdHlwZS5yZW1vdmVPbkRpc2Nvbm5lY3Q9Ry5wcm90b3R5cGUuTmU7XG5HLnByb3RvdHlwZS5TZT1mdW5jdGlvbihhKXtPKFwiRmlyZWJhc2VSZWYuc2V0T25EaXNjb25uZWN0KHZhbHVlKSBiZWluZyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIEZpcmViYXNlUmVmLm9uRGlzY29ubmVjdCgpLnNldCh2YWx1ZSkgaW5zdGVhZC5cIik7dGhpcy5rYSgpLnNldChhKTtQZih0aGlzLmkpfTtHLnByb3RvdHlwZS5zZXRPbkRpc2Nvbm5lY3Q9Ry5wcm90b3R5cGUuU2U7Ry5wcm90b3R5cGUuST1mdW5jdGlvbihhLGIsYyl7TyhcIkZpcmViYXNlUmVmLmF1dGgoKSBiZWluZyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIEZpcmViYXNlUmVmLmF1dGhXaXRoQ3VzdG9tVG9rZW4oKSBpbnN0ZWFkLlwiKTt4KFwiRmlyZWJhc2UuYXV0aFwiLDEsMyxhcmd1bWVudHMubGVuZ3RoKTtOYShcIkZpcmViYXNlLmF1dGhcIixhKTt6KFwiRmlyZWJhc2UuYXV0aFwiLDIsYiwhMCk7eihcIkZpcmViYXNlLmF1dGhcIiwzLGIsITApO01lKHRoaXMuaS5JLGEse30se3JlbWVtYmVyOlwibm9uZVwifSxiLGMpfTtcbkcucHJvdG90eXBlLmF1dGg9Ry5wcm90b3R5cGUuSTtHLnByb3RvdHlwZS5CZD1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2UudW5hdXRoXCIsMCwxLGFyZ3VtZW50cy5sZW5ndGgpO3ooXCJGaXJlYmFzZS51bmF1dGhcIiwxLGEsITApO05lKHRoaXMuaS5JLGEpfTtHLnByb3RvdHlwZS51bmF1dGg9Ry5wcm90b3R5cGUuQmQ7Ry5wcm90b3R5cGUuYmQ9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuZ2V0QXV0aFwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5pLkkuYmQoKX07Ry5wcm90b3R5cGUuZ2V0QXV0aD1HLnByb3RvdHlwZS5iZDtHLnByb3RvdHlwZS5FZT1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5vbkF1dGhcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7eihcIkZpcmViYXNlLm9uQXV0aFwiLDEsYSwhMSk7eWEoXCJGaXJlYmFzZS5vbkF1dGhcIiwyLGIpO3RoaXMuaS5JLlVhKFwiYXV0aF9zdGF0dXNcIixhLGIpfTtHLnByb3RvdHlwZS5vbkF1dGg9Ry5wcm90b3R5cGUuRWU7XG5HLnByb3RvdHlwZS5EZT1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5vZmZBdXRoXCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO3ooXCJGaXJlYmFzZS5vZmZBdXRoXCIsMSxhLCExKTt5YShcIkZpcmViYXNlLm9mZkF1dGhcIiwyLGIpO3RoaXMuaS5JLm5iKFwiYXV0aF9zdGF0dXNcIixhLGIpfTtHLnByb3RvdHlwZS5vZmZBdXRoPUcucHJvdG90eXBlLkRlO0cucHJvdG90eXBlLmplPWZ1bmN0aW9uKGEsYixjKXt4KFwiRmlyZWJhc2UuYXV0aFdpdGhDdXN0b21Ub2tlblwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTtOYShcIkZpcmViYXNlLmF1dGhXaXRoQ3VzdG9tVG9rZW5cIixhKTt6KFwiRmlyZWJhc2UuYXV0aFdpdGhDdXN0b21Ub2tlblwiLDIsYiwhMSk7RShcIkZpcmViYXNlLmF1dGhXaXRoQ3VzdG9tVG9rZW5cIiwzLGMsITApO01lKHRoaXMuaS5JLGEse30sY3x8e30sYil9O0cucHJvdG90eXBlLmF1dGhXaXRoQ3VzdG9tVG9rZW49Ry5wcm90b3R5cGUuamU7XG5HLnByb3RvdHlwZS5rZT1mdW5jdGlvbihhLGIsYyl7eChcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhQb3B1cFwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTtPYShcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhQb3B1cFwiLDEsYSk7eihcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhQb3B1cFwiLDIsYiwhMSk7RShcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhQb3B1cFwiLDMsYywhMCk7UmUodGhpcy5pLkksYSxjLGIpfTtHLnByb3RvdHlwZS5hdXRoV2l0aE9BdXRoUG9wdXA9Ry5wcm90b3R5cGUua2U7XG5HLnByb3RvdHlwZS5sZT1mdW5jdGlvbihhLGIsYyl7eChcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhSZWRpcmVjdFwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTtPYShcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhSZWRpcmVjdFwiLDEsYSk7eihcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhSZWRpcmVjdFwiLDIsYiwhMSk7RShcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhSZWRpcmVjdFwiLDMsYywhMCk7dmFyIGQ9dGhpcy5pLkk7UGUoZCk7dmFyIGU9W0ZlXSxmPW9lKGMpO1wiYW5vbnltb3VzXCI9PT1hfHxcImZpcmViYXNlXCI9PT1hP1AoYixXKFwiVFJBTlNQT1JUX1VOQVZBSUxBQkxFXCIpKTooSi5zZXQoXCJyZWRpcmVjdF9jbGllbnRfb3B0aW9uc1wiLGYuaGMpLFFlKGQsZSxcIi9hdXRoL1wiK2EsZixiKSl9O0cucHJvdG90eXBlLmF1dGhXaXRoT0F1dGhSZWRpcmVjdD1HLnByb3RvdHlwZS5sZTtcbkcucHJvdG90eXBlLm1lPWZ1bmN0aW9uKGEsYixjLGQpe3goXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoVG9rZW5cIiwzLDQsYXJndW1lbnRzLmxlbmd0aCk7T2EoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoVG9rZW5cIiwxLGEpO3ooXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoVG9rZW5cIiwzLGMsITEpO0UoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoVG9rZW5cIiw0LGQsITApO3AoYik/KE9hKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFRva2VuXCIsMixiKSxPZSh0aGlzLmkuSSxhK1wiL3Rva2VuXCIse2FjY2Vzc190b2tlbjpifSxkLGMpKTooRShcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhUb2tlblwiLDIsYiwhMSksT2UodGhpcy5pLkksYStcIi90b2tlblwiLGIsZCxjKSl9O0cucHJvdG90eXBlLmF1dGhXaXRoT0F1dGhUb2tlbj1HLnByb3RvdHlwZS5tZTtcbkcucHJvdG90eXBlLmllPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLmF1dGhBbm9ueW1vdXNseVwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTt6KFwiRmlyZWJhc2UuYXV0aEFub255bW91c2x5XCIsMSxhLCExKTtFKFwiRmlyZWJhc2UuYXV0aEFub255bW91c2x5XCIsMixiLCEwKTtPZSh0aGlzLmkuSSxcImFub255bW91c1wiLHt9LGIsYSl9O0cucHJvdG90eXBlLmF1dGhBbm9ueW1vdXNseT1HLnByb3RvdHlwZS5pZTtcbkcucHJvdG90eXBlLm5lPWZ1bmN0aW9uKGEsYixjKXt4KFwiRmlyZWJhc2UuYXV0aFdpdGhQYXNzd29yZFwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTtFKFwiRmlyZWJhc2UuYXV0aFdpdGhQYXNzd29yZFwiLDEsYSwhMSk7UGEoXCJGaXJlYmFzZS5hdXRoV2l0aFBhc3N3b3JkXCIsYSxcImVtYWlsXCIpO1BhKFwiRmlyZWJhc2UuYXV0aFdpdGhQYXNzd29yZFwiLGEsXCJwYXNzd29yZFwiKTt6KFwiRmlyZWJhc2UuYXV0aEFub255bW91c2x5XCIsMixiLCExKTtFKFwiRmlyZWJhc2UuYXV0aEFub255bW91c2x5XCIsMyxjLCEwKTtPZSh0aGlzLmkuSSxcInBhc3N3b3JkXCIsYSxjLGIpfTtHLnByb3RvdHlwZS5hdXRoV2l0aFBhc3N3b3JkPUcucHJvdG90eXBlLm5lO1xuRy5wcm90b3R5cGUuWGM9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2UuY3JlYXRlVXNlclwiLDIsMixhcmd1bWVudHMubGVuZ3RoKTtFKFwiRmlyZWJhc2UuY3JlYXRlVXNlclwiLDEsYSwhMSk7UGEoXCJGaXJlYmFzZS5jcmVhdGVVc2VyXCIsYSxcImVtYWlsXCIpO1BhKFwiRmlyZWJhc2UuY3JlYXRlVXNlclwiLGEsXCJwYXNzd29yZFwiKTt6KFwiRmlyZWJhc2UuY3JlYXRlVXNlclwiLDIsYiwhMSk7dGhpcy5pLkkuWGMoYSxiKX07Ry5wcm90b3R5cGUuY3JlYXRlVXNlcj1HLnByb3RvdHlwZS5YYztHLnByb3RvdHlwZS5zZD1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5yZW1vdmVVc2VyXCIsMiwyLGFyZ3VtZW50cy5sZW5ndGgpO0UoXCJGaXJlYmFzZS5yZW1vdmVVc2VyXCIsMSxhLCExKTtQYShcIkZpcmViYXNlLnJlbW92ZVVzZXJcIixhLFwiZW1haWxcIik7UGEoXCJGaXJlYmFzZS5yZW1vdmVVc2VyXCIsYSxcInBhc3N3b3JkXCIpO3ooXCJGaXJlYmFzZS5yZW1vdmVVc2VyXCIsMixiLCExKTt0aGlzLmkuSS5zZChhLGIpfTtcbkcucHJvdG90eXBlLnJlbW92ZVVzZXI9Ry5wcm90b3R5cGUuc2Q7Ry5wcm90b3R5cGUuVGM9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2UuY2hhbmdlUGFzc3dvcmRcIiwyLDIsYXJndW1lbnRzLmxlbmd0aCk7RShcIkZpcmViYXNlLmNoYW5nZVBhc3N3b3JkXCIsMSxhLCExKTtQYShcIkZpcmViYXNlLmNoYW5nZVBhc3N3b3JkXCIsYSxcImVtYWlsXCIpO1BhKFwiRmlyZWJhc2UuY2hhbmdlUGFzc3dvcmRcIixhLFwib2xkUGFzc3dvcmRcIik7UGEoXCJGaXJlYmFzZS5jaGFuZ2VQYXNzd29yZFwiLGEsXCJuZXdQYXNzd29yZFwiKTt6KFwiRmlyZWJhc2UuY2hhbmdlUGFzc3dvcmRcIiwyLGIsITEpO3RoaXMuaS5JLlRjKGEsYil9O0cucHJvdG90eXBlLmNoYW5nZVBhc3N3b3JkPUcucHJvdG90eXBlLlRjO1xuRy5wcm90b3R5cGUudGQ9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2UucmVzZXRQYXNzd29yZFwiLDIsMixhcmd1bWVudHMubGVuZ3RoKTtFKFwiRmlyZWJhc2UucmVzZXRQYXNzd29yZFwiLDEsYSwhMSk7UGEoXCJGaXJlYmFzZS5yZXNldFBhc3N3b3JkXCIsYSxcImVtYWlsXCIpO3ooXCJGaXJlYmFzZS5yZXNldFBhc3N3b3JkXCIsMixiLCExKTt0aGlzLmkuSS50ZChhLGIpfTtHLnByb3RvdHlwZS5yZXNldFBhc3N3b3JkPUcucHJvdG90eXBlLnRkO0cuZ29PZmZsaW5lPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLmdvT2ZmbGluZVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtZLmliKCkuUWEoKX07Ry5nb09ubGluZT1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5nb09ubGluZVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtZLmliKCkudGIoKX07XG5mdW5jdGlvbiBiYyhhLGIpe3YoIWJ8fCEwPT09YXx8ITE9PT1hLFwiQ2FuJ3QgdHVybiBvbiBjdXN0b20gbG9nZ2VycyBwZXJzaXN0ZW50bHkuXCIpOyEwPT09YT8oXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBjb25zb2xlJiYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGNvbnNvbGUubG9nPyRiPXIoY29uc29sZS5sb2csY29uc29sZSk6XCJvYmplY3RcIj09PXR5cGVvZiBjb25zb2xlLmxvZyYmKCRiPWZ1bmN0aW9uKGEpe2NvbnNvbGUubG9nKGEpfSkpLGImJkouc2V0KFwibG9nZ2luZ19lbmFibGVkXCIsITApKTphPyRiPWE6KCRiPW51bGwsSi5yZW1vdmUoXCJsb2dnaW5nX2VuYWJsZWRcIikpfUcuZW5hYmxlTG9nZ2luZz1iYztHLlNlcnZlclZhbHVlPXtUSU1FU1RBTVA6e1wiLnN2XCI6XCJ0aW1lc3RhbXBcIn19O0cuU0RLX1ZFUlNJT049XCIxLjEuM1wiO0cuSU5URVJOQUw9WjtHLkNvbnRleHQ9WTt9KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBGaXJlYmFzZTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJWQ21Fc3dcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLlxcXFxub2RlX21vZHVsZXNcXFxcZmlyZWJhc2VcXFxcbGliXFxcXGZpcmViYXNlLXdlYi5qc1wiLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxmaXJlYmFzZVxcXFxsaWJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5fdXNlVHlwZWRBcnJheXNgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAoY29tcGF0aWJsZSBkb3duIHRvIElFNilcbiAqL1xuQnVmZmVyLl91c2VUeXBlZEFycmF5cyA9IChmdW5jdGlvbiAoKSB7XG4gIC8vIERldGVjdCBpZiBicm93c2VyIHN1cHBvcnRzIFR5cGVkIEFycmF5cy4gU3VwcG9ydGVkIGJyb3dzZXJzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssXG4gIC8vIENocm9tZSA3KywgU2FmYXJpIDUuMSssIE9wZXJhIDExLjYrLCBpT1MgNC4yKy4gSWYgdGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBhZGRpbmdcbiAgLy8gcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLCB0aGVuIHRoYXQncyB0aGUgc2FtZSBhcyBubyBgVWludDhBcnJheWAgc3VwcG9ydFxuICAvLyBiZWNhdXNlIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBhZGQgYWxsIHRoZSBub2RlIEJ1ZmZlciBBUEkgbWV0aG9kcy4gVGhpcyBpcyBhbiBpc3N1ZVxuICAvLyBpbiBGaXJlZm94IDQtMjkuIE5vdyBmaXhlZDogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4XG4gIHRyeSB7XG4gICAgdmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcigwKVxuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheShidWYpXG4gICAgYXJyLmZvbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH1cbiAgICByZXR1cm4gNDIgPT09IGFyci5mb28oKSAmJlxuICAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nIC8vIENocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn0pKClcblxuLyoqXG4gKiBDbGFzczogQnVmZmVyXG4gKiA9PT09PT09PT09PT09XG4gKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBhcmUgYXVnbWVudGVkXG4gKiB3aXRoIGZ1bmN0aW9uIHByb3BlcnRpZXMgZm9yIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBBUEkgZnVuY3Rpb25zLiBXZSB1c2VcbiAqIGBVaW50OEFycmF5YCBzbyB0aGF0IHNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0IHJldHVybnNcbiAqIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIEJ5IGF1Z21lbnRpbmcgdGhlIGluc3RhbmNlcywgd2UgY2FuIGF2b2lkIG1vZGlmeWluZyB0aGUgYFVpbnQ4QXJyYXlgXG4gKiBwcm90b3R5cGUuXG4gKi9cbmZ1bmN0aW9uIEJ1ZmZlciAoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSlcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKVxuXG4gIHZhciB0eXBlID0gdHlwZW9mIHN1YmplY3RcblxuICAvLyBXb3JrYXJvdW5kOiBub2RlJ3MgYmFzZTY0IGltcGxlbWVudGF0aW9uIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBzdHJpbmdzXG4gIC8vIHdoaWxlIGJhc2U2NC1qcyBkb2VzIG5vdC5cbiAgaWYgKGVuY29kaW5nID09PSAnYmFzZTY0JyAmJiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHN1YmplY3QgPSBzdHJpbmd0cmltKHN1YmplY3QpXG4gICAgd2hpbGUgKHN1YmplY3QubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgICAgc3ViamVjdCA9IHN1YmplY3QgKyAnPSdcbiAgICB9XG4gIH1cblxuICAvLyBGaW5kIHRoZSBsZW5ndGhcbiAgdmFyIGxlbmd0aFxuICBpZiAodHlwZSA9PT0gJ251bWJlcicpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKVxuICAgIGxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHN1YmplY3QsIGVuY29kaW5nKVxuICBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0JylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdC5sZW5ndGgpIC8vIGFzc3VtZSB0aGF0IG9iamVjdCBpcyBhcnJheS1saWtlXG4gIGVsc2VcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG5lZWRzIHRvIGJlIGEgbnVtYmVyLCBhcnJheSBvciBzdHJpbmcuJylcblxuICB2YXIgYnVmXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgLy8gUHJlZmVycmVkOiBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIGJ1ZiA9IEJ1ZmZlci5fYXVnbWVudChuZXcgVWludDhBcnJheShsZW5ndGgpKVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gVEhJUyBpbnN0YW5jZSBvZiBCdWZmZXIgKGNyZWF0ZWQgYnkgYG5ld2ApXG4gICAgYnVmID0gdGhpc1xuICAgIGJ1Zi5sZW5ndGggPSBsZW5ndGhcbiAgICBidWYuX2lzQnVmZmVyID0gdHJ1ZVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgdHlwZW9mIHN1YmplY3QuYnl0ZUxlbmd0aCA9PT0gJ251bWJlcicpIHtcbiAgICAvLyBTcGVlZCBvcHRpbWl6YXRpb24gLS0gdXNlIHNldCBpZiB3ZSdyZSBjb3B5aW5nIGZyb20gYSB0eXBlZCBhcnJheVxuICAgIGJ1Zi5fc2V0KHN1YmplY3QpXG4gIH0gZWxzZSBpZiAoaXNBcnJheWlzaChzdWJqZWN0KSkge1xuICAgIC8vIFRyZWF0IGFycmF5LWlzaCBvYmplY3RzIGFzIGEgYnl0ZSBhcnJheVxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSlcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdC5yZWFkVUludDgoaSlcbiAgICAgIGVsc2VcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdFtpXVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIGJ1Zi53cml0ZShzdWJqZWN0LCAwLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiAhQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiAhbm9aZXJvKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBidWZbaV0gPSAwXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBTVEFUSUMgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIChiKSB7XG4gIHJldHVybiAhIShiICE9PSBudWxsICYmIGIgIT09IHVuZGVmaW5lZCAmJiBiLl9pc0J1ZmZlcilcbn1cblxuQnVmZmVyLmJ5dGVMZW5ndGggPSBmdW5jdGlvbiAoc3RyLCBlbmNvZGluZykge1xuICB2YXIgcmV0XG4gIHN0ciA9IHN0ciArICcnXG4gIHN3aXRjaCAoZW5jb2RpbmcgfHwgJ3V0ZjgnKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggLyAyXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IHV0ZjhUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBiYXNlNjRUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoICogMlxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiAobGlzdCwgdG90YWxMZW5ndGgpIHtcbiAgYXNzZXJ0KGlzQXJyYXkobGlzdCksICdVc2FnZTogQnVmZmVyLmNvbmNhdChsaXN0LCBbdG90YWxMZW5ndGhdKVxcbicgK1xuICAgICAgJ2xpc3Qgc2hvdWxkIGJlIGFuIEFycmF5LicpXG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoMClcbiAgfSBlbHNlIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBsaXN0WzBdXG4gIH1cblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHRvdGFsTGVuZ3RoICE9PSAnbnVtYmVyJykge1xuICAgIHRvdGFsTGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0b3RhbExlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKHRvdGFsTGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXVxuICAgIGl0ZW0uY29weShidWYsIHBvcylcbiAgICBwb3MgKz0gaXRlbS5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbi8vIEJVRkZFUiBJTlNUQU5DRSBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBfaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBhc3NlcnQoc3RyTGVuICUgMiA9PT0gMCwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBieXRlID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGFzc2VydCghaXNOYU4oYnl0ZSksICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IGJ5dGVcbiAgfVxuICBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IGkgKiAyXG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIF91dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYmluYXJ5V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gX2FzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIFN1cHBvcnQgYm90aCAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpXG4gIC8vIGFuZCB0aGUgbGVnYWN5IChzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIH0gZWxzZSB7ICAvLyBsZWdhY3lcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nXG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBvZmZzZXQgPSBsZW5ndGhcbiAgICBsZW5ndGggPSBzd2FwXG4gIH1cblxuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuICBzdGFydCA9IE51bWJlcihzdGFydCkgfHwgMFxuICBlbmQgPSAoZW5kICE9PSB1bmRlZmluZWQpXG4gICAgPyBOdW1iZXIoZW5kKVxuICAgIDogZW5kID0gc2VsZi5sZW5ndGhcblxuICAvLyBGYXN0cGF0aCBlbXB0eSBzdHJpbmdzXG4gIGlmIChlbmQgPT09IHN0YXJ0KVxuICAgIHJldHVybiAnJ1xuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAodGFyZ2V0LCB0YXJnZXRfc3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNvdXJjZSA9IHRoaXNcblxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAoIXRhcmdldF9zdGFydCkgdGFyZ2V0X3N0YXJ0ID0gMFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHNvdXJjZS5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ3NvdXJjZUVuZCA8IHNvdXJjZVN0YXJ0JylcbiAgYXNzZXJ0KHRhcmdldF9zdGFydCA+PSAwICYmIHRhcmdldF9zdGFydCA8IHRhcmdldC5sZW5ndGgsXG4gICAgICAndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgc291cmNlLmxlbmd0aCwgJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKVxuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0IDwgZW5kIC0gc3RhcnQpXG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCArIHN0YXJ0XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG5cbiAgaWYgKGxlbiA8IDEwMCB8fCAhQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICB0YXJnZXRbaSArIHRhcmdldF9zdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQuX3NldCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksIHRhcmdldF9zdGFydClcbiAgfVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIF91dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmVzID0gJydcbiAgdmFyIHRtcCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIGlmIChidWZbaV0gPD0gMHg3Rikge1xuICAgICAgcmVzICs9IGRlY29kZVV0ZjhDaGFyKHRtcCkgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgICAgIHRtcCA9ICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRtcCArPSAnJScgKyBidWZbaV0udG9TdHJpbmcoMTYpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcyArIGRlY29kZVV0ZjhDaGFyKHRtcClcbn1cblxuZnVuY3Rpb24gX2FzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKVxuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBfYmluYXJ5U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gX2FzY2lpU2xpY2UoYnVmLCBzdGFydCwgZW5kKVxufVxuXG5mdW5jdGlvbiBfaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpKzFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IGNsYW1wKHN0YXJ0LCBsZW4sIDApXG4gIGVuZCA9IGNsYW1wKGVuZCwgbGVuLCBsZW4pXG5cbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICByZXR1cm4gQnVmZmVyLl9hdWdtZW50KHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCkpXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICB2YXIgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkLCB0cnVlKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47IGkrKykge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICAgIHJldHVybiBuZXdCdWZcbiAgfVxufVxuXG4vLyBgZ2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuZ2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy5yZWFkVUludDgob2Zmc2V0KVxufVxuXG4vLyBgc2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodiwgb2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuc2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy53cml0ZVVJbnQ4KHYsIG9mZnNldClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gIH0gZWxzZSB7XG4gICAgdmFsID0gYnVmW29mZnNldF0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMl0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICAgIHZhbCB8PSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXQgKyAzXSA8PCAyNCA+Pj4gMClcbiAgfSBlbHNlIHtcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAxXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAyXSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDNdXG4gICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXRdIDw8IDI0ID4+PiAwKVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHZhciBuZWcgPSB0aGlzW29mZnNldF0gJiAweDgwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDE2KGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQzMihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwMDAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRGbG9hdCAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZERvdWJsZSAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmYpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKSByZXR1cm5cblxuICB0aGlzW29mZnNldF0gPSB2YWx1ZVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDIpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgICAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCA0KTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZiwgLTB4ODApXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIHRoaXMud3JpdGVVSW50OCh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydClcbiAgZWxzZVxuICAgIHRoaXMud3JpdGVVSW50OCgweGZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmYsIC0weDgwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MTYoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgMHhmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQzMihidWYsIDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGZpbGwodmFsdWUsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gKHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIGlmICghdmFsdWUpIHZhbHVlID0gMFxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQpIGVuZCA9IHRoaXMubGVuZ3RoXG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLmNoYXJDb2RlQXQoMClcbiAgfVxuXG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSksICd2YWx1ZSBpcyBub3QgYSBudW1iZXInKVxuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnZW5kIDwgc3RhcnQnKVxuXG4gIC8vIEZpbGwgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCB0aGlzLmxlbmd0aCwgJ3N0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHRoaXMubGVuZ3RoLCAnZW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdGhpc1tpXSA9IHZhbHVlXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgb3V0ID0gW11cbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBvdXRbaV0gPSB0b0hleCh0aGlzW2ldKVxuICAgIGlmIChpID09PSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTKSB7XG4gICAgICBvdXRbaSArIDFdID0gJy4uLidcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgb3V0LmpvaW4oJyAnKSArICc+J1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgYEFycmF5QnVmZmVyYCB3aXRoIHRoZSAqY29waWVkKiBtZW1vcnkgb2YgdGhlIGJ1ZmZlciBpbnN0YW5jZS5cbiAqIEFkZGVkIGluIE5vZGUgMC4xMi4gT25seSBhdmFpbGFibGUgaW4gYnJvd3NlcnMgdGhhdCBzdXBwb3J0IEFycmF5QnVmZmVyLlxuICovXG5CdWZmZXIucHJvdG90eXBlLnRvQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgICAgcmV0dXJuIChuZXcgQnVmZmVyKHRoaXMpKS5idWZmZXJcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KHRoaXMubGVuZ3RoKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGJ1Zi5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSlcbiAgICAgICAgYnVmW2ldID0gdGhpc1tpXVxuICAgICAgcmV0dXJuIGJ1Zi5idWZmZXJcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdCdWZmZXIudG9BcnJheUJ1ZmZlciBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlcicpXG4gIH1cbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG52YXIgQlAgPSBCdWZmZXIucHJvdG90eXBlXG5cbi8qKlxuICogQXVnbWVudCBhIFVpbnQ4QXJyYXkgKmluc3RhbmNlKiAobm90IHRoZSBVaW50OEFycmF5IGNsYXNzISkgd2l0aCBCdWZmZXIgbWV0aG9kc1xuICovXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5faXNCdWZmZXIgPSB0cnVlXG5cbiAgLy8gc2F2ZSByZWZlcmVuY2UgdG8gb3JpZ2luYWwgVWludDhBcnJheSBnZXQvc2V0IG1ldGhvZHMgYmVmb3JlIG92ZXJ3cml0aW5nXG4gIGFyci5fZ2V0ID0gYXJyLmdldFxuICBhcnIuX3NldCA9IGFyci5zZXRcblxuICAvLyBkZXByZWNhdGVkLCB3aWxsIGJlIHJlbW92ZWQgaW4gbm9kZSAwLjEzK1xuICBhcnIuZ2V0ID0gQlAuZ2V0XG4gIGFyci5zZXQgPSBCUC5zZXRcblxuICBhcnIud3JpdGUgPSBCUC53cml0ZVxuICBhcnIudG9TdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9Mb2NhbGVTdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9KU09OID0gQlAudG9KU09OXG4gIGFyci5jb3B5ID0gQlAuY29weVxuICBhcnIuc2xpY2UgPSBCUC5zbGljZVxuICBhcnIucmVhZFVJbnQ4ID0gQlAucmVhZFVJbnQ4XG4gIGFyci5yZWFkVUludDE2TEUgPSBCUC5yZWFkVUludDE2TEVcbiAgYXJyLnJlYWRVSW50MTZCRSA9IEJQLnJlYWRVSW50MTZCRVxuICBhcnIucmVhZFVJbnQzMkxFID0gQlAucmVhZFVJbnQzMkxFXG4gIGFyci5yZWFkVUludDMyQkUgPSBCUC5yZWFkVUludDMyQkVcbiAgYXJyLnJlYWRJbnQ4ID0gQlAucmVhZEludDhcbiAgYXJyLnJlYWRJbnQxNkxFID0gQlAucmVhZEludDE2TEVcbiAgYXJyLnJlYWRJbnQxNkJFID0gQlAucmVhZEludDE2QkVcbiAgYXJyLnJlYWRJbnQzMkxFID0gQlAucmVhZEludDMyTEVcbiAgYXJyLnJlYWRJbnQzMkJFID0gQlAucmVhZEludDMyQkVcbiAgYXJyLnJlYWRGbG9hdExFID0gQlAucmVhZEZsb2F0TEVcbiAgYXJyLnJlYWRGbG9hdEJFID0gQlAucmVhZEZsb2F0QkVcbiAgYXJyLnJlYWREb3VibGVMRSA9IEJQLnJlYWREb3VibGVMRVxuICBhcnIucmVhZERvdWJsZUJFID0gQlAucmVhZERvdWJsZUJFXG4gIGFyci53cml0ZVVJbnQ4ID0gQlAud3JpdGVVSW50OFxuICBhcnIud3JpdGVVSW50MTZMRSA9IEJQLndyaXRlVUludDE2TEVcbiAgYXJyLndyaXRlVUludDE2QkUgPSBCUC53cml0ZVVJbnQxNkJFXG4gIGFyci53cml0ZVVJbnQzMkxFID0gQlAud3JpdGVVSW50MzJMRVxuICBhcnIud3JpdGVVSW50MzJCRSA9IEJQLndyaXRlVUludDMyQkVcbiAgYXJyLndyaXRlSW50OCA9IEJQLndyaXRlSW50OFxuICBhcnIud3JpdGVJbnQxNkxFID0gQlAud3JpdGVJbnQxNkxFXG4gIGFyci53cml0ZUludDE2QkUgPSBCUC53cml0ZUludDE2QkVcbiAgYXJyLndyaXRlSW50MzJMRSA9IEJQLndyaXRlSW50MzJMRVxuICBhcnIud3JpdGVJbnQzMkJFID0gQlAud3JpdGVJbnQzMkJFXG4gIGFyci53cml0ZUZsb2F0TEUgPSBCUC53cml0ZUZsb2F0TEVcbiAgYXJyLndyaXRlRmxvYXRCRSA9IEJQLndyaXRlRmxvYXRCRVxuICBhcnIud3JpdGVEb3VibGVMRSA9IEJQLndyaXRlRG91YmxlTEVcbiAgYXJyLndyaXRlRG91YmxlQkUgPSBCUC53cml0ZURvdWJsZUJFXG4gIGFyci5maWxsID0gQlAuZmlsbFxuICBhcnIuaW5zcGVjdCA9IEJQLmluc3BlY3RcbiAgYXJyLnRvQXJyYXlCdWZmZXIgPSBCUC50b0FycmF5QnVmZmVyXG5cbiAgcmV0dXJuIGFyclxufVxuXG4vLyBzbGljZShzdGFydCwgZW5kKVxuZnVuY3Rpb24gY2xhbXAgKGluZGV4LCBsZW4sIGRlZmF1bHRWYWx1ZSkge1xuICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykgcmV0dXJuIGRlZmF1bHRWYWx1ZVxuICBpbmRleCA9IH5+aW5kZXg7ICAvLyBDb2VyY2UgdG8gaW50ZWdlci5cbiAgaWYgKGluZGV4ID49IGxlbikgcmV0dXJuIGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIGluZGV4ICs9IGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGNvZXJjZSAobGVuZ3RoKSB7XG4gIC8vIENvZXJjZSBsZW5ndGggdG8gYSBudW1iZXIgKHBvc3NpYmx5IE5hTiksIHJvdW5kIHVwXG4gIC8vIGluIGNhc2UgaXQncyBmcmFjdGlvbmFsIChlLmcuIDEyMy40NTYpIHRoZW4gZG8gYVxuICAvLyBkb3VibGUgbmVnYXRlIHRvIGNvZXJjZSBhIE5hTiB0byAwLiBFYXN5LCByaWdodD9cbiAgbGVuZ3RoID0gfn5NYXRoLmNlaWwoK2xlbmd0aClcbiAgcmV0dXJuIGxlbmd0aCA8IDAgPyAwIDogbGVuZ3RoXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkgKHN1YmplY3QpIHtcbiAgcmV0dXJuIChBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChzdWJqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzdWJqZWN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xuICB9KShzdWJqZWN0KVxufVxuXG5mdW5jdGlvbiBpc0FycmF5aXNoIChzdWJqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5KHN1YmplY3QpIHx8IEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSB8fFxuICAgICAgc3ViamVjdCAmJiB0eXBlb2Ygc3ViamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIHR5cGVvZiBzdWJqZWN0Lmxlbmd0aCA9PT0gJ251bWJlcidcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIHZhciBiID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBpZiAoYiA8PSAweDdGKVxuICAgICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpXG4gICAgZWxzZSB7XG4gICAgICB2YXIgc3RhcnQgPSBpXG4gICAgICBpZiAoYiA+PSAweEQ4MDAgJiYgYiA8PSAweERGRkYpIGkrK1xuICAgICAgdmFyIGggPSBlbmNvZGVVUklDb21wb25lbnQoc3RyLnNsaWNlKHN0YXJ0LCBpKzEpKS5zdWJzdHIoMSkuc3BsaXQoJyUnKVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBoLmxlbmd0aDsgaisrKVxuICAgICAgICBieXRlQXJyYXkucHVzaChwYXJzZUludChoW2pdLCAxNikpXG4gICAgfVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KHN0cilcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBwb3NcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSlcbiAgICAgIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gZGVjb2RlVXRmOENoYXIgKHN0cikge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgweEZGRkQpIC8vIFVURiA4IGludmFsaWQgY2hhclxuICB9XG59XG5cbi8qXG4gKiBXZSBoYXZlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSB2YWx1ZSBpcyBhIHZhbGlkIGludGVnZXIuIFRoaXMgbWVhbnMgdGhhdCBpdFxuICogaXMgbm9uLW5lZ2F0aXZlLiBJdCBoYXMgbm8gZnJhY3Rpb25hbCBjb21wb25lbnQgYW5kIHRoYXQgaXQgZG9lcyBub3RcbiAqIGV4Y2VlZCB0aGUgbWF4aW11bSBhbGxvd2VkIHZhbHVlLlxuICovXG5mdW5jdGlvbiB2ZXJpZnVpbnQgKHZhbHVlLCBtYXgpIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlID49IDAsICdzcGVjaWZpZWQgYSBuZWdhdGl2ZSB2YWx1ZSBmb3Igd3JpdGluZyBhbiB1bnNpZ25lZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBpcyBsYXJnZXIgdGhhbiBtYXhpbXVtIHZhbHVlIGZvciB0eXBlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZzaW50ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZJRUVFNzU0ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbn1cblxuZnVuY3Rpb24gYXNzZXJ0ICh0ZXN0LCBtZXNzYWdlKSB7XG4gIGlmICghdGVzdCkgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UgfHwgJ0ZhaWxlZCBhc3NlcnRpb24nKVxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlZDbUVzd1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxndWxwLWJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGJ1ZmZlclxcXFxpbmRleC5qc1wiLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxndWxwLWJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGJ1ZmZlclwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cblx0ZnVuY3Rpb24gZGVjb2RlIChlbHQpIHtcblx0XHR2YXIgY29kZSA9IGVsdC5jaGFyQ29kZUF0KDApXG5cdFx0aWYgKGNvZGUgPT09IFBMVVMpXG5cdFx0XHRyZXR1cm4gNjIgLy8gJysnXG5cdFx0aWYgKGNvZGUgPT09IFNMQVNIKVxuXHRcdFx0cmV0dXJuIDYzIC8vICcvJ1xuXHRcdGlmIChjb2RlIDwgTlVNQkVSKVxuXHRcdFx0cmV0dXJuIC0xIC8vbm8gbWF0Y2hcblx0XHRpZiAoY29kZSA8IE5VTUJFUiArIDEwKVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBOVU1CRVIgKyAyNiArIDI2XG5cdFx0aWYgKGNvZGUgPCBVUFBFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBVUFBFUlxuXHRcdGlmIChjb2RlIDwgTE9XRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gTE9XRVIgKyAyNlxuXHR9XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkgKGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG5cblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHR2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXHRcdHBsYWNlSG9sZGVycyA9ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAyKSA/IDIgOiAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMSkgPyAxIDogMFxuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gbmV3IEFycihiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGhcblxuXHRcdHZhciBMID0gMFxuXG5cdFx0ZnVuY3Rpb24gcHVzaCAodikge1xuXHRcdFx0YXJyW0wrK10gPSB2XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxOCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCAxMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA8PCA2KSB8IGRlY29kZShiNjQuY2hhckF0KGkgKyAzKSlcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNilcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPj4gNClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxMCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCA0KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpID4+IDIpXG5cdFx0XHRwdXNoKCh0bXAgPj4gOCkgJiAweEZGKVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdHJldHVybiBhcnJcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQgKHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGhcblxuXHRcdGZ1bmN0aW9uIGVuY29kZSAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwLmNoYXJBdChudW0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBlbmNvZGUobnVtID4+IDE4ICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDEyICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDYgJiAweDNGKSArIGVuY29kZShudW0gJiAweDNGKVxuXHRcdH1cblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApXG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV1cblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDIpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz09J1xuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMTApXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPj4gNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDIpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9J1xuXHRcdFx0XHRicmVha1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXRcblx0fVxuXG5cdGV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuXHRleHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0XG59KHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJyA/ICh0aGlzLmJhc2U2NGpzID0ge30pIDogZXhwb3J0cykpXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiVkNtRXN3XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi5cXFxcbm9kZV9tb2R1bGVzXFxcXGd1bHAtYnJvd3NlcmlmeVxcXFxub2RlX21vZHVsZXNcXFxcYnJvd3NlcmlmeVxcXFxub2RlX21vZHVsZXNcXFxcYnVmZmVyXFxcXG5vZGVfbW9kdWxlc1xcXFxiYXNlNjQtanNcXFxcbGliXFxcXGI2NC5qc1wiLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxndWxwLWJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGJ1ZmZlclxcXFxub2RlX21vZHVsZXNcXFxcYmFzZTY0LWpzXFxcXGxpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sXG4gICAgICBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxLFxuICAgICAgZU1heCA9ICgxIDw8IGVMZW4pIC0gMSxcbiAgICAgIGVCaWFzID0gZU1heCA+PiAxLFxuICAgICAgbkJpdHMgPSAtNyxcbiAgICAgIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMCxcbiAgICAgIGQgPSBpc0xFID8gLTEgOiAxLFxuICAgICAgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXTtcblxuICBpICs9IGQ7XG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSk7XG4gIHMgPj49ICgtbkJpdHMpO1xuICBuQml0cyArPSBlTGVuO1xuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KTtcblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKTtcbiAgZSA+Pj0gKC1uQml0cyk7XG4gIG5CaXRzICs9IG1MZW47XG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpO1xuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhcztcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpO1xuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbik7XG4gICAgZSA9IGUgLSBlQmlhcztcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKTtcbn07XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbihidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgYyxcbiAgICAgIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDEsXG4gICAgICBlTWF4ID0gKDEgPDwgZUxlbikgLSAxLFxuICAgICAgZUJpYXMgPSBlTWF4ID4+IDEsXG4gICAgICBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMCksXG4gICAgICBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSksXG4gICAgICBkID0gaXNMRSA/IDEgOiAtMSxcbiAgICAgIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDA7XG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSk7XG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDA7XG4gICAgZSA9IGVNYXg7XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpO1xuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLTtcbiAgICAgIGMgKj0gMjtcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKys7XG4gICAgICBjIC89IDI7XG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMDtcbiAgICAgIGUgPSBlTWF4O1xuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAodmFsdWUgKiBjIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKTtcbiAgICAgIGUgPSBlICsgZUJpYXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKTtcbiAgICAgIGUgPSAwO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpO1xuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG07XG4gIGVMZW4gKz0gbUxlbjtcbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KTtcblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjg7XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlZDbUVzd1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxndWxwLWJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGJ1ZmZlclxcXFxub2RlX21vZHVsZXNcXFxcaWVlZTc1NFxcXFxpbmRleC5qc1wiLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxndWxwLWJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGJ1ZmZlclxcXFxub2RlX21vZHVsZXNcXFxcaWVlZTc1NFwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG52YXIgaW50U2l6ZSA9IDQ7XG52YXIgemVyb0J1ZmZlciA9IG5ldyBCdWZmZXIoaW50U2l6ZSk7IHplcm9CdWZmZXIuZmlsbCgwKTtcbnZhciBjaHJzeiA9IDg7XG5cbmZ1bmN0aW9uIHRvQXJyYXkoYnVmLCBiaWdFbmRpYW4pIHtcbiAgaWYgKChidWYubGVuZ3RoICUgaW50U2l6ZSkgIT09IDApIHtcbiAgICB2YXIgbGVuID0gYnVmLmxlbmd0aCArIChpbnRTaXplIC0gKGJ1Zi5sZW5ndGggJSBpbnRTaXplKSk7XG4gICAgYnVmID0gQnVmZmVyLmNvbmNhdChbYnVmLCB6ZXJvQnVmZmVyXSwgbGVuKTtcbiAgfVxuXG4gIHZhciBhcnIgPSBbXTtcbiAgdmFyIGZuID0gYmlnRW5kaWFuID8gYnVmLnJlYWRJbnQzMkJFIDogYnVmLnJlYWRJbnQzMkxFO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1Zi5sZW5ndGg7IGkgKz0gaW50U2l6ZSkge1xuICAgIGFyci5wdXNoKGZuLmNhbGwoYnVmLCBpKSk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuZnVuY3Rpb24gdG9CdWZmZXIoYXJyLCBzaXplLCBiaWdFbmRpYW4pIHtcbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIoc2l6ZSk7XG4gIHZhciBmbiA9IGJpZ0VuZGlhbiA/IGJ1Zi53cml0ZUludDMyQkUgOiBidWYud3JpdGVJbnQzMkxFO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgIGZuLmNhbGwoYnVmLCBhcnJbaV0sIGkgKiA0LCB0cnVlKTtcbiAgfVxuICByZXR1cm4gYnVmO1xufVxuXG5mdW5jdGlvbiBoYXNoKGJ1ZiwgZm4sIGhhc2hTaXplLCBiaWdFbmRpYW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgYnVmID0gbmV3IEJ1ZmZlcihidWYpO1xuICB2YXIgYXJyID0gZm4odG9BcnJheShidWYsIGJpZ0VuZGlhbiksIGJ1Zi5sZW5ndGggKiBjaHJzeik7XG4gIHJldHVybiB0b0J1ZmZlcihhcnIsIGhhc2hTaXplLCBiaWdFbmRpYW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgaGFzaDogaGFzaCB9O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlZDbUVzd1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxndWxwLWJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGNyeXB0by1icm93c2VyaWZ5XFxcXGhlbHBlcnMuanNcIixcIi8uLlxcXFxub2RlX21vZHVsZXNcXFxcZ3VscC1icm93c2VyaWZ5XFxcXG5vZGVfbW9kdWxlc1xcXFxicm93c2VyaWZ5XFxcXG5vZGVfbW9kdWxlc1xcXFxjcnlwdG8tYnJvd3NlcmlmeVwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXJcbnZhciBzaGEgPSByZXF1aXJlKCcuL3NoYScpXG52YXIgc2hhMjU2ID0gcmVxdWlyZSgnLi9zaGEyNTYnKVxudmFyIHJuZyA9IHJlcXVpcmUoJy4vcm5nJylcbnZhciBtZDUgPSByZXF1aXJlKCcuL21kNScpXG5cbnZhciBhbGdvcml0aG1zID0ge1xuICBzaGExOiBzaGEsXG4gIHNoYTI1Njogc2hhMjU2LFxuICBtZDU6IG1kNVxufVxuXG52YXIgYmxvY2tzaXplID0gNjRcbnZhciB6ZXJvQnVmZmVyID0gbmV3IEJ1ZmZlcihibG9ja3NpemUpOyB6ZXJvQnVmZmVyLmZpbGwoMClcbmZ1bmN0aW9uIGhtYWMoZm4sIGtleSwgZGF0YSkge1xuICBpZighQnVmZmVyLmlzQnVmZmVyKGtleSkpIGtleSA9IG5ldyBCdWZmZXIoa2V5KVxuICBpZighQnVmZmVyLmlzQnVmZmVyKGRhdGEpKSBkYXRhID0gbmV3IEJ1ZmZlcihkYXRhKVxuXG4gIGlmKGtleS5sZW5ndGggPiBibG9ja3NpemUpIHtcbiAgICBrZXkgPSBmbihrZXkpXG4gIH0gZWxzZSBpZihrZXkubGVuZ3RoIDwgYmxvY2tzaXplKSB7XG4gICAga2V5ID0gQnVmZmVyLmNvbmNhdChba2V5LCB6ZXJvQnVmZmVyXSwgYmxvY2tzaXplKVxuICB9XG5cbiAgdmFyIGlwYWQgPSBuZXcgQnVmZmVyKGJsb2Nrc2l6ZSksIG9wYWQgPSBuZXcgQnVmZmVyKGJsb2Nrc2l6ZSlcbiAgZm9yKHZhciBpID0gMDsgaSA8IGJsb2Nrc2l6ZTsgaSsrKSB7XG4gICAgaXBhZFtpXSA9IGtleVtpXSBeIDB4MzZcbiAgICBvcGFkW2ldID0ga2V5W2ldIF4gMHg1Q1xuICB9XG5cbiAgdmFyIGhhc2ggPSBmbihCdWZmZXIuY29uY2F0KFtpcGFkLCBkYXRhXSkpXG4gIHJldHVybiBmbihCdWZmZXIuY29uY2F0KFtvcGFkLCBoYXNoXSkpXG59XG5cbmZ1bmN0aW9uIGhhc2goYWxnLCBrZXkpIHtcbiAgYWxnID0gYWxnIHx8ICdzaGExJ1xuICB2YXIgZm4gPSBhbGdvcml0aG1zW2FsZ11cbiAgdmFyIGJ1ZnMgPSBbXVxuICB2YXIgbGVuZ3RoID0gMFxuICBpZighZm4pIGVycm9yKCdhbGdvcml0aG06JywgYWxnLCAnaXMgbm90IHlldCBzdXBwb3J0ZWQnKVxuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIGlmKCFCdWZmZXIuaXNCdWZmZXIoZGF0YSkpIGRhdGEgPSBuZXcgQnVmZmVyKGRhdGEpXG4gICAgICAgIFxuICAgICAgYnVmcy5wdXNoKGRhdGEpXG4gICAgICBsZW5ndGggKz0gZGF0YS5sZW5ndGhcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcbiAgICBkaWdlc3Q6IGZ1bmN0aW9uIChlbmMpIHtcbiAgICAgIHZhciBidWYgPSBCdWZmZXIuY29uY2F0KGJ1ZnMpXG4gICAgICB2YXIgciA9IGtleSA/IGhtYWMoZm4sIGtleSwgYnVmKSA6IGZuKGJ1ZilcbiAgICAgIGJ1ZnMgPSBudWxsXG4gICAgICByZXR1cm4gZW5jID8gci50b1N0cmluZyhlbmMpIDogclxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBlcnJvciAoKSB7XG4gIHZhciBtID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpLmpvaW4oJyAnKVxuICB0aHJvdyBuZXcgRXJyb3IoW1xuICAgIG0sXG4gICAgJ3dlIGFjY2VwdCBwdWxsIHJlcXVlc3RzJyxcbiAgICAnaHR0cDovL2dpdGh1Yi5jb20vZG9taW5pY3RhcnIvY3J5cHRvLWJyb3dzZXJpZnknXG4gICAgXS5qb2luKCdcXG4nKSlcbn1cblxuZXhwb3J0cy5jcmVhdGVIYXNoID0gZnVuY3Rpb24gKGFsZykgeyByZXR1cm4gaGFzaChhbGcpIH1cbmV4cG9ydHMuY3JlYXRlSG1hYyA9IGZ1bmN0aW9uIChhbGcsIGtleSkgeyByZXR1cm4gaGFzaChhbGcsIGtleSkgfVxuZXhwb3J0cy5yYW5kb21CeXRlcyA9IGZ1bmN0aW9uKHNpemUsIGNhbGxiYWNrKSB7XG4gIGlmIChjYWxsYmFjayAmJiBjYWxsYmFjay5jYWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgdW5kZWZpbmVkLCBuZXcgQnVmZmVyKHJuZyhzaXplKSkpXG4gICAgfSBjYXRjaCAoZXJyKSB7IGNhbGxiYWNrKGVycikgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKHJuZyhzaXplKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBlYWNoKGEsIGYpIHtcbiAgZm9yKHZhciBpIGluIGEpXG4gICAgZihhW2ldLCBpKVxufVxuXG4vLyB0aGUgbGVhc3QgSSBjYW4gZG8gaXMgbWFrZSBlcnJvciBtZXNzYWdlcyBmb3IgdGhlIHJlc3Qgb2YgdGhlIG5vZGUuanMvY3J5cHRvIGFwaS5cbmVhY2goWydjcmVhdGVDcmVkZW50aWFscydcbiwgJ2NyZWF0ZUNpcGhlcidcbiwgJ2NyZWF0ZUNpcGhlcml2J1xuLCAnY3JlYXRlRGVjaXBoZXInXG4sICdjcmVhdGVEZWNpcGhlcml2J1xuLCAnY3JlYXRlU2lnbidcbiwgJ2NyZWF0ZVZlcmlmeSdcbiwgJ2NyZWF0ZURpZmZpZUhlbGxtYW4nXG4sICdwYmtkZjInXSwgZnVuY3Rpb24gKG5hbWUpIHtcbiAgZXhwb3J0c1tuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICBlcnJvcignc29ycnksJywgbmFtZSwgJ2lzIG5vdCBpbXBsZW1lbnRlZCB5ZXQnKVxuICB9XG59KVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlZDbUVzd1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxndWxwLWJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGNyeXB0by1icm93c2VyaWZ5XFxcXGluZGV4LmpzXCIsXCIvLi5cXFxcbm9kZV9tb2R1bGVzXFxcXGd1bHAtYnJvd3NlcmlmeVxcXFxub2RlX21vZHVsZXNcXFxcYnJvd3NlcmlmeVxcXFxub2RlX21vZHVsZXNcXFxcY3J5cHRvLWJyb3dzZXJpZnlcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKlxyXG4gKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFJTQSBEYXRhIFNlY3VyaXR5LCBJbmMuIE1ENSBNZXNzYWdlXHJcbiAqIERpZ2VzdCBBbGdvcml0aG0sIGFzIGRlZmluZWQgaW4gUkZDIDEzMjEuXHJcbiAqIFZlcnNpb24gMi4xIENvcHlyaWdodCAoQykgUGF1bCBKb2huc3RvbiAxOTk5IC0gMjAwMi5cclxuICogT3RoZXIgY29udHJpYnV0b3JzOiBHcmVnIEhvbHQsIEFuZHJldyBLZXBlcnQsIFlkbmFyLCBMb3N0aW5ldFxyXG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgQlNEIExpY2Vuc2VcclxuICogU2VlIGh0dHA6Ly9wYWpob21lLm9yZy51ay9jcnlwdC9tZDUgZm9yIG1vcmUgaW5mby5cclxuICovXHJcblxyXG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpO1xyXG5cclxuLypcclxuICogUGVyZm9ybSBhIHNpbXBsZSBzZWxmLXRlc3QgdG8gc2VlIGlmIHRoZSBWTSBpcyB3b3JraW5nXHJcbiAqL1xyXG5mdW5jdGlvbiBtZDVfdm1fdGVzdCgpXHJcbntcclxuICByZXR1cm4gaGV4X21kNShcImFiY1wiKSA9PSBcIjkwMDE1MDk4M2NkMjRmYjBkNjk2M2Y3ZDI4ZTE3ZjcyXCI7XHJcbn1cclxuXHJcbi8qXHJcbiAqIENhbGN1bGF0ZSB0aGUgTUQ1IG9mIGFuIGFycmF5IG9mIGxpdHRsZS1lbmRpYW4gd29yZHMsIGFuZCBhIGJpdCBsZW5ndGhcclxuICovXHJcbmZ1bmN0aW9uIGNvcmVfbWQ1KHgsIGxlbilcclxue1xyXG4gIC8qIGFwcGVuZCBwYWRkaW5nICovXHJcbiAgeFtsZW4gPj4gNV0gfD0gMHg4MCA8PCAoKGxlbikgJSAzMik7XHJcbiAgeFsoKChsZW4gKyA2NCkgPj4+IDkpIDw8IDQpICsgMTRdID0gbGVuO1xyXG5cclxuICB2YXIgYSA9ICAxNzMyNTg0MTkzO1xyXG4gIHZhciBiID0gLTI3MTczMzg3OTtcclxuICB2YXIgYyA9IC0xNzMyNTg0MTk0O1xyXG4gIHZhciBkID0gIDI3MTczMzg3ODtcclxuXHJcbiAgZm9yKHZhciBpID0gMDsgaSA8IHgubGVuZ3RoOyBpICs9IDE2KVxyXG4gIHtcclxuICAgIHZhciBvbGRhID0gYTtcclxuICAgIHZhciBvbGRiID0gYjtcclxuICAgIHZhciBvbGRjID0gYztcclxuICAgIHZhciBvbGRkID0gZDtcclxuXHJcbiAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSsgMF0sIDcgLCAtNjgwODc2OTM2KTtcclxuICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpKyAxXSwgMTIsIC0zODk1NjQ1ODYpO1xyXG4gICAgYyA9IG1kNV9mZihjLCBkLCBhLCBiLCB4W2krIDJdLCAxNywgIDYwNjEwNTgxOSk7XHJcbiAgICBiID0gbWQ1X2ZmKGIsIGMsIGQsIGEsIHhbaSsgM10sIDIyLCAtMTA0NDUyNTMzMCk7XHJcbiAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSsgNF0sIDcgLCAtMTc2NDE4ODk3KTtcclxuICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpKyA1XSwgMTIsICAxMjAwMDgwNDI2KTtcclxuICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpKyA2XSwgMTcsIC0xNDczMjMxMzQxKTtcclxuICAgIGIgPSBtZDVfZmYoYiwgYywgZCwgYSwgeFtpKyA3XSwgMjIsIC00NTcwNTk4Myk7XHJcbiAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSsgOF0sIDcgLCAgMTc3MDAzNTQxNik7XHJcbiAgICBkID0gbWQ1X2ZmKGQsIGEsIGIsIGMsIHhbaSsgOV0sIDEyLCAtMTk1ODQxNDQxNyk7XHJcbiAgICBjID0gbWQ1X2ZmKGMsIGQsIGEsIGIsIHhbaSsxMF0sIDE3LCAtNDIwNjMpO1xyXG4gICAgYiA9IG1kNV9mZihiLCBjLCBkLCBhLCB4W2krMTFdLCAyMiwgLTE5OTA0MDQxNjIpO1xyXG4gICAgYSA9IG1kNV9mZihhLCBiLCBjLCBkLCB4W2krMTJdLCA3ICwgIDE4MDQ2MDM2ODIpO1xyXG4gICAgZCA9IG1kNV9mZihkLCBhLCBiLCBjLCB4W2krMTNdLCAxMiwgLTQwMzQxMTAxKTtcclxuICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpKzE0XSwgMTcsIC0xNTAyMDAyMjkwKTtcclxuICAgIGIgPSBtZDVfZmYoYiwgYywgZCwgYSwgeFtpKzE1XSwgMjIsICAxMjM2NTM1MzI5KTtcclxuXHJcbiAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSsgMV0sIDUgLCAtMTY1Nzk2NTEwKTtcclxuICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpKyA2XSwgOSAsIC0xMDY5NTAxNjMyKTtcclxuICAgIGMgPSBtZDVfZ2coYywgZCwgYSwgYiwgeFtpKzExXSwgMTQsICA2NDM3MTc3MTMpO1xyXG4gICAgYiA9IG1kNV9nZyhiLCBjLCBkLCBhLCB4W2krIDBdLCAyMCwgLTM3Mzg5NzMwMik7XHJcbiAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSsgNV0sIDUgLCAtNzAxNTU4NjkxKTtcclxuICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpKzEwXSwgOSAsICAzODAxNjA4Myk7XHJcbiAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSsxNV0sIDE0LCAtNjYwNDc4MzM1KTtcclxuICAgIGIgPSBtZDVfZ2coYiwgYywgZCwgYSwgeFtpKyA0XSwgMjAsIC00MDU1Mzc4NDgpO1xyXG4gICAgYSA9IG1kNV9nZyhhLCBiLCBjLCBkLCB4W2krIDldLCA1ICwgIDU2ODQ0NjQzOCk7XHJcbiAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSsxNF0sIDkgLCAtMTAxOTgwMzY5MCk7XHJcbiAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSsgM10sIDE0LCAtMTg3MzYzOTYxKTtcclxuICAgIGIgPSBtZDVfZ2coYiwgYywgZCwgYSwgeFtpKyA4XSwgMjAsICAxMTYzNTMxNTAxKTtcclxuICAgIGEgPSBtZDVfZ2coYSwgYiwgYywgZCwgeFtpKzEzXSwgNSAsIC0xNDQ0NjgxNDY3KTtcclxuICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpKyAyXSwgOSAsIC01MTQwMzc4NCk7XHJcbiAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSsgN10sIDE0LCAgMTczNTMyODQ3Myk7XHJcbiAgICBiID0gbWQ1X2dnKGIsIGMsIGQsIGEsIHhbaSsxMl0sIDIwLCAtMTkyNjYwNzczNCk7XHJcblxyXG4gICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2krIDVdLCA0ICwgLTM3ODU1OCk7XHJcbiAgICBkID0gbWQ1X2hoKGQsIGEsIGIsIGMsIHhbaSsgOF0sIDExLCAtMjAyMjU3NDQ2Myk7XHJcbiAgICBjID0gbWQ1X2hoKGMsIGQsIGEsIGIsIHhbaSsxMV0sIDE2LCAgMTgzOTAzMDU2Mik7XHJcbiAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSsxNF0sIDIzLCAtMzUzMDk1NTYpO1xyXG4gICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2krIDFdLCA0ICwgLTE1MzA5OTIwNjApO1xyXG4gICAgZCA9IG1kNV9oaChkLCBhLCBiLCBjLCB4W2krIDRdLCAxMSwgIDEyNzI4OTMzNTMpO1xyXG4gICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2krIDddLCAxNiwgLTE1NTQ5NzYzMik7XHJcbiAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSsxMF0sIDIzLCAtMTA5NDczMDY0MCk7XHJcbiAgICBhID0gbWQ1X2hoKGEsIGIsIGMsIGQsIHhbaSsxM10sIDQgLCAgNjgxMjc5MTc0KTtcclxuICAgIGQgPSBtZDVfaGgoZCwgYSwgYiwgYywgeFtpKyAwXSwgMTEsIC0zNTg1MzcyMjIpO1xyXG4gICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2krIDNdLCAxNiwgLTcyMjUyMTk3OSk7XHJcbiAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSsgNl0sIDIzLCAgNzYwMjkxODkpO1xyXG4gICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2krIDldLCA0ICwgLTY0MDM2NDQ4Nyk7XHJcbiAgICBkID0gbWQ1X2hoKGQsIGEsIGIsIGMsIHhbaSsxMl0sIDExLCAtNDIxODE1ODM1KTtcclxuICAgIGMgPSBtZDVfaGgoYywgZCwgYSwgYiwgeFtpKzE1XSwgMTYsICA1MzA3NDI1MjApO1xyXG4gICAgYiA9IG1kNV9oaChiLCBjLCBkLCBhLCB4W2krIDJdLCAyMywgLTk5NTMzODY1MSk7XHJcblxyXG4gICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2krIDBdLCA2ICwgLTE5ODYzMDg0NCk7XHJcbiAgICBkID0gbWQ1X2lpKGQsIGEsIGIsIGMsIHhbaSsgN10sIDEwLCAgMTEyNjg5MTQxNSk7XHJcbiAgICBjID0gbWQ1X2lpKGMsIGQsIGEsIGIsIHhbaSsxNF0sIDE1LCAtMTQxNjM1NDkwNSk7XHJcbiAgICBiID0gbWQ1X2lpKGIsIGMsIGQsIGEsIHhbaSsgNV0sIDIxLCAtNTc0MzQwNTUpO1xyXG4gICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2krMTJdLCA2ICwgIDE3MDA0ODU1NzEpO1xyXG4gICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2krIDNdLCAxMCwgLTE4OTQ5ODY2MDYpO1xyXG4gICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2krMTBdLCAxNSwgLTEwNTE1MjMpO1xyXG4gICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2krIDFdLCAyMSwgLTIwNTQ5MjI3OTkpO1xyXG4gICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2krIDhdLCA2ICwgIDE4NzMzMTMzNTkpO1xyXG4gICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2krMTVdLCAxMCwgLTMwNjExNzQ0KTtcclxuICAgIGMgPSBtZDVfaWkoYywgZCwgYSwgYiwgeFtpKyA2XSwgMTUsIC0xNTYwMTk4MzgwKTtcclxuICAgIGIgPSBtZDVfaWkoYiwgYywgZCwgYSwgeFtpKzEzXSwgMjEsICAxMzA5MTUxNjQ5KTtcclxuICAgIGEgPSBtZDVfaWkoYSwgYiwgYywgZCwgeFtpKyA0XSwgNiAsIC0xNDU1MjMwNzApO1xyXG4gICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2krMTFdLCAxMCwgLTExMjAyMTAzNzkpO1xyXG4gICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2krIDJdLCAxNSwgIDcxODc4NzI1OSk7XHJcbiAgICBiID0gbWQ1X2lpKGIsIGMsIGQsIGEsIHhbaSsgOV0sIDIxLCAtMzQzNDg1NTUxKTtcclxuXHJcbiAgICBhID0gc2FmZV9hZGQoYSwgb2xkYSk7XHJcbiAgICBiID0gc2FmZV9hZGQoYiwgb2xkYik7XHJcbiAgICBjID0gc2FmZV9hZGQoYywgb2xkYyk7XHJcbiAgICBkID0gc2FmZV9hZGQoZCwgb2xkZCk7XHJcbiAgfVxyXG4gIHJldHVybiBBcnJheShhLCBiLCBjLCBkKTtcclxuXHJcbn1cclxuXHJcbi8qXHJcbiAqIFRoZXNlIGZ1bmN0aW9ucyBpbXBsZW1lbnQgdGhlIGZvdXIgYmFzaWMgb3BlcmF0aW9ucyB0aGUgYWxnb3JpdGhtIHVzZXMuXHJcbiAqL1xyXG5mdW5jdGlvbiBtZDVfY21uKHEsIGEsIGIsIHgsIHMsIHQpXHJcbntcclxuICByZXR1cm4gc2FmZV9hZGQoYml0X3JvbChzYWZlX2FkZChzYWZlX2FkZChhLCBxKSwgc2FmZV9hZGQoeCwgdCkpLCBzKSxiKTtcclxufVxyXG5mdW5jdGlvbiBtZDVfZmYoYSwgYiwgYywgZCwgeCwgcywgdClcclxue1xyXG4gIHJldHVybiBtZDVfY21uKChiICYgYykgfCAoKH5iKSAmIGQpLCBhLCBiLCB4LCBzLCB0KTtcclxufVxyXG5mdW5jdGlvbiBtZDVfZ2coYSwgYiwgYywgZCwgeCwgcywgdClcclxue1xyXG4gIHJldHVybiBtZDVfY21uKChiICYgZCkgfCAoYyAmICh+ZCkpLCBhLCBiLCB4LCBzLCB0KTtcclxufVxyXG5mdW5jdGlvbiBtZDVfaGgoYSwgYiwgYywgZCwgeCwgcywgdClcclxue1xyXG4gIHJldHVybiBtZDVfY21uKGIgXiBjIF4gZCwgYSwgYiwgeCwgcywgdCk7XHJcbn1cclxuZnVuY3Rpb24gbWQ1X2lpKGEsIGIsIGMsIGQsIHgsIHMsIHQpXHJcbntcclxuICByZXR1cm4gbWQ1X2NtbihjIF4gKGIgfCAofmQpKSwgYSwgYiwgeCwgcywgdCk7XHJcbn1cclxuXHJcbi8qXHJcbiAqIEFkZCBpbnRlZ2Vycywgd3JhcHBpbmcgYXQgMl4zMi4gVGhpcyB1c2VzIDE2LWJpdCBvcGVyYXRpb25zIGludGVybmFsbHlcclxuICogdG8gd29yayBhcm91bmQgYnVncyBpbiBzb21lIEpTIGludGVycHJldGVycy5cclxuICovXHJcbmZ1bmN0aW9uIHNhZmVfYWRkKHgsIHkpXHJcbntcclxuICB2YXIgbHN3ID0gKHggJiAweEZGRkYpICsgKHkgJiAweEZGRkYpO1xyXG4gIHZhciBtc3cgPSAoeCA+PiAxNikgKyAoeSA+PiAxNikgKyAobHN3ID4+IDE2KTtcclxuICByZXR1cm4gKG1zdyA8PCAxNikgfCAobHN3ICYgMHhGRkZGKTtcclxufVxyXG5cclxuLypcclxuICogQml0d2lzZSByb3RhdGUgYSAzMi1iaXQgbnVtYmVyIHRvIHRoZSBsZWZ0LlxyXG4gKi9cclxuZnVuY3Rpb24gYml0X3JvbChudW0sIGNudClcclxue1xyXG4gIHJldHVybiAobnVtIDw8IGNudCkgfCAobnVtID4+PiAoMzIgLSBjbnQpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZDUoYnVmKSB7XHJcbiAgcmV0dXJuIGhlbHBlcnMuaGFzaChidWYsIGNvcmVfbWQ1LCAxNik7XHJcbn07XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJWQ21Fc3dcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLlxcXFxub2RlX21vZHVsZXNcXFxcZ3VscC1icm93c2VyaWZ5XFxcXG5vZGVfbW9kdWxlc1xcXFxicm93c2VyaWZ5XFxcXG5vZGVfbW9kdWxlc1xcXFxjcnlwdG8tYnJvd3NlcmlmeVxcXFxtZDUuanNcIixcIi8uLlxcXFxub2RlX21vZHVsZXNcXFxcZ3VscC1icm93c2VyaWZ5XFxcXG5vZGVfbW9kdWxlc1xcXFxicm93c2VyaWZ5XFxcXG5vZGVfbW9kdWxlc1xcXFxjcnlwdG8tYnJvd3NlcmlmeVwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8vIE9yaWdpbmFsIGNvZGUgYWRhcHRlZCBmcm9tIFJvYmVydCBLaWVmZmVyLlxuLy8gZGV0YWlscyBhdCBodHRwczovL2dpdGh1Yi5jb20vYnJvb2ZhL25vZGUtdXVpZFxuKGZ1bmN0aW9uKCkge1xuICB2YXIgX2dsb2JhbCA9IHRoaXM7XG5cbiAgdmFyIG1hdGhSTkcsIHdoYXR3Z1JORztcblxuICAvLyBOT1RFOiBNYXRoLnJhbmRvbSgpIGRvZXMgbm90IGd1YXJhbnRlZSBcImNyeXB0b2dyYXBoaWMgcXVhbGl0eVwiXG4gIG1hdGhSTkcgPSBmdW5jdGlvbihzaXplKSB7XG4gICAgdmFyIGJ5dGVzID0gbmV3IEFycmF5KHNpemUpO1xuICAgIHZhciByO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIHI7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGlmICgoaSAmIDB4MDMpID09IDApIHIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDA7XG4gICAgICBieXRlc1tpXSA9IHIgPj4+ICgoaSAmIDB4MDMpIDw8IDMpICYgMHhmZjtcbiAgICB9XG5cbiAgICByZXR1cm4gYnl0ZXM7XG4gIH1cblxuICBpZiAoX2dsb2JhbC5jcnlwdG8gJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xuICAgIHdoYXR3Z1JORyA9IGZ1bmN0aW9uKHNpemUpIHtcbiAgICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KHNpemUpO1xuICAgICAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhieXRlcyk7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfVxuICB9XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSB3aGF0d2dSTkcgfHwgbWF0aFJORztcblxufSgpKVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlZDbUVzd1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxndWxwLWJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGNyeXB0by1icm93c2VyaWZ5XFxcXHJuZy5qc1wiLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxndWxwLWJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGNyeXB0by1icm93c2VyaWZ5XCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLypcbiAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgU2VjdXJlIEhhc2ggQWxnb3JpdGhtLCBTSEEtMSwgYXMgZGVmaW5lZFxuICogaW4gRklQUyBQVUIgMTgwLTFcbiAqIFZlcnNpb24gMi4xYSBDb3B5cmlnaHQgUGF1bCBKb2huc3RvbiAyMDAwIC0gMjAwMi5cbiAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSBCU0QgTGljZW5zZVxuICogU2VlIGh0dHA6Ly9wYWpob21lLm9yZy51ay9jcnlwdC9tZDUgZm9yIGRldGFpbHMuXG4gKi9cblxudmFyIGhlbHBlcnMgPSByZXF1aXJlKCcuL2hlbHBlcnMnKTtcblxuLypcbiAqIENhbGN1bGF0ZSB0aGUgU0hBLTEgb2YgYW4gYXJyYXkgb2YgYmlnLWVuZGlhbiB3b3JkcywgYW5kIGEgYml0IGxlbmd0aFxuICovXG5mdW5jdGlvbiBjb3JlX3NoYTEoeCwgbGVuKVxue1xuICAvKiBhcHBlbmQgcGFkZGluZyAqL1xuICB4W2xlbiA+PiA1XSB8PSAweDgwIDw8ICgyNCAtIGxlbiAlIDMyKTtcbiAgeFsoKGxlbiArIDY0ID4+IDkpIDw8IDQpICsgMTVdID0gbGVuO1xuXG4gIHZhciB3ID0gQXJyYXkoODApO1xuICB2YXIgYSA9ICAxNzMyNTg0MTkzO1xuICB2YXIgYiA9IC0yNzE3MzM4Nzk7XG4gIHZhciBjID0gLTE3MzI1ODQxOTQ7XG4gIHZhciBkID0gIDI3MTczMzg3ODtcbiAgdmFyIGUgPSAtMTAwOTU4OTc3NjtcblxuICBmb3IodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkgKz0gMTYpXG4gIHtcbiAgICB2YXIgb2xkYSA9IGE7XG4gICAgdmFyIG9sZGIgPSBiO1xuICAgIHZhciBvbGRjID0gYztcbiAgICB2YXIgb2xkZCA9IGQ7XG4gICAgdmFyIG9sZGUgPSBlO1xuXG4gICAgZm9yKHZhciBqID0gMDsgaiA8IDgwOyBqKyspXG4gICAge1xuICAgICAgaWYoaiA8IDE2KSB3W2pdID0geFtpICsgal07XG4gICAgICBlbHNlIHdbal0gPSByb2wod1tqLTNdIF4gd1tqLThdIF4gd1tqLTE0XSBeIHdbai0xNl0sIDEpO1xuICAgICAgdmFyIHQgPSBzYWZlX2FkZChzYWZlX2FkZChyb2woYSwgNSksIHNoYTFfZnQoaiwgYiwgYywgZCkpLFxuICAgICAgICAgICAgICAgICAgICAgICBzYWZlX2FkZChzYWZlX2FkZChlLCB3W2pdKSwgc2hhMV9rdChqKSkpO1xuICAgICAgZSA9IGQ7XG4gICAgICBkID0gYztcbiAgICAgIGMgPSByb2woYiwgMzApO1xuICAgICAgYiA9IGE7XG4gICAgICBhID0gdDtcbiAgICB9XG5cbiAgICBhID0gc2FmZV9hZGQoYSwgb2xkYSk7XG4gICAgYiA9IHNhZmVfYWRkKGIsIG9sZGIpO1xuICAgIGMgPSBzYWZlX2FkZChjLCBvbGRjKTtcbiAgICBkID0gc2FmZV9hZGQoZCwgb2xkZCk7XG4gICAgZSA9IHNhZmVfYWRkKGUsIG9sZGUpO1xuICB9XG4gIHJldHVybiBBcnJheShhLCBiLCBjLCBkLCBlKTtcblxufVxuXG4vKlxuICogUGVyZm9ybSB0aGUgYXBwcm9wcmlhdGUgdHJpcGxldCBjb21iaW5hdGlvbiBmdW5jdGlvbiBmb3IgdGhlIGN1cnJlbnRcbiAqIGl0ZXJhdGlvblxuICovXG5mdW5jdGlvbiBzaGExX2Z0KHQsIGIsIGMsIGQpXG57XG4gIGlmKHQgPCAyMCkgcmV0dXJuIChiICYgYykgfCAoKH5iKSAmIGQpO1xuICBpZih0IDwgNDApIHJldHVybiBiIF4gYyBeIGQ7XG4gIGlmKHQgPCA2MCkgcmV0dXJuIChiICYgYykgfCAoYiAmIGQpIHwgKGMgJiBkKTtcbiAgcmV0dXJuIGIgXiBjIF4gZDtcbn1cblxuLypcbiAqIERldGVybWluZSB0aGUgYXBwcm9wcmlhdGUgYWRkaXRpdmUgY29uc3RhbnQgZm9yIHRoZSBjdXJyZW50IGl0ZXJhdGlvblxuICovXG5mdW5jdGlvbiBzaGExX2t0KHQpXG57XG4gIHJldHVybiAodCA8IDIwKSA/ICAxNTE4NTAwMjQ5IDogKHQgPCA0MCkgPyAgMTg1OTc3NTM5MyA6XG4gICAgICAgICAodCA8IDYwKSA/IC0xODk0MDA3NTg4IDogLTg5OTQ5NzUxNDtcbn1cblxuLypcbiAqIEFkZCBpbnRlZ2Vycywgd3JhcHBpbmcgYXQgMl4zMi4gVGhpcyB1c2VzIDE2LWJpdCBvcGVyYXRpb25zIGludGVybmFsbHlcbiAqIHRvIHdvcmsgYXJvdW5kIGJ1Z3MgaW4gc29tZSBKUyBpbnRlcnByZXRlcnMuXG4gKi9cbmZ1bmN0aW9uIHNhZmVfYWRkKHgsIHkpXG57XG4gIHZhciBsc3cgPSAoeCAmIDB4RkZGRikgKyAoeSAmIDB4RkZGRik7XG4gIHZhciBtc3cgPSAoeCA+PiAxNikgKyAoeSA+PiAxNikgKyAobHN3ID4+IDE2KTtcbiAgcmV0dXJuIChtc3cgPDwgMTYpIHwgKGxzdyAmIDB4RkZGRik7XG59XG5cbi8qXG4gKiBCaXR3aXNlIHJvdGF0ZSBhIDMyLWJpdCBudW1iZXIgdG8gdGhlIGxlZnQuXG4gKi9cbmZ1bmN0aW9uIHJvbChudW0sIGNudClcbntcbiAgcmV0dXJuIChudW0gPDwgY250KSB8IChudW0gPj4+ICgzMiAtIGNudCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNoYTEoYnVmKSB7XG4gIHJldHVybiBoZWxwZXJzLmhhc2goYnVmLCBjb3JlX3NoYTEsIDIwLCB0cnVlKTtcbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiVkNtRXN3XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi5cXFxcbm9kZV9tb2R1bGVzXFxcXGd1bHAtYnJvd3NlcmlmeVxcXFxub2RlX21vZHVsZXNcXFxcYnJvd3NlcmlmeVxcXFxub2RlX21vZHVsZXNcXFxcY3J5cHRvLWJyb3dzZXJpZnlcXFxcc2hhLmpzXCIsXCIvLi5cXFxcbm9kZV9tb2R1bGVzXFxcXGd1bHAtYnJvd3NlcmlmeVxcXFxub2RlX21vZHVsZXNcXFxcYnJvd3NlcmlmeVxcXFxub2RlX21vZHVsZXNcXFxcY3J5cHRvLWJyb3dzZXJpZnlcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5cbi8qKlxuICogQSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBTZWN1cmUgSGFzaCBBbGdvcml0aG0sIFNIQS0yNTYsIGFzIGRlZmluZWRcbiAqIGluIEZJUFMgMTgwLTJcbiAqIFZlcnNpb24gMi4yLWJldGEgQ29weXJpZ2h0IEFuZ2VsIE1hcmluLCBQYXVsIEpvaG5zdG9uIDIwMDAgLSAyMDA5LlxuICogT3RoZXIgY29udHJpYnV0b3JzOiBHcmVnIEhvbHQsIEFuZHJldyBLZXBlcnQsIFlkbmFyLCBMb3N0aW5ldFxuICpcbiAqL1xuXG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpO1xuXG52YXIgc2FmZV9hZGQgPSBmdW5jdGlvbih4LCB5KSB7XG4gIHZhciBsc3cgPSAoeCAmIDB4RkZGRikgKyAoeSAmIDB4RkZGRik7XG4gIHZhciBtc3cgPSAoeCA+PiAxNikgKyAoeSA+PiAxNikgKyAobHN3ID4+IDE2KTtcbiAgcmV0dXJuIChtc3cgPDwgMTYpIHwgKGxzdyAmIDB4RkZGRik7XG59O1xuXG52YXIgUyA9IGZ1bmN0aW9uKFgsIG4pIHtcbiAgcmV0dXJuIChYID4+PiBuKSB8IChYIDw8ICgzMiAtIG4pKTtcbn07XG5cbnZhciBSID0gZnVuY3Rpb24oWCwgbikge1xuICByZXR1cm4gKFggPj4+IG4pO1xufTtcblxudmFyIENoID0gZnVuY3Rpb24oeCwgeSwgeikge1xuICByZXR1cm4gKCh4ICYgeSkgXiAoKH54KSAmIHopKTtcbn07XG5cbnZhciBNYWogPSBmdW5jdGlvbih4LCB5LCB6KSB7XG4gIHJldHVybiAoKHggJiB5KSBeICh4ICYgeikgXiAoeSAmIHopKTtcbn07XG5cbnZhciBTaWdtYTAyNTYgPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiAoUyh4LCAyKSBeIFMoeCwgMTMpIF4gUyh4LCAyMikpO1xufTtcblxudmFyIFNpZ21hMTI1NiA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIChTKHgsIDYpIF4gUyh4LCAxMSkgXiBTKHgsIDI1KSk7XG59O1xuXG52YXIgR2FtbWEwMjU2ID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4gKFMoeCwgNykgXiBTKHgsIDE4KSBeIFIoeCwgMykpO1xufTtcblxudmFyIEdhbW1hMTI1NiA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIChTKHgsIDE3KSBeIFMoeCwgMTkpIF4gUih4LCAxMCkpO1xufTtcblxudmFyIGNvcmVfc2hhMjU2ID0gZnVuY3Rpb24obSwgbCkge1xuICB2YXIgSyA9IG5ldyBBcnJheSgweDQyOEEyRjk4LDB4NzEzNzQ0OTEsMHhCNUMwRkJDRiwweEU5QjVEQkE1LDB4Mzk1NkMyNUIsMHg1OUYxMTFGMSwweDkyM0Y4MkE0LDB4QUIxQzVFRDUsMHhEODA3QUE5OCwweDEyODM1QjAxLDB4MjQzMTg1QkUsMHg1NTBDN0RDMywweDcyQkU1RDc0LDB4ODBERUIxRkUsMHg5QkRDMDZBNywweEMxOUJGMTc0LDB4RTQ5QjY5QzEsMHhFRkJFNDc4NiwweEZDMTlEQzYsMHgyNDBDQTFDQywweDJERTkyQzZGLDB4NEE3NDg0QUEsMHg1Q0IwQTlEQywweDc2Rjk4OERBLDB4OTgzRTUxNTIsMHhBODMxQzY2RCwweEIwMDMyN0M4LDB4QkY1OTdGQzcsMHhDNkUwMEJGMywweEQ1QTc5MTQ3LDB4NkNBNjM1MSwweDE0MjkyOTY3LDB4MjdCNzBBODUsMHgyRTFCMjEzOCwweDREMkM2REZDLDB4NTMzODBEMTMsMHg2NTBBNzM1NCwweDc2NkEwQUJCLDB4ODFDMkM5MkUsMHg5MjcyMkM4NSwweEEyQkZFOEExLDB4QTgxQTY2NEIsMHhDMjRCOEI3MCwweEM3NkM1MUEzLDB4RDE5MkU4MTksMHhENjk5MDYyNCwweEY0MEUzNTg1LDB4MTA2QUEwNzAsMHgxOUE0QzExNiwweDFFMzc2QzA4LDB4Mjc0ODc3NEMsMHgzNEIwQkNCNSwweDM5MUMwQ0IzLDB4NEVEOEFBNEEsMHg1QjlDQ0E0RiwweDY4MkU2RkYzLDB4NzQ4RjgyRUUsMHg3OEE1NjM2RiwweDg0Qzg3ODE0LDB4OENDNzAyMDgsMHg5MEJFRkZGQSwweEE0NTA2Q0VCLDB4QkVGOUEzRjcsMHhDNjcxNzhGMik7XG4gIHZhciBIQVNIID0gbmV3IEFycmF5KDB4NkEwOUU2NjcsIDB4QkI2N0FFODUsIDB4M0M2RUYzNzIsIDB4QTU0RkY1M0EsIDB4NTEwRTUyN0YsIDB4OUIwNTY4OEMsIDB4MUY4M0Q5QUIsIDB4NUJFMENEMTkpO1xuICAgIHZhciBXID0gbmV3IEFycmF5KDY0KTtcbiAgICB2YXIgYSwgYiwgYywgZCwgZSwgZiwgZywgaCwgaSwgajtcbiAgICB2YXIgVDEsIFQyO1xuICAvKiBhcHBlbmQgcGFkZGluZyAqL1xuICBtW2wgPj4gNV0gfD0gMHg4MCA8PCAoMjQgLSBsICUgMzIpO1xuICBtWygobCArIDY0ID4+IDkpIDw8IDQpICsgMTVdID0gbDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSArPSAxNikge1xuICAgIGEgPSBIQVNIWzBdOyBiID0gSEFTSFsxXTsgYyA9IEhBU0hbMl07IGQgPSBIQVNIWzNdOyBlID0gSEFTSFs0XTsgZiA9IEhBU0hbNV07IGcgPSBIQVNIWzZdOyBoID0gSEFTSFs3XTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IDY0OyBqKyspIHtcbiAgICAgIGlmIChqIDwgMTYpIHtcbiAgICAgICAgV1tqXSA9IG1baiArIGldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgV1tqXSA9IHNhZmVfYWRkKHNhZmVfYWRkKHNhZmVfYWRkKEdhbW1hMTI1NihXW2ogLSAyXSksIFdbaiAtIDddKSwgR2FtbWEwMjU2KFdbaiAtIDE1XSkpLCBXW2ogLSAxNl0pO1xuICAgICAgfVxuICAgICAgVDEgPSBzYWZlX2FkZChzYWZlX2FkZChzYWZlX2FkZChzYWZlX2FkZChoLCBTaWdtYTEyNTYoZSkpLCBDaChlLCBmLCBnKSksIEtbal0pLCBXW2pdKTtcbiAgICAgIFQyID0gc2FmZV9hZGQoU2lnbWEwMjU2KGEpLCBNYWooYSwgYiwgYykpO1xuICAgICAgaCA9IGc7IGcgPSBmOyBmID0gZTsgZSA9IHNhZmVfYWRkKGQsIFQxKTsgZCA9IGM7IGMgPSBiOyBiID0gYTsgYSA9IHNhZmVfYWRkKFQxLCBUMik7XG4gICAgfVxuICAgIEhBU0hbMF0gPSBzYWZlX2FkZChhLCBIQVNIWzBdKTsgSEFTSFsxXSA9IHNhZmVfYWRkKGIsIEhBU0hbMV0pOyBIQVNIWzJdID0gc2FmZV9hZGQoYywgSEFTSFsyXSk7IEhBU0hbM10gPSBzYWZlX2FkZChkLCBIQVNIWzNdKTtcbiAgICBIQVNIWzRdID0gc2FmZV9hZGQoZSwgSEFTSFs0XSk7IEhBU0hbNV0gPSBzYWZlX2FkZChmLCBIQVNIWzVdKTsgSEFTSFs2XSA9IHNhZmVfYWRkKGcsIEhBU0hbNl0pOyBIQVNIWzddID0gc2FmZV9hZGQoaCwgSEFTSFs3XSk7XG4gIH1cbiAgcmV0dXJuIEhBU0g7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNoYTI1NihidWYpIHtcbiAgcmV0dXJuIGhlbHBlcnMuaGFzaChidWYsIGNvcmVfc2hhMjU2LCAzMiwgdHJ1ZSk7XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlZDbUVzd1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxndWxwLWJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGNyeXB0by1icm93c2VyaWZ5XFxcXHNoYTI1Ni5qc1wiLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxndWxwLWJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXGNyeXB0by1icm93c2VyaWZ5XCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiVkNtRXN3XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi5cXFxcbm9kZV9tb2R1bGVzXFxcXGd1bHAtYnJvd3NlcmlmeVxcXFxub2RlX21vZHVsZXNcXFxcYnJvd3NlcmlmeVxcXFxub2RlX21vZHVsZXNcXFxccHJvY2Vzc1xcXFxicm93c2VyLmpzXCIsXCIvLi5cXFxcbm9kZV9tb2R1bGVzXFxcXGd1bHAtYnJvd3NlcmlmeVxcXFxub2RlX21vZHVsZXNcXFxcYnJvd3NlcmlmeVxcXFxub2RlX21vZHVsZXNcXFxccHJvY2Vzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8vICAgICB1dWlkLmpzXG4vL1xuLy8gICAgIENvcHlyaWdodCAoYykgMjAxMC0yMDEyIFJvYmVydCBLaWVmZmVyXG4vLyAgICAgTUlUIExpY2Vuc2UgLSBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cbihmdW5jdGlvbigpIHtcbiAgdmFyIF9nbG9iYWwgPSB0aGlzO1xuXG4gIC8vIFVuaXF1ZSBJRCBjcmVhdGlvbiByZXF1aXJlcyBhIGhpZ2ggcXVhbGl0eSByYW5kb20gIyBnZW5lcmF0b3IuICBXZSBmZWF0dXJlXG4gIC8vIGRldGVjdCB0byBkZXRlcm1pbmUgdGhlIGJlc3QgUk5HIHNvdXJjZSwgbm9ybWFsaXppbmcgdG8gYSBmdW5jdGlvbiB0aGF0XG4gIC8vIHJldHVybnMgMTI4LWJpdHMgb2YgcmFuZG9tbmVzcywgc2luY2UgdGhhdCdzIHdoYXQncyB1c3VhbGx5IHJlcXVpcmVkXG4gIHZhciBfcm5nO1xuXG4gIC8vIE5vZGUuanMgY3J5cHRvLWJhc2VkIFJORyAtIGh0dHA6Ly9ub2RlanMub3JnL2RvY3MvdjAuNi4yL2FwaS9jcnlwdG8uaHRtbFxuICAvL1xuICAvLyBNb2RlcmF0ZWx5IGZhc3QsIGhpZ2ggcXVhbGl0eVxuICBpZiAodHlwZW9mKHJlcXVpcmUpID09ICdmdW5jdGlvbicpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIF9yYiA9IHJlcXVpcmUoJ2NyeXB0bycpLnJhbmRvbUJ5dGVzO1xuICAgICAgX3JuZyA9IF9yYiAmJiBmdW5jdGlvbigpIHtyZXR1cm4gX3JiKDE2KTt9O1xuICAgIH0gY2F0Y2goZSkge31cbiAgfVxuXG4gIGlmICghX3JuZyAmJiBfZ2xvYmFsLmNyeXB0byAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgLy8gV0hBVFdHIGNyeXB0by1iYXNlZCBSTkcgLSBodHRwOi8vd2lraS53aGF0d2cub3JnL3dpa2kvQ3J5cHRvXG4gICAgLy9cbiAgICAvLyBNb2RlcmF0ZWx5IGZhc3QsIGhpZ2ggcXVhbGl0eVxuICAgIHZhciBfcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7XG4gICAgX3JuZyA9IGZ1bmN0aW9uIHdoYXR3Z1JORygpIHtcbiAgICAgIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMoX3JuZHM4KTtcbiAgICAgIHJldHVybiBfcm5kczg7XG4gICAgfTtcbiAgfVxuXG4gIGlmICghX3JuZykge1xuICAgIC8vIE1hdGgucmFuZG9tKCktYmFzZWQgKFJORylcbiAgICAvL1xuICAgIC8vIElmIGFsbCBlbHNlIGZhaWxzLCB1c2UgTWF0aC5yYW5kb20oKS4gIEl0J3MgZmFzdCwgYnV0IGlzIG9mIHVuc3BlY2lmaWVkXG4gICAgLy8gcXVhbGl0eS5cbiAgICB2YXIgIF9ybmRzID0gbmV3IEFycmF5KDE2KTtcbiAgICBfcm5nID0gZnVuY3Rpb24oKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgcjsgaSA8IDE2OyBpKyspIHtcbiAgICAgICAgaWYgKChpICYgMHgwMykgPT09IDApIHIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDA7XG4gICAgICAgIF9ybmRzW2ldID0gciA+Pj4gKChpICYgMHgwMykgPDwgMykgJiAweGZmO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX3JuZHM7XG4gICAgfTtcbiAgfVxuXG4gIC8vIEJ1ZmZlciBjbGFzcyB0byB1c2VcbiAgdmFyIEJ1ZmZlckNsYXNzID0gdHlwZW9mKEJ1ZmZlcikgPT0gJ2Z1bmN0aW9uJyA/IEJ1ZmZlciA6IEFycmF5O1xuXG4gIC8vIE1hcHMgZm9yIG51bWJlciA8LT4gaGV4IHN0cmluZyBjb252ZXJzaW9uXG4gIHZhciBfYnl0ZVRvSGV4ID0gW107XG4gIHZhciBfaGV4VG9CeXRlID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgICBfYnl0ZVRvSGV4W2ldID0gKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnN1YnN0cigxKTtcbiAgICBfaGV4VG9CeXRlW19ieXRlVG9IZXhbaV1dID0gaTtcbiAgfVxuXG4gIC8vICoqYHBhcnNlKClgIC0gUGFyc2UgYSBVVUlEIGludG8gaXQncyBjb21wb25lbnQgYnl0ZXMqKlxuICBmdW5jdGlvbiBwYXJzZShzLCBidWYsIG9mZnNldCkge1xuICAgIHZhciBpID0gKGJ1ZiAmJiBvZmZzZXQpIHx8IDAsIGlpID0gMDtcblxuICAgIGJ1ZiA9IGJ1ZiB8fCBbXTtcbiAgICBzLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvWzAtOWEtZl17Mn0vZywgZnVuY3Rpb24ob2N0KSB7XG4gICAgICBpZiAoaWkgPCAxNikgeyAvLyBEb24ndCBvdmVyZmxvdyFcbiAgICAgICAgYnVmW2kgKyBpaSsrXSA9IF9oZXhUb0J5dGVbb2N0XTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFplcm8gb3V0IHJlbWFpbmluZyBieXRlcyBpZiBzdHJpbmcgd2FzIHNob3J0XG4gICAgd2hpbGUgKGlpIDwgMTYpIHtcbiAgICAgIGJ1ZltpICsgaWkrK10gPSAwO1xuICAgIH1cblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICAvLyAqKmB1bnBhcnNlKClgIC0gQ29udmVydCBVVUlEIGJ5dGUgYXJyYXkgKGFsYSBwYXJzZSgpKSBpbnRvIGEgc3RyaW5nKipcbiAgZnVuY3Rpb24gdW5wYXJzZShidWYsIG9mZnNldCkge1xuICAgIHZhciBpID0gb2Zmc2V0IHx8IDAsIGJ0aCA9IF9ieXRlVG9IZXg7XG4gICAgcmV0dXJuICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXTtcbiAgfVxuXG4gIC8vICoqYHYxKClgIC0gR2VuZXJhdGUgdGltZS1iYXNlZCBVVUlEKipcbiAgLy9cbiAgLy8gSW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL0xpb3NLL1VVSUQuanNcbiAgLy8gYW5kIGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS91dWlkLmh0bWxcblxuICAvLyByYW5kb20gIydzIHdlIG5lZWQgdG8gaW5pdCBub2RlIGFuZCBjbG9ja3NlcVxuICB2YXIgX3NlZWRCeXRlcyA9IF9ybmcoKTtcblxuICAvLyBQZXIgNC41LCBjcmVhdGUgYW5kIDQ4LWJpdCBub2RlIGlkLCAoNDcgcmFuZG9tIGJpdHMgKyBtdWx0aWNhc3QgYml0ID0gMSlcbiAgdmFyIF9ub2RlSWQgPSBbXG4gICAgX3NlZWRCeXRlc1swXSB8IDB4MDEsXG4gICAgX3NlZWRCeXRlc1sxXSwgX3NlZWRCeXRlc1syXSwgX3NlZWRCeXRlc1szXSwgX3NlZWRCeXRlc1s0XSwgX3NlZWRCeXRlc1s1XVxuICBdO1xuXG4gIC8vIFBlciA0LjIuMiwgcmFuZG9taXplICgxNCBiaXQpIGNsb2Nrc2VxXG4gIHZhciBfY2xvY2tzZXEgPSAoX3NlZWRCeXRlc1s2XSA8PCA4IHwgX3NlZWRCeXRlc1s3XSkgJiAweDNmZmY7XG5cbiAgLy8gUHJldmlvdXMgdXVpZCBjcmVhdGlvbiB0aW1lXG4gIHZhciBfbGFzdE1TZWNzID0gMCwgX2xhc3ROU2VjcyA9IDA7XG5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9icm9vZmEvbm9kZS11dWlkIGZvciBBUEkgZGV0YWlsc1xuICBmdW5jdGlvbiB2MShvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICAgIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuICAgIHZhciBiID0gYnVmIHx8IFtdO1xuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB2YXIgY2xvY2tzZXEgPSBvcHRpb25zLmNsb2Nrc2VxICE9IG51bGwgPyBvcHRpb25zLmNsb2Nrc2VxIDogX2Nsb2Nrc2VxO1xuXG4gICAgLy8gVVVJRCB0aW1lc3RhbXBzIGFyZSAxMDAgbmFuby1zZWNvbmQgdW5pdHMgc2luY2UgdGhlIEdyZWdvcmlhbiBlcG9jaCxcbiAgICAvLyAoMTU4Mi0xMC0xNSAwMDowMCkuICBKU051bWJlcnMgYXJlbid0IHByZWNpc2UgZW5vdWdoIGZvciB0aGlzLCBzb1xuICAgIC8vIHRpbWUgaXMgaGFuZGxlZCBpbnRlcm5hbGx5IGFzICdtc2VjcycgKGludGVnZXIgbWlsbGlzZWNvbmRzKSBhbmQgJ25zZWNzJ1xuICAgIC8vICgxMDAtbmFub3NlY29uZHMgb2Zmc2V0IGZyb20gbXNlY3MpIHNpbmNlIHVuaXggZXBvY2gsIDE5NzAtMDEtMDEgMDA6MDAuXG4gICAgdmFyIG1zZWNzID0gb3B0aW9ucy5tc2VjcyAhPSBudWxsID8gb3B0aW9ucy5tc2VjcyA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgLy8gUGVyIDQuMi4xLjIsIHVzZSBjb3VudCBvZiB1dWlkJ3MgZ2VuZXJhdGVkIGR1cmluZyB0aGUgY3VycmVudCBjbG9ja1xuICAgIC8vIGN5Y2xlIHRvIHNpbXVsYXRlIGhpZ2hlciByZXNvbHV0aW9uIGNsb2NrXG4gICAgdmFyIG5zZWNzID0gb3B0aW9ucy5uc2VjcyAhPSBudWxsID8gb3B0aW9ucy5uc2VjcyA6IF9sYXN0TlNlY3MgKyAxO1xuXG4gICAgLy8gVGltZSBzaW5jZSBsYXN0IHV1aWQgY3JlYXRpb24gKGluIG1zZWNzKVxuICAgIHZhciBkdCA9IChtc2VjcyAtIF9sYXN0TVNlY3MpICsgKG5zZWNzIC0gX2xhc3ROU2VjcykvMTAwMDA7XG5cbiAgICAvLyBQZXIgNC4yLjEuMiwgQnVtcCBjbG9ja3NlcSBvbiBjbG9jayByZWdyZXNzaW9uXG4gICAgaWYgKGR0IDwgMCAmJiBvcHRpb25zLmNsb2Nrc2VxID09IG51bGwpIHtcbiAgICAgIGNsb2Nrc2VxID0gY2xvY2tzZXEgKyAxICYgMHgzZmZmO1xuICAgIH1cblxuICAgIC8vIFJlc2V0IG5zZWNzIGlmIGNsb2NrIHJlZ3Jlc3NlcyAobmV3IGNsb2Nrc2VxKSBvciB3ZSd2ZSBtb3ZlZCBvbnRvIGEgbmV3XG4gICAgLy8gdGltZSBpbnRlcnZhbFxuICAgIGlmICgoZHQgPCAwIHx8IG1zZWNzID4gX2xhc3RNU2VjcykgJiYgb3B0aW9ucy5uc2VjcyA9PSBudWxsKSB7XG4gICAgICBuc2VjcyA9IDA7XG4gICAgfVxuXG4gICAgLy8gUGVyIDQuMi4xLjIgVGhyb3cgZXJyb3IgaWYgdG9vIG1hbnkgdXVpZHMgYXJlIHJlcXVlc3RlZFxuICAgIGlmIChuc2VjcyA+PSAxMDAwMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd1dWlkLnYxKCk6IENhblxcJ3QgY3JlYXRlIG1vcmUgdGhhbiAxME0gdXVpZHMvc2VjJyk7XG4gICAgfVxuXG4gICAgX2xhc3RNU2VjcyA9IG1zZWNzO1xuICAgIF9sYXN0TlNlY3MgPSBuc2VjcztcbiAgICBfY2xvY2tzZXEgPSBjbG9ja3NlcTtcblxuICAgIC8vIFBlciA0LjEuNCAtIENvbnZlcnQgZnJvbSB1bml4IGVwb2NoIHRvIEdyZWdvcmlhbiBlcG9jaFxuICAgIG1zZWNzICs9IDEyMjE5MjkyODAwMDAwO1xuXG4gICAgLy8gYHRpbWVfbG93YFxuICAgIHZhciB0bCA9ICgobXNlY3MgJiAweGZmZmZmZmYpICogMTAwMDAgKyBuc2VjcykgJSAweDEwMDAwMDAwMDtcbiAgICBiW2krK10gPSB0bCA+Pj4gMjQgJiAweGZmO1xuICAgIGJbaSsrXSA9IHRsID4+PiAxNiAmIDB4ZmY7XG4gICAgYltpKytdID0gdGwgPj4+IDggJiAweGZmO1xuICAgIGJbaSsrXSA9IHRsICYgMHhmZjtcblxuICAgIC8vIGB0aW1lX21pZGBcbiAgICB2YXIgdG1oID0gKG1zZWNzIC8gMHgxMDAwMDAwMDAgKiAxMDAwMCkgJiAweGZmZmZmZmY7XG4gICAgYltpKytdID0gdG1oID4+PiA4ICYgMHhmZjtcbiAgICBiW2krK10gPSB0bWggJiAweGZmO1xuXG4gICAgLy8gYHRpbWVfaGlnaF9hbmRfdmVyc2lvbmBcbiAgICBiW2krK10gPSB0bWggPj4+IDI0ICYgMHhmIHwgMHgxMDsgLy8gaW5jbHVkZSB2ZXJzaW9uXG4gICAgYltpKytdID0gdG1oID4+PiAxNiAmIDB4ZmY7XG5cbiAgICAvLyBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGAgKFBlciA0LjIuMiAtIGluY2x1ZGUgdmFyaWFudClcbiAgICBiW2krK10gPSBjbG9ja3NlcSA+Pj4gOCB8IDB4ODA7XG5cbiAgICAvLyBgY2xvY2tfc2VxX2xvd2BcbiAgICBiW2krK10gPSBjbG9ja3NlcSAmIDB4ZmY7XG5cbiAgICAvLyBgbm9kZWBcbiAgICB2YXIgbm9kZSA9IG9wdGlvbnMubm9kZSB8fCBfbm9kZUlkO1xuICAgIGZvciAodmFyIG4gPSAwOyBuIDwgNjsgbisrKSB7XG4gICAgICBiW2kgKyBuXSA9IG5vZGVbbl07XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZiA/IGJ1ZiA6IHVucGFyc2UoYik7XG4gIH1cblxuICAvLyAqKmB2NCgpYCAtIEdlbmVyYXRlIHJhbmRvbSBVVUlEKipcblxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2Jyb29mYS9ub2RlLXV1aWQgZm9yIEFQSSBkZXRhaWxzXG4gIGZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgLy8gRGVwcmVjYXRlZCAtICdmb3JtYXQnIGFyZ3VtZW50LCBhcyBzdXBwb3J0ZWQgaW4gdjEuMlxuICAgIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuXG4gICAgaWYgKHR5cGVvZihvcHRpb25zKSA9PSAnc3RyaW5nJykge1xuICAgICAgYnVmID0gb3B0aW9ucyA9PSAnYmluYXJ5JyA/IG5ldyBCdWZmZXJDbGFzcygxNikgOiBudWxsO1xuICAgICAgb3B0aW9ucyA9IG51bGw7XG4gICAgfVxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgX3JuZykoKTtcblxuICAgIC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcbiAgICBybmRzWzZdID0gKHJuZHNbNl0gJiAweDBmKSB8IDB4NDA7XG4gICAgcm5kc1s4XSA9IChybmRzWzhdICYgMHgzZikgfCAweDgwO1xuXG4gICAgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG4gICAgaWYgKGJ1Zikge1xuICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IDE2OyBpaSsrKSB7XG4gICAgICAgIGJ1ZltpICsgaWldID0gcm5kc1tpaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZiB8fCB1bnBhcnNlKHJuZHMpO1xuICB9XG5cbiAgLy8gRXhwb3J0IHB1YmxpYyBBUElcbiAgdmFyIHV1aWQgPSB2NDtcbiAgdXVpZC52MSA9IHYxO1xuICB1dWlkLnY0ID0gdjQ7XG4gIHV1aWQucGFyc2UgPSBwYXJzZTtcbiAgdXVpZC51bnBhcnNlID0gdW5wYXJzZTtcbiAgdXVpZC5CdWZmZXJDbGFzcyA9IEJ1ZmZlckNsYXNzO1xuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBQdWJsaXNoIGFzIEFNRCBtb2R1bGVcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7cmV0dXJuIHV1aWQ7fSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mKG1vZHVsZSkgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAvLyBQdWJsaXNoIGFzIG5vZGUuanMgbW9kdWxlXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB1dWlkO1xuICB9IGVsc2Uge1xuICAgIC8vIFB1Ymxpc2ggYXMgZ2xvYmFsIChpbiBicm93c2VycylcbiAgICB2YXIgX3ByZXZpb3VzUm9vdCA9IF9nbG9iYWwudXVpZDtcblxuICAgIC8vICoqYG5vQ29uZmxpY3QoKWAgLSAoYnJvd3NlciBvbmx5KSB0byByZXNldCBnbG9iYWwgJ3V1aWQnIHZhcioqXG4gICAgdXVpZC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBfZ2xvYmFsLnV1aWQgPSBfcHJldmlvdXNSb290O1xuICAgICAgcmV0dXJuIHV1aWQ7XG4gICAgfTtcblxuICAgIF9nbG9iYWwudXVpZCA9IHV1aWQ7XG4gIH1cbn0pLmNhbGwodGhpcyk7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiVkNtRXN3XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi5cXFxcbm9kZV9tb2R1bGVzXFxcXG5vZGUtdXVpZFxcXFx1dWlkLmpzXCIsXCIvLi5cXFxcbm9kZV9tb2R1bGVzXFxcXG5vZGUtdXVpZFwiKSJdfQ==
