const socket = io('/');

// Send an event to the server
socket.emit('join-room', ROOM_ID, 10);

socket.on('user-connected', userId => {
    console.log('User connected: ' + userId);
})