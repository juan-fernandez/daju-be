'use strict';

(function() {

    var socket = io();
    var canvas = document.getElementsByClassName('whiteboard')[0];
    var context = canvas.getContext('2d');

    var drawing = false;

    /*initial rectangle*/
    context.beginPath();
    context.rect(0, 0, 50, 50);
    context.fillStyle = 'yellow';
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = 'black';
    context.stroke();


    socket.on('moving', function(data){
        console.log("client moving",data);
        moveSquare(data);
    });

    $(window).keydown(function(event){

        if(event.which == 39){
            console.log("right ->",event.which)
            socket.emit('moving',{vel_x:100})
        }
    })


    function moveSquare(vel_x){

        console.log("moveSquare",vel_x)
        //console.log("emit",emit)
        context.clearRect(0,0,canvas.width,canvas.height)
        canvas = document.getElementsByClassName('whiteboard')[0];
        context = canvas.getContext('2d');

        context.beginPath();
        context.rect(vel_x.vel_x, 0, 50, 50);
        context.fillStyle = 'yellow';
        context.fill();
        context.lineWidth = 7;
        context.strokeStyle = 'black';
        context.stroke();
    }


})();
