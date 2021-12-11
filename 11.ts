type EnergyMap = { [pos: string]: number };

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
      new Pos(this.x + 1, this.y + 1),
      new Pos(this.x + 1, this.y - 1),
      new Pos(this.x - 1, this.y + 1),
      new Pos(this.x - 1, this.y - 1),
    ];
  }
}

function step(energy: EnergyMap): { energy: EnergyMap; flashes: number } {
  for (const k in energy) {
    ++energy[k];
  }
  let flashes = 0;
  let flashing = Object.entries(energy)
    .filter(([_, v]) => v > 9)
    .map(([k, _]) => k);
  while (flashing.length > 0) {
    for (const f of flashing) {
      energy[f] = 0;
      ++flashes;
      for (const a of Pos.from(f)
        .adjacents()
        .filter((adj) => Object.keys(energy).includes(adj.toString()))) {
        if (energy[a.toString()] !== 0) {
          ++energy[a.toString()];
        }
      }
    }
    flashing = Object.entries(energy)
      .filter(([_, v]) => v > 9)
      .map(([k, _]) => k);
  }
  return { energy, flashes };
}

function totalFlashes(init: EnergyMap, stepCount: number): number {
  let energy = Object.assign({}, init);
  let total = 0;
  for (let i = 0; i < stepCount; ++i) {
    const { energy: next, flashes } = step(energy);
    energy = next;
    total += flashes;
  }
  return total;
}

function firstSync(init: EnergyMap): number {
  let energy = Object.assign({}, init);
  let i = 0;
  while (true) {
    const { energy: next, flashes } = step(energy);
    ++i;
    if (flashes === Object.values(energy).length) {
      return i;
    }
    energy = next;
  }
}

const f = await Deno.readTextFile('./11.txt');
const energy: EnergyMap = f
  .trim()
  .split('\n')
  .map((line) => line.split('').map((x) => parseInt(x)))
  .reduce((acc: EnergyMap, line, y) => {
    line.forEach((val, x) => {
      acc[new Pos(x, y).toString()] = val;
    });
    return acc;
  }, {});
console.log(totalFlashes(energy, 100));
console.log(firstSync(energy));
