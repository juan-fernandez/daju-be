'use strict';

(function() {

    var socket = io();
    var canvas = document.getElementById('game_board');
    var context = canvas.getContext('2d');
    var drawing = false;

    var INITIAL_POS_X = 0;
    var INITIAL_POS_Y = 0;
    var WIDTH = 100;
    var LENGTH = 100;

    var position_x = INITIAL_POS_X;
    var position_y = INITIAL_POS_Y;


    /*initial rectangle*/
    context.beginPath();
    context.rect(position_x, position_y, WIDTH, LENGTH);
    context.stroke();
    context.closePath();


    socket.on('moving', function(data){
        moveSquare(data);
    });

    $(window).keydown(function(event){
        var movement = {
            vel_x: 0,
            vel_y: 0
        };
        if(event.which == 39){ //right
            console.log("right ->")
            movement.vel_x = 20;
        }
        if(event.which == 37){ //left
            console.log("<- left")
            movement.vel_x = -20;
        }
        if(event.which == 38){ //up
            console.log("up ^")
            movement.vel_y = -20;
        }
        if(event.which == 40){ //down
            console.log("down \\/")
            movement.vel_y = 20;
        }
        socket.emit('moving',movement)
    })


    function moveSquare(movement){

        position_x = position_x + movement.vel_x;
        position_y = position_y + movement.vel_y;

        console.log("move_square",position_x,position_y)

        context.clearRect(0,0,canvas.width,canvas.height)
        context.beginPath();
        context.rect(position_x, position_y, WIDTH, LENGTH);
        context.stroke();
        context.closePath();

    }


})();
