"use strict";

// Cross-Reality (XR) Chess
//
// Displays an empty board for the user to play on with physical pieces.

class XR extends BaseChess {

  constructor() {
    super();

    // We start with an empty position because the user it asked
    // to bring their own physical pieces and play on top of their
    // screen. Ha ha.
    this.game.load("8/8/8/8/8/8/8/8 w - - 0 7");
    this.board.position(this.game.fen(), false);
  }

}