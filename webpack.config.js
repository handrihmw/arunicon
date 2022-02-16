const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  mode: "production",
  entry: ["/src/scss/app.scss", "/src/js/app.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/app.js",
  },
  devtool: false,
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require("sass")
            },
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)?$/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|webp)$/i,
        use: [
          "url-loader?limit=10000",
          {
            loader: "img-loader",
            options: {
              plugins: [
                require("imagemin-pngquant")({
                  floyd: 0.5,
                  speed: 2,
                }),
                require("imagemin-svgo")({
                  plugins: [
                    {
                      removeTitle: true,
                    },
                    {
                      convertPathData: false,
                    },
                  ],
                }),
              ],
            },
          },
          {
            loader: "lqip-loader",
            options: {
              base64: true,
              palette: false,
            },
          },
          {
            loader: "url-loader",
            options: {
              limit: 8000,
            },
          },
          {
            loader: "svg-url-loader",
            options: {
              encoding: "base64",
              iesafe: true,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: {
                removeAll: true,
              },
            },
          ],
        },
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/app.css",
      chunkFilename: "css/app.css",
    }),
  ],
};
