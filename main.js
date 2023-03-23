//Create canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1500;
canvas.height = 700;
document.body.appendChild(canvas);

let chessBoard = [
    ['X','X','X','X','X'],
    ['X','X','X','X','X'],
    ['X','X','X','X','X'],
    ['X','X','X','X','X'],
    ['X','X','X','X','X']
];
console.log(chessBoard)

var savedSharkX = canvas.width / 2;
var savedSharkY = canvas.height / 2;

var soundEaten = "sounds/punch.wav";
var soundBubbles = "sounds/bubbles.wav";
var soundwin = "sounds/won.wav"
var soundEfx = document.getElementById("soundEfx");

// lots of variables to keep track of sprite geometry
// I have 8 rows and 3 cols in my space ship sprite sheet
var rows = 4;
var cols = 3;
var trackDown = 0;
var trackLeft = 1;
var trackRight = 2;
var trackUp = 3; // not using up and down in this version, see next version

var spriteWidth = 550; // also spriteWidth/cols;
var spriteHeight = 708; // also spriteHeight/rows;
var width = spriteWidth / cols;
var height = spriteHeight / rows;

var curXFrame = 0; // start on left side
var frameCount = 3; // 3 frames per row
//x and y coordinates of the overall sprite image to get the single framewe want
var srcX = 0; // our image has no borders or other stuff
var srcY = 0;
//Assuming that at start the character will move right side
var left = false;
var right = true;
var up = false;
var down = false;


// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/waterbackground.jpg";

// Shark image
var sharkReady = false;
var sharkImage = new Image();
sharkImage.onload = function () {
    sharkReady = true;
};
sharkImage.src = "images/sharkspritesheet2.png";

// Fish image
var fishReady = false;
var fishImage = new Image();
fishImage.onload = function () {
    fishReady = true;
};
fishImage.src = "images/fish.png";

// Jellyfish images
var jellyfishReady = false;
var jellyfishImage = new Image();
jellyfishImage.onload = function () {
    jellyfishReady = true;
};
jellyfishImage.src = "images/jellyfish2.png";


// Game objects
var shark = {
    speed: 256, // movement in pixels per second
    x: 0,  // where on the canvas are they?
    y: 0  // where on the canvas are they?
};
var fish = {
    x: 0,
    y: 0
};
var jellyfish1 = {
    x: 100,
    y: 200
};
var jellyfish2 = {
    x: 1200,
    y: 200
};
var jellyfish3 = {
    x: 900,
    y: 550
};
var fishEaten = 0;
let lostGame = false;
var counter = 0;

// Handle keyboard controls
var keysDown = {};
addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// Update game objects
var update = function (modifier) {

    ctx.clearRect(shark.x, shark.y, width, height);
    left = false;
    right = false;

    if (38 in keysDown) { //  holding up key
        shark.y -= shark.speed * modifier;
        if (shark.y < 0) {
            shark.y = 0;
        }
        left = false; // for animation
        right = false; // for animation
        up = true;
        down = false;
    }
    if (40 in keysDown) { //  holding down key
        shark.y += shark.speed * modifier;
        if (shark.y > 520) {
            shark.y = 520;
        }
        left = false; // for animation
        right = false; // for animation
        up = false;
        down = true;
    }
    if (37 in keysDown) { // holding left key
        shark.x -= shark.speed * modifier;
        if (shark.x < 0) {
            shark.x = 0;
        }
        left = true; // for animation
        right = false; // for animation
        up = false;
        down = false;
    }
    if (39 in keysDown) { // holding right key
        shark.x += shark.speed * modifier;
        if (shark.x > 1300) {
            shark.x = 1300;
        }
        left = false; // for animation
        right = true; // for animation
        up = false;
        down = false;
    }

    //  Checks if shark is touching fish
    if (
        shark.x <= (fish.x + 50)
        && fish.x <= (shark.x +100)
        && shark.y <= (fish.y + 50)
        && fish.y <= (shark.y + 100)
    ) {
        console.log("here");
        console.log("shark=" + shark.x + ", " + shark.y);
        console.log("fish=" + fish.x + ", " + fish.y);
        console.log("jellyfish1="  + jellyfish1.x + ", " + jellyfish1.y);
        console.log("jellyfish2="  + jellyfish2.x + ", " + jellyfish2.y);
        console.log("jellyfish3="  + jellyfish3.x + ", " + jellyfish3.y);


        soundEfx.src = soundEaten;
        soundEfx.play(); 
        ++fishEaten;       // keep track of our “score”
        
        savedSharkX = shark.x;
        savedSharkY = shark.y;
        //reset();       // start a new cycle
        if (fishEaten == 3) {
            document.getElementById('sound').play();
            alert("You won!");
            keysDown = {};
            gameOver = true;

            window.location.reload();
            
        }
        reset();
    }

    //curXFrame = ++curXFrame % frameCount; //Updating the sprite frame index
    if (counter == 10) { // adjust this to change "walking speed" of animation
        curXFrame = ++curXFrame % frameCount; //Updating the sprite frame index
        counter = 0;
    } else {
        counter++;
    }
    
    
    // it will count 0,1,2,0,1,2,0, etc
    srcX = curXFrame * width; //Calculating the x coordinate for spritesheet
    //if left is true, pick Y dim of the correct row
    if (left) { //calculate srcY
        srcY = trackLeft * height;
    }
    //if the right is true, pick Y dim of the correct row
    if (right) { //calculating y coordinate for spritesheet
        srcY = trackRight * height;
    }
    if (up) {
        srcY = trackUp * height;
    }
    if (down) {
        srcY = trackDown * height;
    }
    /* if (left == false && right == false && up == false && down == false) {
        srcX = 1 * width;
        srcY = 2 * height;
    } */

    //  Checks if shark is touching jellyfish
    if (
        shark.x <= (jellyfish1.x + 25)
        && jellyfish1.x <= (shark.x + 125)
        && shark.y <= (jellyfish1.y + 75)
        && jellyfish1.y <= (shark.y + 125)
    ) {
        soundEfx.src = soundEaten;
        soundEfx.play(); 
        gameOver();
        window.location.reload();
    }

    if (
        shark.x <= (jellyfish2.x + 25)
        && jellyfish2.x <= (shark.x + 125)
        && shark.y <= (jellyfish2.y + 75)
        && jellyfish2.y <= (shark.y + 125)
    ) {
        soundEfx.src = soundEaten;
        soundEfx.play(); 
        gameOver();
        window.location.reload();
    }

    if (
        shark.x <= (jellyfish3.x + 25)
        && jellyfish3.x <= (shark.x + 125)
        && shark.y <= (jellyfish3.y + 75)
        && jellyfish3.y <= (shark.y + 125)
    ) {
        soundEfx.src = soundEaten;
        soundEfx.play(); 
        gameOver();
        window.location.reload();
    }
};

var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Fish eaten: " + fishEaten, 32, 32);

    if (sharkReady) {
         ctx.drawImage(sharkImage, srcX, srcY, width, height, shark.x, shark.y, width, height);
    }
    if (fishReady) {
        ctx.drawImage(fishImage, fish.x, fish.y);
    }
    if (jellyfishReady) {
        ctx.drawImage(jellyfishImage, jellyfish1.x, jellyfish1.y);
        ctx.drawImage(jellyfishImage, jellyfish2.x, jellyfish2.y);
        ctx.drawImage(jellyfishImage, jellyfish3.x, jellyfish3.y);
    }
}

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;
    requestAnimationFrame(main);
};



// Reset the game when the player catches a fish
var reset = function () {
    /* if (fishEaten == 3) {
        document.getElementById('sound').play();
        alert("You won!");
        window.location.reload();
    } */
    for (let i = 0; i < chessBoard.length; i++) {
        for (let j = 0; j < chessBoard[0].length; j++) {
            chessBoard[i][j] = "X";
        }
    }
    shark.x = savedSharkX;
    shark.y = savedSharkY;
    placeItem(fish);
    placeItem(jellyfish1);
    placeItem(jellyfish2);
    placeItem(jellyfish3);
};

var placeItem = function(item) {
    //item.x = (Math.random() * (canvas.width - 200));
    //item.y = (Math.random() * (canvas.height - 200));


    //This is to make sure none of the characters end of touching each other
    //This sitll doesn't work video 1:25
    let a = 0;
    let b = 0;
    let success = false;

    while(!success) {
        a = Math.floor(Math.random() * 5);
        b = Math.floor(Math.random() * 5);
        if (chessBoard[a][b] == "O") {
            success = true;
        } else {
            chessBoard[a][b] = "O";
            /* item.x = ((a*150) +50);
            item.y = ((b*65) +50); */
            item.x = ((a*280) +50);
            item.y = ((b*120) +50);
        }
        
    }
}

let gameOver = function() {
    document.getElementById('soundgamelost').play();
    alert("You got stung by a jellyfish, game over!");
    keysDown = {};
    gameOver = true;
    reset();
    fishEaten = 0;
}

var then = Date.now();
reset();
main();



