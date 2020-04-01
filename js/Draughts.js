"use strict";

const MULTIJUMP_POSITION = "k7/8/p7/1P6/8/3P4/8/K7 w - - 0 7";
const KING_CAPTURES_PIECE_POSITION = "3k4/8/8/8/8/8/4p3/4K3 w - - 0 7";
const KING_CAPTURED_POSITION = "8/8/8/8/8/8/4k3/4K3 w - - 0 7";
const CASTLE_THROUGH_CHECK_POSITION = "rb2k2r/8/8/8/8/8/6r1/R3K2R w KQkq - 0 7";

// CHECK-RS
//
// The game that's hard to name because this idea has been done a fair few times
// already.
//
// I think the ruleset here is relatively unique (I can't find a repeated version)
// In essence all captures are checkers style, so you have to be adjacent and have
// to jump to a free space and can jump multiple times, and have to capture if you can.
// You win by capturing the opponent's king, unsurprisingly (no concept of checkmate).
// Knights can't capture because I just felt, philosophically, like it doesn't make
// sense because of the way they move - just as I ended up saying they had no
// momentum in momentum chess from Chesses.

class Draughts extends BaseChess {

  constructor() {
    super();

    // A special move object to track a couple of specific elements of a move
    // specific to this version (notably the weirdness of capturing a different
    // square to the one you're moving to, like en passant, as well as the nature
    // of castling)
    this.currentMove = {
      from: undefined,
      to: undefined,
      captureSquare: undefined, // To remember the square being captured
      castlingFlag: undefined, // To handle castling moves
    }

    // To track castling availability in the game manually
    // (Since we want to be able to castle "illegally" for one
    // thing, and also because we use game.put() to make our jumping
    // moves and that doesn't alter the castling flags in the engine.)
    this.castling = {
      w: {
        q: true,
        k: true,
      },
      b: {
        q: true,
        k: true
      }
    }
  }

  // Override squareClicked() because we need to show moves completely differently
  // in terms of highlighting and in terms of multiple jumps etc.
  squareClicked(event) {
    // Find out the notation of the square and also the element representing the piece
    let square = $(event.currentTarget).attr('data-square');
    let piece = this.game.get(square);

    // Check for a first click (no existing piece selected) on a valid piece to move
    if (this.from === null && piece && piece.color === this.game.turn()) {
      // Remember the square
      this.from = square;
      this.currentMove.from = square;

      // Get all possible moves from this square
      let moves = this.getMoves(square);

      // If there are no possible moves...
      if (moves.length === 0) {
        // Shake the piece
        $(`.square-${square} ${PIECE}`).effect('shake', {
          times: 1,
          distance: 2
        }, 50, () => {});

        // Reset the selection to nothing and clear any highlighted moves
        this.from = null;
        this.currentMove.from = null;
        this.clearHighlights();
      }
      else {
        // Otherwise, highlight the moves
        this.highlightMoves(moves);
      }
    }
    // Check for the case where a piece has been selected and they're clicking something else...
    else if (this.from !== null) {
      // Check if they clicked a different valid piece to move (and switch to it)
      if (piece && piece.color === this.game.turn()) {
        // Get the moves for this piece on this square
        let moves = this.getMoves(square);
        // If it can't move, shake it and reset
        if (moves.length === 0) {
          $(`.square-${square} ${PIECE}`).effect('shake', {
            times: 1,
            distance: 2
          }, 50, () => {});
          this.from = null;
          this.currentMove.from = null;
          this.clearHighlights();
        }
        // Otherwise this is our new from square and we highlight moves
        else {
          this.from = square;
          this.currentMove.from = square;
          this.highlightMoves(moves);
        }
      }
      // Finally, check if they've clicked on a highlighted square
      // in which case we want to perform the move
      else if ($(event.currentTarget).hasClass('highlight1-32417')) {
        // Get the destination square
        this.currentMove.to = $(event.currentTarget).attr('data-square');
        // Find out if there is data about capture squares or castling
        // associated with this destination
        let captureSquare = $(event.currentTarget).data('captureSquare');
        let castlingFlag = $(event.currentTarget).data('castlingFlag');
        // If there is, store it!
        if (captureSquare) {
          this.currentMove.captureSquare = captureSquare;
        }
        if (castlingFlag) {
          this.currentMove.castlingFlag = castlingFlag;
        }
        this.move(this.from, this.currentMove.to);
      }
      // Final case is an error
      else {
        console.error("NOT A VALID PIECE, NOT A HIGHLIGHTED SQUARE");
      }
    }
  }

  // Override moveCompleted() because we might need to have another jump
  // so we don't want it to reset everything or check results
  moveCompleted() {
    // Reset the from so we can
    this.from = null;

    if (this.gameOver) return;
    this.changeTurn();
    this.hideMessage();
  }

  // Override highlightMoves() because it needs to highlight capture squares
  // and handle castling highlights too.
  highlightMoves(moves) {
    // Clear all the highlights
    this.clearHighlights();

    // Exit if there are no moves available for this square
    if (moves.length === 0) return;

    // Go through every move
    moves.forEach(move => {
      // By default we want to highlight the "to" of the move, which would handle
      // standard moves
      let highlightSquare = move.to;
      // If it's a capturing move we need to highlight the destination not the capture
      if (this.isCapture(move)) {
        // So get the space "after" the capture square (linearly)
        highlightSquare = this.getNextSpace(move.from, move.to);
        // And the highlighted square needs to remember the actual move square!
        $(`.square-${highlightSquare}`).data('captureSquare', move.to);
        // And then we need a stupid special case for en passant
        if (move.flags.indexOf("e") >= 0) {
          let dy = RANKS.indexOf(move.to[1]) - RANKS.indexOf(move.from[1]);
          let captureRank = RANKS.indexOf(parseInt(move.to[1]) - dy);
          let captureFile = FILES.indexOf(move.to[0]);
          let captureSquare = `${FILES[captureFile]}${RANKS[captureRank]}`;
          $(`.square-${highlightSquare}`).data('captureSquare', captureSquare);
        }
      }
      // Also we need to remember the castling flag if that's the move
      if (move.flags.indexOf('k') >= 0) {
        $(`.square-${highlightSquare}`).data('castlingFlag', 'k');
      }
      if (move.flags.indexOf('q') >= 0) {
        $(`.square-${highlightSquare}`).data('castlingFlag', 'q');
      }
      // Finally we can highlight the actual destination
      this.highlight(highlightSquare);
    });
  }

  // Override move() because we have to handle castling ourselves (because
  // we need to be able to castle through what would be check) and for the
  // capturing moves as well. It's a nightmare
  move(from, to) {
    // Here is a bunch fo castling logic if there's a castling flag...
    if (this.currentMove.castlingFlag) {
      this.castlingMove(from, to);
    }
    // If it's a capture, handle our special case
    // This won't work for en passant. There are a lot of problems here man.
    else if (this.currentMove.captureSquare) {
      this.capturingMove(from, to);
    }
    else {
      // Handle disabling castling in case they moved a piece that breaks it
      this.handleDisableCastling(from, to);
      // Then do the usual
      super.move(from, to);
      // And also reset our special move data
      this.currentMove.from = undefined;
      this.currentMove.to = undefined;
      this.currentMove.captureSquare = undefined;
    }
  }

  // Carry out a castling move manually
  castlingMove(from, to) {
    // Remember the from piece (it's a king)
    let fromPiece = this.game.get(from);
    // Remove the king
    this.game.remove(from);
    // Place the king in the destination square
    this.game.put(fromPiece, to);
    // Now we need to position the rook correctly
    let turn = this.game.turn();
    let backRank = turn === this.game.WHITE ? 1 : 8;
    // Handle kingside
    if (this.currentMove.castlingFlag === 'k') {
      // Remove the existing rook
      this.game.remove(`h${backRank}`);
      // Put it in its castled position
      this.game.put({
        type: 'r',
        color: turn
      }, `f${backRank}`);
    }
    // Handle queenside
    else if (this.currentMove.castlingFlag === 'q') {
      // Remove the existing rook
      this.game.remove(`a${backRank}`);
      // Put it in its castled position
      this.game.put({
        type: 'r',
        color: turn
      }, `d${backRank}`);
    }
    this.castling[turn] = undefined;

    // Now handle end of turn stuff like disabling input
    this.disableInput();

    // Clear all highlights from the board
    this.clearHighlights();

    // Update the board based on the new position
    this.board.position(this.game.fen(), true);
    setTimeout(() => {
      // Now we need to check only for captures and offer them
      this.currentMove.from = undefined;
      this.currentMove.to = undefined;
      this.currentMove.captureSquare = undefined;
      this.currentMove.castlingFlag = undefined;
      this.flipTurn();
      this.moveCompleted();
      placeSFX.play();
    }, this.config.moveSpeed * 1.1);
  }

  // Carry out a capturing move (manually because of the jumping element as well
  // as the need to then offer further captures if available)
  capturingMove(from, to) {
    this.handleDisableCastling(from, to);
    // console.log("HANDLING CAPTURE MOVE")
    let fromPiece = this.game.get(from);
    let capturedPiece = this.game.get(this.currentMove.captureSquare);
    this.game.remove(this.currentMove.from);

    let putResult = this.game.put(fromPiece, this.currentMove.to);
    this.game.remove(this.currentMove.captureSquare);

    this.disableInput();

    // Clear all highlights from the board
    this.clearHighlights();

    // Update the board based on the new position
    this.board.position(this.game.fen(), true);

    setTimeout(() => {
      captureSFX.play();

      let fenArray = this.game.fen().split(' ');
      if (fenArray[0].indexOf('k') < 0 || fenArray[0].indexOf('K') < 0) {
        this.showResult(true, fromPiece.color);
        return;
      }

      // Now we need to check only for captures and offer them
      let captures = this.getCaptures(super.getMoves(this.currentMove.to), this.currentMove.to);
      if (captures.length > 0) {
        // If there are captures, we need to make the next one
        this.highlightMoves(captures);
        this.enableInput();
        this.from = this.currentMove.to;
        this.currentMove.from = this.currentMove.to;
        this.currentMove.to = undefined;
        this.currentMove.captureSquare = undefined;
      }
      else {
        this.currentMove.from = undefined;
        this.currentMove.to = undefined;
        this.currentMove.captureSquare = undefined;
        this.flipTurn();
        this.moveCompleted();
      }

    }, this.config.moveSpeed * 1.1);
  }

  // handleDisableCastling() checks whether you moved your king or one of your
  // rooks and disabled castling flags appropriately
  handleDisableCastling(from, to) {
    // Get the piece moved
    let piece = this.game.get(from);
    // Get the turn
    let turn = this.game.turn();
    // Remember what the back rank is
    let backRank = turn === this.game.WHITE ? 1 : 8;

    // If the current side can potentially castle
    if (this.castling[turn] && piece.color === turn) {
      // If they moved their king, no castling is allowed now
      if (from === `e${backRank}` && piece.type === this.game.KING) {
        this.castling[turn] = undefined;
      }
      // If they moved their h rook, no kingside castling
      if (from === `h${backRank}` && piece.type === this.game.ROOK) {
        this.castling[turn].k = false;
      }
      // If they moved their a rook, no queenside castling
      if (from === `a${backRank}` && piece.type === this.game.ROOK) {
        this.castling[turn].q = false;
      }
    }
  }

  // Override getMoves because we need illegal moves around check (since there's no check
  // in this game at all as you can capture the king). We also want to filter captures
  // and castling moves.
  getMoves(square) {
    // We want illegal moves too so we can move into check
    let options = {
      verbose: true,
      legal: false
    }
    // If there's a square then go with it
    if (square) options.square = square;
    // Get the moves
    let moves = this.game.moves(options);
    // If there's no square specified, this is just wanting all possible moves
    if (square === undefined) return moves;
    // If there are no moves, exit returning the (no) moves
    if (moves.length === 0) return moves;
    // We want to get an array of all capturing moves excluding the knight
    let captures = [];
    // We can't capture with a knight
    if (this.game.get(square).type !== 'n') {
      // Select all captures that are adjacent and have a space to jump to
      captures = this.getCaptures(moves, square);
    }
    // If there are any captures, they're the only possible move
    if (captures.length > 0) return captures;
    // Otherwise..
    // Select all non-captures
    let nonCaptures = this.getNonCaptures(moves, square);
    // Select all castling moves
    let castling = this.getCastling(square);
    // Return the resulting total set
    return [...nonCaptures, ...captures, ...castling];
  }

  // Filter the array for non-capturing and non-castling moves
  getNonCaptures(moves, square) {
    return moves.filter(a => !this.isCapture(a) && !this.isCastling(a));
  }

  // Filter the array for moves that can capture another piece that is
  // adjacent to the square and has a free space behind it
  getCaptures(moves, square) {
    return moves.filter(a => {
      return this.isCapture(a) &&
        this.adjacent(square, a.to) &&
        this.getNextSpace(square, a.to);
    });
  }

  // Manually figure out if this square includes castling moves
  getCastling(square) {
    // Get the turn and the piece
    let turn = this.game.turn();
    let piece = this.game.get(square);
    let backRank = turn === this.game.WHITE ? 1 : 8;
    // We'll store possible castling moves
    let moves = [];

    // Make sure we can castle and we're moving the right colored king from the king's square
    if (this.castling[turn] &&
      piece.type === this.game.KING &&
      piece.color === turn &&
      square === `e${backRank}`) {
      // Check for possible kingside castling and free square between king and kingside rook
      if (this.castling[turn].k &&
        !this.game.get(`f${backRank}`) &&
        !this.game.get(`g${backRank}`)) {
        // Can castle kingside
        moves.push({
          from: `e${backRank}`,
          to: `g${backRank}`,
          flags: 'k'
        });
      }
      // Check for possible queenside castling and free square between king and queenside rook
      if (this.castling[turn].q &&
        !this.game.get(`d${backRank}`) &&
        !this.game.get(`c${backRank}`) &&
        !this.game.get(`b${backRank}`)) {
        // Can castle queenside
        moves.push({
          from: `e${backRank}`,
          to: `c${backRank}`,
          flags: 'q'
        });
      }
    }
    return moves;
  }

  // Checks if from and to are adjacent on the board
  adjacent(from, to) {
    // Convert squares to numbers
    let rankFrom = parseInt(from[1]);
    let fileFrom = FILES.indexOf(from[0]);
    let rankTo = parseInt(to[1]);
    let fileTo = FILES.indexOf(to[0]);

    // Go through all possible neighbours and check for adjacency
    for (let i = rankFrom - 1; i <= rankFrom + 1; i++) {
      for (let j = fileFrom - 1; j <= fileFrom + 1; j++) {
        if (i === rankTo && j === fileTo) return true;
      }
    }
    // If we made it through the loops without returning, it's not adjacent
    return false;
  }

  // Calculates the linearly next square "behind" to if you're coming from from
  getNextSpace(from, to) {
    // Get the difference in squares by rank and file
    let dRank = RANKS.indexOf(to[1]) - RANKS.indexOf(from[1]);
    let dFile = FILES.indexOf(to[0]) - FILES.indexOf(from[0]);

    // Establish the rank and file to check as a square
    let checkRank = RANKS[RANKS.indexOf(to[1]) + dRank];
    let checkFile = FILES[FILES.indexOf(to[0]) + dFile];

    // Start as undefined
    let nextSquare = undefined;

    // Make sure we're checking a valid square
    if (RANKS.indexOf(checkRank) !== -1 && FILES.indexOf(checkFile) !== -1) {
      // Get the notation
      nextSquare = `${checkFile}${checkRank}`;
      // If there's a piece on this square, it's not free
      if (this.game.get(nextSquare)) {
        return undefined;
      }
    }
    // If it's not a valid square it's not free
    else {
      return undefined;
    }
    // If we made it here, next square is free
    return nextSquare;
  }

  // Checks capture flags (c for capture, e for en passant)
  isCapture(move) {
    return (move.flags.indexOf("c") >= 0 || move.flags.indexOf("e") >= 0);
  }

  // Checks castling flags (k for kingside, q for queenside)
  isCastling(move) {
    return (move.flags.indexOf('k') >= 0 || move.flags.indexOf('q') >= 0);
  }

}