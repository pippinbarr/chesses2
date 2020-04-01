"use strict";

// Musical Chess
//
// Treats the board as a tone matrix played left to right.
// Ranks represent specific notes from a chord repeated up octaves.
// Black and white play separately when it's their turn, with only
// their pieces counting as notes in the tone matrix.
// White plays an ACE chord
// Black plays an FAC chord

class Musical extends BaseChess {

  constructor() {
    super();

    // How often to play a note (by file)
    this.MUSIC_INTERVAL = 1000;
    // The file to play next (file as in chess)
    this.file = 0;

    // We have one synth per color per rank, so we use arrays
    this.whiteSynths = [];
    this.blackSynths = [];
    // The frequencies for either side are represented in Hz for each
    // rank, with 0 being the player's back rank and so on.
    const whiteFrequencies = [
      // Amaj ACE chord
      220, 261.63, 329.63, 440, 523.25, 659.25, 880, 1046.50
    ];
    const blackFrequencies = [
      //Amaj FAC chord
      174.61, 220, 261.63, 349.23, 440, 523.25, 698.46, 880, 1046.50
    ];

    // Loop through the frequencies and create synths set to each frequency
    // (We need multiple synths to play multiple notes at the same time)
    for (let i = 0; i < 8; i++) {
      // Add synths with the appropriate frequency
      this.whiteSynths.push(this.createSynth(whiteFrequencies[i]));
      this.blackSynths.push(this.createSynth(blackFrequencies[i]));
    }

    // Add a div to all squares that can display whether that square is being played
    $(SQUARE).append('<div class="note-playing"></div>');

    // Create the turn indicator by adding a border to the top and bottom
    // ranks that we can switch the color of between black and yellow
    for (let i = 0; i < 8; i++) {
      $(`.square-${FILES[i]}1`).addClass('w-file-not-playing');
      $(`.square-${FILES[i]}8`).addClass('b-file-not-playing');
    }
    $(`.square-a1`).addClass('white-file-playing');

    // Start playing our music as an interval
    this.playInterval = setInterval(() => {
      this.play();
    }, this.MUSIC_INTERVAL);
  }

  // Creates a new synth object at the specified frequency
  createSynth(frequency) {
    return new Pizzicato.Sound({
      source: 'wave',
      options: {
        frequency: frequency,
        attack: 0.4,
        release: 0.4
      }
    })
  }

  // Plays the notes for the current file and turn
  play() {
    let turn = this.game.turn();
    // Get the current file
    let file = FILES[this.file];
    // Get all squares in the current file using a resgular expression on the CSS
    let $squares = $(`div[class*="square-${file}"]`);
    // Remove any indicators
    $(SQUARE).removeClass('w-file-playing');
    $(SQUARE).removeClass('b-file-playing');
    // Add the appropriate turn indicator
    $(`.square-${file}${turn === this.game.WHITE ? 1 : 8}`)
      .addClass(`${turn}-file-playing`);

    // Go through every rank for the current file...
    for (let rank = 1; rank <= 8; rank++) {
      let square = `${file}${rank}`;
      // Get the piece on the square (if any)
      let piece = this.game.get(square);
      // If there's a piece of the current turn's color, we need to play it
      if (piece && turn === piece.color) {
        // Add the indicator to the square
        $(`.square-${square} .note-playing`).show();
        // Get the correct synth based on color
        let synth = piece.color === this.game.WHITE ? this.whiteSynths[rank] : this.blackSynths[8 - rank];
        // Play it
        synth.play();
        // Stop the synth after an interval (and remove the indicator)
        setTimeout(() => {
          synth.stop();
          setTimeout(() => {
            $('.note-playing').hide();
          }, this.MUSIC_INTERVAL / 2 - synth.release * 1000);
        }, this.MUSIC_INTERVAL / 2 - synth.release * 1000);
      }
    };
    // Having played all the notes for this step, move to the next file for the next one
    this.file = (this.file + 1) % FILES.length;
  }

  // Override changeTurn() so we only display our file indicator as the turn indicator
  changeTurn() {
    if (this.gameOver) return;
    setTimeout(() => {
      this.enableInput();
      this.from = null;
    }, 250);
  }

  // When quitting this game we need to stop the music from playing
  quit() {
    console.log("Quit.");
    clearInterval(this.playInterval);
  }
}