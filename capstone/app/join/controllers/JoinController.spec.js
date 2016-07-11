describe('JoinController spec', function() {
  var ctrl;
  var $location;
  var $scope;
  var room;

  beforeEach(function() {
    $location = jasmine.createSpyObj('$location', ['path']);
    $scope = {};
    room = {};


    var JoinControllerModule = require('./JoinController');
    ctrl = new JoinControllerModule($scope, $location, room);
  });

  describe('submit() function', function() {

    it('calls room join with name from scope', function() {
      room.join = jasmine.createSpy('join');
      room.join.and.returnValue({
        then: function() {}
      });

      $scope.name = 'Sean';

      ctrl.submit();

      expect(room.join).toHaveBeenCalledWith('Sean');
    });

  });

});