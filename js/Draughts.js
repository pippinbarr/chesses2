"use strict";


class Draughts extends BaseChess {

  constructor() {
    super();

    this.currentMove = {
      from: undefined,
      to: undefined,
      captureSquare: undefined
    }

    // Multijump position
    // this.game.load("k7/8/p7/1P6/8/3P4/8/K7 w - - 0 7");
    // this.board.position(this.game.fen(), false);

  }

  squareClicked(event) {
    console.log("SQUARE CLICKED...");
    // Find out the notation of the square and also the element representing the piece
    let square = $(event.currentTarget).attr('data-square');
    let piece = $(event.currentTarget).find(PIECE);
    let validPiece = (piece.length !== 0 && piece.attr('data-piece').indexOf(this.game.turn()) !== -1);

    if (this.from === null && validPiece) {
      console.log("SELECTING VALID PIECE");
      // We haven't selected a move yet + a piece of the correct colour was selected
      this.from = square;
      this.currentMove.from = square;
      let moves = this.getMoves(square);
      if (moves.length === 0) {
        $(`.square-${square} ${PIECE}`).effect('shake', {
          times: 1,
          distance: 2
        }, 50, () => {});
        this.from = null;
        this.currentMove.from = null;
        this.clearHighlights();
        return;
      }
      this.highlightMoves(moves);
    }
    else if (this.from !== null) {
      // We have already selected a square to move from (and thus a piece)
      if (validPiece) {
        console.log("SELECTING NEW VALID PIECE");
        // But now we're selecting another valid piece to move, so we should rehilight
        let moves = this.getMoves(square);
        if (moves.length === 0) {
          $(`.square-${square} ${PIECE}`).effect('shake', {
            times: 1,
            distance: 2
          }, 50, () => {});
          this.from = null;
          this.currentMove.from = null;
          this.clearHighlights();
          return;
        }
        else {
          this.from = square;
          this.currentMove.from = square;
        }
        this.highlightMoves(moves);
      }
      else if ($(event.currentTarget).hasClass('highlight1-32417')) {
        console.log("SELECTING HIGHLIGHTED SQUARE");
        let to = $(event.currentTarget).attr('data-square');
        this.currentMove.to = to;
        let captureSquare = $(event.currentTarget).data('captureSquare');
        if (captureSquare) {
          this.currentMove.captureSquare = captureSquare;
          to = captureSquare;
        }
        this.move(this.from, to);
      }
      else {
        console.log("NOT A VALID PIECE, NOT A HIGHLIGHTED SQUARE");
      }
    }
  }

  highlightMoves(moves) {
    this.clearHighlights();

    // exit if there are no moves available for this square
    if (moves.length === 0) return 0;

    moves.forEach(move => {
      let highlightSquare = move.to;

      if (move.flags.indexOf("c") >= 0) {
        // It's a capture, so we need to highlight the square to the other side
        highlightSquare = this.getNextSpace(move.from, move.to);
        // And the highlighted square needs to remember the actual move square!
        $(`.square-${highlightSquare}`).data('captureSquare', move.to);
      }
      this.highlight(highlightSquare);
    });

    return moves.length;
  }

  move(from, to) {
    // If it's a capture, handle our special case
    // This won't work for en passant. There are a lot of problems here man.
    if (this.game.get(to)) {
      this.game.remove(to);
      this.game.put(this.game.get(from), this.getNextSpace(from, to));
      this.game.remove(from);

      this.disableInput();

      // Clear all highlights from the board
      this.clearHighlights();

      // Update the board based on the new position
      this.board.position(this.game.fen(), true);

      setTimeout(() => {
        captureSFX.play();
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
          this.moveCompleted();
          this.flipTurn();
        }

      }, this.config.moveSpeed * 1.1);

    }
    else {
      // Otherwise do the usual
      super.move(from, to);
      this.currentMove.from = undefined;
      this.currentMove.to = undefined;
      this.currentMove.captureSquare = undefined;
    }
  }

  getMoves(square) {
    let moves = super.getMoves(square);

    // If there's no square specified, this is just wanting all possible moves
    if (square === undefined) return moves;

    // Select all captures that are adjacent and have a space to jump to
    let captures = this.getCaptures(moves, square);

    // If there are any captures, they're the only possible move
    if (captures.length > 0) return captures;

    // Select all non-captures
    let nonCaptures = this.getNonCaptures(moves, square);

    // Return the resulting total set
    return [...nonCaptures, ...captures];
  }

  getNonCaptures(moves, square) {
    return moves.filter(a => a.flags !== "c");
  }

  getCaptures(moves, square) {
    return moves.filter(a => {
      return a.flags.indexOf("c") >= 0 &&
        this.adjacent(square, a.to) &&
        this.getNextSpace(square, a.to);
    });
  }

  adjacent(from, to) {
    let rankFrom = parseInt(from[1]);
    let fileFrom = FILES.indexOf(from[0]);
    let rankTo = parseInt(to[1]);
    let fileTo = FILES.indexOf(to[0]);

    for (let i = rankFrom - 1; i <= rankFrom + 1; i++) {
      for (let j = fileFrom - 1; j <= fileFrom + 1; j++) {
        if (i === rankTo && j === fileTo) return true;
      }
    }

    return false;
  }

  getNextSpace(from, to) {
    // Get the difference in squares by rank and file
    let dRank = RANKS.indexOf(to[1]) - RANKS.indexOf(from[1]);
    let dFile = FILES.indexOf(to[0]) - FILES.indexOf(from[0]);

    // Establish the rank and file to check as a square
    let checkRank = RANKS[RANKS.indexOf(to[1]) + dRank];
    let checkFile = FILES[FILES.indexOf(to[0]) + dFile];

    let checkSquare = undefined;

    if (RANKS.indexOf(checkRank) !== -1 && FILES.indexOf(checkFile) !== -1) {
      checkSquare = `${checkFile}${checkRank}`;
      if (this.game.get(checkSquare)) {
        return undefined;
      }
    }
    else {
      return undefined;
    }

    return checkSquare;
  }

}