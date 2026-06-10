/**
 * Config de jest para el lib inventario (standalone).
 * Correr: npx jest --config libs/inventario/inventario/jest.config.js
 */
module.exports = {
  displayName: 'inventario',
  rootDir: '.',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@angular|rxjs|tslib|@ngrx)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  moduleNameMapper: {
    '@restaurant/inventario': '<rootDir>/src/index.ts',
    '@restaurant/shared/ui': '<rootDir>/../../../libs/shared/ui/src/index.ts',
    '@restaurant/shared/auth': '<rootDir>/../../../libs/shared/auth/src/index.ts',
    '@restaurant/shared/models': '<rootDir>/../../../libs/shared/models/src/index.ts',
    '@restaurant/shared/state': '<rootDir>/../../../libs/shared/state/src/index.ts',
    '@restaurant/shared/api': '<rootDir>/../../../libs/shared/api/src/index.ts',
    '@restaurant/shared/util': '<rootDir>/../../../libs/shared/util/src/index.ts',
  },
};
