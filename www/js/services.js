angular.module('latte')

// Authentification
.service('AuthService', function($q, $http, API_ENDPOINT) {
  var LOCAL_TOKEN_KEY = 'tken'
  var isAuthenticated = false
  var authToken

  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY)
    if (token)
      accessGranted(token)
  }

  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token)
    accessGranted(token)
  }

  function accessGranted(token) {
    isAuthenticated = true
    authToken = token

    // Fill Authorization in header with token
    $http.defaults.headers.common.Authorization = authToken
  }

  function destroyUserCredentials() {
    authToken = undefined
    isAuthenticated = false
    $http.defaults.headers.common.Authorization = undefined
    window.localStorage.removeItem(LOCAL_TOKEN_KEY)
  }
// POST
  var register = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/register', user).then(function(res) {
        if (res.data.success)
          resolve(res.data.msg)
        reject(res.data.msg)
      })
    })
  }
// POST
  var login = function(user) {
     return $q(function(resolve, reject) {
       $http.post(API_ENDPOINT.url + '/authentificate', user).then(function(res) {
         if (res.data.success)
          storeUserCredentials(res.data.token)
          resolve(res.data.msg)
         reject(res.data.msg)
       })
     })
   }

  var logout = function() {
    destroyUserCredentials()
  }

  loadUserCredentials()

  return {
    login: login,
    register: register,
    logout: logout,
    isAuthenticated: function() {return isAuthenticated}
  }
})

// Chat
.service('ChatService', function($q, $http, API_ENDPOINT) {
// GET
  var getMessage = function() {
    return $q(function(resolve, reject) {
      $http.get(API_ENDPOINT.url + '/chat').then(function(result) {
        if (result.status == 200)
          resolve(result.data)
        reject(result.data)
      })
    })
  }
// POST
  var addMessage = function(content) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/chat', content).then(function(result) {
        if(result.data.success)
          resolve(result.data.msg)
        reject(result.data.msg)
      })
    })
  }
// DELETE
  var delMessage = function(messageId) {
    return $q(function(resolve, reject) {
      $http.delete(API_ENDPOINT.url + '/chat', {params: {"message_id": messageId}}).then(function(result) {
        if(result.data.success)
          resolve(result.data.msg)
        reject(result.data.msg)
      })
    })
  }

  return {
    getMessage: getMessage,
    addMessage: addMessage,
    delMessage: delMessage
  }
})

// Youtube API
.service('YoutubeService', function($q, $http) {
// GET
  var getVideo = function(youtubeParams) {
    return $q(function(resolve, reject) {
      $http.get('https://www.googleapis.com/youtube/v3/search', {params: youtubeParams, headers: {'Authorization': undefined}}).then(function(result) {
        if (result.status == 200)
          resolve(result.data)
        reject(result.data)
      })
    })
  }

  return {
    getVideo: getVideo
  }
})

.service('UserService', function($q, $http, API_ENDPOINT) {
  var getUsers = function() {
    return $q(function(resolve, reject) {
      $http.get(API_ENDPOINT.url + 'users').then(function(result) {
        if (result.status == 200)
          resolve(result.data)
        reject(result.data)
      })
    })
  }

  var updateUser = function(user_id) {
    return $q(function(resolve, reject) {
      $http.put(API_ENDPOINT.url + 'users', { params: user_id }).then(function(result) {
        if (result.status == 200)
          resolve(result.data)
        reject(result.data)
      })
    })
  }

  return {
    getUsers: getUsers,
    updateUsers: updateUsers
  }
})

// Watch out if user connected
.factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthentificated,
      }[response.status], response)
      return $q.reject(response)
    }
  }
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor')
});
