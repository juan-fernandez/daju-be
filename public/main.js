'use strict';

$(function() {
    var width = 50,
        length = 50,
        canvas = document.getElementById('game_board'),
        context = canvas.getContext('2d'),
        url = 'https://daju.herokuapp.com/',
        socket = io(url),
        myId;

    socket.on('connect', function() {
        myId = socket.id;
    });


    socket.on('new user', function(new_player, players) {
        updateSquares(players);
    });

    socket.on('delete user', function(players) {
        updateSquares(players);
    });

    socket.on('moving', function(players) {
        updateSquares(players);
    });

    $(window).keydown(function(event){
        var movement = {
                socket_id: myId,
                vel_x: 0,
                vel_y: 0
            };

        if (event.which === 39) { //right
            console.log('right ->');
            movement.vel_x = 20;
            socket.emit('moving', movement);
        }

        if (event.which === 37) { //left
            console.log('<- left');
            movement.vel_x = -20;
            socket.emit('moving', movement);
        }

        if (event.which === 38) { //up
            console.log('up ^');
            movement.vel_y = -20;
            socket.emit('moving', movement);
        }

        if (event.which === 40) { //down
            console.log('down \\/');
            movement.vel_y = 20;
            socket.emit('moving', movement);
        }
    });

    function updateSquares(players) {
        context.clearRect(0,0,canvas.width,canvas.height);

        $.each(players, function(i, player) {
            context.beginPath();
            context.rect(player.pos.x, player.pos.y, width, length);
            context.fillStyle = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
            context.shadowColor = '#999';
            context.shadowBlur = 10;
            context.shadowOffsetX = 5;
            context.shadowOffsetY = 5;
            context.stroke();
            context.closePath();
        });
    }
});
