"use strict";

const SQUARE = ".square-55d63";
const PIECE = ".piece-417db";
const RANKS = "abcdefgh";

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
    // Add fog to every square (we'll remove it as appropriate)
    $(SQUARE).addClass('fog');

    // Remember whose turn it is
    const turn = this.game.turn();

    // Get all the moves for the current color
    const moves = this.game.moves({
      verbose: true
    });

    // Remove fog from every square involved in any piece's move
    // (including start position)
    moves.forEach((move) => {
      $(`.square-${move.to}`).removeClass('fog');
    });

    $(SQUARE).each(function() {
      if (!$(this).hasClass('fog')) return;
      const square = $(this).data('square');
      let piece = $(this).children(PIECE)[0];
      if (piece !== undefined) {
        let pieceColor = $(piece).data('piece')[0];
        let pieceType = $(piece).data('piece')[1].toLowerCase();
        if (pieceColor === turn) {
          // Make the square the piece is on visible (even if it can't move)
          $(`.square-${square}`).removeClass('fog');
          // Make the squares around the piece visible
          const rank = square[0];
          const file = parseInt(square[1]);
          const up = `${rank}${file+1}`;
          const upLeft = `${RANKS[RANKS.indexOf(rank)-1]}${file+1}`;
          const upRight = `${RANKS[RANKS.indexOf(rank)+1]}${file+1}`;
          const down = `${rank}${file-1}`;
          const downLeft = `${RANKS[RANKS.indexOf(rank)-1]}${file-1}`;
          const downRight = `${RANKS[RANKS.indexOf(rank)+1]}${file-1}`;
          const left = `${RANKS[RANKS.indexOf(rank)-1]}${file}`;
          const right = `${RANKS[RANKS.indexOf(rank)+1]}${file}`;
          $(`.square-${up}`).removeClass('fog');
          $(`.square-${down}`).removeClass('fog');
          $(`.square-${left}`).removeClass('fog');
          $(`.square-${right}`).removeClass('fog');
          $(`.square-${upLeft}`).removeClass('fog');
          $(`.square-${upRight}`).removeClass('fog');
          $(`.square-${downLeft}`).removeClass('fog');
          $(`.square-${downRight}`).removeClass('fog');

        }
      }
    });

    // Remove fog from the square immediately on all sides of every piece
    // (two square for pawns on the first rank if there's space?)
    // $(PIECE).each(function() {
    //   const color = $(this).data('piece')[0];
    //   if (color !== turn) return;
    //   const type = $(this).data('piece')[1].toLowerCase();
    //   const square = $(this).parent().data('square');
    //   const rank = square[0];
    //   const file = square[1];
    //
    //   $(`.square-${rank}${file+1}`).removeClass('fog');
    //
    //
    // });


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