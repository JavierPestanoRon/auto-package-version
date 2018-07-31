'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var fs = require('fs');
var appRoot = require('app-root-path');

function getActualDate() {
  var datetime = new Date();
  var year = datetime.getFullYear();
  var month = datetime.getMonth() + 1;
  var day = datetime.getDate();
  var formatDate = '' + year + month + day;
  return formatDate;
}

function init() {
  var result = false;

  if (fs.existsSync(appRoot + '/package.json')) {
    fs.createReadStream(appRoot + '/package.json').pipe(fs.createWriteStream(appRoot + '/json_versions/' + getActualDate() + '.json'));
    result = true;
  } else {
    result = false;
  }
  return result;
}

exports.default = init;