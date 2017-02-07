'use strict';

$(function() {
    var WIDTH = 50,
        LENGTH = 50,
        canvas = document.getElementById('game_board'),
        context = canvas.getContext('2d'),
        //url = 'https://daju.herokuapp.com/',
        url = 'http://localhost:3000',
        socket = io(url),
        myId;

    socket.on('connect', function() {
        myId = socket.id;

    });

    var my_position ={};

    var interval_id = 0;

    var interval_mouse = 0;

    socket.on('new user', function(new_player, players) {
        console.log("new user");
        if(Object.keys(my_position).length == 0){
            my_position = new_player;
        }
        updateSquares(players);
    });

    socket.on('delete user', function(players) {
        updateSquares(players);
    });

    socket.on('moving', function(players) {
        console.log("received moving",players);
        updateSquares(players);
    });
    var keys = {};

    $(document).keydown(function(e) {
        if(interval_id == 0){
            interval_id = setInterval(movePlayer, 20);
            console.log("start interval",interval_id);
        }
        keys[e.keyCode] = true;
    });

    $(document).keyup(function(e) {
        delete keys[e.keyCode];
        console.log(Object.keys(keys).length)
        if(Object.keys(keys).length == 0){
            console.log("stops interval");
            clearInterval(interval_id);
            interval_id = 0;
        }
    });




    //to check ids
    var player_ids = [];

    var targetX = 0;
    var targetY = 0;


    function mousetouchdownListener(e){
        changeDirection(e);
        if(interval_mouse == 0){
            interval_mouse = setInterval(function(){movePlayerMouse(targetX,targetY);},20);
        }
        canvas.addEventListener("mousemove",changeDirection)
        canvas.addEventListener("touchmove",changeDirection)
    }

    function mousetouchupListener(e){
        changeDirection(e);
        clearInterval(interval_mouse);
        interval_mouse = 0;
        canvas.removeEventListener("mousemove",changeDirection)
        canvas.removeEventListener("touchmove",changeDirection)
    }


    canvas.addEventListener("mousedown",mousetouchdownListener)
    canvas.addEventListener("mouseup",mousetouchupListener)

    canvas.addEventListener("touchstart",mousetouchdownListener)
    canvas.addEventListener("touchend",mousetouchupListener)



    function changeDirection(e){
        targetX = e.offsetX;
        targetY = e.offsetY;
    }


    function movePlayerMouse(offsetX,offsetY){
        // calculate direction
        var x_dis = Math.pow(offsetX-my_position.pos.x,2);
        var y_dis = Math.pow(offsetY-my_position.pos.y,2);

        var mod = Math.sqrt(x_dis+y_dis);

        var ratio = x_dis/y_dis;

        var movement = {
                socket_id: myId,
                vel_x: 0,
                vel_y: 0
            };
        // 7 is roughly sqrt(5^2+5^2), which is the velocity with keyboard
        if(offsetX-my_position.pos.x > 0){ // right
            movement.vel_x = 7*Math.abs(offsetX-my_position.pos.x)/mod;
        }else{ //left
            movement.vel_x = -7*Math.abs(offsetX-my_position.pos.x)/mod;
        }
        if(offsetY-my_position.pos.y > 0){ //down
            movement.vel_y = 7*Math.abs(offsetY-my_position.pos.y)/mod;
        }else{
            movement.vel_y = -7*Math.abs(offsetY-my_position.pos.y)/mod;
        }
        socket.emit('moving', movement);
    }



    function movePlayer() {
        var movement = {
                socket_id: myId,
                vel_x: 0,
                vel_y: 0
            };

        for (var direction in keys) {
            if (!keys.hasOwnProperty(direction)) continue;
            if (direction == 37) {
                movement.vel_x += -5;
            }
            if (direction == 38) {
                movement.vel_y += -5;
            }
            if (direction == 39) {
                movement.vel_x += 5;
            }
            if (direction == 40) {
                movement.vel_y += 5;
            }
        }
        if(movement.vel_x != 0 || movement.vel_y != 0){
            socket.emit('moving', movement);
        }
    }

    function updateSquares(players) {
        context.clearRect(0,0,canvas.width,canvas.height);

        $.each(players, function(i, player) {
            if(player.id == my_position.id){
                my_position.pos = player.pos;
            }

            //console.log("player:",player);
            context.beginPath();

            context.rect(player.pos.x, player.pos.y, WIDTH, LENGTH);
            //context.fillStyle = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
            context.shadowColor = '#999';
            context.shadowBlur = 10;
            context.shadowOffsetX = 5;
            context.shadowOffsetY = 5;
            context.stroke();
            context.closePath();
        })


    }

});
