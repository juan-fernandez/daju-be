'use strict';

$(function() {
    var width = 50,
        length = 50,
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
        console.log(keys);
        keys[e.keyCode] = true;
    });

    $(document).keyup(function(e) {
        console.log(keys);
        delete keys[e.keyCode];
    });
    var keys = {};

    var previous_players_state = [{
        id:myId,
        pos:{
            x:0,
            y:0
        },
        size:{
            width:50,
            height:50
        }
    }];

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
                movement.vel_x = -5;
                socket.emit('moving', movement);
                /*if (($("#player").position().left-5) >= 0) {
                    //socket.emit('moving', {left: "-=5"});
                    $("#player").animate({left: "-=5"}, 0);
                }*/
            }
            if (direction == 38) {
                movement.vel_y = 5;
                socket.emit('moving', movement);
                /*if (($("#player").position().top-5) >= 0) {
                    socket.emit('moving', {top: "-=5"});
                    $("#player").animate({top: "-=5"}, 0);
                }*/
            }
            if (direction == 39) {
                movement.vel_x = 5;
                socket.emit('moving', movement);
                /*if (($("#player").position().left+5) <= 450) {
                    //socket.emit('moving', {left: "+=5"});
                    $("#player").animate({left: "+=5"}, 0);
                }*/
            }
            if (direction == 40) {
                movement.vel_y = -5;
                socket.emit('moving', movement);
                /*if (($("#player").position().top+5) <= 450) {
                    //socket.emit('moving', {top: "+=5"});
                    $("#player").animate({top: "+=5"}, 0);
                }*/
            }
        }
    }


/*

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
*/
    function updateSquares(players) {
        console.log("recieved players",players);
        console.log("previous state",previous_players_state[0]);
        console.log("difference", players[0].pos.x-previous_players_state[0].pos.x );


        $.each(players, function(i, player) {
            var sign = player.pos.x - previous_players_state[0].pos.x > 0;
            var symbol = sign ? "-":"+";
            var value = Math.abs(player.pos.x - previous_players_state[0].pos.x);

            // compare current state with received and animate
            if(previous_players_state[0].pos.x != player.pos.x){
                $("#player").animate({right: symbol+"="+value}, 0);
            }

            //$("#player").animate({top: "+=5"}, 0);

            /*context.beginPath();
            context.rect(player.pos.x, player.pos.y, width, length);
            context.fillStyle = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
            context.shadowColor = '#999';
            context.shadowBlur = 10;
            context.shadowOffsetX = 5;
            context.shadowOffsetY = 5;
            context.stroke();
            context.closePath();*/
        })
        previous_players_state = players;

        /*context.clearRect(0,0,canvas.width,canvas.height);

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
        });*/
    }
});
