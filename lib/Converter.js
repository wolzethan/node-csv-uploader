var Convert = require('csvtojson').Converter;
var converter = new Convert({});
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Converter = function() {
    EventEmitter.call(this);
}

util.inherits(Converter, EventEmitter);

Converter.prototype.readFile = function(file) {
  require('fs').createReadStream(file).pipe(converter);

  converter.on('end_parsed', function(jsonArray) {
    this.emit('data', jsonArray);
    this.data = jsonArray;
  }.bind(this));
}

Converter.prototype.readUrl =  function(url) {
require("request").get(url).pipe(converter);

converter.on("record_parsed", function (jsonObj) {
    this.emit('data', jsonObj);
    this.data = jsonObj;
  }.bind(this));
};

Converter.prototype.readString = function(string) {
  converter.fromString(string, function(err, result) {
    if(err) {
      throw err;
    }
    this.emit('data', result);
  }.bind(this));
};

module.exports = new Converter();
