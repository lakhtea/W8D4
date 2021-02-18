// DON'T TOUCH THIS CODE
if (typeof window === "undefined") {
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid() {
  let array = [];
  for (let i = 0; i < 8; i++) {
    array.push(new Array(8));
  }
  [array[3][4], array[4][3]] = [new Piece("black"), new Piece("black")];
  [array[3][3], array[4][4]] = [new Piece("white"), new Piece("white")];

  return array;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board() {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  let x = pos[0];
  let y = pos[1];

  if (x > 7 || x < 0 || y > 7 || y < 0) return false;
  return true;
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (!this.isValidPos(pos)) {
    throw new Error("Not valid pos!");
  } else if (!this.isOccupied(pos)) {
    return undefined;
  } else {
    return this.grid[pos[0]][pos[1]];
  }
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  if (!this.isOccupied(pos)) return false;
  return this.grid[pos[0]][pos[1]].color === color;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return this.grid[pos[0]][pos[1]] !== undefined;
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function (pos, color, dir, piecesToFlip) {
  if (piecesToFlip === undefined) {
    piecesToFlip = [];
  }

  let x = pos[0];
  let y = pos[1];

  let dirx = dir[0];
  let diry = dir[1];

  let newpos = [x + dirx, y + diry];

  if (
    !this.isValidPos(pos) ||
    !this.isValidPos(newpos) ||
    !this.isOccupied(newpos)
  ) {
    return [];
  }

  if (!this.isMine(newpos, color)) {
    piecesToFlip.push(newpos);
    return this._positionsToFlip(newpos, color, dir, piecesToFlip);
  } else {
    return piecesToFlip;
  }
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (!this.isOccupied(pos)) {
    let moves = Board.DIRS.map((dir) => this._positionsToFlip(pos, color, dir));
    return moves.some((move) => move.length > 0);
  }
  return false;
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (!this.isValidPos(pos) || !this.validMove(pos, color)) {
    throw new Error("Invalid move!");
  }
  let x = pos[0];
  let y = pos[1];
  let counter = 0;
  for (let i = 0; i < Board.DIRS.length; i++) {
    let dir = Board.DIRS[i];
    let dirx = dir[0];
    let diry = dir[1];

    let newpos = [x + dirx, y + diry];

    if (!this.isMine(newpos)) {
      counter++;
    }
  }
  if (counter > 0) {
    this.grid[pos[0]][pos[1]] = new Piece(color);

    for (let i = 0; i < Board.DIRS.length; i++) {
      let toFlip = this._positionsToFlip(pos, color, Board.DIRS[i]);
      toFlip.forEach((pos) => this.getPiece(pos).flip());
    }
  }
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let array = [];
  for (let i = 0; i < this.grid.length; i++) {
    for (let j = 0; j < this.grid.length; j++) {
      let pos = [i, j];
      if (!this.isOccupied(pos) && this.validMove(pos, color)) array.push(pos);
    }
  }
  return array;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  if (this.validMoves(color).length) return true;
  return false;
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  if (!this.hasMove("black") && !this.hasMove("white")) return true;
  return false;
};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  console.log("");
  console.log("(っ◔◡◔)っ :hearts: Reversi :hearts:");
  console.log("---------------------");
  console.log("   0 1 2 3 4 5 6 7");
  for (let i = 0; i < this.grid.length; i++) {
    console.log(`${i}${this.rowAsString(i)}`);
  }
  console.log("---------------------");
};

// DON'T TOUCH THIS CODE
if (typeof window === "undefined") {
  module.exports = Board;
}
// DON'T TOUCH THIS CODE
