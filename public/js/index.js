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
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

// custom events //
// socket.on('newEmail', function(email) {
//   console.log('New email', email);
// });

socket.on('newMessage', function(message) {
  // console.log('newMessage', message)

  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});


socket.on('newLocationMessage', function(message) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);

  jQuery('#messages').append(li);
});


// use jQuery to target html form //
jQuery('#message-form').on('submit', function(event) {
  event.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('input[name=message]').val()
  }, function() {
    // callback //

  });

});


var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(function(position) {
    // success callback //
    console.log(position);
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    // error callback //
    alert('Unable to fetch location.');
  });
});
