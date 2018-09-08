import { projectJsonPath, backupFolderPath } from './constants';
import Utils from './utils';


const fs = require('fs');
const appRoot = require('app-root-path');
const Console = require('console');


// Function that return true if exist files in the backup folder
export function existFilesInBackupFolder() {
  if (fs.readdirSync(`${backupFolderPath}`).length > 0) {
    return true;
  }
  return false;
}

// Function that overwrite the project package.json
export function overwriteCurrentPackageJson(newPackageJson) {
  try {
    fs.readFileSync(`${appRoot}\\package.json`, JSON.stringify(newPackageJson), 'utf-8');
  } catch (error) {
    Console.error('Overwrite file error: ', error);
  }
}

// Function that copy the package.json to /json_versions
export function createJsonBackupFile() {
  try {
    fs.createReadStream(`${projectJsonPath}`).pipe(fs.createWriteStream(`${backupFolderPath}\\${Utils.getActualDate()}.json`));
  } catch (error) {
    Console.error('Copy file error: ', error);
  }
}

// Function that return the name of the latest file in /json_versions
export function getLatestFile() {
  let result = '';
  let fileArray = [];
  const files = fs.readdirSync(`${backupFolderPath}`);
  if (files.length > 2) {
    fileArray = files.sort((a, b) => {
      const file1 = fs.statSync(`${backupFolderPath}/${a}`);
      const file2 = fs.statSync(`${backupFolderPath}/${b}`);
      return file1.mtime > file2.mtime;
    });
    result = fileArray[fileArray.length - 1];
  } else {
    result = files;
  }
  return result;
}

// Function that return the content of project package.json or the backup package.json
export function parseJson(folder) {
  let result;
  if (folder === 'backup') {
    result = JSON.parse(fs.readFileSync(`${appRoot}\\json_versions\\${getLatestFile()}`, 'utf-8'));
  } else if (folder === 'project') {
    result = JSON.parse(fs.readFileSync(`${appRoot}\\package.json`, 'utf-8'));
  }
  return result;
}

// Function that return if exist the package.json file in the project
export function existFile() {
  return fs.existsSync(`${projectJsonPath}`);
}
