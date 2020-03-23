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

    this.MUSIC_INTERVAL = 1000;
    this.whiteSynths = [];
    this.blackSynths = [];
    let whiteFrequencies = [
      // Amaj ACE chord
      220, 261.63, 329.63, 440, 523.25, 659.25, 880, 1046.50
    ];
    let blackFrequencies = [
      //Amag FAC chord
      174.61, 220, 261.63, 349.23, 440, 523.25, 698.46, 880, 1046.50
    ];

    for (let i = 0; i < 8; i++) {
      this.whiteSynths.push(new Pizzicato.Sound({
        source: 'wave',
        options: {
          frequency: whiteFrequencies[i],
          attack: 0.4,
          release: 0.4
        }
      }));

      this.blackSynths.push(new Pizzicato.Sound({
        source: 'wave',
        options: {
          frequency: blackFrequencies[i],
          attack: 0.4,
          release: 0.4
        }
      }));
    }
    this.file = 0;

    setInterval(() => {
      this.play();
    }, this.MUSIC_INTERVAL);
  }

  play() {
    let $squares = $(`div[class*="square-${FILES[this.file]}"]`);
    let context = this;
    $squares.each(function() {
      let square = $(this).data('square');
      let piece = context.game.get(square);
      if (piece && context.game.turn() === piece.color) {
        let rank = RANKS.indexOf(square[1]);
        let synth = piece.color === 'w' ? context.whiteSynths[rank] : context.blackSynths[7 - rank];
        console.log(synth.frequency);
        synth.play();
        setTimeout(() => {
          synth.stop();
        }, context.MUSIC_INTERVAL / 2 - synth.release * 1000);
      }
    });
    this.file = (this.file + 1) % FILES.length;
  }
}