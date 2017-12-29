const server = require('../dist/server');
const http = require('http');
const https = require('https');
const fs = require('fs');

const port = normalizePort(process.env.PORT || '3000');
const bootstrapServer = server.Server.bootstrap();
bootstrapServer.app.set('port', port);

let httpServer;
if (port === 443) {
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/triflesapp.com/privkey.pem');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/triflesapp.com/cert.pem');
  httpServer = https.createServer({
    key: privateKey,
    cert: certificate
  }, bootstrapServer.app);

  // Redirect from HTTP to HTTPS
  http.createServer(function (req, res) {
    res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
    res.end();
  }).listen(80);
} else {
  httpServer = http.createServer(bootstrapServer.app);
}

httpServer.listen(port);
httpServer.on('error', onError);
httpServer.on('listening', onListening);

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = httpServer.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
