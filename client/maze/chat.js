var userScore = 0,
    opponentScore = 0;

socket.on('chatMsg', function(msg) {
    if (msg.user === "Server"){
        $("#chatlog").append("<p class='sysMsg'><i><b>" + msg.user + ":</b> " + msg.msg + "</i></p>");
    } else {
        $("#chatlog").append("<p><b>" + msg.user + ":</b><br />" + msg.msg + "</p>");
    }
    updateScroll();
});

function updateScroll() {
    $("#chatlog").scrollTop($("#chatlog").get(0).scrollHeight);
}

function incrementAndUpdateScore(user) {
    if (checkFinish()) {
        userScore++;
    } else {
        opponentScore++;
    }

    $("#user-score").text(userScore);
    $("#opponent-score").text(opponentScore);
}

function addRoomInfo(id) {
    if (typeof roomID === 'undefined' && $("#room-id").is(":empty")) {
        roomID = id;
        $("#room-id").append("<b>Sala:</b> <i>" + roomID + "</i>");
        $("#room-username").append("<b>Usuario:</b> <i>" + username + "</i>");
        $("#room-score").append("<b>Marcador:</b> <i id=\"user-score\">0</i><b> | </b><i id=\"opponent-score\">0</i>");
    }
}
