function attachKeyListener() {
    document.onkeydown = function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        var movementData = curPos;

        switch (code) {
            case 37:
                if (checkLoc({y:curPos.y, x:curPos.x - 1})) {
                    moveUser({y:curPos.y, x:curPos.x - 1});
                    movementData.x1 = curPos.x - 1;
                    movementData.y1 = curPos.y;
                    if (!checkFinish())
                        socket.emit('userMovement', movementData);
                }
                break;
            case 38:
                if (checkLoc({y:curPos.y - 1, x: curPos.x})) {
                    moveUser({y:curPos.y - 1, x: curPos.x});
                    movementData.x1 = curPos.x;
                    movementData.y1 = curPos.y - 1;
                    if (!checkFinish())
                        socket.emit('userMovement', movementData);
                }
                break;
            case 39:
                if (checkLoc({y:curPos.y, x: curPos.x + 1})) {
                    moveUser({y:curPos.y, x: curPos.x + 1});
                    movementData.x1 = curPos.x + 1;
                    movementData.y1 = curPos.y;
                    if (!checkFinish())
                        socket.emit('userMovement', movementData);
                }
                break;
            case 40:
                if (checkLoc({y:curPos.y + 1, x: curPos.x})) {
                    moveUser({y:curPos.y + 1, x: curPos.x});
                    movementData.x1 = curPos.x;
                    movementData.y1 = curPos.y + 1;
                    if (!checkFinish())
                        socket.emit('userMovement', movementData);
                }
                break;
        }
    };
}

// Opponent movement
socket.on('userMovement', function(msg){
    moveOpponent(msg);
});

$(document).keydown(function(event){
    if(event.keyCode==123){
    return false;
   }
else if(event.ctrlKey && event.shiftKey && event.keyCode==73){
      return false;  //Prevent from ctrl+shift+i
   }
});

$(document).on("contextmenu",function(e){
   e.preventDefault();
});
