
angular.module('starter.controllers', ['ngCookies','ionic'])
.controller('SettingsCtrl', ['$scope','$cookies','$cookieStore','$http', 'Household', 'Roommates','$ionicPopup', function($scope,$cookies,$cookieStore,$http,Household,Roommates,$ionicPopup) {
  // Check to see if there is household data... if so great, use it.  If not then send a login modal that will ask for it and then get it. 
  if(!$cookies.household){
    console.log("NOHOUSE");
  }


  //console.log("COOKIES", $cookies);
  $http.get('data/roomMates.json').success(function(data){
      $scope.roomMates = data;
  });

  $scope.remove = function(roommate){
    $scope.roomMates.splice( $scope.roomMates.indexOf(roommate), 1 );
  };

  $scope.add = function(name){
    $scope.roomMates.push({'name': name});
  };

}])

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

})



.controller('UserCtrl', function($scope, $rootScope, $http, Roommates, $ionicPopup, $cookies) {
  $scope.loginUser = {};
  $scope.newUser = {};
  $scope.showValidationMessages = false;


  $scope.login = function(user){
    // set the cookies for the user
    $cookies.user = user;
    $rootScope.roommateModal.hide();
    console.log("Cookies", $cookies.user);
    $rootScope.checkForHouse();
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
                 console.log("Data", data);
                 $scope.login(data);
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
                        subTitle: 'your user name is' + $scope.newUser.email, // String (optional). The sub-title of the popup.
                        okText: 'Great', // String (default: 'OK'). The text of the OK button.
                        okType: 'button-positive' // String (default: 'button-positive'). The type of the OK button.
                      });
                      popup.then(function(res) {
                       // Great now a new user is created, login with the users information
                       $scope.login($scope.newUser);
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
  $scope.admin = {
    "name": "Tom",
    "_id": "riddle@gmail.com"
  };

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
        console.log("Household Saved", data);
      },
      function(err){
        console.log("Household NOT Saved", err);
      }
    );
  };
})





.controller('NewCtrl', function($scope, Textbooks) {
  $scope.textbooks = Textbooks.all();
  $scope.showValidationMessages = false;
  $scope.textbook = {
          "condition":{
              'value': 4,
              'description': "This book is in great condition"
          }
      }
  $scope.conditions = [
      {
          "description": "This book sucks"
      },
      {
          "description": "This book sucks a little"
      },
      {
          "description": "This book is ok"
      },
      {
          "description": "This book is in great condition"
      },
      {
          "description": "This book is awesome"
      }
  ];
  $scope.submit = function(tbForm){
      $scope.showValidationMessages = true;

      if(!tbForm.$invalid){
          console.log("TB",tbForm);
      }

  };
  $scope.updateCondition = function(tb){
      tb.condition.description = $scope.conditions[tb.condition.value -1].description;
      console.log("TB", tb);
  };
});



// .controller('TextbookDetailCtrl', function($http, $scope, $stateParams, Textbooks) {
//   // var textbooks = Textbooks.all();
//   // console.log(textbooks[1]);
//   // $scope.textbook = textbooks[2];
//   $http.get('data/book_list.json').success(function(data){
//       var books = data;
//       for (var key in books) {
//         if (books.hasOwnProperty(key)) {
//           if ($stateParams.textbookId == books[key]['id']) {
//           	console.log(books[key]);
//           	$scope.textbook = books[key];
//           }
//         }
//       }
//   });
//   $http.get('data/user_list.json').success(function(data){
//       var user = data;
//       for (var key in user) {
//         if (user.hasOwnProperty(key)) {
//           if ($scope.textbook['sellerID'] == user[key]['sellerID']) {
//           	console.log(user[key]);
//           	$scope.seller = user[key];
//           }
//         }
//       }
//   });
// })

