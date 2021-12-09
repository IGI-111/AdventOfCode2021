type HeightMap = { [pos: string]: number };

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
  public adjacents(): Pos[] {
    return [
      new Pos(this.x + 1, this.y),
      new Pos(this.x - 1, this.y),
      new Pos(this.x, this.y + 1),
      new Pos(this.x, this.y - 1),
    ];
  }
}

function lowPoints(heights: HeightMap): Pos[] {
  return Object.keys(heights)
    .filter((k) => {
      const h = heights[k];
      const pos = Pos.from(k);
      const adjacents = pos
        .adjacents()
        .map((pos) => heights[pos.toString()])
        .filter((v) => v !== undefined);
      return adjacents.every((height) => height > h);
    })
    .map(Pos.from);
}

function riskLevel(pos: Pos, heights: HeightMap): number {
  return heights[pos.toString()] + 1;
}

function basin(lowPoint: Pos, heights: HeightMap): Pos[] {
  const accepted: Set<string> = new Set();
  const queue = [lowPoint.toString()];
  while (queue.length > 0) {
    const pos = queue.shift()!;

    Pos.from(pos)
      .adjacents()
      .filter((p) => {
        const h = heights[p.toString()];
        return (
          !accepted.has(p.toString()) &&
          h !== undefined &&
          h !== 9 &&
          h >= heights[pos]
        );
      })
      .forEach((pos) => queue.push(pos.toString()));

    accepted.add(pos);
  }
  return [...accepted.values()].map(Pos.from);
}

const f = await Deno.readTextFile('./9.txt');
const heights: HeightMap = f
  .trim()
  .split('\n')
  .map((line) => line.split('').map((x) => parseInt(x)))
  .reduce((acc: HeightMap, line, y) => {
    line.forEach((val, x) => {
      acc[new Pos(x, y).toString()] = val;
    });

    return acc;
  }, {});

console.log(
  lowPoints(heights)
    .map((pos) => riskLevel(pos, heights))
    .reduce((acc, x) => acc + x, 0)
);

console.log(
  lowPoints(heights)
    .map((p) => basin(p, heights).length)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((acc, x) => acc * x, 1)
);
