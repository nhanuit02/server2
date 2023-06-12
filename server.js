const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const express = require('express');
const { count } = require('console');
const app = express();

app.use(express.static('D:/Data/code/server2'));
const server = app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

// const server = http.createServer((request, response) => {
//   fs.readFile('./index.html', (err, html) => {
//     if (err) {
//       throw err;
//     }
//     response.writeHead(200, { "Content-Type": "text.html" });
//     response.write(html);
//     response.end();
//   });
// });

const wss = new WebSocket.Server({ server });

const clients = new Set();

// function sendCount(ws) {
//   const count = Math.floor(Math.random()*100);
//   const sendInterval = setInterval(() => {
//       ws.send(count.toString());
//     }
//   , 1000);
// }

/*setInterval(() => {
  const randomData = Math.floor(Math.random() * 100); // Dữ liệu ngẫu nhiên
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(randomData.toString());
    }
  });
}, 1000);*/

wss.on('connection', (ws) => {
  clients.add(ws);
  //ws.send('Welcome to the server!');

  //sendCount(ws);

  ws.on('message', (message) => {
    console.log('Received message: %s', message);
    broadcast(message, ws);
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

function broadcast(message, sender) {
  clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message.toString());
    }
  });
}

