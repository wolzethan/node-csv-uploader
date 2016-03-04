var Convert = require('csvtojson').Converter;
var converter = new Convert({
  fork: true,
});
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Converter = function(file) {
    this.file = file;
}

Converter.prototype.readFile = function(cb) {
  require('fs').createReadStream(this.file).pipe(converter);

  converter.on('end_parsed', function(jsonArray) {
    this.data = jsonArray;
    cb(jsonArray);
  }.bind(this));

  converter.on('error', function(errMsg, errData) {
    console.log(errMsg + '\n\n');
    console.log(errData + '\n\n');
  });
}

Converter.prototype.readUrl =  function() {
require("request").get(this.file).pipe(converter);

converter.on("record_parsed", function (jsonObj) {
    this.emit('data', jsonObj);
    this.data = jsonObj;
  }.bind(this));
};

Converter.prototype.readString = function(cb) {
  converter.fromString(this.file, function(err, result) {
    if(err) {
      throw err;
    }
    cb(null, result);
  }.bind(this));
};

module.exports = new Converter();
