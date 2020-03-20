"use strict";


class LeWitt extends BaseChess {

  constructor() {
    super();

    $p5Canvas.detach().appendTo('#board');
    resizeCanvas($('#board').width(), $('#board').width());
    $p5Canvas.show();

    this.scribble = new Scribble();
    this.scribble.bowing = 1; // changes the bowing of lines
    this.scribble.roughness = 0.2; // changes the roughness of lines
    this.scribble.maxOffset = 4; // coordinates will get an offset, here you define the max offset

  }

  move(from, to, silent) {
    super.move(from, to, silent);

    let turn = this.game.turn();

    let $from = $(`.square-${from}`);
    let $to = $(`.square-${to}`);

    let boardX = $('#board').offset().left;
    let boardY = $('#board').offset().top;

    let offset = $(SQUARE).width() / 2;

    console.log(boardX, boardY);

    let x1 = $from.offset().left - boardX + offset; // - $from.parent().offset().left;
    let y1 = $from.offset().top - boardY + offset; // - $from.parent().offset().top;
    let x2 = $to.offset().left - boardX + offset; // - $from.parent().offset().left;
    let y2 = $to.offset().top - boardY + offset; // - $from.parent().offset().top;
    console.log(x1, y1, x2, y2);
    stroke(0, 150);
    strokeWeight(2);
    this.scribble.scribbleLine(x1, y1, x2, y2);
  }

  showResult(win, color) {
    super.showResult(win, color);
    if (this.game.game_over()) {
      this.showDrawing();
    }
  }

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
        left: 0
      })
      .appendTo("#board");
  }

}

// For LeWitt's p5 canvas
function setup() {
  pixelDensity(1);
  createCanvas(640, 640);
  $p5Canvas = $('canvas');
  // $p5Canvas.detach();
  $p5Canvas.hide();
}