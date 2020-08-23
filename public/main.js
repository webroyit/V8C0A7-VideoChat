const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});
const myVideo = document.createElement('video');
myVideo.muted = true;       // Disable on listening to your own video
const peers = {};

// Conntect to your video
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream);

    // Listen for another user video call
    myPeer.on('call', call => {
        // Send your video
        call.answer(stream);

        // Make sure the another user get your video
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream);
    })
});

socket.on('user-disconnected', userId => {
    if(peers[userId]) peers[userId].close();
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
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

function connectToNewUser(userId, stream){
    // Send a video to another user
    const call = myPeer.call(userId, stream);

    const video = document.createElement('video');

    // Get the video from another user
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });

    // Close a video when an user leave
    call.on('close', () => {
        video.remove();
    });

    peers[userId] = call;
}