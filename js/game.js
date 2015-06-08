// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
ctx.strokeStyle = 'black';

canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// truck image
var carReady = false;
var truckImage = new Image();
truckImage.onload = function () {
	carReady = true;
};
truckImage.src = "images/truck.png";

// finish image
var finishReady = false;
var finishImage = new Image();
finishImage.onload = function () {
	finishReady = true;
};
finishImage.src = "images/finish.png";

// Game objects
var truck = {
	speed: 80, // movement in pixels per second
	width: 32,
	height: 32
};
var finish = {};
var finishes = 1;
var crashes = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a finish
var reset = function () {
	truck.x = 0;
	truck.y = canvas.height - truck.height;

	finish.x = canvas.width - truck.width;
	finish.y = 0;
};

// Update game objects
var update = function (modifier) {

	var rectanglesSet = [
                            [
		                        {x1: 0, y1: 0, x2: 64, y2: 64, color: "black"},
	                        ],
                            [
                                {x1: 0, y1: 0, x2: 384, y2: 32, color: "black"},
                                {x1: 432, y1: 0, x2: 464, y2: 46, color: "black"},
		                        {x1: 0, y1: 0, x2: 32, y2: 432, color: "black"},
		                        {x1: 80, y1: 208, x2: 112, y2: 272, color: "black"},
		                        {x1: 80, y1: 80, x2:160 , y2: 160 , color: "black"},
		                        {x1: 160, y1: 208, x2: 240, y2: 240, color: "black"},
		                        {x1: 208, y1: 80 , x2: 240 , y2: 208, color: "black"},
		                        {x1: 160, y1: 288, x2: 240, y2: 320, color: "black"},
		                        {x1: 208, y1: 240, x2: 240, y2: 288, color: "black"},
		                        {x1: 112, y1: 368, x2: 240, y2: 400, color: "black"},
		                        {x1: 80, y1: 320, x2: 112, y2: 400, color: "black"},
		                        {x1: 288, y1: 368, x2: 320, y2: 400, color: "black"},
                                {x1: 80, y1: 448, x2: 320, y2: 480, color: "black"},
                                {x1: 288, y1: 160, x2: 320 , y2: 320, color: "black"},
                                {x1: 288, y1: 80, x2: 480, y2: 112, color: "black" },
                                {x1: 448, y1: 80, x2: 480, y2:160, color: "black" },
                                {x1: 320, y1: 160, x2: 480, y2: 192, color: "black" },
                                {x1: 448, y1: 192, x2: 480, y2: 400, color: "black" },
                                {x1: 368, y1: 240, x2: 400, y2: 480, color: "black"},
	                        ],
                        ];

    ctx.beginPath();
    ctx.rect(0, 0, 512, 480);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();

	var canMoveLeft = true;
	var canMoveRight = true;
	var canMoveUp = true;
	var canMoveDown = true;
    var offGrid = false;

    if (typeof rectanglesSet[finishes-1] === 'undefined') {
        finishes = 1;
    } else {
        rectangles = rectanglesSet[finishes-1];
    }


	for (var i = 0; i < rectangles.length; i++) {

		var x1 = rectangles[i].x1;
		var y1 = rectangles[i].y1;
		var x2 = rectangles[i].x2;
		var y2 = rectangles[i].y2;

		ctx.beginPath();
        ctx.rect(x1 , y1, x2 - x1, y2 - y1);
        ctx.fillStyle = rectangles[i].color;
        ctx.fill();

        if (((truck.x + 32) > x1) && (truck.x) < x2) {
            if (truck.y + 32 > y1 && truck.y < y1) {
                canMoveDown = false;
            }
            if (truck.y < y2 && truck.y > y1) {
                canMoveUp = false;
            }
            if (truck.x + 32 < x2) {
                if (truck.y < y2 && truck.y + 32 > y1) {
                    canMoveRight = false;
                }

            }
            if (truck.x + 32 > x2) {
                if (truck.y < y2 && truck.y + 32 > y1) {
                    canMoveLeft = false;
                }
            }
        }
	}

	// Keep the truck on the grid
	if (truck.y > canvas.height - truck.height) {
		canMoveDown = false;
        offGrid = true;
	}
	if (truck.y < 0) {
		canMoveUp = false;
        offGrid = true;
	}
	if (truck.x < 0) {
		canMoveLeft = false;
        offGrid = true;
	}
	if (truck.x > canvas.width - truck.width) {
		canMoveRight = false;
        offGrid = true;
	}

    if (!offGrid && (!canMoveUp || !canMoveDown || !canMoveLeft || !canMoveRight)) {
		reset();
        crashes++;
    }

	if (canMoveUp && 38 in keysDown) { // Player holding up
		truck.y -= truck.speed * modifier;
	}
	if (canMoveDown && 40 in keysDown) { // Player holding down
		truck.y += truck.speed * modifier;
	}
	if (canMoveLeft && 37 in keysDown) { // Player holding left
		truck.x -= truck.speed * modifier;
	}
	if (canMoveRight && 39 in keysDown) { // Player holding right
		truck.x += truck.speed * modifier;
	}

	// Are they touching?
	if (
		truck.x <= (finish.x + truck.width)
		&& finish.x <= (truck.x + truck.width)
		&& truck.y <= (finish.y + truck.height)
		&& finish.y <= (truck.y + truck.height)
	) {
		++finishes;
        //crashes = 0;
		reset();
	}

};

// Draw everything
var render = function () {

	if (carReady) {
		ctx.drawImage(truckImage, truck.x, truck.y);
	}

	if (finishReady) {
		ctx.drawImage(finishImage, finish.x, finish.y);
	}

	ctx.fillStyle = "rgb(256, 0, 0)";
	ctx.font = "18px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";
	ctx.fillText("Level: " + finishes, 402, 480);
	ctx.fillText("Crashes: " + crashes, 402, 464);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
