//remove ./dist folder and ./packages/*/dist folders

import fs from 'fs';

const packages = [
  'commons',
  'validators',
  'core',
  'vue2',
  'vue3'
];

fs.rmSync('./dist', { recursive: true, force: true });
packages.forEach(async (pkg) => {
  fs.rmSync('./packages/' + pkg + "/dist", { recursive: true, force: true });
});
