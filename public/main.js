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


    socket.on('new user', function(new_player, players) {
        console.log("new user");
        updateSquares(players);
    });

    socket.on('delete user', function(players) {
        updateSquares(players);
    });

    socket.on('moving', function(players) {
        console.log("received moving",players);
        updateSquares(players);
    });

    $(document).keydown(function(e) {
        console.log("DOWN keys:",keys);
        keys[e.keyCode] = true;
    });

    $(document).keyup(function(e) {
        console.log("UP keys:",keys);
        delete keys[e.keyCode];
    });
    var keys = {};


    //to check ids
    var player_ids = [];


    setInterval(movePlayer, 20);

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
                //socket.emit('moving', movement);
            }
            if (direction == 38) {
                movement.vel_y += -5;
                //socket.emit('moving', movement);
            }
            if (direction == 39) {
                movement.vel_x += 5;
                //socket.emit('moving', movement);
            }
            if (direction == 40) {
                movement.vel_y += 5;
                //socket.emit('moving', movement);
            }
        }
        if(movement.vel_x != 0 || movement.vel_y != 0){
            socket.emit('moving', movement);
        }
    }

    function updateSquares(players) {
        context.clearRect(0,0,canvas.width,canvas.height);

        $.each(players, function(i, player) {
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
