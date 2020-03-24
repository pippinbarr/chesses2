"use strict";


class Draughts extends BaseChess {

  constructor() {
    super();

    this.currentMove = {
      from: undefined,
      to: undefined,
      captureSquare: undefined,
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

    // Multijump position
    // this.game.load("k7/8/p7/1P6/8/3P4/8/K7 w - - 0 7");
    // this.board.position(this.game.fen(), false);

    // King capture piece position
    // this.game.load("3k4/8/8/8/8/8/4p3/4K3 w - - 0 7");
    // this.board.position(this.game.fen(), false);

    // King captured position
    // this.game.load("8/8/8/8/8/8/4k3/4K3 w - - 0 7");
    // this.board.position(this.game.fen(), false);

    // Castle through check
    // this.game.load("rb2k2r/8/8/8/8/8/6r1/R3K2R w KQkq - 0 7");
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
        let castlingFlag = $(event.currentTarget).data('castlingFlag');
        if (captureSquare) {
          this.currentMove.captureSquare = captureSquare;
          to = captureSquare;
        }
        if (castlingFlag) {
          this.currentMove.castlingFlag = castlingFlag;
        }
        this.move(this.from, this.currentMove.to);
      }
      else {
        console.log("NOT A VALID PIECE, NOT A HIGHLIGHTED SQUARE");
      }
    }
  }

  moveCompleted() {
    console.log(this.game.fen());
    this.from = null;

    if (this.gameOver) return;
    this.changeTurn();
    this.hideMessage();
  }

  highlightMoves(moves) {
    this.clearHighlights();

    // exit if there are no moves available for this square
    if (moves.length === 0) return 0;

    moves.forEach(move => {
      let highlightSquare = move.to;

      if (this.isCapture(move)) {
        // It's a capture, so we need to highlight the square to the other side
        highlightSquare = this.getNextSpace(move.from, move.to);
        // And the highlighted square needs to remember the actual move square!
        $(`.square-${highlightSquare}`).data('captureSquare', move.to);
        if (move.flags.indexOf("e") >= 0) {
          let dy = RANKS.indexOf(move.to[1]) - RANKS.indexOf(move.from[1]);
          let captureRank = RANKS.indexOf(parseInt(move.to[1]) - dy);
          let captureFile = FILES.indexOf(move.to[0]);
          let captureSquare = `${FILES[captureFile]}${RANKS[captureRank]}`;
          $(`.square-${highlightSquare}`).data('captureSquare', captureSquare);
        }
      }
      if (move.flags.indexOf('k') >= 0) {
        $(`.square-${highlightSquare}`).data('castlingFlag', 'k');
      }
      if (move.flags.indexOf('q') >= 0) {
        $(`.square-${highlightSquare}`).data('castlingFlag', 'q');
      }
      this.highlight(highlightSquare);
    });

    return moves.length;
  }

  move(from, to) {
    if (this.currentMove.castlingFlag) {
      console.log("HANDLING CASTLING MOVE");
      let fromPiece = this.game.get(from);
      this.game.remove(from);
      this.game.put(fromPiece, to);
      if (this.game.turn() === 'w') {
        if (this.currentMove.castlingFlag === 'k') {
          this.game.remove('h1');
          this.game.put({
            type: 'r',
            color: 'w'
          }, 'f1');
        }
        else if (this.currentMove.castlingFlag === 'q') {
          this.game.remove('a1');
          this.game.put({
            type: 'r',
            color: 'w'
          }, 'd1');
        }
        this.castling.w = undefined;
      }
      else {
        if (this.currentMove.castlingFlag === 'k') {
          this.game.remove('h8');
          this.game.put({
            type: 'r',
            color: 'b'
          }, 'f8');
        }
        else if (this.currentMove.castlingFlag === 'q') {
          this.game.remove('a8');
          this.game.put({
            type: 'r',
            color: 'b'
          }, 'd8');
        }
        this.castling.b = undefined;
      }

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

      }, this.config.moveSpeed * 1.1);

    }
    // If it's a capture, handle our special case
    // This won't work for en passant. There are a lot of problems here man.
    else if (this.currentMove.captureSquare) {
      this.handleDisableCastling(from, to);
      console.log("HANDLING CAPTURE MOVE")
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
          this.showResult(true, this.getTurn(false));
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
    else {
      this.handleDisableCastling(from, to);
      // Otherwise do the usual
      super.move(from, to);
      this.currentMove.from = undefined;
      this.currentMove.to = undefined;
      this.currentMove.captureSquare = undefined;
    }
  }

  handleDisableCastling(from, to) {
    let piece = this.game.get(from);

    if (this.castling.w) {
      if (from === 'e1' && piece.type === this.game.KING && piece.color === 'w') {
        this.castling.w = undefined;
      }
      if (from === 'h1' && piece.type === this.game.ROOK && piece.color === 'w') {
        this.castling.w.k = false;
      }
      if (from === 'a1' && piece.type === this.game.ROOK && piece.color === 'w') {
        this.castling.w.q = false;
      }
    }
    if (this.castling.b) {
      if (from === 'e8' && piece.type === this.game.KING && piece.color === 'b') {
        this.castling.b = undefined;
      }
      if (from === 'h8' && piece.type === this.game.ROOK && piece.color === 'b') {
        this.castling.b.k = false;
      }
      if (from === 'a8' && piece.type === this.game.ROOK && piece.color === 'b') {
        this.castling.b.q = false;
      }

    }
    // Disable castling if they move their king
  }


  getMoves(square) {
    // We want illegal moves too so we can move into check
    let options = {
      verbose: true,
      legal: false
    }
    if (square) options.square = square;
    let moves = this.game.moves(options);

    // If there's no square specified, this is just wanting all possible moves
    if (square === undefined) return moves;

    if (moves.length === 0) return moves;

    let captures = [];
    // We can't capture with a knight
    if (this.game.get(moves[0].from).type !== 'n') {
      // Select all captures that are adjacent and have a space to jump to
      captures = this.getCaptures(moves, square);
      console.log(captures);
    }

    // If there are any captures, they're the only possible move
    if (captures.length > 0) return captures;

    // Select all non-captures
    let nonCaptures = this.getNonCaptures(moves, square);

    // Select all castling moves
    let castling = this.getCastling(square);

    // Return the resulting total set
    return [...nonCaptures, ...captures, ...castling];
  }

  getNonCaptures(moves, square) {
    return moves.filter(a => !this.isCapture(a) && !this.isCastling(a));
  }

  getCaptures(moves, square) {
    return moves.filter(a => {
      return this.isCapture(a) &&
        this.adjacent(square, a.to) &&
        this.getNextSpace(square, a.to);
    });
  }

  getCastling(square) {
    let turn = this.game.turn();
    let piece = this.game.get(square);
    let moves = [];
    switch (square) {
      case 'e1':
        if (this.castling.w && piece.type === this.game.KING && piece.color === 'w') {
          // If we're here then it's the right square and the right piece and castling
          // is technically possible for this side, so we need to check the two castling
          // sides and the intervening pieces...
          if (this.castling.w.k && !this.game.get('f1') && !this.game.get('g1')) {
            // Can castle kingside
            moves.push({
              from: 'e1',
              to: 'g1',
              flags: 'k'
            });
          }
          if (this.castling.w.q && !this.game.get('d1') && !this.game.get('c1') && !this.game.get('b1')) {
            // Can castle queenside
            moves.push({
              from: 'e1',
              to: 'c1',
              flags: 'q'
            });
          }
        }
      case 'e8':
        if (this.castling.b && piece.type === this.game.KING && piece.color === 'b') {
          // If we're here then it's the right square and the right piece and castling
          // is technically possible for this side, so we need to check the two castling
          // sides and the intervening pieces...
          if (this.castling.b.k && !this.game.get('f8') && !this.game.get('g8')) {
            // Can castle kingside
            moves.push({
              from: 'e8',
              to: 'g8',
              flags: 'k'
            });
          }
          if (this.castling.b.q && !this.game.get('d8') && !this.game.get('c8') && !this.game.get('b8')) {
            // Can castle queenside
            moves.push({
              from: 'e8',
              to: 'c8',
              flags: 'q'
            });
          }
        }
    }
    return moves;
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

  isCapture(move) {
    return (move.flags.indexOf("c") >= 0 || move.flags.indexOf("e") >= 0);
  }

  isCastling(move) {
    return (move.flags.indexOf('k') >= 0 || move.flags.indexOf('q') >= 0);
  }

}