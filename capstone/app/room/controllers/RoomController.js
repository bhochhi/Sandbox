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
