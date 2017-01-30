const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

function onConnection(socket){

    socket.on('moving',(data)=>{
        console.log("moving event",data)
        socket.emit('moving',data) // to sender as well
        socket.broadcast.emit('moving',data)
    })
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
