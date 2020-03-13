"use strict";


class Musical extends BaseChess {

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

    this.MUSIC_INTERVAL = 500;
    this.synths = [];
    let frequencies = [
      220, 246.94, 277.18, 293.66, 329.63, 369.99, 415.30
    ];
    this.drums = {
      p: new Audio("assets/sounds/808/BD10.WAV"),
      n: new Audio("assets/sounds/808/CLHAT2.WAV"),
      b: new Audio("assets/sounds/808/OPHAT2.WAV"),
      r: new Audio("assets/sounds/808/SD05.WAV"),
      q: new Audio("assets/sounds/808/CLAPS.WAV"),
      k: new Audio("assets/sounds/808/CLAVES.WAV")
    };

    for (let i = 0; i < 8; i++) {
      this.synths.push(new Pizzicato.Sound({
        source: 'wave',
        options: {
          frequency: frequencies[i],
          attack: 0.1,
          release: 0.1
        }
      }));
    }
    this.files = "abcedefgh";
    this.file = 0;

    setInterval(() => {
      this.play();
    }, this.MUSIC_INTERVAL);
  }

  play() {
    let $squares = $(`div[class*="square-${this.files[this.file]}"] img`);
    let context = this;
    $squares.each(function() {
      // DRUM VERSION
      let piece = $(this).data('piece')[1].toLowerCase();
      context.drums[piece].currentTime = 0;
      context.drums[piece].play();

      // SYNTH VERSION
      // let rank = parseInt($(this).parent().data("square")[1]);
      // let synth = context.synths[rank - 1];
      // synth.play();
      // setTimeout(() => {
      // synth.stop();
      // }, context.MUSIC_INTERVAL / 2 - synth.release * 1000);
    });
    this.file = (this.file + 1) % this.files.length;
  }
}