const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));


var players = [];


function onConnection(socket){


    // missing checking if colliding with existing players
    var new_player = {
        id:socket.id,
        pos:{
            x:Math.floor((Math.random() * 450) + 1),
            y:Math.floor((Math.random() * 450) + 1)
        }
    };

    players.push(new_player)
    console.log("New player created:",new_player);

    // new player and all the players to redraw
    socket.emit("new user",new_player,players) // to sender as well
    socket.broadcast.emit("new user",new_player,players);


    socket.on('moving',(movement)=>{
        console.log("player moving:",movement)
        // change user position
        var index = players.findIndex((player)=>{
            //console.log("player id:",player.id)
            return player.id == movement.socket_id;
        })
        if(index!=-1){
            players[index].pos.x += movement.vel_x;
            players[index].pos.y += movement.vel_y;
            console.log("sending players:",players)
            socket.emit('moving',players) // to sender as well
            socket.broadcast.emit('moving',players)
        }
    })
    socket.on('disconnect',()=>{
        console.log("player disco:",socket.id)
        var index = players.findIndex((player)=>{
            //console.log("player id:",player.id)
            return player.id == socket.id;
        })
        if(index!= -1){
            players.splice(index,1);
        }
        socket.broadcast.emit('delete user',players)
    })
}

io.on('connection', onConnection);




http.listen(port, () => console.log('listening on port ' + port));
