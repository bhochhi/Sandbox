
module.exports = function($scope, $location, room) {

  this.submit = function() {
    room.join($scope.name).then(function(newChildRef) {

      $location.path('/room/' + room.getId() + '/' + newChildRef.name());
    });
  };
};

