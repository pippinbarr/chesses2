"use strict";


class Life extends BaseChess {

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

    this.FILES = "abcdefgh";
    this.RANKS = "12345678";
    this.STEP_INTERVAL = 1000;

    this.step();
  }

  // Alive cell - Fewer than 2 alive neighbours - dies (underpopulation).
  // Alive cell - 2 or 3 neighbours - continues to live (perfect situation).
  // Alive cell - More than 3 alive neighbours - dies (overpopulation).
  // Dead cell - Exactly three alive neighbours - becomes alive (reproduction).
  // But I also need to make a separate array since you evaluate everything in a single moment

  step() {
    let position = this.board.position();
    let newPosition = {};
    for (let file = 0; file < this.FILES.length; file++) {
      for (let rank = 0; rank < this.RANKS.length; rank++) {
        let square = `${this.FILES[file]}${this.RANKS[rank]}`;
        let piece = $(`.square-${square} img`).data("piece");
        if (piece && piece.indexOf('K') >= 0) newPosition[square] = position[square];

        let numNeighbours = this.neighbours(position, file, rank);

        console.log(square, numNeighbours);

        if (numNeighbours === 3) {
          // console.log(square, position[square]);
        }

        if (numNeighbours < 2 || numNeighbours > 3) {
          // DEATH, so just don't add this square
        }
        else if (numNeighbours === 3 && !position[square]) {
          // LIFE, so add this square
          newPosition[square] = 'wP';
        }
        else {
          // STASIS, so just maintain this square as is
          if (position[square]) newPosition[square] = position[square];
        }
      }
    }

    this.game.load(Chessboard.objToFen(newPosition) + ` ${this.game.turn()} KQkq - 0 1`);
    this.board.position(this.game.fen(), false);

    setTimeout(() => {
      this.step()
    }, this.STEP_INTERVAL);
  }

  neighbours(position, file, rank) {
    let square = `${this.FILES[file]}${this.RANKS[rank]}`;
    let count = 0;
    for (let f = file - 1; f <= file + 1; f++) {
      let checkFile = f >= 0 ? f > 7 ? 0 : f : 7; // For wrap system
      // if (f < 0 || f > 7) continue; // For closed system
      for (let r = rank - 1; r <= rank + 1; r++) {
        let checkRank = r >= 0 ? r > 7 ? 0 : r : 7; // For wrap system
        // if (r < 0 || r > 7) continue; // For closed system
        if (checkRank === rank && checkFile === file) continue;
        let neighbourSquare = `${this.FILES[checkFile]}${this.RANKS[checkRank]}`;
        if (position[neighbourSquare] && position[neighbourSquare] !== undefined) {
          count++;
        }
      }
    }
    return count;
  }


}