// This file hosts all logic that has to do with the maze, from managing interal variables to displaying the maze

var xSize, ySize, curPos, playingField;

/* Yay helper functions (from StackOverflow).
 * Creates an n-dimensional array, with n equaling the number of parameters provided
 * i.e. createArray(5) generates a 1D array with 5 elements, and createArray(5,3) creates a 2D array... etc. etc.
 */
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

// This uses a modified Kruskal's algorithm to generate a random maze, with vertices in a unsigned rectangular system.
function generateMaze() {
    var i; // Loop variable
    Math.seedrandom(randomSeed);
    var numNodes = ySize * xSize;
    console.log(numNodes);

    var representativeArray = createArray(numNodes),
        edgeArray = createArray(2 * numNodes); // 2 * numNodes because at most each node will have 2 connections, one going right and one going down
    console.log(edgeArray);
    // Initializes our representative array; their IDs are just arbitrary values
    for (i = 0; i < representativeArray.length; i++) {
        representativeArray[i] = i;
    }
    console.log(representativeArray);
    console.log(xSize);
    // Initalizes our edgeArray
    for (i = 0; i < edgeArray.length / 2; i++){
        // There's some confunkery occuring here. We define each edge as an object with a random weight, a starting position, and ending position.
        // However, to obtain those positions, which are defined in a 2D space, in a 1D array, we can find our y position by floor dividing our iterator variable, and our x position would be the remainder of said floor division, represented by the modulus opertation.
        // After that, then it merely becomes checks to see if the node to the right or to the bottom, respectively, is valid, and if so, create an edge. Otherwise, we move on to the next position

        // If possible, add an edge connecting the current vertex to the one right next to it.
        if (i % xSize + 1 !== xSize) {
            edgeArray[i] = {weight: Math.random(), startPos: {y: Math.floor(i / xSize), x: i % xSize}, endPos: {y: Math.floor(i / xSize), x: (i % xSize) + 1}};
        }

        // If possible, add an edge connecting the current vertex to the one below it.
        if (Math.floor(i / xSize) + 1 !== ySize) {
            edgeArray[numNodes + i] = {weight: Math.random(), startPos: {y: Math.floor(i / xSize), x: i % xSize}, endPos: {y: Math.floor(i / xSize) + 1, x: (i % xSize)}};
        }
    }

    // Sorts edges by their weight property, least to greatest
    edgeArray.sort(function(a, b) {
        return a.weight - b.weight;
    });

    // Generates and draws the minimal standing tree, taking advantage of the fact that the list is sorted by least to greatest weight
    while (typeof edgeArray[0] !== 'undefined') {
        // First, we get the data of the least-weight value...
        var startPos = edgeArray[0].startPos.y * xSize + edgeArray[0].startPos.x,
            endPos = edgeArray[0].endPos.y * xSize + edgeArray[0].endPos.x;

            // ... set all IDs with the same value to equal the value of the starting node, and thus creating a representative ID subgraph ...
            var representative = representativeArray[startPos];
            var toBeReplaced = representativeArray[endPos];

            if (representative !== toBeReplaced) {
                for (i = 0; i < representativeArray.length; i++) {
                    if (representativeArray[i] === toBeReplaced) {
                        representativeArray[i] = representative;
                    }
                }
                drawField(); // ... draw the field...
            }

        edgeArray.shift(); // ... and finally remove that node from our list, allowing us to repeat this process
    }

    // Helper function to set up our maze array
    function drawField() {
        var startPos = edgeArray[0].startPos,
            endPos = edgeArray[0].endPos;

        // variable below have their values incremented to account for the border we want to draw on the top and left side.
        var startPosX = startPos.x * 2 + 1,
            startPosY = startPos.y * 2 + 1,
            endPosX = endPos.x * 2 + 1;
            endPosY = endPos.y * 2 + 1;
            playingFieldBefore = playingField;
            playingField[startPosY][startPosX] = 1; // Draws the box at the starting vertex
            playingField[(startPosY + endPosY) / 2][(startPosX + endPosX) / 2] = 1; // Draws the box at the middle position, the "edge"
            playingField[endPosY][endPosX] = 1; // Draws the box at the ending vertex
            console.log(playingField == playingFieldBefore);

    }

    // Sets the default position to (0, 0) and draws the user
    curPos = {x:0, y:0};
};

// Writes the maze to the DOM, allowing us to visualize the output. Paths are black while the borders are grey
function displayMaze() {
    var container = $("#left");
    container.append("<div id=\"playing-field\">");

    var field = $("#playing-field");
    for (i=0; i < playingField.length; i++) {
        field.append("<div id=\"row-" + i + "\">");
        var row = $("#row-" + i);
        for (j = 0; j < playingField[i].length; j++) {
            if (i === playingField.length - 2 && j === playingField[0].length - 2){
                row.append("<img src=\"img/goal.png\" />");
            } else {
                if (typeof playingField[i][j] !== 'undefined')
                    row.append("<img src=\"img/path.png\"/>");
                else
                    row.append("<img src=\"img/wall.png\"/>");
            }
        }
        row.append("<br/>");
        field.append("</div>");
    }

    container.append("</div>");
}

// Checks if the user can move to the specified position
function checkLoc(location) {
    return (typeof playingField[location.y + 1][location.x + 1] !== 'undefined');
}

// Sets the current location to the location specified in the parameter, and then calls an update to the UI. Also checks if the player has won.
function moveUser(location) {
    curPos.x = location.x;
    curPos.y = location.y;
    drawUser();
    if (checkFinish()){
        socket.emit("chatMsg", {user: "Servidor", msg: username + " ha ganado un punto"});
        socket.emit("getNewMap", username);
    }
}

// Draws the user at curPos
function drawUser() {
    $("#user").css({
        position:"absolute",
        top:(curPos.y + 1) * 16,
        left:(curPos.x + 1) * 16
    });
}

// Updates the opponent's location
function moveOpponent(msg) {
    $("#opponent").css({
        position:"absolute",
        top:(msg.y + 1) * 16,
        left:(msg.x + 1) * 16
    });
}

// Checks if the user reaches the target position on the maze
function checkFinish() {
    return (curPos.x === (xSize - 1) * 2 && curPos.y === (ySize - 1) * 2)
}

function generateNewMaze() {
    clearMaze();
    generateMaze();
    displayMaze();
    addPlayers();
    resetPlayers();
}

// Clear the maze and recreates the internal playing field
function clearMaze() {
    $("#playing-field").empty();
    // Because we double the size, what happens is that a natural border is generated on the right and bottom edges, since we generate the playing field by getting two points and essentially drawing between them, and there cannot be a point outside the field. This means that if we want to create a border on all edges, we need to make the array one larger.
    playingField = createArray(ySize * 2 + 1, xSize * 2 + 1);
}

function addPlayers(){
    $("#playing-field").append("<img src=\"img/opponent.png\" id=\"opponent\" />");
    $("#playing-field").append("<img src=\"img/user.png\" id=\"user\" />");
}

function resetPlayers() {
    $("#opponent").css({position:"absolute", top:"16px", left:"16px"});
    $("#user").css({position:"absolute", top:"16px", left:"16px"});
}
