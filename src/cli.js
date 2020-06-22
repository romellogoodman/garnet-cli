#!/usr/bin/env node
const sade = require('sade');
const micro = require('micro');
const {version} = require('../package');

const run = (sketch, options) => {
  const server = micro(require('./server')(sketch, options));

  server.listen(options.port, () => {
    process.stdout.write(`garnet running at: ${options.port}\n`);
  });
};
const prog = sade('garnet');

prog
  .version(version)
  .option('--open', 'Automatically open browser', true)
  .option('--port', 'Specify a port', 3000)
  .option('--ws', 'Specify a port for the reload ws', 3301);

prog
  .command('watch <sketch>', '<sketch>', {default: true})
  .describe('start the sketch')
  .example('sketch.js')
  .action(run);

prog.parse(process.argv);
