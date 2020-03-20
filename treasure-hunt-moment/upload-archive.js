/**
 * HOW TO CALL:
 * - node ./_uplaod/generate.js -v 1.0.3 (or other version)
 * - node ./_upload/upload-archive.js --n quiz,collage,duel
 * The process: 
 * - Autenticate using tester account.
 * - Read template from the [templates] folder.
 * - Upload [cover] for the template.
 * - Upload [icon] for the template.
 * - Create a folder called [tmp] containing: 
 *    - [manifest.json]: from [./assets/templates/{templateName}.json]
 *    - [config]: formed by mapping
 *      - [./assets/config/{templateName}.mobile.json] ==> [./config/mobile.config.json]
 *      - [./assets/config/{templateName}.stage.json] ==> [./config/results.config.json]
 *    - [src]: taken from [../{templateName}/v2/]
 * - From [tmp] generate an archive [archive.zip] by executing the bash zip script. 
 * - Remove [tmp]
 * - Upload [archive.zip]
 * - Remove [archive.zip]
 * 
 * NOTE: If you are not running this script on a bash console, the zip command might not work.
 */
var path = require('path');
var fs = require('fs');
var axios = require('axios');
var ncp = require('ncp').ncp;
var rimraf = require("rimraf");
const { exec } = require('child_process');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const copyFileAsync = promisify(fs.copyFile);
const unlinkFileAsync = promisify(fs.unlink);
const readdirAsync = promisify(fs.readdir);
const ncpAsync = promisify(ncp);
const execFileAsync = promisify(exec);
const NixClap = require("nix-clap");
 
const cliOptions = {
  templateNames: {
    desc: "specify template names",
    alias: ["n", "m", "name"],
    type: "string"
  },
  env: {
    desc: "specify endpoint (default staging)",
    alias: ["env", "e"],
    type: "string",
    default: "staging"
  },
  user: {
    desc: "specify user",
    alias: ["user", "u"],
    type: "string",
    default: ""
  },
  pwd: {
    desc: "specify password",
    alias: ["pass", "pwd", "p"],
    type: "string",
    default: ""
  },
};
 
const parsed = new NixClap()
  .version("1.0.0")
  .usage("$0 [options]")
  .init(cliOptions)
  .parse();

// state
let apiEndpoint, cdn;

if (parsed.opts.env && parsed.opts.env === 'production') {
  apiEndpoint = 'https://stagecast.se';
  cdn = 'https://d5q8k8cx63nj4.cloudfront.net/api/content/';
  console.warn('NOTE: you are running against PRODUCTION! You have 2s to abort the program.');
} else {
  apiEndpoint = 'https://staging.stagecast.se';
  cdn = 'https://d2cb7i0wbc0znj.cloudfront.net/api/content/';
  console.log('Running against staging...');
}

if (!parsed.opts.user || !parsed.opts.pwd) {
  console.warn("Either username or password are missing.");
  console.warn("You specify them by adding --user username --pwd password");
  console.warn("Exit with code 1");
  process.exit(1);
}

var options = {
  headers: {
    'Content-Type': 'application/json',
    'X-Token' : ''
  }
};

async function auth() {
  try {
    const { data } = await axios.post(
      `${apiEndpoint}/api/users/login`,
      { email: parsed.opts.user, password: parsed.opts.pwd },
      { headers: {'Content-Type': 'application/json'} }
    );
    console.log('Successfully authenticated!');
    return data;
  } catch (error) {
    console.error(error.message || error);
  }
}
async function uploadCover(name) {
  let attempts = 3;
  let contentId = '';
  while (true) {
    try {
      let img = await readFileAsync(path.join(__dirname, 'assets', `${createId(name)}.cover.png`));
      let contentOptions = {...options};
      contentOptions.headers['X-Tags'] = "template,momentstore,cover";
      contentOptions.headers['Content-Type'] = 'image/png';
      console.log(`Uploading cover for "${name}"...`);
      const { data } = await axios.post(`${apiEndpoint}/api/events/imgbucket/templates/content`, img, contentOptions);
      contentId = data.id
      console.log(`Cover for "${name}" uploaded with id ${contentId}`);
      break;
  
    } catch(error) {
      if (--attempts <= 0) {
        console.log('Error while uploading the cover:', error.message);
        return null;
      }
    }
  }
  return contentId;
}
async function uploadIcon(name) {
  let attempts = 3;
  let icon = '';
  while (true) {
    try {
      let img = await readFileAsync(path.join(__dirname, 'assets', `${createId(name)}.icon.png`));
      let contentOptions = {...options};
      contentOptions.headers['X-Tags'] = "template,icon,white,default"
      contentOptions.headers['Content-Type'] = 'image/png';
      console.log(`Uploading icon for "${name}"...`);
      const { data } = await axios.post(`${apiEndpoint}/api/events/imgbucket/templates/content`, img, contentOptions);
      icon = data.id
      console.log(`Icon for "${name}" uploaded with id ${icon}`);
      break;
    } catch(error) {
      if (--attempts <= 0) {
        console.log('Error while uploading the template icon:', error.message);
        return null;
      }
    }
  }
  return icon;
}

async function readFile(file) {
  if (file.startsWith('_')) {
    return false;
  }
  // read template
  const buffer = await readFileAsync(path.join(__dirname, file));
  let toUpload = JSON.parse(buffer.toString());
  return toUpload;
}
async function createArchive(name, toUpload) {
  var dir = 'tmp';

  // create dir
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  } 

  writeFileAsync(
    path.resolve( __dirname, dir, "manifest.json"),
    JSON.stringify(toUpload, null, 2),
    {flag: 'w'}
   );
   console.log("manifest.json was saved!");


  // copy manifest
  // await copyFileAsync('_upload/assets/templates/article.json', '_upload/tmp/manifest.json', fs.constants.COPYFILE_EXCL);
  try {
    console.log('Copying src...');
    await ncpAsync('src', 'tmp/src');
  } catch (err) {
    console.log(err);
  }
  console.log('Copying config...');
  fs.mkdirSync(path.join(dir, 'config'));
  
  try {
    console.log('mobile config...');
    await copyFileAsync('config/mobile.config.json', 'tmp/config/mobile.config.json', fs.constants.COPYFILE_EXCL);
  } catch (err) {}
  try {
    console.log('stage config...');
    await copyFileAsync('config/results.config.json', 'tmp/config/results.config.json', fs.constants.COPYFILE_EXCL);
  } catch (err) {}
  
  console.log("Zipping...");
  const { error, stdout, stderr } = await execFileAsync('./zip.sh');
  if (stdout) {
    console.log(stdout);
  }
  if (error) {
    console.log("Error: ", error);
    return; 
  }
  if (stderr) {
    console.log('Error while zipping: ' + stderr);
  }
  rimraf.sync(dir);
}
async function uploadLocalArchive() {
  try {
    console.log(__dirname);
    const archive = await readFileAsync(path.join(__dirname,`archive.zip`));
    let contentOptions = {...options};
    contentOptions.headers['Content-Type'] = 'application/octet-stream';
    console.log(`Uploading archive...`);
    return await axios.post(`${apiEndpoint}/api/archives`, archive, contentOptions);

  } catch(error) {
    console.log('Error while uploading the archive:', error.message || error);
  }
}
async function removeLocalArchive() {
  await unlinkFileAsync('archive.zip');
}
async function handleFile(file) {
  let toUpload;
  try {
    toUpload = await readFile(file);
  } catch (err) {
    console.log('The file was not found. Aborting.');
    return null
  }
  if (!toUpload) {
    console.log(`"${template.name}" is disabled (you disable by placing a _ before the template name). Skipping.`);
    return null;
  }

  let template = toUpload.template;
  
  // upload cover
  let coverId = await uploadCover(template.name);
  if (!coverId) {
    console.log('Cover upload failed. Aborting.');
    return null;
  }
  template.presentation['cover'] = coverId;

  // upload icon
  let iconId = await uploadIcon(template.name);
  if (!iconId) {
    console.log('Icon upload failed. Aborting.');
    return null;
  }
  Object.assign(template.icons[0], {
    "url": cdn + iconId,
    "name": `${template.name}.png`,
    "contentId": iconId
  });

  try {
    await createArchive(toUpload.template.name, toUpload);
  } catch (err) {
    console.log('Error while creating the archive. Are you running this script on bash? '
    + 'The zip command works only on bash consoles. Aborting.');
    await removeLocalArchive();
  }
  await uploadLocalArchive();
  await removeLocalArchive();
}

async function readAndUploadSelected() {
  console.log('\n');
  await handleFile('manifest.json');
}

async function main() {
  await cleanAll();
  await sleep(2000);
  const { token } = await auth();
  options.headers['X-Token'] = token;
  await readAndUploadSelected();
  console.log('\nAll done. Exit.');
}
async function cleanAll() {
  try {
    rimraf.sync('./tmp');
  } catch (err) {}
  try {
    await removeLocalArchive();
  } catch (err) {}
}
function createId(name) {
  return name.split(' ').join('_');
}
// TODO: replace the name-based operation with bundle-id based operations
function getTemplateNameFromBundle(bundleId) {
  let s = bundleId.split('.') || [];
  return s.length > 0 ? s[s.length - 1].split('_').join(' ') : null;
}
function templateIsBlacklisted(name) {
  return (blackList.includes(name) || blackList.includes(name.split(' ').join('-')))
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
main();
