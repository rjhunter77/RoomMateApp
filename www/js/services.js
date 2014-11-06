angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Textbooks', function($http) {
  // Might use a resource here that returns a JSON array
  var textbooks = [];

  var getTextbooks = function(){
      $http.get('data/book_list.json').success(function(data){
          textbooks = data;
          // console.log(data);
      });
  };

  var setTextbooks = function(){

  };

  // Some fake testing data

  // console.log(textbooks[3]);
  return {
    all: function() {
      getTextbooks();
      return textbooks;
    },
    get: function(textbookId) {
      // Simple index lookup
      getTextbooks();
      return textbooks[textbookId];
    },
    set: function(textbook){
      getTextbooks();
      textbooks.push(textbook);
      setTextbooks();
      return textbooks;
    }
  };
});
