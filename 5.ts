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

interface Line {
  from: Pos;
  to: Pos;
}

function linePoints(line: Line): Pos[] {
  const from = line.from;
  const to = line.to;
  if (from.x === to.x) {
    const x = from.x;
    const lowY = Math.min(from.y, to.y);
    const highY = Math.max(from.y, to.y);

    const yInterval = Array(highY - lowY + 1)
      .fill(0)
      .map((_, i) => lowY + i);
    return yInterval.map((y) => new Pos(x, y));
  } else if (from.y === to.y) {
    const y = from.y;
    const lowX = Math.min(from.x, to.x);
    const highX = Math.max(from.x, to.x);

    const xInterval = Array(highX - lowX + 1)
      .fill(0)
      .map((_, i) => lowX + i);
    return xInterval.map((x) => new Pos(x, y));
  } else {
    let xInc = to.x > from.x ? 1 : -1;
    let yInc = to.y > from.y ? 1 : -1;
    const interval = [from];
    while (!interval[interval.length - 1].equals(to)) {
      const last = interval[interval.length - 1];
      interval.push(new Pos(last.x + xInc, last.y + yInc));
    }
    return interval;
  }
}

function overlapCount(lines: Line[]): number {
  const points: { [pos: string]: number } = {};
  for (const line of lines) {
    for (const pos of linePoints(line)) {
      if (points[pos.toString()] === undefined) {
        points[pos.toString()] = 0;
      }
      points[pos.toString()]++;
    }
  }
  return Object.values(points).filter((x) => x > 1).length;
}

const f = await Deno.readTextFile('./5.txt');
const lines: Line[] = f
  .trim()
  .split('\n')
  .map((line) => {
    const [from, to] = line.split('->').map((pos) => pos.trim());
    return { from: Pos.from(from), to: Pos.from(to) };
  });
console.log(
  overlapCount(
    lines.filter(
      (line) => line.from.x === line.to.x || line.from.y === line.to.y
    )
  )
);
console.log(overlapCount(lines));
