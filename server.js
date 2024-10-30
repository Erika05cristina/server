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

// Configurar Express para servir el frontend Angular
app.use(express.static(path.join(__dirname, '../public')));

// Ruta para manejar todas las solicitudes y devolver el archivo `index.html`
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Escuchar conexiones de clientes
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('message', (msg) => {
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});
