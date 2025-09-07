const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let clients = {};

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  // Cuando el cliente envía su ubicación
  socket.on('location', (location) => {
    clients[socket.id] = location;
    // Emitir a todos los clientes las ubicaciones actualizadas
    io.emit('locations', clients);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    delete clients[socket.id];
    io.emit('locations', clients);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});