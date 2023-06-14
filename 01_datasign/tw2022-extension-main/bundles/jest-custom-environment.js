// https://jestjs.io/docs/configuration#testenvironment-string
// https://github.com/jsdom/jsdom/issues/2524#issuecomment-736672511


const NodeEnvironment = require('jest-environment-node').TestEnvironment;
// const Environment = require("jest-environment-jsdom");
module.exports = class CustomTestEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === "undefined") {
      const { TextEncoder, TextDecoder } = require("util");
      this.global.TextEncoder = TextEncoder;
      this.global.TextDecoder = TextDecoder;
    }

    // Fixing `buffer isinstanceof Uint8Array !== true` error
    // https://github.com/facebook/jest/issues/9983#issuecomment-936055633
    this.global.Uint8Array = Uint8Array;

    // Use node's crypto.webcrypto as a polyfill for browers' webcrypto API.
    if (typeof this.global.crypto === "undefined") {
      const crypto = require("crypto");
      this.global.crypto = crypto.webcrypto;
    }
  }
};
