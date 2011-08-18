/**
 * Created by JetBrains RubyMine.
 * User: RBhochhibhoya
 * Date: 8/3/11
 * Time: 11:04 AM
 * To change this template use File | Settings | File Templates.
 */

App = (function($){
    var self = {};
    self.start = function(){
        $('#hello-world').html('hello-world');
        
            }
});


$(document).ready(function(){
   alert(32332);
});

$(function(){
  $('#hello-world').html('Hello world');
    new App(jQuery).start();

})