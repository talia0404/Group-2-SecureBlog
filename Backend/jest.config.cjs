/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/*.test.js"], // <- looser match
  collectCoverageFrom: ["src/**/*.js", "!src/server.js"],
  verbose: true
};
