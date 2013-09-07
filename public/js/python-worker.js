;(function () {
  self.console = {
    log: function (obj) {
      postMessage({
        type: 'log',
        data: obj
      });
    }
  };

  var handleChr = function (chr) {
    if (chr !== null) {
      postMessage(String.fromCharCode(chr));
    }
  }

  var setStatus = function(msg) {
    postMessage({type: 'status', data: msg});
  }

  setStatus('loading python...');

  importScripts('python.opt.js');

  Python.initialize(null, handleChr, handleChr);

  addEventListener('message', function (e) {
    setStatus('executing...');
    if (Python.isFinished(e.data)) {
      var result = Python.eval(e.data);
      /*if (result !== null && result !== undefined) {
        postMessage('\n--------------------------\nResult: ' + result);
      }*/
      setStatus('finished');
    } else {
      setStatus('executing...');
    }
  }, false);

  setStatus('python loaded');
})();
