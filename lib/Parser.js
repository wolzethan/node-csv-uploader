var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var dataTypes = require('./datatypes');

var Parser = function() {
  EventEmitter.call(this);
};

util.inherits(Parser, EventEmitter);

Parser.prototype.getHeaders = function(data) {
  var headers = [];
  if(data.length) {
    data = data[0];
  }

  for(var prop in data) {
    headers.push(prop);
  }
  this.headers = headers;
  return this;
};

Parser.prototype.checkHeaders = function(headers, cb) {

  if(!this.headers) return cb(false);
  var badHeaders = [];
  // TODO check current headers against the control
  for(var i=0; i < this.headers.length; i++) {
    if(headers.indexOf(this.headers[i]) < 0) {
      badHeaders.push(this.headers[i]);
    }
  }
  if (badHeaders.length) {
      this.headersValid = false;
      cb(false, badHeaders);

  } else {
      this.headersValid = true;
      cb(true);
  }
};

// Match Object to the Control Object
Parser.prototype.orderObject = function(control, data, callback) {
  var newObj = {};
  if(!this.headersValid) return callback("Headers have not been validated");
  for(var i = 0; i < control.length; i++) {
    if(data.hasOwnProperty(control[i])) {
      newObj[control[i]] = data[control[i]];
    } else {
      return callback("Issue with header", headers[i]);
    }
  };
  return callback(null, newObj);
};

//TODO: Function to fix incorrect values
Parser.prototype.setNewValues = function(obj, corrections) {
  var newObj = {};
  // PROP looks like transaction_ids
  for(var prop in corrections) {
    if(obj.hasOwnProperty(prop)) {
      var data = obj[prop];
      delete obj[prop];
      obj[corrections[prop]] = data;
    }
  }
  return obj;
};

//TODO: Set values to match values for DB Header syntax
Parser.prototype.setValuesForDB = function(dataObj, callback) {
  var realValues = [];
  // Loop through datatypes of props in dataObj
  for (var prop in dataObj) {
    if(dataTypes.hasOwnProperty(typeof dataObj[prop])) {
      realValues.push('"' + prop + '"' + ' ' + dataTypes[typeof dataObj[prop]]);
    }
  }
  callback(null, realValues.join(","));
};

module.exports = new Parser();
