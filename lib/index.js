import Version from './model';

const fs = require('fs');
const appRoot = require('app-root-path');
const Console = require('console');

const originalJsonPath = `${appRoot}/package.json`;

// Function that generate the json file name with the date
function getActualDate() {
  const dateTime = new Date();
  const year = dateTime.getFullYear();
  const month = dateTime.getMonth() + 1;
  const day = dateTime.getDate();
  const hour = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const milliseconds = dateTime.getMilliseconds();
  const formatDate = `${month}-${day}-${year} ${hour}_${minutes}_${milliseconds}`;
  return formatDate;
}

// Function that copy the package.json to /json_versions
function createJsonLogFile(_originalJsonPath) {
  const logJsonFolderPath = `${appRoot}/json_versions`;
  const newJsonFileName = `${getActualDate()}.json`;
  try {
    fs.createReadStream(`${_originalJsonPath}`).pipe(fs.createWriteStream(`${logJsonFolderPath}/${newJsonFileName}`));
  } catch (error) {
    Console.error('Copy file error: ', error);
  }
}

// Function that returns if there are files in a directory
function existFilesInFolder() {
  let result = false;
  if (fs.readdirSync(`${appRoot}/json_versions`).length > 0) {
    result = true;
  }
  return result;
}

// Function that return the name of the latest file in /json_versions
function getLatestFile() {
  let result = '';
  let fileArray = [];
  const files = fs.readdirSync(`${appRoot}/json_versions`);
  if (files.length > 1) {
    fileArray = files.sort((a, b) => {
      const file1 = fs.statSync(`${appRoot}/json_versions/${a}`);
      const file2 = fs.statSync(`${appRoot}/json_versions/${b}`);
      return file1.mtime > file2.mtime;
    });
    result = fileArray[fileArray.length - 1];
  }
  return result;
}

function routeReplace() {
  const route = appRoot.path.replace(/\\/g, '/');
  return route;
}

function deserializeVersion(_actualVersion) {
  const fields = _actualVersion.split('.');
  return new Version('', fields[0], fields[1], fields[2]);
}

function serializeVersion(_newVersion) {
  return `${_newVersion.major}.${_newVersion.minor}.${_newVersion.patch}`;
}

function changePackageVersions(type, packageJson) {
  const versionModel = deserializeVersion(packageJson.version);
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
  return serializeVersion(versionModel);
}

function overwritePackageJson(_newPackageJson) {
  try {
    fs.readFileSync(`${routeReplace()}/package.json`, JSON.stringify(_newPackageJson), 'utf-8');
  } catch (error) {
    Console.error('Overwrite file error: ', error);
  }
}

function comparePackages(latestJson, currentJson) {
  const latestDependencies = latestJson.dependencies;
  const latestDevDependencies = latestJson.devDependencies;
  const currentDependencies = currentJson.dependencies;
  const currentDevDependencies = currentJson.devDependencies;

  // TODO -> comparar que las keys sean las mismas y los values tambien
  // TODO -> en caso contrario realizar los update pertinentes
}

function isLastFileEqual() {
  const latestJsonLog = JSON.parse(fs.readFileSync(`${routeReplace()}/json_versions/${getLatestFile()}`, 'utf-8'));
  const currentPackageJson = JSON.parse(fs.readFileSync(`${routeReplace()}/package.json`, 'utf-8'));

  // tienen el mismo nuemero de elementos
  if (latestJsonLog.dependencies.length === currentPackageJson.dependencies.length
  || latestJsonLog.devDependencies.length === currentPackageJson.devDependencies.length) {
    // comprobar si sus elementos no han variado o son los mismos
  } else {
    currentPackageJson.version = changePackageVersions('major', currentPackageJson);
    overwritePackageJson(currentPackageJson); // sobreescribe package.json
    createJsonLogFile(originalJsonPath); // crea una copia en /json_version
  }
}


function init() {
  let result = false;

  if (fs.existsSync(`${originalJsonPath}`)) { // si el fichero package.json existe en nuestro proyecto
    if (existFilesInFolder()) { // comprobamos si existen ficheros en /json_versions
      isLastFileEqual(); // comparamos el fichero actual con el último fichero de /json_versions
    } else { // copy the file package.json to /json_versions
      createJsonLogFile(originalJsonPath);
    }
    result = true;
  } else { // si el fichero no existe mostrar un mensaje de advertencia al usuario
    result = false;
  }
  return result;
}


export default init;
