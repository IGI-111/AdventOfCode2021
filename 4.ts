class Board {
  private pos: { [num: string]: string };
  private num: { [pos: string]: string };
  private marked: Set<string>;
  private static WIDTH = 5;
  private static HEIGHT = 5;

  public constructor(boardStr: string) {
    this.num = {};
    this.pos = {};
    this.marked = new Set();
    const board = boardStr
      .split('\n')
      .map((line) => line.split(' ').filter((s) => s !== ''));
    for (let y = 0; y < board.length; ++y) {
      for (let x = 0; x < board[y].length; ++x) {
        const num = board[y][x];
        const pos = `${x},${y}`;
        this.num[pos] = num;
        this.pos[num] = pos;
      }
    }
  }
  public mark(num: string): boolean {
    const pos = this.pos[num];
    if (pos !== undefined) {
      this.marked.add(pos);

      const [x, y] = pos.split(',').map((v) => parseInt(v));

      const linePos = [pos];
      let i = x - 1;
      while (i >= 0) {
        linePos.push(`${i},${y}`);
        --i;
      }
      i = x + 1;
      while (i < Board.WIDTH) {
        linePos.push(`${i},${y}`);
        ++i;
      }

      const colPos = [pos];
      i = y - 1;
      while (i >= 0) {
        colPos.push(`${x},${i}`);
        --i;
      }
      i = y + 1;
      while (i < Board.HEIGHT) {
        colPos.push(`${x},${i}`);
        ++i;
      }

      return (
        linePos.every((pos) => this.marked.has(pos)) ||
        colPos.every((pos) => this.marked.has(pos))
      );
    }
    return false;
  }
  public score(): number {
    return Object.values(this.pos)
      .filter((pos) => !this.marked.has(pos))
      .map((pos) => this.num[pos])
      .reduce((acc, num) => acc + parseInt(num), 0);
  }
}

const f = await Deno.readTextFile('./4.txt');
const elements = f.trim().split('\n\n');
const numbers = elements[0].split(',');
const boards = elements.slice(1).map((boardStr) => new Board(boardStr));

const bingoScore = (numbers: string[], boards: Board[]): number => {
  for (const n of numbers) {
    for (const board of boards) {
      const isBingo = board.mark(n);
      if (isBingo) {
        return board.score() * parseInt(n);
      }
    }
  }
  return 0;
};

console.log(bingoScore(numbers, boards));

const lastBingoScore = (numbers: string[], boards: Board[]): number => {
  const winners: number[] = [];
  const winnerScores: number[] = [];
  for (const n of numbers) {
    boards.forEach((board, i) => {
      if (!winners.includes(i)) {
        const isBingo = board.mark(n);
        if (isBingo) {
          const score = board.score() * parseInt(n);
          winners.push(i);
          winnerScores.push(score);
        }
      }
    });
  }
  return winnerScores[winnerScores.length - 1];
};

console.log(lastBingoScore(numbers, boards));
