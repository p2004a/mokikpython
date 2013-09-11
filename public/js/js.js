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
        var e = $($element);

        var editor = $('.editor');
        var output_box = $('.output_box');
        var output_hide = $('.output_hide');
        var output = $('.output');

        var moverClick = function(ev) {
          ev.preventDefault();

          var y = ev.screenY;

          var doc = $(document);

          doc.on('mouseup', function(ev) {
            doc.unbind('mouseup mousemove');
          });

          doc.on('mousemove', function(ev) {
            var inc = y - ev.screenY;
            y = ev.screenY;

            function changeVal(inc, obj, attr) {
              var val = obj.css(attr);
              val = parseFloat(val.substr(0, val.length - 2));

              var winheight = Math.max($(document).height(), $(window).height());

              var editortop = editor.css('top');
              editortop = parseFloat(editortop.substr(0, editortop.length - 2));
              editortop += 50;

              var maxbottom = winheight - editortop;

              var new_val = Math.min(maxbottom, Math.max(50, val + inc));
              obj.css(attr, (new_val) + 'px');
            }

            changeVal(inc, editor, 'bottom');
            changeVal(inc, output_box, 'height');

            $scope.editor.resize(true);
          });
        }

        e.on('mousedown', moverClick);

        var old_val = {
          editor: null,
          output_box: null
        };
        output_hide.on('click', function (ev) {
          $scope.output_hidden = !$scope.output_hidden;
          switch ($scope.output_hidden) {
            case true:
              old_val.editor = editor.css('bottom');
              old_val.output_box = output_box.css('height');

              editor.css('bottom', '5px');
              output_box.css('height', '0px');

              output_hide.removeClass('output_hide_show');
              output_hide.addClass('output_hide_hide');

              output_hide.find('i').removeClass('glyphicon-chevron-down');
              output_hide.find('i').addClass('glyphicon-chevron-up');

              output.css('display', 'none');

              $scope.editor.resize(true);

              e.unbind('mousedown');
              break;

            case false:
              editor.css('bottom', old_val.editor);
              output_box.css('height', old_val.output_box);

              output_hide.removeClass('output_hide_hide');
              output_hide.addClass('output_hide_show');

              output_hide.find('i').removeClass('glyphicon-chevron-up');
              output_hide.find('i').addClass('glyphicon-chevron-down');

              output.css('display', 'block');

              $scope.editor.resize(true);

              e.on('mousedown', moverClick);
              break;
          }
        });
      }
    };
   return d;
  });

function IDEController($scope) {
  $scope.output = '';
  $scope.status = 'loading page...';
  $scope.output_hidden = false;

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
