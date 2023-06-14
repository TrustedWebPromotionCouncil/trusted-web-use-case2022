/** @type {import('jest').Config} */
const config = {
  verbose: true,
  setupFiles: ["./setupTests"],
  transformIgnorePatterns: [
    "/node_modules/(?!(@tbd54566975/dwn-sdk-js|fetch-mock)/)",
  ],
  resetMocks: true,
};

module.exports = config;
