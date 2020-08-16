const express = require('express');
const app = express();

// Make the server work with socket.io
const server = require('http').Server(app);
const io = require('socket.io')(server);

// For random roomId
const { v4: uuidV4 } = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`);
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);

        // Disconnect the user that leave the room
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        });
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${PORT}`));