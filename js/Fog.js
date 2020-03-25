"use strict";

// Fog
//
// Chess with Fog of War
//
// See also:
// Dark Chess https://en.wikipedia.org/wiki/Dark_chess
// Fog of War Chess (William Lee Sims) https://www.chessvariants.com/other.dir/fog_of_war_chess.html
// Dark Chess https://store.steampowered.com/app/1151130/Dark_Chess/
//
// As in: this isn't an original idea.

class Fog extends BaseChess {

  constructor() {
    super();

    // Add a fog div to every square (we'll manipulate its opacity during play)
    $(SQUARE).append('<div class="fog"></div>');

    // Show the first instruction (for black to look away), which will also
    // listen for the click to start play
    this.showInstruction();
  }

  // Override moveCompleted so we can wait, then fade in the fog and switch the turn
  moveCompleted() {
    // Housekeeping
    this.from = null;
    // Check if the game is actually over!
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

      // If the game isn't over we want to show the results of the last move
      // in terms of updating the fog, so
      // Flip the turn back to the player who just played
      this.flipTurn();
      // Display the fog
      this.setupFog(false);
      // Flip the turn back to the correct player
      this.flipTurn();
      // Wait and then...
      setTimeout(() => {
        // Animate the fog to totally opaque so that nobody can see anything
        $.when($('.fog').animate({
            opacity: 1
          }, 1000))
          .then(() => {
            // And then show the instructions for the next turn
            this.showInstruction();
          });
      }, 2000);
    }

  }

  // Displays the instructions prior to the next turn, telling you who can look
  // at the board and who should look away
  showInstruction() {
    // Get the turn
    let turn = this.game.turn();
    // Note who is the color to play and who is "off"
    let color = turn === 'w' ? 'WHITE' : 'BLACK';
    let offColor = turn === 'w' ? 'BLACK' : 'WHITE';
    // Delay, then show our message describing the next turn instructions
    // including mobile-sensitive TAP/CLICK distinction!
    setTimeout(() => {
      $('#fog-message').text(`${color}'S TURN. ${offColor} LOOK AWAY. ${color} PLAYER ${MOBILE ? 'TAP' : 'CLICK'} HERE WHEN READY.`).slideDown();
      // They click/tap the message itself to trigger the next turn...
      $('#fog-message').one('click', () => {
        // Remove the message
        $('#fog-message').slideUp();
        // Display the correct fog for this turn
        this.setupFog(false);
        // I'm not sure what this is for to be honest?
        this.hideMessage();
        this.changeTurn();
      })
    }, 500);
  }

  // Override changeTurn so that it displays the current state of the fog before changing over
  // (The parent version is just changing the turn indicator and reenabling input)
  changeTurn() {
    this.setupFog(false);
    super.changeTurn();
  }

  // setupFog is the big one of course. It calculates the visibility of every square
  // on the board based on the current turn and the lines of sight of all the pieces.
  // The animate flag is there for when I was trying to animate the fog in, but it seemed
  // to lag so much I gave up
  setupFog() {
    // Add fog to every square (we'll adjust it as appropriate)
    $(`${SQUARE} .fog`).css('opacity', 1);
    // Remember whose turn it is
    const turn = this.game.turn();

    // Get all the moves for the current color
    const moves = this.game.moves({
      verbose: true
    });

    // Calculate fog for every destination square involved in any piece's move
    // i.e. you can see everywhere you can go (including capture squares)
    moves.forEach((move) => {
      this.see(move.to);
    });

    // Remember context (because we're going into a .each())
    let context = this;
    $(SQUARE).each(function() {
      // Get the current square's notation
      const square = $(this).data('square');
      // Get the piece on that square
      let piece = context.game.get(square);
      // If there is a piece
      if (piece) {
        // And it's of the current side
        if (piece.color === turn) {
          // Make the square the piece is on visible (even if it can't move)
          $(`.square-${square} .fog`).css('opacity', 0);
          // Go through every neighbour of the current piece's square
          const file = FILES.indexOf(square[0]);
          const rank = RANKS.indexOf(square[1]);
          for (let r = rank - 1; r <= rank + 1; r++) {
            for (let f = file - 1; f <= file + 1; f++) {
              // Get the notation
              let neighbour = `${FILES[f]}${RANKS[r]}`;
              // See it
              context.see(neighbour);
            }
          }
        }
      }
    });
  }

  // Override showResult to animate away the fog slowly at the end
  // in a beautiful and shocking reveal
  showResult(win, color) {
    super.showResult(win, color);
    $(`.fog`).animate({
      opacity: 0
    }, 5000);
  }

  // see() calculates the change in opacity of a square based on it having
  // been seen
  see(square) {
    let $square = $(`.square-${square}`);
    if ($square.length === 0) return;
    // Get the current opacity
    let opacity = parseFloat($square.children('.fog').css('opacity'));
    // Reduce it by our set amount
    opacity -= 0.2;
    // Don't allow negative opacity
    if (opacity < 0) opacity = 0;
    // Set the opacity to the new value
    $square.children('.fog').css('opacity', opacity);
  }

}