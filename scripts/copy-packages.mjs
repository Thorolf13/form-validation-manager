import cpy from 'cpy';

const packages = [
  'commons',
  'validators',
  'core',
  'vue2',
  'vue3'
];

packages.forEach(async (pkg) => {
  //copy package.json files
  await cpy(['./packages/' + pkg + '/package.json'], './dist/' + pkg, { flat: true, overwrite: true });

  //copy dist files
  await cpy(['./packages/' + pkg + '/dist/**/*'], './dist/' + pkg + '/dist', { parents: true, overwrite: true });

  //copy types files
  await cpy(['./packages/' + pkg + '/types/**/*'], './dist/' + pkg + "/types", { parents: true, overwrite: true });
});

//copy main package.json
await cpy(['./package.json'], './dist', { flat: true, overwrite: true });

//copy md files
await cpy(['./README.md', './LICENCE.md', 'changelog.md'], './dist', { flat: true, overwrite: true });
