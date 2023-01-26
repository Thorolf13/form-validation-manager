module.exports = {
  verbose: true,
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ['ts', 'js', 'jsx', 'json', 'vue']
};
