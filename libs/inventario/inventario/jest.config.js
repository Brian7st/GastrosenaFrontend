const { createCjsPreset } = require('jest-preset-angular/presets');

const presetConfig = createCjsPreset({
  tsconfig: '<rootDir>/tsconfig.spec.json',
  stringifyContentPathRegex: '\\.(html|svg)$',
});

module.exports = {
  displayName: 'inventario',
  ...presetConfig,
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '@restaurant/inventario': '<rootDir>/src/index.ts',
  },
};
