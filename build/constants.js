'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var appRoot = require('app-root-path'); // project path

var projectJsonPath = exports.projectJsonPath = appRoot + '\\package.json'; // project package.json path
var backupFolderPath = exports.backupFolderPath = appRoot + '\\json_versions'; // package.json backup folder path