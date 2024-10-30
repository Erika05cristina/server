const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(express.static(path.join(__dirname, '../public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

let userCount = 0;

io.on('connection', (socket) => {
  userCount++;
  const username = `Usuario ${userCount}`;
  
  console.log(`${username} conectado`);

  // Notificar a todos los usuarios cuando un nuevo usuario se conecta
  //socket.broadcast.emit('message', { user: 'Sistema', text: `${username} se ha unido al chat.` });

  socket.on('message', (msg) => {
    // Emitir el mensaje con el nombre del usuario a todos los clientes
    io.emit('message', { user: username, text: msg });
  });

  socket.on('disconnect', () => {
    console.log(`${username} desconectado`);
    socket.broadcast.emit('message', { user: 'Sistema', text: `${username} ha salido del chat.` });
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});
