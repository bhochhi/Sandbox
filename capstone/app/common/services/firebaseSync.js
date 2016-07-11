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