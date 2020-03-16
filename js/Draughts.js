"use strict";


class Draughts extends BaseChess {

  constructor() {
    super();

    this.currentMove = {
      from: undefined,
      to: undefined,
      capture: undefined
    }
  }

  // The process of a move is:
  // squareClicked() calls getMoves()

  // move(from, to) {
  //   // Get the move
  //   let move = super.move(from, to);
  // }
  move(from, to) {
    // If it's a capture, handle our special case
    if (this.game.get(to)) {
      this.game.remove(to);
      this.game.put(this.game.get(from), this.getNextSpace(from, to));
      this.game.remove(from);

      this.disableInput();

      // Clear all highlights from the board (a new turn is about to begin)
      this.clearHighlights();

      // Update the board based on the new position
      this.board.position(this.game.fen(), true);

      setTimeout(() => {
        captureSFX.play();
        this.moveCompleted();
        this.flipTurn();
      }, this.config.moveSpeed * 1.1);

    }
    else {
      // Otherwise do the usual
      super.move(from, to);
    }
  }

  getMoves(square) {
    let moves = super.getMoves(square);

    if (square === undefined) return moves;

    let nonCaptures = moves.filter(a => a.flags !== "c");
    let captures = moves.filter(a => a.flags.indexOf("c") !== -1);

    for (let i = captures.length - 1; i >= 0; i--) {
      let nextSpace = this.getNextSpace(square, captures[i].to)
      if (!this.adjacent(square, captures[i].to) || nextSpace === undefined) {
        captures.splice(i, 1);
      }
    }
    return [...nonCaptures, ...captures];
  }

  adjacent(from, to) {
    let rankFrom = parseInt(from[1]);
    let fileFrom = FILES.indexOf(from[0]);
    let rankTo = parseInt(to[1]);
    let fileTo = FILES.indexOf(to[0]);

    for (let i = rankFrom - 1; i <= rankFrom + 1; i++) {
      for (let j = fileFrom - 1; j <= fileFrom + 1; j++) {
        if (i === rankFrom && j === fileFrom) continue;
        if (i === rankTo && j === fileTo) return true;
      }
    }

    return false;
  }

  getNextSpace(from, to) {
    // Get the difference in squares by rank and file
    let dRank = RANKS.indexOf(to[1]) - RANKS.indexOf(from[1]);
    let dFile = FILES.indexOf(to[0]) - FILES.indexOf(from[0]);

    // Establish the rank and file to check as a square
    let checkRank = RANKS[RANKS.indexOf(to[1]) + dRank];
    let checkFile = FILES[FILES.indexOf(to[0]) + dFile];

    let checkSquare = undefined;

    if (RANKS.indexOf(checkRank) !== -1 && FILES.indexOf(checkFile) !== -1) {
      checkSquare = `${checkFile}${checkRank}`;
      if (this.game.get(checkSquare)) {
        return undefined;
      }
    }
    else {
      return undefined;
    }

    return checkSquare;
  }

}