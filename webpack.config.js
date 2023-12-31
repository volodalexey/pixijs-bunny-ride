/* eslint-env node */
/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require("node:path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/app.ts",
  mode: process.env.WEBPACK_ENV,
  devtool: "cheap-source-map",
  devServer: {
    static: "./dist",
    hot: true,
    port: 8891,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.(mp3)$/,
        type: "asset/resource",
        generator: {
          filename: "./assets/audio/[name][ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial",
        },
      },
    },
  },
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.js",
    path: path.resolve(__dirname, "dist"),
    clean: {
      keep: /\.git\//,
    },
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      favicon: "./src/favicon.ico",
      filename: "index.html",
      template: "./src/index.html",
      inject: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/assets/fonts/**", to: "assets/fonts/[name][ext]" },
        { from: "src/assets/spritesheets/**", to: "assets/spritesheets/[name][ext]" },
        { from: "src/assets/leaderboard/**", to: "assets/leaderboard/[name][ext]" },
      ],
    }),
  ],
};
