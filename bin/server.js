#!/usr/bin/env node
const arg = require("arg");
const express = require("express");
const fs = require("fs");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");

const parseArgs = (rawArgs) => {
  const args = arg(
    {},
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    fileName: args._[0],
  };
};

const { fileName } = parseArgs(process.argv);
const sketchPath = `${process.cwd()}/${fileName}`;

if (!fileName || !fs.existsSync(sketchPath)) {
  console.log("Please provide a valid file name");
  process.exit(1);
}

const config = require("./webpack.config.js");
const conf = config({ sketchName: fileName, sketchPath });
const compiler = webpack(conf);
const instance = webpackDevMiddleware(compiler, {
  publicPath: conf.output.publicPath,
});
const app = express();

app.use(instance);

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log("Example app listening on port 3000!\n");
});
