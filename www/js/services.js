angular.module('starter.services', ['ngCookies'])

.factory('Household', ['$cookies','$http', function($cookies, $http) {
  var makeid = function(){
      var text = "";
      var possible = "0123456789";

      for( var i=0; i < 9; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  };
  return {
    all: function() {
      
    },
    get: function(householdID) {
      console.log("Household", householdID);
       var household_db = new PouchDB('http://dgm3790.iriscouch.com/roommates_household_db');
         return household_db.get(householdID, function(err, doc){
              if(err){
                  return err;
              } else if(doc){
                  return doc;
              }
          });
    },
    set: function(roommates){
      var household_db = new PouchDB('http://dgm3790.iriscouch.com/roommates_household_db');
      return household_db.put(
      {
          _id: makeid(),
          "roommates": roommates
      }, function(err, response) {
          if(err){
              return err;
          } else if(response){
              return response;
          }

      });
    },
    update: function(householdID, newRoommates){
      console.log("householdID", householdID, "newRoommates", newRoommates);
       var household_db = new PouchDB('http://dgm3790.iriscouch.com/roommates_household_db');
       return household_db.get(householdID, function(err, otherDoc) {
        household_db.put({
         "roommates": newRoommates
        }, otherDoc._id, otherDoc._rev, function(err, response) {
          if(err){
                console.log("Household NOT UPDATED", err);
                return err;
                //alert("The roomate was not saved");
            } else if(response){
                console.log("Household UPDATED", response);
                return response;
            }
        });
      });
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
    },
    update: function(roommateID, householdID){
      console.log("ROOMMATEID", roommateID, "Household", householdID);
      var roommates_db = new PouchDB('http://dgm3790.iriscouch.com/roommates_db');
       return roommates_db.get(roommateID, function(err, otherDoc) {
        roommates_db.put({
          name: otherDoc.name,
          "password": otherDoc.password,
          admin: true,
          householdId: householdID
        }, otherDoc._id, otherDoc._rev, function(err, response) {
          if(err){
                console.log("Roommate NOT UPDATED", err);
                return err;
                //alert("The roomate was not saved");
            } else if(response){
                console.log("Roomate UPDATED", response);
                return response;
            }
        });
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
