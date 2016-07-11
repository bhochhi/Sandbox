describe('RoomController spec', function() {
  var ctrl;
  var $routeParams;
  var $scope;
  var room;
  var $location;
  var users;

  beforeEach(function() {
    $routeParams = { userId: 'user123' };

    $location = jasmine.createSpyObj('$location', ['absUrl']);
    $scope = {};
    room = jasmine.createSpyObj('room', ['getUsers', 'getAttributes', 'reset', 'vote', 'show']);
    users = jasmine.createSpyObj('users', ['$watch']);
    room.getUsers.and.returnValue(users);


    var RoomControllerModule = require('./RoomController');
    ctrl = new RoomControllerModule($routeParams, $scope, $location, room);
  });

  describe('card variable', function() {
    it('should contain all the cards', function() {
      expect(ctrl.cards).toEqual([ '?', '.5', '1', '2', '3', '5', '8', '13', '20', '100', '∞' ]);
    });
  });

  describe('joinUri() function', function() {
    it('should return the join uri', function() {
      $location.absUrl.and.returnValue('http://localhost:8080/#/room/roomId/userId');

      expect(ctrl.joinUri()).toBe('http://localhost:8080/#/room/roomId');
    });
  });

  describe('vote() function', function() {
    it('should call vote on room object', function() {
      ctrl.vote('5');

      expect(room.vote).toHaveBeenCalledWith('user123', '5');
    });
  });

  describe('reset() function', function() {
    it('should call reset on room object', function() {
      ctrl.reset();

      expect(room.reset).toHaveBeenCalled();
    });
  });

  describe('show() function', function() {
    it('should call show on room object', function() {
      ctrl.show();

      expect(room.show).toHaveBeenCalled();
    });
  });

});