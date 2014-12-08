angular.module('starter.services', ['ngCookies'])

.factory('Household', ['$cookies','$http', function($cookies, $http) {
  return {
    all: function() {
      
    },
    get: function(householdId) {
      
    },
    set: function(household){
      
    }
  };
}])
.factory('Roommates', function($http) {
  console.log("SUP?");
  return {
    all: function() {

    },
    get: function(roommateId) {
      console.log("ROOMMATEID", roommateId);
       var roommates_db = new PouchDB('http://dgm3790.iriscouch.com/roommates_db');
         return roommates_db.get(roommateId, function(err, doc){
              if(err){
                  return err;
              } else if(doc){
                  return doc;
              }
          });
    },
    set: function(roommate){
       var roommates_db = new PouchDB('http://dgm3790.iriscouch.com/roommates_db');

        return roommates_db.put(
            {
                _id: roommate.email,
                "name": roommate.name,
                "password": roommate.password,
            }, function(err, response) {
                if(err){
                    console.log("Roommate NOT SAVED", err);
                    return err;
                    //alert("The roomate was not saved");
                } else if(response){
                    console.log("Roomate SAVED", response);
                    return response;
                }

            });
    }
  };
})
.factory('Transactions', function($http) {
  
  return {
    all: function() {
      
    },
    get: function(textbookId) {
     
    },
    set: function(textbook){
     
    }
  };
});
