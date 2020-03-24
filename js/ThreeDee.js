"use strict";

// 3D chess
//
// It just rotates the board in the 3D space of the document

class ThreeDee extends BaseChess {

  constructor() {
    // Create the chess
    super();

    // Use the transform property to rotate
    $('#board').css({
      transform: `rotate3d(1, 1, 0, 45deg)`
    });

    // And that's it buddy.
  }

}