'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.existFilesInBackupFolder = existFilesInBackupFolder;
exports.overwriteCurrentPackageJson = overwriteCurrentPackageJson;
exports.createJsonBackupFile = createJsonBackupFile;
exports.getLatestFile = getLatestFile;
exports.parseJson = parseJson;
exports.existFile = existFile;

var _constants = require('./constants');

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var appRoot = require('app-root-path');
var Console = require('console');

// Function that return true if exist files in the backup folder
function existFilesInBackupFolder() {
  if (fs.readdirSync('' + _constants.backupFolderPath).length > 0) {
    return true;
  }
  return false;
}

// Function that overwrite the project package.json
function overwriteCurrentPackageJson(newPackageJson) {
  try {
    fs.readFileSync(appRoot + '\\package.json', JSON.stringify(newPackageJson), 'utf-8');
  } catch (error) {
    Console.error('Overwrite file error: ', error);
  }
}

// Function that copy the package.json to /json_versions
function createJsonBackupFile() {
  try {
    fs.createReadStream('' + _constants.projectJsonPath).pipe(fs.createWriteStream(_constants.backupFolderPath + '\\' + _utils2.default.getActualDate() + '.json'));
  } catch (error) {
    Console.error('Copy file error: ', error);
  }
}

// Function that return the name of the latest file in /json_versions
function getLatestFile() {
  var result = '';
  var fileArray = [];
  var files = fs.readdirSync('' + _constants.backupFolderPath);
  if (files.length > 2) {
    fileArray = files.sort(function (a, b) {
      var file1 = fs.statSync(_constants.backupFolderPath + '/' + a);
      var file2 = fs.statSync(_constants.backupFolderPath + '/' + b);
      return file1.mtime > file2.mtime;
    });
    result = fileArray[fileArray.length - 1];
  } else {
    result = files;
  }
  return result;
}

function parseJson(folder) {
  var result = void 0;
  if (folder === 'backup') {
    result = JSON.parse(fs.readFileSync(appRoot + '\\json_versions\\' + getLatestFile(), 'utf-8'));
  } else if (folder === 'project') {
    result = JSON.parse(fs.readFileSync(appRoot + '\\package.json', 'utf-8'));
  }
  return result;
}

function existFile() {
  return fs.existsSync('' + _constants.projectJsonPath);
}