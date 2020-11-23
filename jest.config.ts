module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  modulePaths: ['<rootDir>/src'],
  displayName: {
    name: 'M2',
    color: 'cyan'
  },
  modulePathIgnorePatterns: [
    '_transpiled'
  ],
  silent: false,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!**/node_modules/**"
  ],
  forceExit: true
};