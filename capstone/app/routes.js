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

