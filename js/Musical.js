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

    this.MUSIC_INTERVAL = 100;
    this.synths = [];
    this.frequencies = {
      p: 220,
      n: 246.94,
      b: 277.18,
      r: 293.66,
      q: 329.63,
      k: 369.99
    };

    this.whiteSynth = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'sine',
        frequency: 0,
        attack: 0.1,
        release: 0.1
      }
    });

    this.blackSynth = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'square',
        frequency: 0,
        attack: 0.1,
        release: 0.1
      }
    });

    this.rank = 7;
    this.file = 0;

    setInterval(() => {
      this.play();
    }, this.MUSIC_INTERVAL);
  }

  play() {
    $(SQUARE).removeClass('note');

    this.whiteSynth.stop();
    this.blackSynth.stop();

    let square = `${FILES[this.file]}${RANKS[this.rank]}`;
    let piece = this.game.get(square);
    if (piece) {
      if (piece.color === 'w') {
        this.whiteSynth.frequency = this.frequencies[piece.type];
        this.whiteSynth.play();
      }
      else {
        this.blackSynth.frequency = this.frequencies[piece.type];
        this.blackSynth.play();
      }
    }

    $(`.square-${square}`).addClass('note');

    this.file = (this.file + 1) % FILES.length;
    if (this.file === 0) {
      this.rank--;
      if (this.rank < 0) {
        this.rank = 7;
        this.file = 0;
      }
    }
  }
}