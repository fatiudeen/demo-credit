/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const pathsToModuleNameMapper = require('ts-jest').pathsToModuleNameMapper;
const compilerOptions = require('./tsconfig.json').compilerOptions;

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  clearMocks: true,
  modulePathIgnorePatterns: ['./dist'],
  moduleDirectories: ['node_modules', 'src'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  // setupFilesAfterEnv: ['./src/v1/api/__tests__/__mocks__/mock.ts'],
};
