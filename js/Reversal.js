"use strict";

// Reversal
//
// After moving a piece it changes sides. White to black, black to white.

class Reversal extends BaseChess {

  constructor() {
    super();
  }

  // We override move() because this is the key moment to swap the color of the piece
  move(from, to) {
    // Get the move based on the parent move() function
    let move = super.move(from, to);
    // Animate the move on the board
    this.board.position(this.game.fen(), true);
    // After the animation completes...
    setTimeout(() => {
      // Replace the piece on the board with its equivalent in the opposite color
      this.game.put({
        type: move.piece,
        color: move.color === this.game.BLACK ? this.game.WHITE : this.game.BLACK
      }, to);
      // Update the board (instantly)
      this.board.position(this.game.fen(), false);
    }, this.config.moveSpeed);
  }

  // We also override moveCompleted because we need to handle moves the end in
  // one player checkmating themselves!
  moveCompleted() {
    // Housekeeping
    this.from = null;
    // Flip the turn back to the player who just moved (since we want to check
    // if they put themselves into check)
    this.flipTurn();
    // Find out it it's check...
    if (this.game.in_check()) {
      // If so we consider this checkmate and victory for the other side
      this.showResult(true, this.getTurn(false));
      this.gameOver = true;
      this.disableInput();
    }
    // Flip the turn back to the correct next player
    this.flipTurn();
    // And now check whether the game is over because THEY were checkmated or stalemated
    // as per the parent - get all moves and if there aren't any check which ending it is
    let moves = this.getMoves();
    if (moves.length === 0) {
      if (this.game.in_check()) {
        // Checkmate
        this.showResult(true, this.getTurn(false));
      }
      else {
        // Stalemate
        this.showResult(false);
      }
    }
    else {
      // If there are moves available, we play on
      if (this.gameOver) return;
      this.changeTurn();
      this.hideMessage();
    }
  }


}