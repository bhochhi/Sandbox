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

