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

    if (this.game.game_over()) {
      this.save();
    }
  }

  save() {
    loadPixels();

    let lines = createImage(width, height);
    lines.loadPixels();
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        lines.set(i, j, get(i, j));
      }
    }

    lines.updatePixels();

    background(255);
    blend(lines, 0, 0, width, height, 0, 0, width, height, BLEND);

    saveCanvas();
  }

}