angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives', 'ngCookies'])

.run(function($rootScope, $ionicPlatform, $cookies, $ionicModal) {
  $ionicPlatform.ready(function() {
  //   console.log("COOKYS", $cookies);
  //   $ionicModal.fromTemplateUrl('../templates/userModal.html', {
  //     scope: $rootScope,
  //     animation: 'slide-in-up',
  //     hardwareBackButtonClose: false,
  //     backdropClickToClose: false
  //   }).then(function(modal) {
  //     $rootScope.roommateModal = modal;

  //     // When a user first gets to the application check to see if a cookie exists... if not send the question page.
  //     if(!$cookies.user){
  //        $rootScope.roommateModal.show();
  //     } else {
  //        $rootScope.checkForHouse();
  //     }

  //   });

    $rootScope.checkForHouse = function(){
      // This is called also after the user login function 
      console.log("COOKYS-2", $cookies);

      $ionicModal.fromTemplateUrl('../templates/householdModal.html', {
        scope: $rootScope,
        animation: 'slide-in-up',
        hardwareBackButtonClose: false,
        backdropClickToClose: false
      }).then(function(modal) {
        $rootScope.householdModal = modal;

        // When a user first gets to the application check to see if a cookie exists... if not send the question page.
        if(!$cookies.household){
           $rootScope.householdModal.show();
        };

      });
    };
    $rootScope.checkForHouse();



    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })


    .state('tab.settings', {
        url: '/settings',
         views: {
          'tab-settings': {
            templateUrl: 'templates/settings.html',
            controller: 'SettingsCtrl'
          }
        }
    })


    .state('tab.history', {
      url: '/history',
      views: {
        'tab-history': {
          templateUrl: 'templates/tab-history.html',
          controller: 'HistoryCtrl'
        }
      }
    })


    // .state('tab.textbook-detail', {
    //   url: '/textbook/:textbookId',
    //   views: {
    //     'tab-dash': {
    //       templateUrl: 'templates/textbook-detail.html',
    //       controller: 'TextbookDetailCtrl'
    //     }
    //   }
    // })

    .state('tab.new', {
      url: '/new',
      views: {
        'tab-new': {
          templateUrl: 'templates/tab-new.html',
          controller: 'NewCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/settings');

});

