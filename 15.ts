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
  public neighbors(): Pos[] {
    return [
      new Pos(this.x + 1, this.y),
      new Pos(this.x - 1, this.y),
      new Pos(this.x, this.y + 1),
      new Pos(this.x, this.y - 1),
    ];
  }
}

type RiskMap = { [pos: string]: number };

function fullRiskMap(riskMap: RiskMap): RiskMap {
  const tileWidth =
    1 +
    Object.keys(riskMap)
      .map(Pos.from)
      .reduce((acc, p) => Math.max(acc, p.x), 0);
  const tileHeight =
    1 +
    Object.keys(riskMap)
      .map(Pos.from)
      .reduce((acc, p) => Math.max(acc, p.y), 0);

  const fullRiskMap: RiskMap = {};
  for (let tileY = 0; tileY < 5; ++tileY) {
    for (let tileX = 0; tileX < 5; ++tileX) {
      Object.keys(riskMap)
        .map(Pos.from)
        .forEach((pos) => {
          const realPos = new Pos(
            pos.x + tileX * tileWidth,
            pos.y + tileY * tileHeight
          );
          const risk = ((riskMap[pos.toString()] - 1 + tileX + tileY) % 9) + 1;
          fullRiskMap[realPos.toString()] = risk;
        });
    }
  }
  return fullRiskMap;
}

function astar(riskMap: RiskMap): number | undefined {
  const start = '0,0';
  const end = Object.keys(riskMap)
    .map(Pos.from)
    .reduce((acc, p) => (p.x + p.y > acc.x + acc.y ? p : acc), new Pos(0, 0))
    .toString();
  const endPos = Pos.from(end);

  const open: Set<string> = new Set([start]);
  const cameFrom: { [to: string]: string } = {};

  const gScore: { [pos: string]: number } = {};
  for (const pos in riskMap) {
    gScore[pos] = Infinity;
  }
  gScore[start] = 0;

  const fScore: { [pos: string]: number } = {};
  for (const pos in riskMap) {
    fScore[pos] = Infinity;
  }
  fScore[start] = endPos.x + endPos.y;

  while (open.size > 0) {
    const current = [...open].reduce(
      (acc, x) => (fScore[x] < fScore[acc] ? x : acc),
      [...open][0]
    );
    if (current === end) {
      return gScore[end];
    }
    open.delete(current);
    for (const pos of Pos.from(current)
      .neighbors()
      .filter((p) => p.toString() in riskMap)) {
      const neighbor = pos.toString();
      const tentativeGScore = gScore[current] + riskMap[neighbor];
      if (tentativeGScore < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] = tentativeGScore + pos.x + pos.y;
        if (!open.has(neighbor)) {
          open.add(neighbor);
        }
      }
    }
  }
  return gScore[end];
}

const f = await Deno.readTextFile('./15.txt');
const riskMap: RiskMap = f
  .trim()
  .split('\n')
  .reduce((acc: RiskMap, line, y) => {
    const lineMap: RiskMap = line.split('').reduce((acc: RiskMap, c, x) => {
      acc[new Pos(x, y).toString()] = parseInt(c);
      return acc;
    }, {});
    return Object.assign(acc, lineMap);
  }, {});

console.log(astar(riskMap));
console.log(astar(fullRiskMap(riskMap)));
