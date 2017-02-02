const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));


var players = [];
var PLAYER_WIDTH = 50;
var PLAYER_HEIGHT = 50;

var BOARD_WIDTH = 500;
var BOARD_HEIGHT = 500;

function onConnection(socket){

    var new_player = function(){
        return {
            id:socket.id,
            pos:{
                x:Math.floor((Math.random() * 450) + 1),
                y:Math.floor((Math.random() * 450) + 1)
            },
            size:{
                width:PLAYER_WIDTH,
                height:PLAYER_HEIGHT,
            }
        }
    };
    // collision avoiding when creating new player
    while(true){
        var player_new = new_player();
        players.push(new_player());
        if(!collisionDetector({socket_id:player_new.id,vel_x:0,vel_y:0})){
            console.log("stop")
            break;
        }
        var index = players.findIndex((player)=>{
            //console.log("player id:",player.id)
            return player.id == player_new.id;
        })
        if(index!= -1){
            players.splice(index,1);
        }
        console.log("recreating")
    }

    console.log("New player created:",player_new);

    // new player and all the players to redraw
    socket.emit("new user",player_new,players) // to sender as well
    socket.broadcast.emit("new user",player_new,players);


    socket.on('moving',(movement)=>{

        // change user position
        var index = players.findIndex((player)=>{
            return player.id == movement.socket_id;
        })
        if(index!=-1){
            var collision = collisionDetector(movement);
            if(!collision){
                players[index].pos.x += movement.vel_x;
                players[index].pos.y += movement.vel_y;
                //console.log("sending players:",players)
                socket.emit('moving',players) // to sender as well
                socket.broadcast.emit('moving',players)
            }else{
                console.log("collision found")
            }
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

// collision detector. true if collision, false otherweise
function collisionDetector(movement){
    // check border collisions
    var index = players.findIndex((player)=>{
        return player.id == movement.socket_id;
    })
    if(index==-1){
        console.error("Player not found")
        return true;
    }

    if(players[index].pos.x+movement.vel_x < 0 || // left border
       players[index].pos.x+movement.vel_x + PLAYER_WIDTH > BOARD_WIDTH || //right border
       players[index].pos.y+movement.vel_y + PLAYER_HEIGHT > BOARD_HEIGHT || // bottom border
       players[index].pos.y+movement.vel_y < 0) // upper border
    {
        return true;
    }

    // check player collisions
    result = players.every((player)=>{
        if(players[index].id != player.id){ // do not check with itself
            var x_distance = Math.abs(players[index].pos.x+movement.vel_x - player.pos.x)
            var y_distance = Math.abs(players[index].pos.y+movement.vel_y - player.pos.y)
            if( x_distance < PLAYER_WIDTH && y_distance < PLAYER_HEIGHT){
                return false;
            }else{
                return true;
            }
        }else{
            return true;
        }
    })
    return !result;
}


http.listen(port, () => console.log('listening on port ' + port));
