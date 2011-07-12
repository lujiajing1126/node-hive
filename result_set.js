var ResultSet = function(rows, schema) {
  this.rows = rows;
  this.schema = schema.fieldSchemas;
};

ResultSet.prototype.each = function(cb) {
  for(var i in this.rows) {
    var rowArray = this.rows[i].split("\t");
    var row = {};
    var headers = this.headers();
    for(var a in rowArray) {
      row[headers[a]] = rowArray[a];
    }
    cb(row);
  };
};

ResultSet.prototype.toArray = function() {
  var ret = [];
  for(var i in this.rows) {
    ret.push(this.rows[i].split("\t"));
  };
  return ret;
};

ResultSet.prototype.headers = function() {
  var colCount = this.rows[0].split("\t").length;
  var ret = [];
  var partitionCount = 1;
  var i = 0;
  while(i < colCount) {
    schemaName = this.schema[i] ? this.schema[i].name : ("_p" + partitionCount++);
    ret.push(schemaName);
    i++;
  }
  this.headers = function() { return ret; };
  return ret;
};

ResultSet.prototype.toTSV = function(headers) {
  var body = this.rows.join("\n");
  if(headers) {
   body = this.headers().join("\t") + "\n" + body;
  }
  return body;
};

exports.create = function(rows, schema) {
  return (new ResultSet(rows, schema))
};