var Convert = require('csvtojson').Converter;
var converter = new Convert({});
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Converter = function(file) {
    this.file = file;
    EventEmitter.call(this);
}

util.inherits(Converter, EventEmitter);
Converter.setMaxListeners(20);
Converter.prototype.readFile = function() {
  require('fs').createReadStream(this.file).pipe(converter);

  converter.on('end_parsed', function(jsonArray) {
    this.emit('data', jsonArray);
    this.data = jsonArray;
  }.bind(this));
}

Converter.prototype.readUrl =  function() {
require("request").get(this.file).pipe(converter);

converter.on("record_parsed", function (jsonObj) {
    this.emit('data', jsonObj);
    this.data = jsonObj;
  }.bind(this));
};

Converter.prototype.readString = function() {
  converter.fromString(this.file, function(err, result) {
    if(err) {
      throw err;
    }
    this.emit('data', result);
  }.bind(this));
};

module.exports = Converter;
