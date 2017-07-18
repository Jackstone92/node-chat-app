// use to listen to server and send data to server //
var socket = io();

// client eventlisteners //
socket.on('connect', function() {
  console.log('Connected to server');

  // creating an event on the client - data object as second argument //
  // socket.emit('createEmail', {
  //   to: 'jen@example.com',
  //   text: 'Hey, this is Jack'
  // });

  socket.emit('createMessage', {
    from: 'Jack',
    text: 'Hey, this is Jack!'
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

// custom events //
// socket.on('newEmail', function(email) {
//   console.log('New email', email);
// });

socket.on('newMessage', function(message) {
  console.log('newMessage', message)
});
