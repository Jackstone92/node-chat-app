// built into npm so don't need to add path //
const path = require('path');
// http built in node module //
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000;

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

// console.log(__dirname + '/../public');
// console.log(publicPath);

// set up express //
var app = express();
var server = http.createServer(app);
// set up socketIO - returns websocket server //
var io = socketIO(server);
// initialise Users class //
var users = new Users();


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


  // Create Chat Room //
  socket.on('join', (params, callback) => {
    // string validation //
    if(!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required!');
    }

    // emit chat messages only to others in same room //
    socket.join(params.room);

    // remove user from any potential previous rooms //
    users.removeUser(socket.id);
    // target specific users //
    // io.emit -> io.to('Example Room').emit //
    // socket.broadcast.emit -> socket.broadcast.to('Example Room').emit //
    // socket.emit //

    // add new users to current room //
    users.addUser(socket.id, params.name, params.room);

    // get room users data //
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('Admin', `Welcome to the ${params.room} room!`));
    // send event to everybody but this current socket //
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));


    callback();
  });

  socket.on('createMessage', (message, callback) => {
    // console.log('createMessage', message);

    // emit event to every single connection via io.emit() rather than just socket //
    io.emit('newMessage', generateMessage(message.from, message.text));
    // acknoledge receipt //
    // callback('This is from the server.');
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    // console.log('User was disconnected');
    // remove user and update userList //
    var user = users.removeUser(socket.id);

    if(user) {
      // update user list //
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      // print message from Admin //
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
