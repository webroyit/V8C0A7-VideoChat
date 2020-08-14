const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
});
const myVideo = document.createElement('video');
myVideo.muted = true;       // Disable on listening to your own video

// Conntect to your video
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream);
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});

socket.on('user-connected', userId => {
    console.log('User connected: ' + userId);
});

function addVideoStream(video, stream){
    video.srcObject = stream;
    
    // Play the video when it is finish loading
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });

    // Add the video on the DOM
    videoGrid.append(video);
}