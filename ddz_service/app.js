const socket = require('socket.io');
const app = socket('3000');
app.on('connection',function (socket) {
    socket.emit('welcome','hello word');
})