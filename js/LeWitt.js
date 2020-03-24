"use strict";

// LeWitt
//
// Chess that creates a Sol LeWitt-style "wall" drawing from the moves
// that are played by drawing lines between the start and end position
// for each piece that moves.

// A reference to the p5 canvas for LeWitt so we can show.hide it
let $p5Canvas;

class LeWitt extends BaseChess {

  constructor() {
    super();

    // We need to lay superimpose the p5 canvas onto the board
    // and resize it to the same size as the board
    $p5Canvas.detach().appendTo('#board');
    resizeCanvas($('#board').width(), $('#board').width());
    $p5Canvas.show();

    // Set up the scribble library and its parameters to create more
    // human-style drawings
    this.scribble = new Scribble();
    this.scribble.bowing = 1; // changes the bowing of lines
    this.scribble.roughness = 0.2; // changes the roughness of lines
    this.scribble.maxOffset = 4; // coordinates will get an offset, here you define the max offset
  }

  // Override move to draw the lines as moves are made
  move(from, to, silent) {
    // Carry out the move in the normal way
    super.move(from, to, silent);

    // Get the from and to square HTML elements
    let $from = $(`.square-${from}`);
    let $to = $(`.square-${to}`);

    // We need to know where the board is on the screen to offset our drawing
    // on the canvas
    let boardX = $('#board').offset().left;
    let boardY = $('#board').offset().top;

    // We also need to offset the drawing to the centre of the square
    let offset = $(SQUARE).width() / 2;

    // Calculate the from (x1,y1) and to (x2,y2) positions in pixels
    let x1 = $from.offset().left - boardX + offset; // - $from.parent().offset().left;
    let y1 = $from.offset().top - boardY + offset; // - $from.parent().offset().top;
    let x2 = $to.offset().left - boardX + offset; // - $from.parent().offset().left;
    let y2 = $to.offset().top - boardY + offset; // - $from.parent().offset().top;

    // Draw a line between the two locations using scribble
    stroke(0, 150);
    strokeWeight(2);
    this.scribble.scribbleLine(x1, y1, x2, y2);
  }

  // Override showResult to show the final drawing after a delay
  showResult(win, color) {
    super.showResult(win, color);
    if (this.game.game_over()) {
      setTimeout(() => {
        this.showDrawing();
      }, 1000);
    }
  }

  // Fades in a background so that you get to see just the drawing and not the chess board
  showDrawing() {
    // Create a white background and insert it under the canvas so we see a "drawing"
    let $bg = $("<div>")
      .css({
        width: $("#board").width(),
        height: $("#board").height(),
        backgroundColor: "white",
        zIndex: 50,
        position: "absolute",
        top: 0,
        left: 0,
        display: "none"
      })
      .appendTo("#board");
    // Fade it in
    $bg.fadeIn(2000);
  }

}

// p5 setup function
function setup() {
  // Set pixel density so we don't get funny behaviour from high-density screens
  pixelDensity(1);
  // Make our canvas (it'll be resized when it's actually attached to the board)
  createCanvas(640, 640);
  // Keep a reference to it
  $p5Canvas = $('canvas');
  // Hide it until the user starts the LeWitt game specifically
  $p5Canvas.hide();
}