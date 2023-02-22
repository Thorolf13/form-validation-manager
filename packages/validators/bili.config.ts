import { Config } from 'bili';

const config: Config = {
  input: './index.ts',
  output: {
    format: ['esm', 'cjs'],
    moduleName: 'FvmValidators'
  }
}

export default config;
