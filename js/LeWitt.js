"use strict";


class LeWitt extends BaseChess {

  constructor() {
    super();

    $p5Canvas.detach().appendTo('#board');
    resizeCanvas($('#board').width(), $('#board').width());
    $p5Canvas.show();

  }

  move(from, to, silent) {
    super.move(from, to, silent);

    let turn = this.game.turn();

    let $from = $(`.square-${from}`);
    let $to = $(`.square-${to}`);

    let boardX = $('#board').offset().left;
    let boardY = $('#board').offset().top;

    let offset = $(SQUARE).width() / 2 + (turn === 'w' ? -2 : 2);

    console.log(boardX, boardY);

    let x1 = $from.offset().left - boardX + offset; // - $from.parent().offset().left;
    let y1 = $from.offset().top - boardY + offset; // - $from.parent().offset().top;
    let x2 = $to.offset().left - boardX + offset; // - $from.parent().offset().left;
    let y2 = $to.offset().top - boardY + offset; // - $from.parent().offset().top;
    console.log(x1, y1, x2, y2);
    strokeWeight(3);
    line(x1, y1, x2, y2);
  }

}