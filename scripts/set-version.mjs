import { exec } from 'child_process';

let version = process.env.npm_package_version;
let fromArgs = false;

const argv = process.argv;
if (argv.length > 2) {
  const arg = argv[2];
  if (arg) {
    version = arg;
    fromArgs = true;
  }
}


console.log('set version to', version);


if (fromArgs) {
  await exec('npm version ' + version);
}

//propagate version to all packages
const packages = [
  'commons',
  'validators',
  'core',
  'vue2',
  'vue3'
];


//run lerna version
packages.forEach(async (pkg) => {
  //move into pack dir and run npm version
  console.log('    set ' + pkg + ' version to', version)
  await exec('cd ./packages/' + pkg + ' && npm version ' + version);
});
