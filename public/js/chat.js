// use to listen to server and send data to server //
var socket = io();

// autoscrolling function //
function scrollToBottom() {
  // Selectors //
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  // Heights //
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  // calculation //
  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    // console.log('Should scroll');
    messages.scrollTop(scrollHeight);
  }
}



// client eventlisteners //
socket.on('connect', function() {
  // console.log('Connected to server');
  // Join Chat Rooms //
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function(err) {
    // callback //
    if(err) {
      alert(err);
      window.location.href="/";
    } else {
      // console.log('No error');
    }
  });

  // creating an event on the client - data object as second argument //
  // socket.emit('createEmail', {
  //   to: 'jen@example.com',
  //   text: 'Hey, this is Jack'
  // });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

// Update the userlist //
socket.on('updateUserList', function(users) {
  // console.log('Users list:', users);
  var ol = jQuery('<ol></ol>');

  users.forEach(function(user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});

// custom events //
// socket.on('newEmail', function(email) {
//   console.log('New email', email);
// });

socket.on('newMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');

  // Mustache Template //
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    // render properties //
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);

  scrollToBottom();
});


socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');

  // Mustache Template //
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    // render properties //
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);

  scrollToBottom();
});



// Event Listeners //
// use jQuery to target html form //
jQuery('#message-form').on('submit', function(event) {
  event.preventDefault();

  var messageTextBox = jQuery('input[name=message]');

  socket.emit('createMessage', {
    text: messageTextBox.val()
  }, function() {
    // callback //
    // clear value after submit //
    messageTextBox.val('');
  });

});


var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  // disable button and change text while sending location //
  locationButton.attr('disabled', 'disabled').text('Sending...');;

  navigator.geolocation.getCurrentPosition(function(position) {
    // success callback //
    // console.log(position);
    locationButton.removeAttr('disabled').text('Send Location');

    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    // error callback //
    locationButton.removeAttr('disabled');
    alert('Unable to fetch location.');
  });
});
