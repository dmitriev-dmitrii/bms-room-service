const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgeCssPlugin = require('purgecss-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = (env) => {

  const isDevMode = env.mode === 'development'
  const isProdMode = env.mode === 'production'

  return {
    entry: './webpack-entry.js',
    mode: isProdMode ? 'production' : 'development',

    devServer: {
      historyApiFallback: true,
      compress: true,
      open:true
    },
    output: {
      filename: isProdMode ? '[contenthash:9].js' : 'index.js',
      clean: true
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/')
      },
      extensions: ["*",".scss", ".js", ".json"],
    },
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            isDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            {
              loader: "sass-loader",
              options: { additionalData: `@import "./src/scss/common/vars.scss";` }
            }
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]'
          }
        },
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /node_modules/
        },
      ]
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new SpriteLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: isProdMode ? "[contenthash:9].css" : "index.css",
      }),
      new ImageminPlugin({
        test: path.resolve(__dirname, './src/img/**/*'),
        optimizationLevel: 3,
        progressive: true,
      }),
      new ImageminWebpWebpackPlugin({
        config: [
          {
            test: /\.(jpe?g|png)/,
            options: {
              quality: 85,
            },
          },
        ],
        overrideExtension: true,
        detailedLogs: false,
        silent: false,
        strict: true,
      }),
      new PurgeCssPlugin({
        paths: () => glob.sync( path.join(__dirname, 'src/**/*') , { nodir: true })
      }),
      new HtmlWebpackPlugin({
        template:path.resolve(__dirname, './src/index.html'),
        minify: isProdMode,
        hash: isProdMode,
        inject: 'body',
      }),


    ],
    optimization: {
      concatenateModules: isProdMode,
      mangleExports: isProdMode,
      minimize: isProdMode,
    }
  };

};

