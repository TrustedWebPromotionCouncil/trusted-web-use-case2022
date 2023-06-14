process.env.DATABASE_FILEPATH = "./TEST_DB";
process.env.RE_CAPTCHA_VERIFY_SERVER_URL="https://www.google.com/recaptcha/api/siteverify"

module.exports = {
  extension: ["ts"],
  spec: "src/**/*.test.ts",
  require: "ts-node/register",
  "node-option": [
    "experimental-specifier-resolution=node",
    "loader=ts-node/esm",
  ],
};
