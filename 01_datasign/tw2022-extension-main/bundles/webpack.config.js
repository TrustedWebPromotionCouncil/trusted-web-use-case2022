const path = require("path");
const dotenv = require("dotenv");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const env = dotenv.config().parsed;

module.exports = {
  entry: {
    background: "./src/background.ts",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      // {
      //     test: /\.tsx?$/,
      //     use: 'ts-loader',
      //     exclude: /node_modules/,
      // },
      {
        // test: /\.tsx?$/,
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
      // {
      //     test: path.resolve(__dirname, "node_modules/eth-keyring-controller/index.js"),
      //     use: {
      //         loader: 'babel-loader',
      //         options: {
      //             presets: ['@babel/preset-env', "@babel/preset-react", '@babel/preset-typescript']
      //         }
      //     }
      // },
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
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
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
    new webpack.DefinePlugin({
      window: JSON.stringify({}),
      // 'window': JSON.stringify(undefined),
      // 'typeof window': JSON.stringify('object')
    }),
    new webpack.ProvidePlugin({
      process: "process",
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build/js"),
    clean: true,
  },
};
