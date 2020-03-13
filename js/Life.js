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
    this.VALUES = {
      k: 0,
      q: 9,
      r: 5,
      b: 3,
      n: 3,
      p: 1
    }

  }

  move(from, to) {
    super.move(from, to);

    setTimeout(() => {
      this.step();
    }, this.config.moveSpeed);

  }

  step() {
    let position = this.board.position();
    let newPosition = {};
    for (let file = 0; file < this.FILES.length; file++) {
      for (let rank = 0; rank < this.RANKS.length; rank++) {
        let square = `${this.FILES[file]}${this.RANKS[rank]}`;
        let piece = $(`.square-${square} img`).data("piece");
        if (piece && piece.indexOf('K') >= 0) newPosition[square] = position[square];

        let neighbours = this.neighbours(position, file, rank);

        console.log(square, neighbours.count, neighbours.average);

        // 78 is the total value of all pieces on the board (except king)
        // Average value is therefore 78 / 30 = 2.6

        // In life you die with 0, 1 and 4, 5, 6, 7, 8
        // You survive with 2, 3
        // You birth with 3 (and empty)
        // So we'd have: 0 to 5.2 = death
        // 5.2 to 7.4 = life
        // 7.4 and up = death
        // 7.4 = life (but we'll need a range)

        if (neighbours.count === 3) {
          // console.log(square, position[square]);
        }

        if (neighbours.count < 2 || neighbours.count > 3) {
          // DEATH, so just don't add this square
        }
        else if (neighbours.count === 3 && !position[square]) {
          // LIFE, so add this square
          let value = Math.round(neighbours.average);
          let piece;
          if (value < 3) piece = "P";
          else if (value < 5) piece = Math.random() < 0.5 ? 'N' : 'B';
          else if (value < 8) piece = "R";
          else piece = "Q";
          newPosition[square] = `${neighbours.color}${piece}`;
        }
        else {
          // STASIS, so just maintain this square as is
          if (position[square]) newPosition[square] = position[square];
        }
      }
    }

    this.game.load(Chessboard.objToFen(newPosition) + ` ${this.game.turn()} KQkq - 0 1`);
    this.board.position(this.game.fen(), false);
  }

  neighbours(position, file, rank) {
    let square = `${this.FILES[file]}${this.RANKS[rank]}`;
    let count = 0;
    let value = 0;
    let blacks = 0;
    let whites = 0;
    for (let f = file - 1; f <= file + 1; f++) {
      let checkFile = f >= 0 ? f > 7 ? 0 : f : 7; // For wrap system
      // if (f < 0 || f > 7) continue; // For closed system
      for (let r = rank - 1; r <= rank + 1; r++) {
        let checkRank = r >= 0 ? r > 7 ? 0 : r : 7; // For wrap system
        // if (r < 0 || r > 7) continue; // For closed system
        if (checkRank === rank && checkFile === file) continue;
        let neighbourSquare = `${this.FILES[checkFile]}${this.RANKS[checkRank]}`;
        if (position[neighbourSquare] && position[neighbourSquare] !== undefined) {
          let color = position[neighbourSquare][0];
          let piece = position[neighbourSquare][1].toLowerCase();
          if (color == 'w') {
            whites++;
          }
          else {
            blacks++;
          }

          count++;
          value += this.VALUES[piece];
        }
      }
    }

    let color;
    if (whites > blacks) {
      color = 'w';
    }
    else if (blacks > whites) {
      color = 'b';
    }
    else {
      color = Math.random() > 0.5 ? 'w' : 'b';
    }

    return {
      count: count,
      average: count > 0 ? value / count : 0,
      color: color
    };
  }


}