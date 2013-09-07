angular.module('main.db', ['ngResource', 'ui.ace'])
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
}])

function IDEController($scope) {
  $scope.editorLoaded = function(editor) {
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/python");
    editor.commands.addCommand({
        name: 'execProgram',
        bindKey: 'Ctrl-Enter',
        exec: function(editor) {
            console.log('command');
        },
        readOnly: true // false if this command should not apply in readOnly mode
    });
  };
}
