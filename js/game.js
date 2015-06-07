// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
ctx.strokeStyle = 'black';

canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 64, // movement in pixels per second
	width: 32,
	height: 32
};
var monster = {};
var monstersCaught = 1;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = 0;
	hero.y = canvas.height - hero.height;

	monster.x = canvas.width - hero.width;
	monster.y = 0;
};

// Update game objects
var update = function (modifier) {

	var rectanglesSet = [
                        [
                            {x1: 0, y1: 0, x2: 384, y2: 32, color: "black"},
                            {x1: 432, y1: 16, x2: 464, y2: 48, color: "black"},
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
                        [
		                    {x1: 128, y1: 128, x2: 256, y2: 256, color: "blue"},
	                    ],
                        [
		                    {x1: 0, y1: 0, x2: 64, y2: 64, color: "black"},
	                    ],
                    ];

    ctx.beginPath();
    ctx.rect(0, 0, 512, 480);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(410, 450, 512, 480);
    ctx.fillStyle = 'black';
    ctx.fill();

	var canMoveLeft = true;
	var canMoveRight = true;
	var canMoveUp = true;
	var canMoveDown = true;
    var offGrid = false;

    if (typeof rectanglesSet[monstersCaught-1] === 'undefined') {
        monstersCaught = 1;
    } else {
        rectangles = rectanglesSet[monstersCaught-1];
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

        if (((hero.x + 32) > x1) && (hero.x) < x2) {
            if (hero.y + 32 > y1 && hero.y < y1) {
                canMoveDown = false;
                if (hero.y + 32 > y1) {
                }
                if (hero.y < y2) {
                }
            }
            if (hero.y < y2 && hero.y > y1) {
                canMoveUp = false;
            }
            if (hero.x + 32 < x2) {
                if (hero.y < y2 && hero.y + 32 > y1) {
                    canMoveRight = false;
                }

            }
            if (hero.x + 32 > x2) {
                if (hero.y < y2 && hero.y + 32 > y1) {
                    canMoveLeft = false;
                }
            }
        }
	}

	// Keep the hero on the grid
	if (hero.y > canvas.height - hero.height) {
		canMoveDown = false;
        offGrid = true;
	}
	if (hero.y < 0) {
		canMoveUp = false;
        offGrid = true;
	}
	if (hero.x < 0) {
		canMoveLeft = false;
        offGrid = true;
	}
	if (hero.x > canvas.width - hero.width) {
		canMoveRight = false;
        offGrid = true;
	}

    if (!offGrid && (!canMoveUp || !canMoveDown || !canMoveLeft || !canMoveRight)) {
		reset();
    }

	if (canMoveUp && 38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (canMoveDown && 40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (canMoveLeft && 37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (canMoveRight && 39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (
		hero.x <= (monster.x + hero.width)
		&& monster.x <= (hero.x + hero.width)
		&& hero.y <= (monster.y + hero.height)
		&& monster.y <= (hero.y + hero.height)
	) {
		++monstersCaught;
		reset();
	}

};

// Draw everything
var render = function () {

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	ctx.fillStyle = "rgb(0, 256, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";
	ctx.fillText("Level: " + monstersCaught, 416, 480);
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
