var Uploader  = require('./Uploader');
var Converter = require('./Converter');
var Parser    = require('./Parser');

var EventEmitter = require('events').EventEmitter;
var util      = require('util');

var csvUploader = function(data) {
  this.parser    = Parser;
  this.converter = Converter;
  this.uploader  = Uploader;
};

util.inherits(csvUploader, EventEmitter);

module.exports = new csvUploader();
