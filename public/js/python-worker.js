;(function () {
    self.console = {
        log: function (obj) {
            postMessage({
                type: 'log',
                data: obj
            });
        }
    };
    
    importScripts('js/python.opt.js');

    var handleChr = function {
        if (chr !== null) {
            postMessage(String.fromCharCode(chr));
        }
    }
    
    Python.initialize(null, handleChr, handleChr);

    addEventListener('message', function (e) {
        if (Python.isFinished(e.data)) {
            var result = Python.eval(e.data);
            if (result !== null && result !== undefined) {
                postMessage('\n--------------------------\nResult: ' + result);
            }
        } else {
            postMessage('\nCommand not finished.\n');
        }
    }, false);

    postMessage('');
})();
