describe('CreateController spec', function() {
  var ctrl;
  var $location;

  beforeEach(function() {
    $location = jasmine.createSpyObj('$location', ['path']);

    var CreateControllerModule = require('./CreateController');
    ctrl = new CreateControllerModule($location);
  });

  describe('createRoom() function', function() {

    it('redirects to /room URI', function() {
      ctrl.createRoom();

      expect($location.path.calls.mostRecent().args[0])
          .toMatch(/\/room\/[a-f0-9\-]{36}/);
    });

  });
});