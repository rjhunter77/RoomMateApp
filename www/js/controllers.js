
angular.module('starter.controllers', [])
.controller('SettingsCtrl', function($scope, $http) {
  $http.get('data/roomMates.json').success(function(data){
      $scope.roomMates = data;
  });

  $scope.remove = function(roommate){
    $scope.roomMates.splice( $scope.roomMates.indexOf(roommate), 1 );
  };

  $scope.add = function(name){
    $scope.roomMates.push({'name': name});
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




  // var init = function(){
  //   for(i=0; i <= $scope.transactions.length; i++){
  //     console.log($scope.transactions[i].who);
  //     // $scope.transactions[i].who = $scope.roomMates[$scope.transactions[i].who].name
  //   }
  // };

  // init()
  

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

