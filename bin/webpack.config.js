const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = ({ sketchName, sketchPath }) => {
  return {
    mode: "development",
    entry: [`${__dirname}/app.js`, ...(sketchPath ? [`${sketchPath}.js`] : [])],
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
    },
    devtool: "inline-source-map",
    devServer: {
      contentBase: "./dist",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
            },
          ],
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "file-loader",
              options: "?name=[name].[ext]",
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        templateContent: ({ htmlWebpackPlugin }) => {
          return `
            <html>
              <head>
                <title>Garnet | ${sketchName}</title>
                ${htmlWebpackPlugin.tags.headTags}
              </head>
              <body>
                <h1>Hello World</h1>
                <div id="root"></div>
                ${htmlWebpackPlugin.tags.bodyTags}
              </body>
            </html>
          `;
        },
      }),
    ],
  };
};
