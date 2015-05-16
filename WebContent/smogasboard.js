		var div = document.getElementById('canvasesdiv');

		var boardLayer = document.getElementById('boardLayer');
		var boardLayerContext = boardLayer.getContext('2d');

		var diceLayer = document.getElementById("diceLayer");
		var diceLayerContext = diceLayer.getContext("2d");

		var coverImage = new Image();
		var boardImage = new Image();
		var diceSpriteSheetImage = new Image();
		var diceframe = {
				'source' : diceSpriteSheetImage,
				'current' : 0,
				'total_frames' : 14,
				'width' : 72,
				'height' : 72
			};
		var dice1 = new Image();
		var dice2 = new Image();
		var dice3 = new Image();
		var dice4 = new Image();
		var dice5 = new Image();
		var dice6 = new Image();

		boardImage.src = 'images/board.png';
		coverImage.src = 'images/cover.png';
		diceSpriteSheetImage.src = 'images/horizontalSpriteSheetDice.png';
		dice1.src = "images/1.png";
		dice2.src = "images/2.png";
		dice3.src = "images/3.png";
		dice4.src = "images/4.png";
		dice5.src = "images/5.png";
		dice6.src = "images/6.png";

		var positions = [ 0, 0, 0, 0 ];
		var turn = 1;
		var numPlayers;
		var roll;

		boardImage.onload = function() {
			
			//Menu
			boardLayerContext.drawImage(coverImage, 0, 0, 900, 600);
			numPlayers = prompt("Numero de jugadores?");
			
			drawGameStatus(0, positions);
			
		};

		div.onclick = function gameLoop() {
			// game loop

			roll = rollDice();
			turn = nextTurn(turn);
			positions[turn - 1] += roll;
			console.log("positions: " + positions);

			drawGameStatus(roll, positions);			
			var animation = setInterval(function () {drawNextFrame(0, 0, diceframe);}, 100);
			setTimeout(function(){clearInterval(animation);drawGameStatus(roll, positions);},1000)
		
		};

		
		//TODO: Improve this function to draw:
		//	1. The actual state of the board
		//  2. The dice roll animation
		//	3. Then a new animation simulating the player movement form box to box ending up in the resulting position
		//  Integrate all of this with the setTimeout and setInterval inside. May be woth looking into how to wrap this functions for a cleaner implementation.
		function drawGameStatus(roll, positions) {
			//draw board
			boardLayerContext.drawImage(boardImage, 0, 0, 900, 600);

			//draw game status
			boardLayerContext.font = '20pt Calibri';
			boardLayerContext.fillStyle = 'black';
			if (turn) {
				boardLayerContext.fillText("PLAYER " + turn, 400, 30);
			}

			//draw players
			for (player = 0; player < numPlayers; player++) {
				drawPlayer(positions[player], player);
			}

			//draw dice
			if (roll !== 0) {

				diceLayerContext.clearRect(0, 0, 900, 600);

				switch (roll) {
				case 1:
					diceLayerContext.drawImage(dice1, 0, 0);
					break;
				case 2:
					diceLayerContext.drawImage(dice2, 0, 0);
					break;
				case 3:
					diceLayerContext.drawImage(dice3, 0, 0);
					break;
				case 4:
					diceLayerContext.drawImage(dice4, 0, 0);
					break;
				case 5:
					diceLayerContext.drawImage(dice5, 0, 0);
					break;
				case 6:
					diceLayerContext.drawImage(dice6, 0, 0);
					break;
				default:
					;

				}
			}
		}
		
		function drawNextFrame(x, y, frame) { // context is the canvas 2d context.
			diceLayerContext.clearRect(0, 0, 900, 600);
			if (frame.source != null)
				diceLayerContext.drawImage(frame.source, frame.current * frame.width, 0,
						frame.width, frame.height, x, y, frame.width, frame.height);
				
			frame.current = (frame.current + 1) % frame.total_frames;
			// incrementing the current frame and assuring animation loop
		}

		function drawPlayer(position, player) {

			var radius = 10;

			var board = [
					[ [ 280, 260 ], [ 320, 263 ], [ 297, 302 ], [ 330, 300 ] ], //box 0
					[ [ 213, 285 ], [ 239, 279 ], [ 241, 321 ], [ 269, 313 ] ], //box 1             
					[ [ 162, 308 ], [ 187, 299 ], [ 210, 341 ], [ 230, 332 ] ], //box 2
					[ [ 111, 349 ], [ 139, 325 ], [ 175, 371 ], [ 196, 358 ] ], //box 3
					[ [ 85, 389 ], [ 94, 365 ], [ 152, 395 ], [ 170, 383 ] ], //box 4
					[ [ 88, 441 ], [ 87, 413 ], [ 162, 432 ], [ 163, 411 ] ], //box 5
					[ [ 111, 473 ], [ 102, 456 ], [ 165, 455 ], [ 156, 440 ] ], //box 6
					[ [ 149, 503 ], [ 134, 488 ], [ 195, 474 ], [ 184, 458 ] ], //box 7
					[ [ 217, 527 ], [ 186, 515 ], [ 235, 486 ], [ 216, 472 ] ], //box 8
					[ [ 282, 530 ], [ 243, 531 ], [ 285, 489 ], [ 256, 489 ] ], //box 9
					[ [ 346, 526 ], [ 315, 528 ], [ 326, 479 ], [ 299, 486 ] ] //box 10
			];

			var x = board[position][player][0];
			var y = board[position][player][1];

			boardLayerContext.beginPath();
			boardLayerContext.arc(x, y, radius, 0, 2 * Math.PI, false);

			switch (player) {
			case 0:
				boardLayerContext.fillStyle = 'red';
				break;
			case 1:
				boardLayerContext.fillStyle = 'green';
				break;
			case 2:
				boardLayerContext.fillStyle = 'yellow';
				break;
			case 3:
				boardLayerContext.fillStyle = 'blue';
				break;
			default:
				;

			}

			boardLayerContext.fill();
			boardLayerContext.lineWidth = 3;
			boardLayerContext.strokeStyle = '#003300';
			boardLayerContext.stroke();
		}

		function rollDice() {
			return Math.floor(Math.random() * 6) + 1;
			//return 1; //this is useful when testing all the game boxes
		}

		function nextTurn(turn) {
			if (turn < numPlayers) {
				return turn + 1;
			} else {
				return 1;
			}
		}
