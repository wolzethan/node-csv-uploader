var Csv = require('./index');
var csv = new Csv('./test.csv');
var testers = require('./lib/headers');
// var testHeaders = require('./headers.js');
var self = csv;
csv.uploader.connectionInfo = {
  host: "data-warehouse-2-0.cxd7nx8wf7hf.us-west-2.rds.amazonaws.com",
  port: 5432,
  user: 'ebdadmin',
  password: 'B0LG7rQ5iZio',
  database: 'data_warehouse'
};

csv.converter.readFile();
csv.converter.on('data', function(data) {
  self.data = data;
  self.parser.getHeaders(data).checkHeaders(testers);
});

csv.parser.on('valid', function() {
  // CREATE NEW OBJECT AND SEND TO POSTGRES
    self.parser.orderObject(testers, self.data[1], function(err, result) {
      if(err) {
        console.log(err);
      }
      // self.parser.setValuesForDB(result);
      self.uploader.changeObjectToCsv(result).insert(null, 'chase_test', function(err, result) {
        if(err) {
          throw err;
        }
        console.log(result);
      });
    });
}.bind(this));

csv.parser.on('invalid', function(data) {
  // DO REVALIDATION HERE
  console.log(data);
});

csv.parser.on('new:headers', function(data) {
  self.uploader.createTable('chase_test', data, function(err, result) {
    if(err) {
      throw err;
    }
    console.log(result);
  });
});
