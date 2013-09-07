angular.module('main.db', ['ngResource'])
  .factory("db", function ($resource) {
    /*var getArrayAction = {
      'get': {method: 'GET', isArray: true}
    }
    var allObjectActions = {
      'get': {method: 'GET', isArray: false},
      'put': {method: 'PUT', isArray: false},
      'delete': {method: 'DELETE', isArray: false}
    }*/
    var db = {};
    /*db.users = $resource('/api/users', {}, getArrayAction);
    db.user = $resource('/api/user/:id', {}, allObjectActions);*/
    return db;
  });

angular.module('main', ['main.db'])
  .config(['$routeProvider', function ($routeProvider) {
  $routeProvider;
    //.when('/users', {templateUrl: 'partials/users.html', controller: UsersCtrl})
    //.otherwise({redirectTo: '/users'});
}]);
