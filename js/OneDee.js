"use strict";


class OneDee extends BaseChess {

  constructor() {
    super();

    // EMPTY POSITION
    // this.game.load("8/8/8/8/8/8/8/8 w - - 0 7");
    // this.board.position(this.game.fen(), false);

    // CHECKMATE POSITION
    // this.game.load("2rnkbnr/4pppp/4pbpp/7q/8/3QPPPP/3RPPPP/2NBKBNR w - - 0 7");
    // this.board.position(this.game.fen(),false);

    // STALEMATE POSITION
    // this.game.load("5Rnk/7n/7R/8/8/8/7R/6QK w - - 0 7");
    // this.board.position(this.game.fen(),false);

    // ONEDEE POSITION
    this.game.load("4k3/4p3/8/8/8/8/4P3/4K3 w - - 0 7");
    this.board.position(this.game.fen(), false);

    for (let i = 1; i <= 8; i++) {
      $(`.square-a${i}`).hide();
      $(`.square-b${i}`).hide();
      $(`.square-c${i}`).hide();
      $(`.square-d${i}`).hide();
      $(`.square-f${i}`).hide();
      $(`.square-g${i}`).hide();
      $(`.square-h${i}`).hide();
    }

    $('#board').css({
      margin: '0 auto'
    })

  }

}