"use strict";

const SQUARE = ".square-55d63";
const PIECE = ".piece-417db";

class Fog extends BaseChess {

  constructor() {
    super();

    // CHECKMATE POSITION
    // this.game.load("2rnkbnr/4pppp/4pbpp/7q/8/3QPPPP/3RPPPP/2NBKBNR w - - 0 7");
    // this.board.position(this.game.fen(),false);

    // STALEMATE POSITION
    // this.game.load("5Rnk/7n/7R/8/8/8/7R/6QK w - - 0 7");
    // this.board.position(this.game.fen(),false);

    this.setupFog();
  }

  // Override move since that's the key moment samsara happens
  moveCompleted() {
    super.moveCompleted();
    this.setupFog();
  }

  setupFog() {
    // Add fog to every square
    $(SQUARE).addClass('fog');

    // Remember whose turn it is
    const turn = this.game.turn();
    // Get all the moves for the current color
    const moves = this.game.moves({
      verbose: true
    });
    moves.forEach((move) => {
      $(`.square-${move.from}`).removeClass('fog');
      $(`.square-${move.to}`).removeClass('fog');
    });

    $(PIECE).each(function() {
      const color = $(this).data('piece')[0];
      const type = $(this).data('piece')[1].toLowerCase();
      const square = $(this).data('square');
      if (color === turn) {
        $(this).parent().removeClass('fog');
      }
    });


    $('.fog').children(PIECE).hide();


  }

}


let vowels = ['a', 'e', 'i', 'o', 'u'];

let teaName = "Assam";
let firstLetter = teaName.charAt(0).toLowerCase();

let article = "a";
if ("aeiou".split().includes(firstLetter)) {
  article = "an";
}