'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

var _constants = require('./constants');

var _fileUtils = require('./fileUtils');

var FileUtils = _interopRequireWildcard(_fileUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const fs = require('fs');

var numberPattern = /^(\D*)(\d+)$/i;

function updatePackageVersion(type, packageJson) {
  var versionModel = _model2.default.deserializeVersion(packageJson.version);
  switch (type) {
    case 'major':
      // aumentamos el major
      versionModel.major += 1;
      versionModel.minor = 0;
      versionModel.path = 0;
      break;
    case 'minor':
      // aumentamos el minor
      versionModel.minor += 1;
      versionModel.path = 0;
      break;
    case 'patch':
      // aumentamos el patch
      versionModel.path += 1;
      break;
    default:
      break;
  }
  return _model2.default.serializeVersion(versionModel);
}

function objectVersion(version) {
  var vsArray = version.split('.');
  var match = numberPattern.exec(vsArray[0]);
  var vsObject = void 0;
  if (match !== null) {
    vsObject = new _model2.default(match[1], match[2], vsArray[1], vsArray[2]);
  } else {
    throw new Error('Expression not supported  ' + { vsObject: vsObject });
  }

  return vsObject;
}

function compareKeys(current, backup) {
  var currentKeys = Object.keys(current);
  var totalMajor = 0;
  var totalMinor = 0;
  var totalPatch = 0;
  var version = void 0;

  for (var i = 0; i < currentKeys.length; i += 1) {
    var key = currentKeys[i];
    var currentValue = current[key];
    var backupValue = backup[key];
    if (backupValue === undefined || backupValue === null) {
      // se ha añadido una nueva y eliminado una antigüa
      version = updatePackageVersion('major', _constants.projectJsonPath);
      return version;
    }
    // las key son iguales -> comparamos las versiones
    var actual = objectVersion(currentValue);
    var backup2 = objectVersion(backupValue);
    if (actual.compare(backup2) === 'major') {
      totalMajor += 1;
    } else if (actual.compare(backup2) === 'minor') {
      totalMinor += 1;
    } else if (actual.compare(backup2) === 'patch') {
      totalPatch += 1;
    }
  }
  if (totalMajor) {
    version = updatePackageVersion('major', _constants.projectJsonPath);
    return version;
  }
  if (totalMinor) {
    version = updatePackageVersion('minor', _constants.projectJsonPath);
    return version;
  }
  if (totalPatch) {
    version = updatePackageVersion('patch', _constants.projectJsonPath);
    return version;
  }
  return false;
}

function comparePackages(latestJson, currentJson) {
  var latestDependencies = latestJson.dependencies;
  var latestDevDependencies = latestJson.devDependencies;
  var currentDependencies = currentJson.dependencies;
  var currentDevDependencies = currentJson.devDependencies;

  var resultDependenciesKeys = compareKeys(currentDependencies, latestDependencies);
  var resultDevDependenciesKeys = compareKeys(currentDevDependencies, latestDevDependencies);

  if (resultDependenciesKeys) {// corregir
    // guardar el package json
  } else if (resultDevDependenciesKeys) {
    // guardar el package json
  }
}

// Function that compare if the last backup package.json is equal to the current
function isLastBackupFileEqual() {
  var latestJsonBackup = FileUtils.parseJson('backup');
  var currentJson = FileUtils.parseJson('project');
  // Dependencies Elements (number of packages installed)
  var latestDependenciesElements = Object.keys(latestJsonBackup.dependencies).length;
  var currentDependenciesElement = Object.keys(currentJson.dependencies).length;
  // DevDependencies Elements (number of packages installed)
  var latestDevDependenciesElements = Object.keys(latestJsonBackup.devDependencies).length;
  var currentDevDependenciesElements = Object.keys(currentJson.devDependencies).length;

  // if they have the same number of elements we compare them to check changes in the versions
  if (latestDependenciesElements === currentDependenciesElement || latestDevDependenciesElements === currentDevDependenciesElements) {
    comparePackages(latestJsonBackup, currentJson);
  } else {
    // its elements have changed therefore we make an major update
    currentJson.version = updatePackageVersion('major', currentJson);
    FileUtils.overwriteCurrentPackageJson(currentJson);
    FileUtils.createJsonBackupFile();
  }
}

function init() {
  var result = false;

  if (FileUtils.existFile()) {
    // if exist package.json in the project
    if (FileUtils.existFilesInBackupFolder()) {
      // if exists backup files in /json_versions
      isLastBackupFileEqual();
    } else {
      // if not exist files, copy the file package.json to /json_versions
      FileUtils.createJsonBackupFile();
    }
    result = true;
  } else {
    // si el fichero no existe mostrar un mensaje de advertencia al usuario
    result = false;
  }
  return result;
}

init();

exports.default = init;