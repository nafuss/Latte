angular.module('latte')

//Controllers
  // LOGIN
.controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state){
  $scope.user = {
    identifiant: '',
    password: ''
  }

  $scope.login = function() {
    AuthService.login($scope.user).then(function(msg) {
      window.localStorage.setItem('id', $scope.user.identifiant)
      $state.go('latte.home')
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      })
      alertePopup
    })
  }
})
  // REGISTER
.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state){
  $scope.user = {
    identifiant: '',
    password: '',
    email: '',
    name: '',
    lastname: '',
    status: 'Private'
  }

  $scope.register = function() {
    AuthService.register($scope.user).then(function(msg) {
      $state.go('auth.login')
      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      })
      alertePopup
    }, function(errMsg) {
      var alertePopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      })
      alertePopup
    })
  }
})
  // SECU
.controller('AppCtrl', function($scope, AuthService, AUTH_EVENTS, $state, $ionicPopup){
  $scope.$on(AUTH_EVENTS.notAuthentificated, function(event) {
    AuthService.logout()
    $state.go('auth.login')
    var alertePopup = $ionicPopup.alert({
      title: 'Session lost!',
      template: 'Please try to login again'
    })
  })
  $scope.name = window.localStorage.getItem('id')
})
  // DASHBOARD
.controller('HomeCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state, $localStorage){
  $scope.storage = $localStorage
  $scope.labels = []
  $scope.data = []
  $scope.search = []

  $scope.destroySession = function() {
    AuthService.logout()
  }

  $scope.logout = function() {
    AuthService.logout()
    $state.go('auth.login')
  }

  $scope.getData = function() {
    // Retrieve playlist and search array from localstorage
    $scope.playlists = $scope.storage.playlists
    angular.forEach($scope.playlists, function(value, key) {
      // And store the stat onto the chart
      $scope.labels.push(value.title)
      $scope.data.push(value.video.length)
    })
    $scope.search = $scope.storage.search
  }



  $scope.getData()
})
  // PLAYLIST
.controller('PlaylistCtrl', function($scope, $localStorage, $ionicPopup, $stateParams){
  $scope.storage = $localStorage
  $scope.currentPlaylist = $stateParams.title
  $scope.player = {}
  $scope.list = []
  $scope.newPlaylist = {
    title: '',
    video: [],
    list: []
  }
  // Make sure localStorage is init
  if(!$scope.storage.playlists)
    $scope.storage.playlists = []

  $scope.createPlaylist = function() {
    var promptPopup = $ionicPopup.prompt({
      title: 'Create new playlist',
      template: 'Playlist title'
    })
    promptPopup.then(function(result) {
      if(!result)
      $scope.newPlaylist.title = result
    })
    $scope.storage.playlists.push($scope.newPlaylist)
  }

  $scope.getPlaylist = function() {
    $scope.playlists = $scope.storage.playlists
    angular.forEach($scope.playlists, function(value, key) {
      $scope.list = value.list
    })
  }

  $scope.playVideo = function(videoId){
    $scope.player.videoId = videoId
    $scope.$on('youtube.player.ready',function($event, player) {
      player.playVideo()
    })
  }

  $scope.playPlaylist = function() {
    // Start at first video
    var i = 0
    $scope.playVideo($scope.list[i])
    while(i<$scope.list.length){
      // Then when it end start the next one and so on
      $scope.$on('youtube.player.ended', function($event, player) {
        $scope.playVideo($scope.list[i++])
      })
    }
  }

  $scope.removeVideo = function(videoId){
    $scope.playlists
  }

  $scope.getPlaylist()

})
  // YT PLAYER
.controller('YTPlayerCtrl', function($scope, $http, $localStorage, YoutubeService, $state, $ionicPopup){

  if(!$localStorage.search)
  $localStorage.search = []
  // Videos store here
  $scope.videos = []
  $scope.search = {
    term: ''
  }
  $scope.storeSearch = $localStorage.search
  // Params for yt query
  $scope.youtubeParams = {
    key: 'AIzaSyCzcprqg9WptIA9a34j8Eg1Ja-6GPyT1AQ',
    type: 'video',
    maxResults: '5',
    part: 'id,snippet',
    q: 'Pandora Journey',
    order: 'date',
  }
  // Search Bar
  $scope.reSearch = function(){
    // Add empty query!
    $scope.videos = [] // Clear previous search
    $scope.youtubeParams.q = $scope.search.term // Add search term to query
    $scope.getVideo() // Get video with new term
    if($scope.storeSearch.length < 5){
      $scope.storeSearch.splice(0, 0, $scope.search.term)
    }else{
      $scope.storeSearch.splice(5, 1)
      $scope.storeSearch.splice(0, 0, $scope.search.term)

    }
  }
  // // Infinite Scroll
  // $scope.loadMore = function() {
  //   $scope.youtubeParams.maxResults = 10
  //   $scope.getVideo().then(function(data) {
  //     $scope.$broadcast('scroll.infiniteScrollComplete')
  //   })
  // }

  // Get Video from yt
  $scope.getVideo = function(){
    YoutubeService.getVideo($scope.youtubeParams).then(function(data) {
      angular.forEach(data.items, function(child){
        $scope.videos.push(child)
      })
    })
  }
  // Variable for YT request
  $scope.playerVars = {
    rel: 0,
    showinfo: 0,
    modestbranding: 0,
  }

  $scope.choosePlaylist = function() {
    $scope.choose = {}
    this.video.choose = true
    $scope.choose.playlist = $localStorage.playlists
  }

  $scope.addToPlaylist = function(id, video) {
    // Push embedded video data
    $localStorage.playlists[id].video.push({
      title: video.snippet.title,
      id: video.id.videoId
    })

    // Push raw video data
    $localStorage.playlists[id].list.push(video.id.videoId)

    // Delete the chooser
    $scope.choose = null
  }

  $scope.newMessage = function(videoId) {
    $state.go('latte.new', { videoId: videoId })
  }
  //Exec get video when page load
  $scope.getVideo()
})
  // CHAT
.controller('ChatCtrl', function($scope, ChatService, API_ENDPOINT, $http, $state, $stateParams){
  $scope.user = window.localStorage.getItem('id')
  $scope.whichContact = $state.params.user
  $scope.allChat = [{}]
  $scope.newMessage = {
    to: '',
    message_body: '',
    link: $stateParams.videoId
  }
  $scope.chat = {
    to: $state.params.user,
    message_body: "",
    link: ''
  }
  $scope.getMessage = function(){
    ChatService.getMessage().then(function(data) {
      $scope.allChat = data
      return $scope.allChat
    })
  }

  $scope.createMessage = function() {
    ChatService.addMessage($scope.newMessage).then(function(){
      $state.go('latte.contact') //latte.chat
    })
  }

  $scope.addMessage = function() {
    ChatService.addMessage($scope.chat)
  }

  $scope.delMessage = function(chat) {
    ChatService.delMessage(chat._id)
    $scope.getMessage()
  }

  $scope.getMessage()
})
.controller('ParameterCtrl', function(){
})
