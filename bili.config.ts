import { Config } from 'bili'

const config: Config = {
  plugins: {
    typescript2: {
      // Override the config in `tsconfig.json`
      tsconfigOverride: {
        include: ['src']
      }
    }
  },
  input: 'src/index.ts',
  output: {
    format: ['esm', 'cjs', 'iife-min'],
    moduleName: 'Vuelidate'
  },
  globals: {
    'vue-demi': 'VueDemi'
  }
}

export default config;
