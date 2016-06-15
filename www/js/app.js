// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('latte', ['ionic','ngStorage', 'youtube-embed', 'chart.js'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    //Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    //for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
    }
    if(window.StatusBar) {
      StatusBar.styleDefault()
    }
  });
})

// Routes
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('auth', {
      url: '/auth',
      abstract: true,
      templateUrl: 'templates/auth/auth.html',
    })
    .state('auth.login', {
      url: '/login',
      views: {
        'auth' :{
          templateUrl: 'templates/auth/login.html',
          controller: 'LoginCtrl'
        }
      }
    })
    .state('auth.register', {
      url: '/register',
      views: {
        'auth': {
          templateUrl: 'templates/auth/register.html',
          controller: 'RegisterCtrl'
        }
      }
    })
    .state('latte', {
      url: '/latte',
      abstract: true,
      templateUrl: 'templates/sideMenu.html',
      controller: 'AppCtrl'
    })
    .state('latte.home', {
      url: '/home',
      views: {
        'main-content': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })
    .state('latte.contact', {
      url: '/contact',
      views: {
        'main-content': {
          templateUrl: 'templates/contact/list.html',
          controller: 'ChatCtrl'
        }
      }
    })
    .state('latte.chat', {
      url: '/contact/chat/:user',
      views: {
        'main-content': {
          templateUrl: 'templates/contact/view.html',
          controller: 'ChatCtrl'
        }
      }
    })
    .state('latte.new', {
      url: '/contact/new?videoId',
      views: {
        'main-content': {
          templateUrl: 'templates/contact/new.html',
          controller: 'ChatCtrl'
        }
      }
    })
    .state('latte.playlist', {
      url: '/playlist',
      views: {
        'main-content': {
          templateUrl: 'templates/player/playlist.html',
          controller: 'PlaylistCtrl'
        }
      }
    })
    .state('latte.overview', {
      url: '/playlist/:title',
      views: {
        'main-content': {
          templateUrl: 'templates/player/view.html',
          controller: 'PlaylistCtrl'
        }
      }
    })
    .state('latte.player', {
      url: '/player',
      views: {
        'main-content': {
          templateUrl: 'templates/player/YTPlayer.html',
          controller: 'YTPlayerCtrl'
        }
      }
    })
    .state('latte.parameter', {
      url: '/parameter',
      views: {
        'main-content': {
          templateUrl: 'templates/parameter.html',
          controller: 'ParameterCtrl'
        }
      }
    });

    $urlRouterProvider.otherwise('/auth/login') // Si connecter rediriger vers /latte/home sinon sur /auth/login
})

// Check each time route change if the user is auth else redirect to login
.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      console.log(next.name)
      if (next.name !== 'auth.login' && next.name !== 'auth.register') {
        event.preventDefault()
        $state.go('auth.login')
      }
    }
  });
})
// Set tabs bar at bottom
.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

}]);
