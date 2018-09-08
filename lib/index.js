import Version from './model';
import { projectJsonPath } from './constants';
import * as FileUtils from './fileUtils';

const numberPattern = /^(\D*)(\d+)$/i;


function updatePackageVersion(type, packageJson) {
  const versionModel = Version.deserializeVersion(packageJson.version);
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
  return Version.serializeVersion(versionModel);
}


function objectVersion(version) {
  const vsArray = version.split('.');
  const match = numberPattern.exec(vsArray[0]);
  let vsObject;
  if (match !== null) {
    vsObject = new Version(match[1], match[2], vsArray[1], vsArray[2]);
  } else {
    throw new Error(`Expression not supported  ${{ vsObject }}`);
  }
  return vsObject;
}


function compareKeys(current, backup) {
  const currentKeys = Object.keys(current);
  let totalMajor = 0;
  let totalMinor = 0;
  let totalPatch = 0;
  let version;

  for (let i = 0; i < currentKeys.length; i += 1) {
    const key = currentKeys[i];
    const currentValue = current[key];
    const backupValue = backup[key];
    if (backupValue === undefined || backupValue === null) {
      // se ha añadido una nueva y eliminado una antigüa
      version = updatePackageVersion('major', projectJsonPath);
      return version;
    }
    // las key son iguales -> comparamos las versiones
    const actual = objectVersion(currentValue);
    const backup2 = objectVersion(backupValue);
    if (actual.compare(backup2) === 'major') {
      totalMajor += 1;
    } else if (actual.compare(backup2) === 'minor') {
      totalMinor += 1;
    } else if (actual.compare(backup2) === 'patch') {
      totalPatch += 1;
    }
  }
  if (totalMajor) {
    version = updatePackageVersion('major', projectJsonPath);
    return version;
  }
  if (totalMinor) {
    version = updatePackageVersion('minor', projectJsonPath);
    return version;
  }
  if (totalPatch) {
    version = updatePackageVersion('patch', projectJsonPath);
    return version;
  }
  return false;
}

function comparePackages(latestJson, currentJson) {
  const latestDependencies = latestJson.dependencies;
  const latestDevDependencies = latestJson.devDependencies;
  const currentDependencies = currentJson.dependencies;
  const currentDevDependencies = currentJson.devDependencies;

  const resultDependenciesKeys = compareKeys(currentDependencies, latestDependencies);
  const resultDevDependenciesKeys = compareKeys(currentDevDependencies, latestDevDependencies);

  if (resultDependenciesKeys) { // corregir
    // guardar el package json
  } else if (resultDevDependenciesKeys) {
    // guardar el package json
  }
}

// Function that compare if the last backup package.json is equal to the current
function isLastBackupFileEqual() {
  const latestJsonBackup = FileUtils.parseJson('backup');
  const currentJson = FileUtils.parseJson('project');
  // Dependencies Elements (number of packages installed)
  const latestDependenciesElements = Object.keys(latestJsonBackup.dependencies).length;
  const currentDependenciesElement = Object.keys(currentJson.dependencies).length;
  // DevDependencies Elements (number of packages installed)
  const latestDevDependenciesElements = Object.keys(latestJsonBackup.devDependencies).length;
  const currentDevDependenciesElements = Object.keys(currentJson.devDependencies).length;

  // if they have the same number of elements we compare them to check changes in the versions
  if (latestDependenciesElements === currentDependenciesElement
      || latestDevDependenciesElements === currentDevDependenciesElements) {
    comparePackages(latestJsonBackup, currentJson);
  } else { // its elements have changed therefore we make an major update
    currentJson.version = updatePackageVersion('major', currentJson);
    FileUtils.overwriteCurrentPackageJson(currentJson);
    FileUtils.createJsonBackupFile();
  }
}


function init() {
  let result = false;

  if (FileUtils.existFile()) { // if exist package.json in the project
    if (FileUtils.existFilesInBackupFolder()) { // if exists backup files in /json_versions
      isLastBackupFileEqual();
    } else { // if not exist files, copy the file package.json to /json_versions
      FileUtils.createJsonBackupFile();
    }
    result = true;
  } else { // si el fichero no existe mostrar un mensaje de advertencia al usuario
    result = false;
  }
  return result;
}


init();

export default init;
