const fs = require('fs');
const {send} = require('micro');
const microbundle = require('microbundle');
const compress = require('micro-compress');
const opn = require('opn');
const path = require('path');
const url = require('url');
const WebSocket = require('ws');

const GARNET_DIR = path.join(process.cwd(), '.garnet');

const setUpFiles = () => {
  // Delete the old dir
  if (fs.existsSync(GARNET_DIR)) {
    fs.rmdirSync(GARNET_DIR, {recursive: true}, (err) => {
      if (err) {
        throw err;
      }

      console.log(`${GARNET_DIR} is deleted!`);
    });
  }

  // Recreate the dir
  fs.mkdirSync(GARNET_DIR);

  // Copy over files
  const appFile = 'app.js';
  const appMapFile = 'app.js.map';

  fs.copyFileSync(
    path.join(__dirname, '..', 'dist', appFile),
    path.join(GARNET_DIR, appFile)
  );
  fs.copyFileSync(
    path.join(__dirname, '..', 'dist', appMapFile),
    path.join(GARNET_DIR, appMapFile)
  );
};

const createClientWebSocket = (port) => {
  return `
    <script>
      const ws = new WebSocket('ws://localhost:${port}');
      ws.onmessage = event => {
        if (event.data === 'reload') {
          setTimeout(() => {
            ws.close();
            self.location.reload();
          }, 300);
        }
      };
    </script>
	`;
};

const buildIndexHtml = (options) => {
  const {sketch, ws} = options;

  return `
    <html>
      <head>
        <title>garnet | ${sketch}</title>
        <script src="${sketch}" type="module"></script>
      </head>
      <body>
        <div id="root"></div>
        <script src="app.js" type="module"></script>
        ${createClientWebSocket(ws)}
      </body>
    </html>
  `.replace(/\t|\n/g, '');
};

const createHandler = (options) => {
  return (request, response) => {
    const {pathname} = url.parse(request.url);
    let fileData = '';

    if (pathname.endsWith('.js') || pathname.endsWith('.js.map')) {
      let filePath = GARNET_DIR + pathname;

      if (!fs.existsSync(filePath)) {
        response.setHeader('content-type', 'text/html');
        send(response, 404, 'not found');
        return;
      }

      try {
        fileData = fs.readFileSync(filePath, {encoding: 'utf8'});
      } catch (error) {
        console.log(error);
        send(response, 500);
        return;
      }

      response.setHeader('content-type', 'application/javascript');
      send(response, 200, fileData);
    } else {
      fileData = buildIndexHtml(options);
      response.setHeader('content-type', 'text/html');
      send(response, 200, fileData);
    }
  };
};

process.on('SIGINT', process.exit);

module.exports = function (sketch, options) {
  let firstBuild = true;
  const wss = new WebSocket.Server({port: options.ws});
  const sketchPath = path.join(process.cwd(), sketch);
  const outputPath = path.join(GARNET_DIR, sketch);

  options.sketch = sketch;

  setUpFiles();

  if (!sketch || !fs.existsSync(sketchPath)) {
    console.log('Please provide a valid file name');
    process.exit(1);
  }

  wss.on('connection', (ws) => {
    // Most likely this means the user manually refreshed the browser
    ws.on('error', () => {});
  });

  microbundle({
    cwd: '',
    entries: sketch,
    output: outputPath,
    format: 'es',
    onBuild() {
      if (firstBuild && options.open) {
        firstBuild = false;
        opn(`http://localhost:${options.port}`).catch(console.error);
      } else {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send('reload');
          }
        });
      }
    },
    target: 'browser',
    watch: true,
  }).catch(console.error);

  return compress(createHandler(options));
};
