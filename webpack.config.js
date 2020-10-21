const webpack = require("webpack");
const path = require("path");

const env = process.env.NODE_ENV;

const config = {
  entry: "./src/index.ts",
  output: {
    filename: "HtmlDiff.js",
    sourceMapFilename: "HtmlDiff.map.js",
    path: path.resolve(__dirname, "umd"),
    library: "HtmlDiff",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(env),
    }),
  ],
};

if (env === "development") {
  config.mode = "development";
  config.devtool = "source-map";
}

if (env === "production") {
  config.mode = "production";
  config.output.filename = "HtmlDiff.min.js";
}

module.exports = config;
