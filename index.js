const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));


var players = [];
var PLAYER_WIDTH = 20;
var PLAYER_HEIGHT = 20;

var BOARD_WIDTH = 300;
var BOARD_HEIGHT = 300;

function onConnection(socket){

    var new_player = function(){
        return {
            id:socket.id,
            pos:{
                x:Math.floor((Math.random() * 280) + 1),
                y:Math.floor((Math.random() * 280) + 1)
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
        players.push(player_new);
        var collision = collisionDetector({socket_id:player_new.id,vel_x:0,vel_y:0});
        if(!collision.horizontal && !collision.vertical){
            //console.log("stop")
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
            //console.log(collision);
            if(!collision.horizontal){
               players[index].pos.x += movement.vel_x;
            }
            if(!collision.vertical){
               players[index].pos.y += movement.vel_y;
            }
            //console.log("sending players:",players)
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

// collision detector. true if collision, false otherweise
function collisionDetector(movement){
    // check border collisions
    //return false;
   var collision = {
      vertical: false, // it has a collision up or down
      horizontal: false
   }
   var index = players.findIndex((player)=>{
      return player.id == movement.socket_id;
   })
   if(index==-1){
      console.error("Player not found")
      return true;
   }

   if(players[index].pos.x+movement.vel_x < 0 || // left border
      players[index].pos.x+movement.vel_x + PLAYER_WIDTH > BOARD_WIDTH ) // upper border
   {
      collision.horizontal = true;
      //return collision;
   }

   if(players[index].pos.y+movement.vel_y + PLAYER_HEIGHT > BOARD_HEIGHT || // bottom border
      players[index].pos.y+movement.vel_y < 0){ //right border
      collision.vertical = true;
      //return collision;
   }



    // check player collisions
      result = players.every((player)=>{
         if(players[index].id != player.id){ // do not check with itself
            var x_distance = Math.abs(players[index].pos.x+movement.vel_x - player.pos.x)
            var y_distance = Math.abs(players[index].pos.y+movement.vel_y - player.pos.y)
            if(x_distance < PLAYER_WIDTH && y_distance < PLAYER_HEIGHT){
               // we have now to look the original positions to know what intersection happened
               if(Math.abs(players[index].pos.x - player.pos.x) < PLAYER_WIDTH){
                  collision.vertical = true;
                  return false;
               }else if(Math.abs(players[index].pos.y - player.pos.y)<PLAYER_HEIGHT){
                  collision.horizontal = true;
                  return false;
               }
            }

            return true;
        }else{
            return true;
        }
    })
    return collision;
}


http.listen(port, () => console.log('listening on port ' + port));
