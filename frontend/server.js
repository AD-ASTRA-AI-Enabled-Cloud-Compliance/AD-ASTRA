// server.js
const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');
const { parse } = require('url');

const app = next({ dev: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    path: '/api/socketio',
  });

  io.on('connection', (socket) => {
    console.log('[Socket.IO] Connected:', socket.id);

    socket.on('message', (msg) => {
      console.log('[Socket.IO] Received:', msg);
    });
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
