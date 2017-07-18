// built into npm so don't need to add path //
const path = require('path');
// http built in node module //
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000;

// console.log(__dirname + '/../public');
// console.log(publicPath);

// set up express //
var app = express();
var server = http.createServer(app);
// set up socketIO - returns websocket server //
var io = socketIO(server);

app.use(express.static(publicPath));

// register eventlisteners //
// listen for new connection and do something on callback //
// can create eventlisteners inside io.on //
io.on('connection', (socket) => {
  console.log('New User Connected');

  // creating an event - second argument is the data object //
  // socket.emit('newEmail', {
  //   from: 'mike@example.com',
  //   text: 'Hey. What is going on?',
  //   createdAt: 123
  // });

  socket.emit('newMessage', {
    from: 'Jess',
    text: 'See you then',
    createdAt: 123123
  });

  // server eventListener //
  // socket.on('createEmail', (email) => {
  //   console.log('CreateEmail', email);
  // });

  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
