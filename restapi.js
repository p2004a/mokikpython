function doMany(onFinished, numTasks, task) {
  if (!numTasks) {
    onFinished();
  }
  task(function () {
    --numTasks;
    if (numTasks == 0) {
      onFinished();
    }
  });
}

function exitIfError(err, db, res) {
  if (err) {
    res.send(500, '{"ok": 0}');
    if (db) db.close();
    console.log('REST API ERROR');
    throw err;
  }
}

function handleErrors(db, res, callback) {
  return function (err, obj) {
    exitIfError(err, db, res);
    callback(obj);
  }
}

exports.extend = function (app) {

}
