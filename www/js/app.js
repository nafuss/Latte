// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('reader', ['ionic', 'youtube-embed'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    //Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    //for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

//Services
.factory('$localStorage', ['$window', function($window){
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key){
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

// Routes
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('reader', {
      url: '/reader',
      abstract: true,
      templateUrl: 'templates/sideMenu.html',
      controller: 'MainCtrl'
    })
    .state('reader.dashboard', {
      url: '/dashboard',
      views: {
        'main-content': {
          templateUrl: 'templates/dashboard.html',
          controller: 'DashboardCtrl'
        }
      }
    })
    .state('reader.documents', {
      url: '/note',
      views: {
        'main-content': {
          templateUrl: 'templates/noteList.html',
          controller: 'NoteCtrl'
        }
      }
    })
    .state('reader.new', {
      url: '/note/new',
      views: {
        'main-content': {
          templateUrl: 'templates/new.html',
          controller: 'NoteCtrl'
        }
      }
    })
    .state('reader.more', {
      url: '/more/:user/:id', //:user is temporary
      views: {
        'main-content': {
        templateUrl: 'templates/noteView.html',
        controller: 'NoteCtrl'
        }
      }
    })
    .state('reader.favoris', {
      url: '/favoris',
      views: {
        'main-content': {
          templateUrl: 'templates/favoris.html',
          controller: 'FavorisCtrl'
        }
      }
    })
    .state('reader.player', {
      url: '/player',
      views: {
        'main-content': {
          templateUrl: 'templates/YTPlayer.html',
          controller: 'YTPlayerCtrl'
        }
      }
    })
    .state('reader.parameter', {
      url: '/parameter',
      views: {
        'main-content': {
          templateUrl: 'templates/parameter.html',
          controller: 'ParameterCtrl'
        }
      }
    });

    $urlRouterProvider.otherwise('/reader/dashboard');
})

//Controllers
.controller('MainCtrl', function(){
})
.controller('DashboardCtrl', function(){
})
.controller('NoteCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
  $http.get('js/note.json').success(function(res){
    $scope.user = res;
    $scope.toggleDownload = function(document){
      document.download = !document.download;
      // Push in download queue
    };
    $scope.toggleFavoris = function(document){
      document.favoris = !document.favoris;
    };
    $scope.addStar = function(author){
      //$http.update('js/author.json')
      author.star = !author.star;
      author.stars += 1;
    };
    $scope.removeStar = function(author){
      //$http.update('js/author.json')
      author.star = !author.star;
      author.stars -= 1;
    }
    $scope.whichAuthor  = $state.params.name;
    $scope.whichDocument = $state.params.id;
  })
}])
.controller('LocalCtrl', ['$scope', '$localStorage', function($scope, $localStorage){
  // Retrieve local data
  $scope.localFiles = $localStorage.getObject('file');

  $scope.storeFile = function(){
    // Retrieve data from form
    // send them in local storage
    // var obj = [{
    //   title: 'Awesome Title',
    //   content: 'Something'
    //   },
    //   {
    //   title: 'Much Better One',
    //   content: 'Something Else'
    //   }];
    // $localStorage.setObject('file', obj);
  };
}])
.controller('FavorisCtrl', function(){
})
.controller('UploadCtrl', function(){
})
.controller('YTPlayerCtrl', function($scope, $http){
  //API Key: AIzaSyCzcprqg9WptIA9a34j8Eg1Ja-6GPyT1AQ
  $scope.videos = [];
  $scope.query = 'ThePrimeCronus';
  $scope.search = '';

  $scope.youtubeParams = {
    key: 'AIzaSyCzcprqg9WptIA9a34j8Eg1Ja-6GPyT1AQ',
    type: 'video',
    maxResults: '5',
    part: 'id,snippet',
    q: $scope.query,
    order: 'date',
    //channelId: 'jeanot04@live.fr',
  }

  $scope.reSearch = function(){
    // Rajouter cas valeur nul
    $scope.query = $scope.search;
  }

  $http.get('https://www.googleapis.com/youtube/v3/search', {params:$scope.youtubeParams}).success(function(response){
    angular.forEach(response.items, function(child){
      $scope.videos.push(child);
      console.log(child);
    });
  });

  $scope.playerVars = {
    rel: 0,
    showinfo: 0,
    modestbranding: 0,
  }

  $scope.toggleFavoris = function(video){
    if(video.favoris == true){
      $http.delete('localhost://mongodb.../fav/video' + this.video.id.videoId).success(function(response){
        video.favoris = false;
      })
    }
    $http.post('localhost://mongodb.../fav/video' + this.video.id.videoId).success(function(response){
      video.favoris = true;
    })
  };
})
.controller('ParameterCtrl', function(){
});
