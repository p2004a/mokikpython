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
  .directive('mover', function factory() {
    var d = {
      replace: false,
      restrict: 'C',
      transclude: false,
      scope: true,
      controller: function($element, $scope) {
        e = $($element);

        editor = $('.editor');
        output_box = $('.output_box');

        e.on('mousedown', function(ev) {
          var y = ev.screenY;

          doc = $(document);

          doc.on('mouseup', function(ev) {
            doc.unbind('mouseup mousemove');
          });

          doc.on('mousemove', function(ev) {
            var inc = y - ev.screenY;
            y = ev.screenY;

            function changeVal(inc, obj, attr) {
              var val = obj.css(attr);
              val = parseFloat(val.substr(0, val.length - 2));
              obj.css(attr, (val + inc) + 'px');
            }

            changeVal(inc, editor, 'bottom');
            changeVal(inc, output_box, 'height');

            $scope.editor.resize(true);
          });
        });
      }
    };
   return d;
  });

function IDEController($scope) {
  $scope.output = '';
  $scope.status = 'loading page...'

  $scope.editorLoaded = function(editor) {
    $scope.editor = editor;

    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/python");

    editor.commands.addCommand({
        name: 'execProgram',
        bindKey: 'Ctrl-Enter',
        exec: function(editor) {
            $scope.output = '';
            $scope.worker.postMessage(editor.getValue());
        }
    });
  };

  $scope.init = function() {
    $scope.startWorker();
  }

  $scope.startWorker = function () {
    $scope.worker = new Worker('js/python-worker.js');
    $scope.worker.addEventListener('message', function (e) {
      $scope.$apply(function () {
        if (e.data instanceof Object) {
          switch (e.data.type) {
            case 'log':
              console.log(e.data.data);
              break;

            case 'status':
              $scope.setStatus(e.data.data);
              break;

            default:
              console.error("Unknown command from worker");
          }
        } else {
          $scope.output += e.data;
        }
      });
    }, false);
  }

  $scope.setStatus = function(status) {
    console.log('status: ' + status);
    $scope.status = status;
  }
}
