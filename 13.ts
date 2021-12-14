interface Fold {
  isVertical: boolean;
  pos: number;
}

class Pos {
  public x: number;
  public y: number;
  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public static from(pos: string) {
    const [x, y] = pos.split(',');
    return new Pos(parseInt(x), parseInt(y));
  }
  public toString(): string {
    return `${this.x},${this.y}`;
  }
  public equals(pos: Pos): boolean {
    return this.x === pos.x && this.y === pos.y;
  }
}

function applyFold(dots: Set<string>, fold: Fold) {
  if (fold.isVertical) {
    [...dots]
      .map(Pos.from)
      .filter((d) => d.y > fold.pos)
      .forEach((d) => {
        const newD = new Pos(d.x, fold.pos - (d.y - fold.pos));
        dots.delete(d.toString());
        dots.add(newD.toString());
      });
  } else {
    [...dots]
      .map(Pos.from)
      .filter((d) => d.x > fold.pos)
      .forEach((d) => {
        const newD = new Pos(fold.pos - (d.x - fold.pos), d.y);
        dots.delete(d.toString());
        dots.add(newD.toString());
      });
  }
}

function printDots(dots: Set<string>) {
  const width =
    1 + [...dots].map(Pos.from).reduce((acc, d) => Math.max(acc, d.x), 0);
  const height =
    1 + [...dots].map(Pos.from).reduce((acc, d) => Math.max(acc, d.y), 0);

  let buf = '';
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      if (dots.has(new Pos(x, y).toString())) {
        buf += '#';
      } else {
        buf += ' ';
      }
    }
    buf += '\n';
  }
  console.log(buf);
}

const f = await Deno.readTextFile('./13.txt');
const [dotsStr, foldsStr] = f.trim().split('\n\n');
const dots = new Set(dotsStr.split('\n'));

const folds = foldsStr.split('\n').map((line) => {
  const [dir, pos] = line.slice(11).split('=');
  return { isVertical: dir === 'y', pos: parseInt(pos) };
});

applyFold(dots, folds.shift()!);
console.log(dots.size);
for (const fold of folds) {
  applyFold(dots, fold);
}
printDots(dots);
