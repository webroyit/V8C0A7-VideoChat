const socket = io('/');
const myPeer = new myPeer(undefined, {
    host: '/',
    port: '3001'
})

// Send an event to the server
socket.emit('join-room', ROOM_ID, 10);

socket.on('user-connected', userId => {
    console.log('User connected: ' + userId);
})