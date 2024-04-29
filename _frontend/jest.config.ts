import nextJest from "next/jest";

const esModules = ['d3', 'd3-array', 'other-d3-module-if-needed'].join('|')

const createJestConfig = nextJest({
  dir: "./",
});
;

/** @type {import('jest').Config} */
const config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  preset: "ts-jest",
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  "moduleNameMapper": {
    "d3": "<rootDir>/node_modules/d3/dist/d3.min.js",
    "^d3-(.*)$": "<rootDir>/node_modules/d3-$1/dist/d3-$1.min.js"
  }
};

export default createJestConfig(config);