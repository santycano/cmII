var xSize, ySize, curPos, playingField,userLogo;

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMaze() {
    var i;
    Math.seedrandom(randomSeed);
    var numNodes = ySize * xSize;

    var representativeArray = createArray(numNodes),
        edgeArray = createArray(2 * numNodes);

    for (i = 0; i < representativeArray.length; i++) {
        representativeArray[i] = i;
    }

    for (i = 0; i < edgeArray.length / 2; i++){

        if (i % xSize + 1 !== xSize) {
            edgeArray[i] = {weight: Math.random(), startPos: {y: Math.floor(i / xSize), x: i % xSize}, endPos: {y: Math.floor(i / xSize), x: (i % xSize) + 1}};
        }

        if (Math.floor(i / xSize) + 1 !== ySize) {
            edgeArray[numNodes + i] = {weight: Math.random(), startPos: {y: Math.floor(i / xSize), x: i % xSize}, endPos: {y: Math.floor(i / xSize) + 1, x: (i % xSize)}};
        }
    }

    edgeArray.sort(function(a, b) {
        return a.weight - b.weight;
    });

    while (typeof edgeArray[0] !== 'undefined') {
        var startPos = edgeArray[0].startPos.y * xSize + edgeArray[0].startPos.x,
            endPos = edgeArray[0].endPos.y * xSize + edgeArray[0].endPos.x;

            var representative = representativeArray[startPos];
            var toBeReplaced = representativeArray[endPos];

            if (representative !== toBeReplaced) {
                for (i = 0; i < representativeArray.length; i++) {
                    if (representativeArray[i] === toBeReplaced) {
                        representativeArray[i] = representative;
                    }
                }
                drawField();
            }

        edgeArray.shift();
    }

    function drawField() {
        var startPos = edgeArray[0].startPos,
            endPos = edgeArray[0].endPos;

        var startPosX = startPos.x * 2 + 1,
            startPosY = startPos.y * 2 + 1,
            endPosX = endPos.x * 2 + 1;
            endPosY = endPos.y * 2 + 1;
            playingFieldBefore = playingField;
            playingField[startPosY][startPosX] = 1;
            playingField[(startPosY + endPosY) / 2][(startPosX + endPosX) / 2] = 1;
            playingField[endPosY][endPosX] = 1;
    }

    do{
        yRand = getRandomInt(1,ySize);
        xRand = getRandomInt(1,xSize);
    }while (playingField[xRand-1][yRand-1] !== 1);

    curPos = {x:xRand, y:yRand};

};

function displayMaze() {
    var container = $("#left");
    container.append("<div id=\"playing-field\">");
    do{
        yRandf = getRandomInt(1,playingField.length-2);
        xRandf = getRandomInt(1,playingField.length-2);
    }while ( playingField[xRandf][yRandf] !== 1 && xRandf !== xRand && yRandf !== yRand);

    var field = $("#playing-field");
    for (i=0; i < playingField.length; i++) {
        field.append("<div id=\"row-" + i + "\">");
        var row = $("#row-" + i);
        for (j = 0; j < playingField[i].length; j++) {
                if (i === xRandf && yRandf === j)
                    row.append("<img src=\"../img/goal.png\" />");
                else if (typeof playingField[i][j] !== 'undefined')
                    row.append("<img src=\"../img/path.png\"/>");
                else
                    row.append("<img src=\"../img/wall.png\"/>");
        }
        row.append("<br/>");
        field.append("</div>");
    }

    container.append("</div>");
}

function checkLoc(location) {
    return (typeof playingField[location.y + 1][location.x + 1] !== 'undefined');
}

function moveUser(location) {
    curPos.x = location.x;
    curPos.y = location.y;
    drawUser();
    if (checkFinish()){
        socket.emit("chatMsg", {user: "Servidor", msg: username + " ha ganado un punto"});
        socket.emit("getNewMap", username);
    }
}

function drawUser() {
    $("#user").css({
        position:"absolute",
        top:(curPos.y + 1) * 16,
        left:(curPos.x + 1) * 16
    });
}

function moveOpponent(msg) {
    $("#opponent").css({
        position:"absolute",
        top:(msg.y + 1) * 16,
        left:(msg.x + 1) * 16
    });
}

function checkFinish() {
    return (curPos.x === (yRandf - 1) && curPos.y === (xRandf - 1))
}

function generateNewMaze() {
    clearMaze();
    generateMaze();
    displayMaze();
    addPlayers();
    resetPlayers();
    drawUser();
    moveOpponent(curPos);
}

function clearMaze() {
    $("#playing-field").empty();
    playingField = createArray(ySize * 2 + 1, xSize * 2 + 1);
}

function addPlayers(){
    $("#playing-field").append("<img src=\"../img/opponent.png\" id=\"opponent\" />");
    $("#playing-field").append(userLogo);
}

function resetPlayers() {
    $("#opponent").css({position:"absolute", top:"16px", left:"16px"});
    $("#user").css({position:"absolute", top:"16px", left:"16px"});
}
