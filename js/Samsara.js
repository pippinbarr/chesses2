"use strict";

// Samsara
//
// When moved, each pieces moves through the great cycle of being
// from pawn to knight to bishop to rook to queen to pawn, and on.

class Samsara extends BaseChess {

  constructor() {
    super();

    // The samsara sequence, from pawn to knight to bishop etc.
    this.sequence = ['p', 'n', 'b', 'r', 'q'];
  }

  // We override the move method since that's the key moment samsara happens
  move(from, to) {
    // Get the move based on the parent move() function
    let move = super.move(from, to);
    // Animate the move
    this.board.position(this.game.fen(), true);
    // After the animation is completed...
    setTimeout(() => {
      // If it's a king, do nothing (we don't cycle the kings because it would break the game)
      if (move.piece == 'k') return;
      // Get the next piece index in the sequence for this piece
      // cycle back through to 0 as needed
      let nextIndex = (this.sequence.indexOf(move.piece) + 1) % this.sequence.length;
      // Get the next piece symbol from the sequence
      let reincarnation = this.sequence[nextIndex];
      // Swap out the piece for its reincarnation
      this.game.put({
        type: reincarnation,
        color: move.color
      }, to);
      // Set the board instantly to swap in this piece visually
      // since animating doesn't really make sense?
      this.board.position(this.game.fen(), false);
    }, this.config.moveSpeed);
  }

}