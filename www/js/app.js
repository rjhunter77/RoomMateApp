angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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

