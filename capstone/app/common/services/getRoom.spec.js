describe('getRoom service', function() {
  var roomFactory;

  var attributes;
  var userSync;

  beforeEach(function() {
    attributes = jasmine.createSpyObj('attributes', ['$save']);

    userSync = jasmine.createSpyObj('userSync', ['$push', '$asArray']);

    var firebaseSync = function(firebaseUrl) {
      if(firebaseUrl.indexOf('/users') > 0) {
        return userSync;
      } else {
        return {
          $asObject: function() {
            return attributes;
          }
        };
      }
    };

    var GetRoomModule = require('./getRoom');
    roomFactory = new GetRoomModule(firebaseSync);
  });

  describe('getId() function', function() {
    it('returns room id', function() {
      var room = roomFactory('abc123');

      expect(room.getId()).toBe('abc123');
    });
  });

  describe('show() function', function() {
    it('sets show attribute to true', function() {
      attributes.show = false;

      roomFactory('abc123').show();

      expect(attributes.show).toBe(true);
    });

    it('saves attributes', function() {
      roomFactory('abc123').show();

      expect(attributes.$save).toHaveBeenCalled();
    });
  });

  describe('getAttributes() function', function() {
    it('returns attributes', function() {
      expect(roomFactory('abc123').getAttributes()).toBe(attributes);
    });
  });

  describe('join() function', function() {
    it('adds user to users array', function() {
      var room = roomFactory('abc123');

      room.join('Sean');

      expect(userSync.$push).toHaveBeenCalledWith({name: 'Sean', card: ''});
    });
  });

  describe('getUsers() function', function() {
    it('returns users as array', function() {
      var room = roomFactory('abc123');

      userSync.$asArray = function() {
        return ['mockUser'];
      };

      expect(room.getUsers()).toEqual(['mockUser']);
    });
  });

  describe('vote() function', function() {
    it('does nothing if vote has finished (cards shown)', function() {
      attributes.show = true;

      roomFactory('abc123').vote();

      expect(userSync.$asArray).not.toHaveBeenCalled();
    });

    it('saves vote to users array', function() {
      var users = jasmine.createSpyObj('users', ['$getRecord', '$save']);
      users.$getRecord.and.returnValue({name:'Sean'});

      userSync.$asArray.and.returnValue(users);

      roomFactory('abc123').vote('userId', '5');

      expect(users.$getRecord).toHaveBeenCalledWith('userId');
      expect(users.$save).toHaveBeenCalledWith({name:'Sean', card: '5'});
    });
  });

  describe('reset() function', function() {
    var users;

    beforeEach(function() {
      users = [];
      userSync.$asArray.and.returnValue(users);
    });

    it('hides cards by setting show attribute to false', function() {
      attributes.show = true;

      roomFactory('abc123').reset();

      expect(attributes.show).toBe(false);
      expect(attributes.$save).toHaveBeenCalled();
    });
  });
});