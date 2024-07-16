// client.js

const net = require('net');

const client = new net.Socket();

client.connect(8000, 'localhost', () => {
  console.log('Connected to server');
  client.write('Hello, server!');
});

client.on('data', data => {
  console.log(`Received from server: ${data}`);
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', err => {
  console.error(`Client error: ${err}`);
});
