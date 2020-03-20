"use strict";

class Fog extends BaseChess {

  constructor() {
    super();

    // CHECKMATE POSITION
    // this.game.load("2rnkbnr/4pppp/4pbpp/7q/8/3QPPPP/3RPPPP/2NBKBNR w - - 0 7");
    // this.board.position(this.game.fen(),false);

    // STALEMATE POSITION
    // this.game.load("5Rnk/7n/7R/8/8/8/7R/6QK w - - 0 7");
    // this.board.position(this.game.fen(),false);

    $(SQUARE).append('<div class="fog"></div>');

    let turn = this.game.turn();
    let color = turn === 'w' ? 'WHITE' : 'BLACK';
    let offColor = turn === 'w' ? 'BLACK' : 'WHITE';
    setTimeout(() => {
      $('#fog-message').text(`${color}'S TURN. ${offColor} LOOK AWAY. ${color} PLAYER CLICK HERE WHEN READY.`).slideDown();
      $('#fog-message').one('click', () => {
        $('#fog-message').slideUp();
        this.setupFog(false);
        this.hideMessage();
      })
    }, 500);


    // this.setupFog();
  }

  // Override move since that's the key moment samsara happens
  moveCompleted() {
    // super.moveCompleted();
    this.from = null;
    let moves = this.getMoves();
    if (moves.length === 0) {
      if (this.game.in_check()) {
        // CHECKMATE
        this.showResult(true, this.getTurn(false));
      }
      else {
        // STALEMATE
        this.showResult(false);
      }
    }
    else {
      if (this.gameOver) return;

      $('.fog').css('opacity', 1);
      this.flipTurn();
      this.setupFog(false);
      this.flipTurn();

      setTimeout(() => {
        $('.fog').animate({
          opacity: 1
        }, 1000, () => {
          let turn = this.game.turn();
          let color = turn === 'w' ? 'WHITE' : 'BLACK';
          let offColor = turn === 'w' ? 'BLACK' : 'WHITE';
          setTimeout(() => {
            $('#fog-message').text(`${color}'S TURN. ${offColor} LOOK AWAY. ${color} PLAYER CLICK HERE WHEN READY.`).slideDown();
            $('#fog-message').one('click', () => {
              $('#fog-message').slideUp();
              this.changeTurn();
              this.hideMessage();
            })
          }, 500);
        });
      }, 2000);
    }

  }

  changeTurn() {
    this.setupFog(false);
    super.changeTurn();
  }

  setupFog(animate) {
    // Add fog to every square (we'll adjust it as appropriate)
    if (!animate) $(`${SQUARE} .fog`).css('opacity', 1);

    if (animate) {
      $(SQUARE).each(function() {
        $(this).data('targetOpacity', 1);
      });
    }

    // Remember whose turn it is
    const turn = this.game.turn();

    // Get all the moves for the current color
    const moves = this.game.moves({
      verbose: true
    });

    // Remove fog from every square involved in any piece's move
    // (including start position)
    moves.forEach((move) => {
      this.see($(`.square-${move.to}`), animate);
    });

    let context = this;
    $(SQUARE).each(function() {
      // if (!$(this).hasClass('fog')) return;
      const square = $(this).data('square');
      let piece = $(this).children(PIECE)[0];
      if (piece !== undefined) {
        let pieceColor = $(piece).data('piece')[0];
        let pieceType = $(piece).data('piece')[1].toLowerCase();
        if (pieceColor === turn) {
          // Make the square the piece is on visible (even if it can't move)
          // $(`.square-${square}`).removeClass('fog');
          if (!animate) $(`.square-${square} .fog`).css('opacity', 0);
          if (animate) $(`.square-${square}`).data('targetOpacity', 0);
          // context.see($(`.square-${square} .fog`));

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
          context.see($(`.square-${up}`), animate);
          context.see($(`.square-${down}`), animate);
          context.see($(`.square-${left}`), animate);
          context.see($(`.square-${right}`), animate);
          context.see($(`.square-${upLeft}`), animate);
          context.see($(`.square-${upRight}`), animate);
          context.see($(`.square-${downLeft}`), animate);
          context.see($(`.square-${downRight}`), animate);

        }
      }
    });

    if (animate) {
      $(SQUARE).each(function() {
        $(this).children('.fog').animate({
          opacity: $(this).data('targetOpacity')
        }, 2000);
      })
    }
  }

  see(square, animate) {
    if (!animate) {
      let opacity = parseFloat(square.children('.fog').css('opacity'));
      opacity -= 0.2;
      square.children('.fog').css('opacity', opacity);
    }
    else {
      let opacity = $(square).data('targetOpacity');
      opacity -= 0.2;
      if (opacity < 0) opacity = 0;
      $(square).data('targetOpacity', opacity);
    }
  }

}