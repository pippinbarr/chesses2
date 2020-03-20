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
    this.volumes = {
      p: 1 / 10,
      n: 3 / 10,
      b: 3 / 10,
      r: 5 / 10,
      q: 9 / 10,
      k: 10 / 10
    };

    this.frequencies = [
      220, 277.18, 329.63, 440, 554.37, 659.25, 880, 1108.73
    ];

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
        type: 'sine',
        frequency: 0,
        attack: 0.1,
        release: 0.1
      }
    });

    this.rank = 7;
    this.file = 0;

    this.playInterval = setInterval(() => {
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
        this.whiteSynth.frequency = this.frequencies[this.file];
        this.whiteSynth.volume = this.volumes[piece.type];
        this.whiteSynth.play();
      }
      else {
        this.blackSynth.frequency = this.frequencies[this.file];
        this.blackSynth.volume = this.volumes[piece.type];
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