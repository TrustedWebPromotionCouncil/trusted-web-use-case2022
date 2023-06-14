var path = require("path");
const {
  override,
  overrideDevServer,
  addBabelPlugins,
  addWebpackAlias,
  addWebpackModuleRule,
  addWebpackPlugin,
  disableChunk,
} = require("customize-cra");
const CopyPlugin = require("copy-webpack-plugin");

const REACT_APP_EXTENSION_OBSERVABLE_HOST = "";
const REACT_APP_TRACE_APP_HOST = "";

const multipleEntry = require("react-app-rewire-multiple-entry")([
  {
    // Webpack extra entry
    entry: "src/tab/index.tsx",
    // HTML template used in plugin HtmlWebpackPlugin
    template: "public/tab.html",
    // The file to write the HTML to. You can specify a subdirectory
    outPath: "tab.html",
    // Visit: http[s]://localhost:12222/entry/standard.html
  },
]);

// https://dev.to/jamalx31/use-create-react-app-to-develop-a-chrome-extension-14ld
const copyPlugin = new CopyPlugin({
  patterns: [
    // copy assets
    {
      from: "public",
      globOptions: {
        ignore: ["**/*.html"],
      },
      transform: (content, path) => {
        if (path.endsWith(".json") || path.endsWith(".js")) {
          const modifiedOnce = content
            .toString()
            .replace(
              /\$__REACT_APP_EXTENSION_OBSERVABLE_HOST__/g,
              REACT_APP_EXTENSION_OBSERVABLE_HOST
            );
          const modifiedTwice = modifiedOnce
            .toString()
            .replace(
              /\$__REACT_APP_TRACE_APP_HOST__/g,
              REACT_APP_TRACE_APP_HOST
            );
          return modifiedTwice;
        } else {
          return content;
        }
      },
    },
  ],
});

const devServerConfig = () => (config) => {
  return {
    ...config,
    writeToDisk: true,
  };
};

const babelPlugins = () => {
  let plugins = [
    "@babel/plugin-proposal-logical-assignment-operators",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator",
  ];
  return plugins;
};

module.exports = {
  webpack: function (config, env) {
    // config.optimization.minimize = false;
    return override(
      multipleEntry.addMultiEntry,
      ...addBabelPlugins(...babelPlugins()),
      addWebpackPlugin(copyPlugin),
      disableChunk(),
      addWebpackAlias({
        "@": path.resolve(__dirname, "src"),
      }),
      addWebpackModuleRule({
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [
                "@babel/plugin-proposal-optional-chaining",
                "@babel/plugin-proposal-logical-assignment-operators",
                "@babel/plugin-proposal-nullish-coalescing-operator",
              ],
            },
          },
        ],
        exclude: {
          include: /node_modules/,
          exclude: /node_modules\/@decentralized-identity|did-jwt\//,
        },
      })
    )(config, env);
  },
  devServer: overrideDevServer(devServerConfig()),
};
