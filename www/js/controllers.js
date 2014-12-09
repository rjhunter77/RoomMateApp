
angular.module('starter.controllers', ['ngCookies','ionic'])
.controller('SettingsCtrl', ['$scope','$rootScope','$cookies','$cookieStore','$http', 'Household', 'Roommates','$ionicPopup', function($scope, $rootScope, $cookies,$cookieStore,$http,Household,Roommates,$ionicPopup) {
  // Check to see if there is household data... if so great, use it.  If not then send a login modal that will ask for it and then get it. 
  if(!$cookies.household){
    console.log("NOHOUSE");
  }
  $scope.roomMates = {};
  $scope.householdId = "";
  $scope.userName = "";

  if($rootScope.user){
      console.log("PING", $rootScope.user);
    if($rootScope.user.householdId){
      $scope.householdId = $rootScope.user.householdId;
    }
    if($rootScope.user.name){
      $scope.userName = $rootScope.user.name;
    }
  }
  if($rootScope.roommates){
    $scope.roomMates = $rootScope.roommates;
  }

  //console.log("COOKIES", $cookies);
  $scope.listRoomates = function(){
    var promise = Household.get($rootScope.user.householdId);
    $scope.userName = $rootScope.user.name;
    $scope.householdId = $rootScope.user.householdId;
    promise.then(
      function(result){
        console.log("HOUSEHOLD FOUND", result);
        $scope.roomMates = result.roommates;
        $rootScope.roommates = result.roommates;
        $scope.$apply();
      },
      function(error){
        console.log("HOUSEHOLD NOT FOUND", error);
      }
    );
  };
  $rootScope.$on('updateViews', function()
  {
      console.log("!!!!!!!!!!!!!HARRAY!!!!!!!!!!!!!!!!!");
      if($rootScope.user && $rootScope.user.householdId){
        $scope.listRoomates();
      }
  });



  $scope.remove = function(roommate){
    $scope.roomMates.splice( $scope.roomMates.indexOf(roommate), 1 );
  };

  $scope.add = function(name){
    $scope.roomMates.push({'name': name});
  };

}])





.controller('UserCtrl', function($scope, $rootScope, $http, Roommates, $ionicPopup, $cookies) {
  $scope.loginUser = {};
  $scope.newUser = {};
  $scope.showValidationMessages = false;


  $scope.login = function(userID){
    console.log("UID", userID);
    var promise = Roommates.get(userID);
    promise.then(
      function(result){
     
        console.log("DATA", result);

        // set the cookies for the user
        $cookies.user = result;
        $rootScope.user = result;
        $rootScope.roommateModal.hide();
        console.log("Cookies", $cookies.user);
        console.log("USER", $rootScope.user);
        $rootScope.checkForHouse();
        $rootScope.$emit('updateViews');
      },
      function(err){
        console.log("ROOMY NOT FOUND");
      }
    );
   
  };

  $scope.submitLogin = function(loginForm){
    if(!loginForm.$invalid){
      //Login form is valid: check for user
      var promise = Roommates.get($scope.loginUser.email);
      promise.then(
          function(data){
              console.log("Roomate Found", data);
              //check to see for correct password
              if(data.password == $scope.loginUser.password){
                 var successPopup = $ionicPopup.alert({
                  title: 'Welcome Back ' + data.name, // String. The title of the popup.
                  subTitle: 'You are now logged in', // String (optional). The sub-title of the popup.
                  okText: 'Close', // String (default: 'OK'). The text of the OK button.
                  okType: 'button-positive' // String (default: 'button-positive'). The type of the OK button.
                });
                successPopup.then(function() {
                 // Great now login with the users information
                 $scope.login(data._id);
               });
              } else {
                var popup = $ionicPopup.alert({
                  title: 'You typed the incorrect password', // String. The title of the popup.
                  subTitle: 'Please try again', // String (optional). The sub-title of the popup.
                  okText: 'Close', // String (default: 'OK'). The text of the OK button.
                  okType: 'button-positive' // String (default: 'button-positive'). The type of the OK button.
                });
                popup();
              }
          },
          function(err){
              console.log("No Roomate not Found", err);
              var errorPopup = $ionicPopup.alert({
                title: 'The account does not exist', // String. The title of the popup.
                subTitle: 'Please try again or sign up bellow', // String (optional). The sub-title of the popup.
                okText: 'Close', // String (default: 'OK'). The text of the OK button.
                okType: 'button-positive' // String (default: 'button-positive'). The type of the OK button.
              });
              errorPopup();
              
          }
      );
    } else {
      var invalidPopup = $ionicPopup.alert({
        title: 'The form was invalid', // String. The title of the popup.
        subTitle: 'Please try again', // String (optional). The sub-title of the popup.
        okText: 'Close', // String (default: 'OK'). The text of the OK button.
        okType: 'button-positive' // String (default: 'button-positive'). The type of the OK button.
      });
      invalidPopup();
    }
  };

  $scope.submitNew = function(newForm){

    showValidationMessages = true;
    if(!newForm.$invalid){
      console.log("USER", $scope.newUser);
       // first check there are no roomates with that email..
       var promise = Roommates.get($scope.newUser.email);
       promise.then(
            function(data){
                console.log("Roomate Found - do not make", data);
                var popup = $ionicPopup.alert({
                  title: 'An Account already exists with that email address', // String. The title of the popup.
                  subTitle: 'Close this and then Login', // String (optional). The sub-title of the popup.
                  okText: 'Close', // String (default: 'OK'). The text of the OK button.
                  okType: 'button-positive' // String (default: 'button-positive'). The type of the OK button.
                });
                popup.then(function(res) {
                 // Great now a new user is created, save a cookie with the users name and email.
               });
            },
            function(err){
                console.log("No Roomate - make one", err);
                var setPromise = Roommates.set($scope.newUser);
                setPromise.then(
                  function(data){
                      console.log("Roomate Created", data);
                      var popup = $ionicPopup.alert({
                        title: 'You have created a new account', // String. The title of the popup.
                        subTitle: 'your user name is ' + $scope.newUser.email, // String (optional). The sub-title of the popup.
                        okText: 'Great', // String (default: 'OK'). The text of the OK button.
                        okType: 'button-positive' // String (default: 'button-positive'). The type of the OK button.
                      });
                      popup.then(function(res) {
                       // Great now a new user is created, login with the users information
                       console.log("NEWUSER", data);
                       $scope.login($scope.newUser.email);
                     });
                      
                  },
                  function(err){
                      console.log("No Roommate Created", err);
                      
                  }
                );
            }
        );
    } else {
      var popup = $ionicPopup.alert({
        title: 'The form was invalid', // String. The title of the popup.
        subTitle: 'Please try again', // String (optional). The sub-title of the popup.
        okText: 'Close', // String (default: 'OK'). The text of the OK button.
        okType: 'button-positive' // String (default: 'button-positive'). The type of the OK button.
      });
      popup();
    }
  };

})







.controller('HouseholdCtrl', function($scope, $rootScope, $http, Roommates, Household, $ionicPopup, $cookies) {
  $scope.admin = $rootScope.user;

  $scope.roomMates = [];

  $scope.roomMates.push($scope.admin);

  // $scope.roomMates = [
  //   {
  //     "name": $cookies.user.name,
  //     "_id": $cookies.user.email,
  //   }
  // ];

  $scope.remove = function(roommate){
    if(roommate._id == $scope.admin._id){
      var popup = $ionicPopup.alert({
        title: 'You cannot delete yourself', // String. The title of the popup.
        okText: 'Close', // String (default: 'OK'). The text of the OK button.
        okType: 'button-positive' // String (default: 'button-positive'). The type of the OK button.
      });
      popup();
    } else {
      $scope.roomMates.splice( $scope.roomMates.indexOf(roommate), 1 );
    }
  };

  $scope.add = function(name){
    $scope.roomMates.push({'name': name});
    document.getElementById('newName').value = "";
  };

  $scope.createHousehold = function(){
    var promise = Household.set($scope.roomMates);
    promise.then(
      function(data){
        console.log("Household Saved", $scope.admin._id, data.id);
        $cookies.household = data.id;
        console.log("Cookie Saved", $cookies.household);
        var roommatePromise = Roommates.update($scope.admin._id, data.id);
        roommatePromise.then(
          function(result){
            console.log("Added the household ID to the roommate", result);
            $rootScope.user.householdId = data.id;
            $rootScope.$emit('updateViews');
            $rootScope.householdModal.hide();
          }, function(error){
            console.log("ERROR: could not add the household to the roommate");
          }
        );
      },
      function(err){
        console.log("Household NOT Saved", err);
      }
    );
  };

  $scope.getNameString = function(list){
    var names = "";
    for(var i=0; i < list.length; i++){
      if(i == 0) {
        names += list[i].name;
      } else {
        names += ", " + list[i].name;
      }
    }
    return names;
  };

  $scope.joinHousehold = function(form){
    if(!form.$invalid){
        console.log("TB",$scope.HHID);
        var promise = Household.get($scope.HHID);
        promise.then(
          function(result){
            console.log("We Found the household", result);
            // First add the household to the admin
            var promise2 = Roommates.update($scope.admin._id, $scope.HHID);
            promise2.then(
              function(r){
                console.log("The Roomate was Updated", r);
                
                var listOfNames = $scope.getNameString(result.roommates);
                console.log("LIST OF ROOMATES", listOfNames);
                // Ask if they would like their name added to the list
                $ionicPopup.confirm({
                  title: 'Is your name included in the list bellow?', // String. The title of the popup.
                  subTitle: listOfNames, // String (optional). The sub-title of the popup.
                  cancelText: 'No', // String (default: 'Cancel'). The text of the Cancel button.
                  cancelType: 'button-default', // String (default: 'button-default'). The type of the Cancel button.
                  okText: 'Yes', // String (default: 'OK'). The text of the OK button.
                  okType: 'button-default', // String (default: 'button-positive'). The type of the OK button.
               }).then(function(res) {
                 $cookies.household = $scope.HHID;

                 console.log('The confirmation:', res);
                 if(res == false){
                  var newRoomates = result.roommates;
                  newRoomates.push({
                    "name": $scope.admin.name,
                    "_id" : $scope.admin._id
                  });
                  var promise3 = Household.update($scope.HHID, newRoomates);
                  promise3.then(
                    function(result3){
                      console.log("The HOUSEHOLD has been UPDATED", result3);
                      $rootScope.user.householdId = $scope.HHID;
                      $rootScope.$emit('updateViews');
                      $rootScope.user.householdId = $scope.HHID;
                      $rootScope.householdModal.hide();
                      
                    }, function(error3){
                      console.log("Household NOT UPDATED", error3);
                    }
                  );
                 } else {
                  $rootScope.user.householdId = $scope.HHID;
                  $rootScope.$emit('updateViews');
                  $rootScope.householdModal.hide();
                 }
               });

              },
              function(e){
                console.log("The Roommate was not updated", e);
              }
            );

            var rmates = result.roommates;
            // Check to see if the admins name is inculded (if not then add it)
          }, function(err){
            console.log("ERROR - No household found", err);
          }
        );
    }
  };
})





.controller('NewCtrl', function($scope, $rootScope, Household) {
  $scope.userName = "";
  $scope.roommates = [];
  $scope.transactions = [
    {
      name:'IOU'
    },
    {
      name:'payment'
    }
  ];

  if($rootScope.user){
    if($rootScope.user.name){
      $scope.userName = $rootScope.user.name;
    }
  }

  if($rootScope.roommates){
    $scope.roommates = $rootScope.roommates;
  }

  $scope.arrayRoommates = function(roommates){

  };

  //console.log("COOKIES", $cookies);
  $scope.listRoomates = function(){
    var promise = Household.get($rootScope.user.householdId);
    $scope.householdId = $rootScope.user.householdId;
    promise.then(
      function(result){
        console.log("HOUSEHOLD FOUND", result);
        $scope.roommates = result.roommates;
        $rootScope.roommates = result.roommates;
        $scope.$apply();
      },
      function(error){
        console.log("HOUSEHOLD NOT FOUND", error);
      }
    );
  };

  $rootScope.$on('updateViews', function(){
    console.log("BAMB");
      if($rootScope.user){
        $scope.userName = $rootScope.user.name;
        console.log("PING", $rootScope.user);
        if($rootScope.user.householdId){
          $scope.listRoomates();
        }
        $scope.$apply();
      }
  });

  $scope.submit = function(form){
    if(!form.$invalid){

    } else {
      console.log("FORM INVALID");
    }
  };
 
})









.controller('HistoryCtrl', function($scope, $http) {

  $http.get('data/roomMates.json').success(function(data){
      $scope.roomMates = data;
  });

  $http.get('data/transactions.json').success(function(data){
      $scope.transactions = data;
  });

  $scope.getName = function(id){
    for(var i=0; i < $scope.roomMates.length; i++){
      if($scope.roomMates[i].id == id){
       return $scope.roomMates[i].name;
      }
    }
    return;
  };  

});



