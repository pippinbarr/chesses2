"use strict";


class Samsara extends BaseChess {

  constructor() {
    super();

    // The samsara sequence, from pawn to knight to bishop etc.
    this.sequence = ['p', 'n', 'b', 'r', 'q'];

    // CHECKMATE POSITION
    // this.game.load("2rnkbnr/4pppp/4pbpp/7q/8/3QPPPP/3RPPPP/2NBKBNR w - - 0 7");
    // this.board.position(this.game.fen(),false);

    // STALEMATE POSITION
    // this.game.load("5Rnk/7n/7R/8/8/8/7R/6QK w - - 0 7");
    // this.board.position(this.game.fen(),false);
  }

  // Override move since that's the key moment samsara happens
  move(from, to) {
    // Get the move
    let move = super.move(from, to);
    // Animate the move
    this.board.position(this.game.fen(), true);
    // After the animation is completed...
    setTimeout(() => {
      // If it's a king, do nothing (we don't cycle the kings)
      if (move.piece == 'k') return;
      // Get the next piece index in the sequence for this piece
      let nextIndex = (this.sequence.indexOf(move.piece) + 1) % this.sequence.length;
      // Get the next piece symbol from the sequence
      let reincarnation = this.sequence[nextIndex];
      // Swap out the piece for its reincarnation
      this.game.put({
        type: reincarnation,
        color: move.color
      }, to);
      // Set the board instantly to swap in this piece visually
      this.board.position(this.game.fen(), false);
    }, this.config.moveSpeed);
  }

}