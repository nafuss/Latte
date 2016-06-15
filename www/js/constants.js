angular.module('latte')

.constant('AUTH_EVENTS', {
  notAuthentificated: 'auth-not-authentificated'
})
.constant('API_ENDPOINT', {
  url: 'http://172.17.10.103:8080/api' // PROD => http://172.17.10.103:8080/api LOCAL => http://localhost:8080/api //192.168.1.13:8080
})
