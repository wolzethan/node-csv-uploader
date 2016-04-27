var pg = require('pg');
var connectionInfo = require('./config').connectionInfo;
var self;
var Uploader = function() {
  self = this;
  this.defaults = pg.defaults;
  this.connectionInfo = connectionInfo;
}

// TODO: Upload function
Uploader.prototype.insert = function(row, conn, table, callback) {

  if(arguments[0] === null) {
    row = this._stagedData;
  };

  var connectionInfo = {};

  if(conn !== null) {
    connectionInfo = conn;
  } else {
    connectionInfo = self.connectionInfo;
  }

  pg.connect(connectionInfo, function(err, client, done) {
    if(err) {
      throw err;
    }

    client.query('INSERT INTO '+table+' VALUES('+row+')', function(err, result) {
      done();
      if(err) {
          return callback(err);
      }

      return callback(null, result);
    });
  });
};

// TODO: CREATE TABLE function
Uploader.prototype.createTable = function(name, conn, values, callback) {
  var connectionInfo = {};

  if(conn !== null) {
    connectionInfo = conn;
  } else {
    connectionInfo = self.connectionInfo;
  }

  pg.connect(connectionInfo, function(err, client, done) {
    if(err) {
      throw err;
    }
    client.query('CREATE TABLE ' + name + '('+values+')', function(err, result) {
      done();
      if(err) {
        return callback(err);
      }

      return callback(null, result);
    });
  });
};

//TODO: Get TABLE HEADERS
Uploader.prototype.getColumnNames = function(table_name, callback) {
  pg.connect(self.connectionInfo, function(err, client, done) {
    if(err) {
      throw err;
    }
    client.query('SELECT * FROM information_schema.columns WHERE table_name = '+table_name,
      function(err, result) {
        if(err) {
          return callback(err);
        }

        return callback(null, result);
      });
  });
};

Uploader.prototype.changeObjectToCsv = function(data) {
  var objectData = [];
  for (var prop in data) {
    if(typeof data[prop] === 'object') {
        data[prop] = JSON.stringify(data[prop]);
    }
    objectData.push("'" + data[prop] + "'");
  };
  this._stagedData = objectData.join(",");
  return this;
};

module.exports = new Uploader();
