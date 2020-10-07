// This file hosts the code that is appliciable to the function of the app itself, rather than any specific module

var socket = io({'sync disconnect on unload': true });
var randomSeed, username, roomID, firstUser = 0;

// Should be called after everything else is loaded
socket.on('startData', function(msg) {
    $("#waiting").hide();
    randomSeed = msg;
    generateNewMaze();
    attachKeyListener();
    socket.emit('debug', 'CLIENT[?] ACTION: ACKNOWLEDGE=>DATA(' + JSON.stringify(msg) + ')');
});

socket.on('newMazeData', function(msg) {
    incrementAndUpdateScore(msg.username);
    randomSeed = msg;
    generateNewMaze();
});

socket.on('roomData', function(msg) {
    users = msg.user;

    if (firstUser === 0)
        test = msg.userimg1;
    else
        test = msg.userimg0;
    switch (test) {
        case "user":
            userLogo = "<img src=\"../img/user.png\" id=\"user\" />";
            firstUser++;
            break;
        case "user1":
            firstUser++;
            userLogo = "<img src=\"../img/user1.png\" id=\"user\" />";
            break;
        default:
            console.log("ERROR: UNKNOWN LOGO \"" + msg.userimg + "\"");
    }
    switch (msg.diff) {
        case "easy":
            ySize = 10;
            xSize = 10;
            break;
        case "medium":
            ySize = 15;
            xSize = 20;
            break;
        case "hard":
            ySize = 20;
            xSize = 35;
            break;
        default:
            console.log("ERROR: UNKNOWN DIFFICULTY \"" + msg.diff + "\"");
    }
    addRoomInfo(msg.id);
});
