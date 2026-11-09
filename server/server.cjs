const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
  console.log('A user connected!');

  socket.on('message', (message) => {
    const text = message.toString();
    console.log('Received:', text);

    // Broadcast to every connected client, including the sender.
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(text);
      }
    });
  });

  socket.on('close', () => console.log('A user disconnected.'));
  socket.on('error', (error) => console.error('Socket error:', error.message));
});

console.log('WebSocket server running on port 8080');
