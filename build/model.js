'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function Version(symbol, major, minor, patch) {
  this.symbol = String(symbol);
  this.major = Number(major);
  this.minor = Number(minor);
  this.patch = Number(patch);
}

Version.prototype.compare = function compare(versionParam) {
  var status = '';
  if (this.major !== versionParam.major) {
    status = 'major';
  } else if (this.minor !== versionParam.minor) {
    status = 'minor';
  } else if (this.patch !== versionParam.patch) {
    status = 'patch';
  } else {
    status = 'equals';
  }
  return status;
};

// Function that take a version and return a Version Object
Version.prototype.deserializeVersion = function deserializeVersion(version) {
  var fields = version.split('.');
  return new Version('', fields[0], fields[1], fields[2]);
};

// Function that take a Version Object and return a version string
// Format: 'major.minor.path'
Version.prototype.serializeVersion = function serializeVersion(version) {
  return version.major + '.' + version.minor + '.' + version.patch;
};

exports.default = Version;