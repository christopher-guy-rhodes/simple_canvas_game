// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

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
	speed: 256, // movement in pixels per second
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

	// Throw the monster somewhere on the screen randomly
	monster.x = canvas.width - hero.width;
	monster.y = 0;
};

// Update game objects
var update = function (modifier) {

	var rectangles = [
		             {x1: 64, y1: 64, x2: 448, y2: 416},
		             {x1: 24, y1: 34, x2: 48, y2: 99}
	                 ];

	var canMoveLeft = true;
	var canMoveRight = true;
	var canMoveUp = true;
	var canMoveDown = true;

	for (var i = 0; i < rectangles.length; i++) {
		var x1 = rectangles[i].x1;
		var y1 = rectangles[i].y1;
		var x2 = rectangles[i].x2;
		var y2 = rectangles[i].y2;
		console.log('x:' + hero.x + ', y:' + hero.y);

		if (hero.x > x1 - hero.width && hero.x < x2 && hero.y < y2 && hero.y > y1 - hero.height) {
			if (y1 - hero.y > 0 && y1 - hero.y < hero.height) {
				// touching top
				canMoveDown = false;
			}
			if (y2 - hero.y > 0 && y2 - hero.y < hero.height) {
				// touching bottom
				canMoveUp = false;
			}
			if (x1 - hero.x > 0 && x1 - hero.x < hero.width ) {
				// touching left
				canMoveRight = false;
			}
			if (x2 - hero.x > 0 && x2 - hero.x < hero.width ) {
				// touching right
				canMoveLeft = false;
			}
		}
	}

	// Keep the hero on the grid
	if (hero.y > canvas.height - hero.height) {
		canMoveDown = false;
	}
	if (hero.y < 0) {
		canMoveUp = false;
	}
	if (hero.x < 0) {
		canMoveLeft = false;
	}
	if (hero.x > canvas.width - hero.width) {
		canMoveRight = false;
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
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";
	ctx.fillText("Level: " + monstersCaught, 256, 480);
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
