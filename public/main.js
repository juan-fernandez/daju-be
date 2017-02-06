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
        console.log(keys);
        keys[e.keyCode] = true;
    });

    $(document).keyup(function(e) {
        console.log(keys);
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
                movement.vel_x = -5;
                socket.emit('moving', movement);

            }
            if (direction == 38) {
                movement.vel_y = -5;
                socket.emit('moving', movement);

            }
            if (direction == 39) {
                movement.vel_x = 5;
                socket.emit('moving', movement);

            }
            if (direction == 40) {
                movement.vel_y = 5;
                socket.emit('moving', movement);

            }
        }
    }

    function updateSquares(players) {

        $.each(players, function(i, player) {
            console.log("player:",player);
            if($.inArray(player.id,player_ids)==-1){
                console.log("new player")
                jQuery('<div/>',{
                    class: 'player',
                    id: player.id,
                    style: "top:"+player.pos.y+"px;right:"+player.pos.x+"px"
                }).appendTo(".container");
                player_ids.push(player.id);
            }else{
                var signHor = player.pos.x - $("#"+player.id).position().left > 0;
                var symbolHor = signHor ? "-":"+";
                var valueHor = Math.abs(player.pos.x - $("#"+player.id).position().left);
                if(valueHor != 0){
                    $("#"+player.id).animate({right: symbolHor+"="+valueHor+"px"}, 0);
                }
                var signVer = player.pos.y - $("#"+player.id).position().top > 0;

                var symbolVer = signVer ? "+":"-";
                console.log("symbol:",symbolVer);

                var valueVer = Math.abs(player.pos.y - $("#"+player.id).position().top);
                console.log("valueVer:",valueVer);
                if(valueVer != 0){
                    $("#"+player.id).animate({top: symbolVer+"="+valueVer+"px"}, 0);
                }

            }
        })


    }
});
