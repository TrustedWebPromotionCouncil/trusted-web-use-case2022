const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    content: "./src/content.ts",
    ngPopup: "./src/ngPopup.tsx",
    emailPopup: "./src/emailPopup.tsx",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: path.resolve(
          __dirname,
          "node_modules/@metamask/eth-hd-keyring/index.js"
        ),
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.png$/i,
        type: "asset/inline",
      },
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader", // Creates style nodes from JS strings
          },
          {
            loader: "css-loader", // Translates CSS into CommonJS
          },
          {
            loader: "sass-loader", // Compiles Sass to CSS
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      buffer: require.resolve("buffer"),
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
      process: require.resolve("process/browser"),
      util: require.resolve("util/"),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process",
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new HtmlWebpackPlugin({
      template: "./html/ng-popup.html",
      filename: "../../ng-popup.html",
      chunks: ["ngPopup"],
    }),
    new HtmlWebpackPlugin({
      template: "./html/email-popup.html",
      filename: "../../email-popup.html",
      chunks: ["emailPopup"],
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build/static/js"),
    clean: true,
  },
};
